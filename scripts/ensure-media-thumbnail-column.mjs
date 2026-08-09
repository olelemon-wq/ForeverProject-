#!/usr/bin/env node
/**
 * Ensure production has Media.thumbnailPath (fixes 500 on /[slug] pages).
 * Usage: DATABASE_URL="postgresql://..." node scripts/ensure-media-thumbnail-column.mjs
 */
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

try {
  await db.$executeRawUnsafe(
    'ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "thumbnailPath" TEXT;',
  );
  console.log('✓ Media.thumbnailPath column is present');
} finally {
  await db.$disconnect();
}
