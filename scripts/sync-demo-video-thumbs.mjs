#!/usr/bin/env node
/**
 * Sync video thumbnailPath from prisma/data/demo-sites.json into the current DATABASE_URL.
 * Safe for localhost: only updates thumbnailPath on matching video media rows.
 *
 * Usage: node scripts/sync-demo-video-thumbs.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '../prisma/data/demo-sites.json');
const db = new PrismaClient();

function thumbByFilePath(payload) {
  const map = new Map();
  for (const site of payload.sites ?? []) {
    for (const media of site.medias ?? []) {
      if (media.mimeType?.startsWith('video/') && media.filePath && media.thumbnailPath) {
        map.set(media.filePath, media.thumbnailPath);
      }
    }
  }
  return map;
}

async function main() {
  const payload = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const thumbs = thumbByFilePath(payload);
  let updated = 0;

  for (const [filePath, thumbnailPath] of thumbs) {
    const result = await db.media.updateMany({
      where: { filePath, mimeType: { startsWith: 'video/' } },
      data: { thumbnailPath },
    });
    if (result.count > 0) {
      updated += result.count;
      console.log(`✓ ${filePath} → ${thumbnailPath}`);
    }
  }

  console.log(`Updated ${updated} video thumbnail(s)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
