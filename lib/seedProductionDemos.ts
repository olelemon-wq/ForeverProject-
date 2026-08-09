import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const TEN_YEARS_MS = 10 * 365 * 24 * 60 * 60 * 1000;
const DATA_PATH = path.join(process.cwd(), 'prisma/data/demo-sites.json');

function stripMeta<T extends Record<string, unknown>>(record: T) {
  const next = { ...record };
  delete next.id;
  delete next.websiteId;
  delete next.createdAt;
  delete next.updatedAt;
  return next;
}

async function ensureWebmaster(db: PrismaClient, phone: string) {
  let webmaster = await db.webmaster.findUnique({ where: { phone } });
  if (!webmaster) {
    webmaster = await db.webmaster.create({ data: { phone, name: 'FOREVER Demo' } });
  }
  return webmaster;
}

async function clearTenantChildren(db: PrismaClient, websiteId: string) {
  await db.donation.deleteMany({ where: { websiteId } });
  await db.ebook.deleteMany({ where: { websiteId } });
  await db.familyMember.deleteMany({ where: { websiteId } });
  await db.memoryPost.deleteMany({ where: { websiteId } });
  await db.condolence.deleteMany({ where: { websiteId } });
  await db.media.deleteMany({ where: { websiteId } });
  await db.menu.deleteMany({ where: { websiteId } });
}

async function seedSite(
  db: PrismaClient,
  site: Record<string, any>,
  webmasterId: string,
  ownerPhone: string,
) {
  const { slug, tenant, menus, medias, condolences, memoryPosts, familyMembers, ebooks, donations } =
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
    await clearTenantChildren(db, record.id);
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
      data: menus.map((m: Record<string, unknown>) => ({ ...stripMeta(m), websiteId })),
    });
  }

  if (medias?.length) {
    await db.media.createMany({
      data: medias.map((m: Record<string, unknown>) => ({
        ...stripMeta(m),
        websiteId,
        fileSize: BigInt((m.fileSize as string | number | bigint | undefined) ?? 0),
      })),
    });
  }

  if (condolences?.length) {
    await db.condolence.createMany({
      data: condolences.map((c: Record<string, unknown>) => ({ ...stripMeta(c), websiteId })),
    });
  }

  if (memoryPosts?.length) {
    await db.memoryPost.createMany({
      data: memoryPosts.map((p: Record<string, unknown>) => ({ ...stripMeta(p), websiteId })),
    });
  }

  if (ebooks?.length) {
    await db.ebook.createMany({
      data: ebooks.map((e: Record<string, unknown>) => ({ ...stripMeta(e), websiteId })),
    });
  }

  if (donations?.length) {
    await db.donation.createMany({
      data: donations.map((d: Record<string, unknown>) => ({ ...stripMeta(d), websiteId })),
    });
  }

  if (familyMembers?.length) {
    const idMap = new Map<string, { newId: string; oldParentId?: string | null; oldSpouseOfId?: string | null }>();

    for (const member of familyMembers) {
      const oldId = member.id as string;
      const oldParentId = member.parentId as string | null | undefined;
      const oldSpouseOfId = member.spouseOfId as string | null | undefined;
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

  return slug as string;
}

export async function seedProductionDemos() {
  if (!fs.existsSync(DATA_PATH)) {
    throw new Error(`Missing ${DATA_PATH}`);
  }

  const db = new PrismaClient();
  try {
    const payload = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8')) as {
      ownerPhone: string;
      sites: Record<string, unknown>[];
    };
    const webmaster = await ensureWebmaster(db, payload.ownerPhone);
    const seeded: string[] = [];

    for (const site of payload.sites) {
      const slug = await seedSite(db, site, webmaster.id, payload.ownerPhone);
      seeded.push(slug);
    }

    return { count: seeded.length, slugs: seeded };
  } finally {
    await db.$disconnect();
  }
}
