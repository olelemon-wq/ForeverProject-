#!/usr/bin/env node
/**
 * Generate JPEG thumbnails for demo MP4 files and update demo-sites.json.
 * Usage: node scripts/generate-demo-video-thumbs.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import ffmpegPath from 'ffmpeg-static';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DEMO_MEDIA_DIR = path.join(ROOT, 'public/demo-media');
const DATA_PATH = path.join(ROOT, 'prisma/data/demo-sites.json');

if (!ffmpegPath) {
  console.error('ffmpeg-static binary not found');
  process.exit(1);
}

function generateThumb(mp4Path) {
  const thumbPath = mp4Path.replace(/\.mp4$/i, '-thumb.jpg');
  execFileSync(ffmpegPath, [
    '-y',
    '-i',
    mp4Path,
    '-ss',
    '00:00:01',
    '-vframes',
    '1',
    '-q:v',
    '2',
    thumbPath,
  ], { stdio: 'pipe' });
  return thumbPath;
}

function walkMp4Files(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkMp4Files(full));
    else if (entry.name.endsWith('.mp4')) results.push(full);
  }
  return results;
}

const mp4Files = walkMp4Files(DEMO_MEDIA_DIR);
const thumbByVideoPath = new Map();

for (const mp4 of mp4Files) {
  const thumb = generateThumb(mp4);
  const publicPath = `/${path.relative(path.join(ROOT, 'public'), mp4).split(path.sep).join('/')}`;
  const thumbPublicPath = `/${path.relative(path.join(ROOT, 'public'), thumb).split(path.sep).join('/')}`;
  thumbByVideoPath.set(publicPath, thumbPublicPath);
  console.log(`✓ ${thumbPublicPath}`);
}

const payload = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
let updated = 0;

for (const site of payload.sites) {
  for (const media of site.medias || []) {
    if (media.mimeType !== 'video/mp4') continue;
    const thumb = thumbByVideoPath.get(media.filePath);
    if (thumb) {
      media.thumbnailPath = thumb;
      updated += 1;
    }
  }
}

fs.writeFileSync(DATA_PATH, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`Updated ${updated} media records in demo-sites.json`);
