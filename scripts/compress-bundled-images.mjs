#!/usr/bin/env node
/**
 * Compress large static images under public/demo-media and public/patterns.
 * Rewrites prisma/data/demo-sites.json when file extensions change.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const DATA_PATH = path.join(ROOT, 'prisma/data/demo-sites.json');

const THRESHOLD_BYTES = 280 * 1024;
const JPEG_QUALITY = 84;
const WEBP_QUALITY = 82;

const SCAN_DIRS = [
  path.join(PUBLIC, 'demo-media'),
  path.join(PUBLIC, 'patterns'),
];

const EXAMPLE_COVERS = [
  '/demo-media/71c8328d-857d-440e-a77d-8de0a06b3232/1782186663308-gallery-1782186662815-img-7169.jpg',
  '/demo-media/350b0b44-5a07-4173-aa75-0ce6e78ab71c/1784969266780-gallery-1784969266742-CleanShot 2569-07-25 at 15.27.45@2x.jpg',
  '/demo-media/88a6311e-21a0-49f9-a0d6-6a63a5d2f566/1785128145977-announcement-card-1785128145848.jpg',
  '/demo-media/4041f2c5-d9e2-4367-8877-a88214b3a76e/1785401245880-deceased-avatar-1785401245825-7f401b80-8dd9-405d-b816-b0824fbbf8b7.jpeg',
  '/demo-media/edd45dd0-39bf-4e0d-9b5a-d43562f1e044/1784993607104-gallery-1784993606994-b7b93478-45b9-40c1-8162-3349be8b5174.jpg',
  '/demo-media/f4d68f77-50a1-4799-b060-cf38af5d210d/1785398783773-deceased-avatar-1785398783710-a3ee928f-d9e5-42eb-83d6-5b3c49053306.jpg',
];

function maxSideFor(fileName) {
  if (fileName.includes('announcement-card')) return 1400;
  if (fileName.includes('gallery-') || fileName.includes('cover')) return 1600;
  if (fileName.includes('pattern') || fileName.includes('floral') || fileName.includes('branch')) {
    return 1800;
  }
  return 1200;
}

function walkImages(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walkImages(abs, out);
    else if (/\.(png|jpe?g|webp)$/i.test(entry.name)) out.push(abs);
  }
  return out;
}

function publicPath(absPath) {
  return `/${path.relative(PUBLIC, absPath).split(path.sep).join('/')}`;
}

function rewriteJsonPaths(oldPath, newPath) {
  if (!fs.existsSync(DATA_PATH) || oldPath === newPath) return;
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  if (!raw.includes(oldPath)) return;
  fs.writeFileSync(DATA_PATH, raw.split(oldPath).join(newPath));
}

async function compressFile(absPath) {
  const before = fs.statSync(absPath).size;
  const rel = publicPath(absPath);
  const isExampleCover = EXAMPLE_COVERS.includes(rel);
  const threshold = isExampleCover ? 220 * 1024 : THRESHOLD_BYTES;

  const meta = await sharp(absPath).metadata();
  const fileName = path.basename(absPath);
  const maxSide = maxSideFor(fileName);
  const needsResize =
    (meta.width && meta.width > maxSide) || (meta.height && meta.height > maxSide);

  const isPhoto = ['png', 'jpeg', 'jpg', 'webp'].includes(meta.format || '');
  if (!isPhoto) return null;
  if (before <= threshold && meta.format !== 'png') return null;

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
  const convertToJpeg = meta.format === 'png' || meta.format === 'jpeg' || meta.format === 'jpg';
  const outExt = convertToJpeg ? '.jpg' : ext === '.webp' ? '.webp' : '.jpg';
  const outPath = outExt === ext ? absPath : absPath.replace(/\.[^.]+$/, outExt);
  const tmpPath = `${outPath}.tmp`;

  if (convertToJpeg) {
    await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(tmpPath);
  } else {
    await pipeline.webp({ quality: WEBP_QUALITY }).toFile(tmpPath);
  }

  const after = fs.statSync(tmpPath).size;
  if (after >= before && meta.format !== 'png') {
    fs.unlinkSync(tmpPath);
    return null;
  }

  if (outPath === absPath) {
    fs.renameSync(tmpPath, absPath);
  } else {
    fs.renameSync(tmpPath, outPath);
    fs.unlinkSync(absPath);
  }

  const oldPublic = publicPath(absPath);
  const newPublic = publicPath(outPath);
  rewriteJsonPaths(oldPublic, newPublic);

  return { file: path.basename(outPath), before, after, oldPublic, newPublic };
}

async function main() {
  const files = SCAN_DIRS.flatMap((dir) => walkImages(dir));
  let count = 0;
  let saved = 0;

  for (const absPath of files.sort()) {
    const result = await compressFile(absPath);
    if (!result) continue;
    count += 1;
    saved += result.before - result.after;
    console.log(
      `${result.file}: ${Math.round(result.before / 1024)}KB → ${Math.round(result.after / 1024)}KB`,
    );
    if (result.oldPublic !== result.newPublic) {
      console.log(`  path: ${result.oldPublic} → ${result.newPublic}`);
    }
  }

  console.log(`\nCompressed ${count} files, saved ~${Math.round(saved / 1024)}KB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
