import fs from 'node:fs';
import path from 'node:path';
import { db } from '@/lib/db';

const DATA_PATH = path.join(process.cwd(), 'prisma/data/demo-sites.json');
const TEN_YEARS_MS = 10 * 365 * 24 * 60 * 60 * 1000;

type JsonRecord = Record<string, unknown>;

function stripMeta(record: JsonRecord) {
  const next = { ...record };
  delete next.id;
  delete next.websiteId;
  delete next.createdAt;
  delete next.updatedAt;
  return next;
}

async function ensureWebmaster(phone: string) {
  let webmaster = await db.webmaster.findUnique({ where: { phone } });
  if (!webmaster) {
    webmaster = await db.webmaster.create({ data: { phone, name: 'FOREVER Demo' } });
  }
  return webmaster;
}

async function clearTenantChildren(websiteId: string) {
  await db.donation.deleteMany({ where: { websiteId } });
  await db.ebook.deleteMany({ where: { websiteId } });
  await db.familyMember.deleteMany({ where: { websiteId } });
  await db.memoryPost.deleteMany({ where: { websiteId } });
  await db.condolence.deleteMany({ where: { websiteId } });
  await db.media.deleteMany({ where: { websiteId } });
  await db.menu.deleteMany({ where: { websiteId } });
}

async function seedSite(site: JsonRecord, webmasterId: string, ownerPhone: string) {
  const slug = site.slug as string;
  const tenant = site.tenant as JsonRecord;
  const menus = (site.menus as JsonRecord[] | undefined) ?? [];
  const medias = (site.medias as JsonRecord[] | undefined) ?? [];
  const condolences = (site.condolences as JsonRecord[] | undefined) ?? [];
  const memoryPosts = (site.memoryPosts as JsonRecord[] | undefined) ?? [];
  const familyMembers = (site.familyMembers as JsonRecord[] | undefined) ?? [];
  const ebooks = (site.ebooks as JsonRecord[] | undefined) ?? [];
  const donations = (site.donations as JsonRecord[] | undefined) ?? [];

  const themeConfig = {
    ...((tenant.themeConfig as JsonRecord | undefined) ?? {}),
    isDemo: true,
  };

  const tenantData = {
    name: tenant.name as string,
    category: tenant.category as string,
    ownerPhone,
    themeConfig,
    visibility: 'PUBLIC',
    status: 'ACTIVE',
    expiredAt: new Date(Date.now() + TEN_YEARS_MS),
    donationPromptPay: (tenant.donationPromptPay as string | null | undefined) ?? null,
    donationAccountName: (tenant.donationAccountName as string | null | undefined) ?? null,
    donationActive: Boolean(tenant.donationActive ?? false),
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

  if (menus.length) {
    await db.menu.createMany({
      data: menus.map((m) => ({ ...stripMeta(m), websiteId })),
    });
  }

  if (medias.length) {
    await db.media.createMany({
      data: medias.map((m) => ({
        ...stripMeta(m),
        websiteId,
        fileSize: BigInt((m.fileSize as number | string | undefined) ?? 0),
      })),
    });
  }

  if (condolences.length) {
    await db.condolence.createMany({
      data: condolences.map((c) => ({ ...stripMeta(c), websiteId })),
    });
  }

  if (memoryPosts.length) {
    await db.memoryPost.createMany({
      data: memoryPosts.map((p) => ({ ...stripMeta(p), websiteId })),
    });
  }

  if (ebooks.length) {
    await db.ebook.createMany({
      data: ebooks.map((e) => ({ ...stripMeta(e), websiteId })),
    });
  }

  if (donations.length) {
    await db.donation.createMany({
      data: donations.map((d) => ({ ...stripMeta(d), websiteId })),
    });
  }

  if (familyMembers.length) {
    const idMap = new Map<string, { newId: string; oldParentId?: string; oldSpouseOfId?: string }>();

    for (const member of familyMembers) {
      const oldId = member.id as string;
      const oldParentId = member.parentId as string | undefined;
      const oldSpouseOfId = member.spouseOfId as string | undefined;
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

  return slug;
}

export async function seedDemoSites() {
  if (!fs.existsSync(DATA_PATH)) {
    throw new Error(`Missing ${DATA_PATH}. Run: npm run demos:export`);
  }

  const payload = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8')) as {
    ownerPhone: string;
    sites: JsonRecord[];
  };

  const webmaster = await ensureWebmaster(payload.ownerPhone);
  const seeded: string[] = [];

  for (const site of payload.sites) {
    seeded.push(await seedSite(site, webmaster.id, payload.ownerPhone));
  }

  return {
    ownerPhone: payload.ownerPhone,
    count: seeded.length,
    slugs: seeded,
  };
}
