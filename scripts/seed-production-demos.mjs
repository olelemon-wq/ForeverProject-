#!/usr/bin/env node
/**
 * Seed or refresh public demo sites on any environment (local / production).
 * Data source: prisma/data/demo-sites.json (generated via scripts/export-demo-sites.mjs)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '../prisma/data/demo-sites.json');
const TEN_YEARS_MS = 10 * 365 * 24 * 60 * 60 * 1000;

function stripMeta(record) {
  const next = { ...record };
  delete next.id;
  delete next.websiteId;
  delete next.createdAt;
  delete next.updatedAt;
  return next;
}

async function ensureWebmaster(phone) {
  let webmaster = await db.webmaster.findUnique({ where: { phone } });
  if (!webmaster) {
    webmaster = await db.webmaster.create({ data: { phone, name: 'FOREVER Demo' } });
  }
  return webmaster;
}

async function clearTenantChildren(websiteId) {
  await db.donation.deleteMany({ where: { websiteId } });
  await db.activity.deleteMany({ where: { websiteId } });
  await db.ebook.deleteMany({ where: { websiteId } });
  await db.familyMember.deleteMany({ where: { websiteId } });
  await db.memoryPost.deleteMany({ where: { websiteId } });
  await db.condolence.deleteMany({ where: { websiteId } });
  await db.media.deleteMany({ where: { websiteId } });
  await db.menu.deleteMany({ where: { websiteId } });
}

async function seedSite(site, webmasterId, ownerPhone) {
  const { slug, tenant, menus, medias, condolences, memoryPosts, familyMembers, ebooks, donations, activities } =
    site;

  const themeConfig = {
    ...(tenant.themeConfig || {}),
    isDemo: true,
  };

  const tenantData = {
    name: tenant.name,
    category: tenant.category,
    ownerPhone,
    themeConfig,
    visibility: 'PUBLIC',
    status: 'ACTIVE',
    expiredAt: new Date(Date.now() + TEN_YEARS_MS),
    donationPromptPay: tenant.donationPromptPay,
    donationAccountName: tenant.donationAccountName,
    donationActive: tenant.donationActive ?? false,
  };

  let record = await db.tenant.findUnique({ where: { slug } });
  if (record) {
    record = await db.tenant.update({ where: { slug }, data: tenantData });
    await clearTenantChildren(record.id);
  } else {
    record = await db.tenant.create({ data: { slug, ...tenantData } });
  }

  const websiteId = record.id;

  await db.websiteWebmaster.upsert({
    where: {
      websiteId_webmasterId: { websiteId, webmasterId },
    },
    create: { websiteId, webmasterId, role: 'MAIN' },
    update: { role: 'MAIN' },
  });

  if (menus?.length) {
    await db.menu.createMany({
      data: menus.map((m) => ({ ...stripMeta(m), websiteId })),
    });
  }

  if (medias?.length) {
    await db.media.createMany({
      data: medias.map((m) => ({
        ...stripMeta(m),
        websiteId,
        fileSize: BigInt(m.fileSize ?? 0),
      })),
    });
  }

  if (condolences?.length) {
    await db.condolence.createMany({
      data: condolences.map((c) => ({ ...stripMeta(c), websiteId })),
    });
  }

  if (memoryPosts?.length) {
    await db.memoryPost.createMany({
      data: memoryPosts.map((p) => ({ ...stripMeta(p), websiteId })),
    });
  }

  if (ebooks?.length) {
    await db.ebook.createMany({
      data: ebooks.map((e) => ({ ...stripMeta(e), websiteId })),
    });
  }

  if (donations?.length) {
    await db.donation.createMany({
      data: donations.map((d) => ({ ...stripMeta(d), websiteId })),
    });
  }

  if (activities?.length) {
    await db.activity.createMany({
      data: activities.map((a) => ({
        ...stripMeta(a),
        websiteId,
        eventDate: a.eventDate ? new Date(a.eventDate) : null,
      })),
    });
  }

  if (familyMembers?.length) {
    const idMap = new Map();

    for (const member of familyMembers) {
      const oldId = member.id;
      const oldParentId = member.parentId;
      const oldSpouseOfId = member.spouseOfId;
      const data = stripMeta(member);

      const created = await db.familyMember.create({
        data: {
          ...data,
          websiteId,
          parentId: null,
          spouseOfId: null,
        },
      });
      idMap.set(oldId, { newId: created.id, oldParentId, oldSpouseOfId });
    }

    for (const { newId, oldParentId, oldSpouseOfId } of idMap.values()) {
      const parentId = oldParentId ? idMap.get(oldParentId)?.newId : null;
      const spouseOfId = oldSpouseOfId ? idMap.get(oldSpouseOfId)?.newId : null;
      if (parentId || spouseOfId) {
        await db.familyMember.update({
          where: { id: newId },
          data: {
            ...(parentId ? { parentId } : {}),
            ...(spouseOfId ? { spouseOfId } : {}),
          },
        });
      }
    }
  }

  console.log(`✓ ${slug}`);
}

async function main() {
  if (!fs.existsSync(DATA_PATH)) {
    console.error(`Missing ${DATA_PATH}. Run: node scripts/export-demo-sites.mjs`);
    process.exit(1);
  }

  const payload = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const webmaster = await ensureWebmaster(payload.ownerPhone);

  console.log(`Seeding ${payload.sites.length} demo sites for ${payload.ownerPhone}...`);
  for (const site of payload.sites) {
    await seedSite(site, webmaster.id, payload.ownerPhone);
  }

  console.log('Done.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
