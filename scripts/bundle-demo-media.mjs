#!/usr/bin/env node
/**
 * Copy demo upload files into public/demo-media so production can serve them statically.
 * Rewrites /uploads/... paths in prisma/data/demo-sites.json to /demo-media/...
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'prisma/data/demo-sites.json');
const UPLOADS_ROOT = path.join(ROOT, 'public/uploads');
const DEMO_MEDIA_ROOT = path.join(ROOT, 'public/demo-media');

function collectUploadPaths(value, out = new Set()) {
  if (typeof value === 'string' && value.startsWith('/uploads/')) {
    out.add(value);
    return out;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectUploadPaths(item, out);
    return out;
  }
  if (value && typeof value === 'object') {
    for (const v of Object.values(value)) collectUploadPaths(v, out);
  }
  return out;
}

function rewriteUploadPaths(value) {
  if (typeof value === 'string') {
    if (value.startsWith('/uploads/')) return `/demo-media${value.slice('/uploads'.length)}`;
    return value;
  }
  if (Array.isArray(value)) return value.map(rewriteUploadPaths);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, rewriteUploadPaths(v)])
    );
  }
  return value;
}

function main() {
  if (!fs.existsSync(DATA_PATH)) {
    console.error(`Missing ${DATA_PATH}`);
    process.exit(1);
  }

  const payload = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const uploadPaths = [...collectUploadPaths(payload)].sort();
  let copied = 0;
  let missing = 0;

  for (const uploadPath of uploadPaths) {
    const rel = uploadPath.replace(/^\/uploads\//, '');
    const src = path.join(UPLOADS_ROOT, rel);
    const dest = path.join(DEMO_MEDIA_ROOT, rel);

    if (!fs.existsSync(src)) {
      console.warn(`Missing local file: ${uploadPath}`);
      missing += 1;
      continue;
    }

    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    copied += 1;
  }

  const rewritten = rewriteUploadPaths(payload);
  fs.writeFileSync(DATA_PATH, JSON.stringify(rewritten, null, 2));

  console.log(`Bundled ${copied} files into public/demo-media`);
  if (missing) console.warn(`Skipped ${missing} missing files`);
  console.log(`Rewrote paths in ${DATA_PATH}`);
}

main();
