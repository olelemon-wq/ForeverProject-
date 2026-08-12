#!/usr/bin/env node
/**
 * Update kittiemeaw diary memory post images in the current DATABASE_URL.
 * Usage: node scripts/sync-kittiemeaw-diary-images.mjs
 */
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();
const WEBSITE_ID = 'f4d68f77-50a1-4799-b060-cf38af5d210d';

const updates = [
  {
    id: '819170c2-56c5-40c0-b914-7c26d2d9fbb0',
    mediaUrl:
      '/demo-media/f4d68f77-50a1-4799-b060-cf38af5d210d/1785398635928-gallery-1785398635709-a3ee928f-d9e5-42eb-83d6-5b3c49053306.jpg',
  },
  {
    id: '1c6dcbfb-39a3-4b1b-b78d-6589be9e3064',
    mediaUrl:
      '/demo-media/f4d68f77-50a1-4799-b060-cf38af5d210d/1785398636190-gallery-1785398636177-be1d970a-2094-4771-b7f8-6e9208ce7e16.jpeg',
  },
];

async function main() {
  for (const { id, mediaUrl } of updates) {
    await db.memoryPost.update({
      where: { id },
      data: { mediaUrl, mediaType: 'IMAGE' },
    });
    console.log(`✓ ${id}`);
  }

  const posts = await db.memoryPost.findMany({
    where: { websiteId: WEBSITE_ID, isApproved: true, mediaUrl: { not: '' } },
    select: { title: true, mediaUrl: true },
  });
  console.log(JSON.stringify(posts, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
