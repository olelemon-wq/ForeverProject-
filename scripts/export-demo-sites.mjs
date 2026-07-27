#!/usr/bin/env node
/**
 * Export demo tenants from the current database into prisma/data/demo-sites.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, '../prisma/data/demo-sites.json');

const SLUGS = [
  'boonkrua-family',
  'bts-family',
  'friendforever',
  'kittiemeaw',
  'kukimiyafamily',
  'pluemploy',
];

const replacer = (_key, value) => (typeof value === 'bigint' ? value.toString() : value);

async function main() {
  const payload = { ownerPhone: '0816830368', sites: [] };

  for (const slug of SLUGS) {
    const tenant = await db.tenant.findUnique({
      where: { slug },
      include: {
        menus: true,
        medias: { where: { isDeleted: false } },
        condolences: true,
        memoryPosts: true,
        familyMembers: true,
        ebooks: true,
        donations: true,
      },
    });

    if (!tenant) {
      console.warn(`Skip missing slug: ${slug}`);
      continue;
    }

    const {
      id: _id,
      menus,
      medias,
      condolences,
      memoryPosts,
      familyMembers,
      ebooks,
      donations,
      ...tenantFields
    } = tenant;

    payload.sites.push({
      slug,
      tenant: tenantFields,
      menus,
      medias,
      condolences,
      memoryPosts,
      familyMembers,
      ebooks,
      donations,
    });

    console.log(`Exported ${slug}`);
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(payload, replacer, 2));
  console.log(`Wrote ${OUT_PATH}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
