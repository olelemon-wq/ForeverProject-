#!/usr/bin/env node
/**
 * Compress large demo site images (gallery, avatars, covers).
 * Usage: node scripts/compress-demo-images.mjs [slug]
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { PrismaClient } from '@prisma/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const SLUG = process.argv[2] || 'kittiemeaw';
const SIZE_THRESHOLD = 300 * 1024;
const JPEG_QUALITY = 84;
const WEBP_QUALITY = 82;

const db = new PrismaClient();

function md5(filePath) {
  return crypto.createHash('md5').update(fs.readFileSync(filePath)).digest('hex');
}

function maxSideFor(album, fileName) {
  if (album === 'GALLERY' || fileName.includes('gallery-')) return 1600;
  if (fileName.includes('announcement-card') || fileName.includes('cover')) return 1400;
  return 1200;
}

async function compressImage(absPath, album, fileName) {
  const before = fs.statSync(absPath).size;
  const meta = await sharp(absPath).metadata();
  const maxSide = maxSideFor(album, fileName);
  const needsResize =
    (meta.width && meta.width > maxSide) || (meta.height && meta.height > maxSide);

  const isPhoto = ['png', 'jpeg', 'webp', 'jpg'].includes(meta.format || '');
  if (!isPhoto) return null;
  if (before <= SIZE_THRESHOLD && meta.format !== 'png') return null;

  const pipeline = sharp(absPath).rotate();
  if (needsResize) {
    pipeline.resize({
      width: maxSide,
      height: maxSide,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  const ext = path.extname(absPath).toLowerCase();
  const useJpeg = meta.format === 'png' || meta.format === 'jpeg' || meta.format === 'jpg';
  const outExt = useJpeg ? '.jpg' : ext === '.webp' ? '.webp' : '.jpg';
  const outPath = outExt === ext ? absPath : absPath.replace(/\.[^.]+$/, outExt);

  if (useJpeg) {
    await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(`${outPath}.tmp`);
  } else {
    await pipeline.webp({ quality: WEBP_QUALITY }).toFile(`${outPath}.tmp`);
  }

  const after = fs.statSync(`${outPath}.tmp`).size;
  if (after >= before && meta.format !== 'png') {
    fs.unlinkSync(`${outPath}.tmp`);
    return null;
  }

  if (outPath === absPath) {
    fs.renameSync(`${outPath}.tmp`, absPath);
  } else {
    fs.renameSync(`${outPath}.tmp`, outPath);
    fs.unlinkSync(absPath);
  }

  return {
    outPath,
    before,
    after,
    mimeType: useJpeg ? 'image/jpeg' : 'image/webp',
    filePath: `/${path.relative(PUBLIC, outPath).split(path.sep).join('/')}`,
  };
}

async function updateThemeConfigPaths(tenant, oldPath, newPath) {
  const cfg = structuredClone(tenant.themeConfig || {});
  let changed = false;
  const walk = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'string' && v === oldPath) {
        obj[k] = newPath;
        changed = true;
      } else if (v && typeof v === 'object') walk(v);
    }
  };
  walk(cfg);
  if (changed) {
    await db.tenant.update({ where: { id: tenant.id }, data: { themeConfig: cfg } });
  }
}

async function main() {
  const tenant = await db.tenant.findUnique({ where: { slug: SLUG } });
  if (!tenant) throw new Error(`Tenant not found: ${SLUG}`);

  const media = await db.media.findMany({
    where: { websiteId: tenant.id, isDeleted: false },
    orderBy: { createdAt: 'asc' },
  });

  let saved = 0;
  let count = 0;

  for (const item of media) {
    if (!item.filePath.startsWith('/uploads/')) continue;
    const absPath = path.join(PUBLIC, item.filePath);
    if (!fs.existsSync(absPath)) {
      console.warn('missing:', item.filePath);
      continue;
    }

    const result = await compressImage(absPath, item.album || '', path.basename(absPath));
    if (!result) continue;

    const oldPath = item.filePath;
    await db.media.update({
      where: { id: item.id },
      data: {
        filePath: result.filePath,
        fileName: path.basename(result.outPath),
        fileSize: BigInt(result.after),
        mimeType: result.mimeType,
        fileHash: md5(result.outPath),
      },
    });

    if (oldPath !== result.filePath) {
      await updateThemeConfigPaths(tenant, oldPath, result.filePath);
    }

    saved += result.before - result.after;
    count += 1;
    console.log(
      `${path.basename(result.outPath)}: ${Math.round(result.before / 1024)}KB → ${Math.round(result.after / 1024)}KB`
    );
  }

  console.log(`Compressed ${count} files, saved ~${Math.round(saved / 1024)}KB`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
