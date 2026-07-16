import { db } from '@/lib/db';

type WebmasterWithSites = Awaited<
  ReturnType<
    typeof db.webmaster.findUnique<{
      where: { phone: string };
      include: {
        websites: {
          include: { website: true };
        };
      };
    }>
  >
>;

function isMissingWebmasterPhoneTable(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes('WebmasterPhone') &&
    (msg.includes('does not exist') || msg.includes('P2021') || msg.includes('42P01'))
  );
}

/**
 * Resolve webmaster by phone.
 * Prefer WebmasterPhone when available; fall back to legacy Webmaster.phone
 * if the multi-phone table is not migrated yet on this database.
 */
export async function resolveWebmasterByPhone(cleanPhone: string) {
  try {
    const phoneRecord = await db.webmasterPhone.findUnique({
      where: { phone: cleanPhone },
      include: {
        webmaster: {
          include: {
            websites: {
              include: { website: true },
            },
          },
        },
      },
    });
    if (phoneRecord?.webmaster) {
      return { webmaster: phoneRecord.webmaster, via: 'phone' as const };
    }
  } catch (err) {
    if (!isMissingWebmasterPhoneTable(err)) throw err;
    console.warn('WebmasterPhone table missing — using legacy Webmaster.phone');
  }

  const legacy = await db.webmaster.findUnique({
    where: { phone: cleanPhone },
    include: {
      websites: {
        include: { website: true },
      },
    },
  });

  return { webmaster: legacy, via: 'legacy' as const };
}

/** Ensure Webmaster exists for this phone (legacy-safe). */
export async function ensureWebmasterForPhone(cleanPhone: string) {
  const resolved = await resolveWebmasterByPhone(cleanPhone);
  if (resolved.webmaster) {
    await maybeHealWebmasterPhone(resolved.webmaster.id, cleanPhone);
    return resolved.webmaster;
  }

  try {
    return await db.webmaster.create({
      data: {
        phone: cleanPhone,
        name: '',
        phones: {
          create: {
            phone: cleanPhone,
            isPrimary: true,
          },
        },
      },
      include: {
        websites: {
          include: { website: true },
        },
      },
    });
  } catch (err) {
    if (!isMissingWebmasterPhoneTable(err)) throw err;
    return db.webmaster.create({
      data: {
        phone: cleanPhone,
        name: '',
      },
      include: {
        websites: {
          include: { website: true },
        },
      },
    });
  }
}

async function maybeHealWebmasterPhone(webmasterId: string, cleanPhone: string) {
  try {
    await db.webmasterPhone.create({
      data: {
        webmasterId,
        phone: cleanPhone,
        isPrimary: true,
      },
    });
  } catch {
    // ignore unique / missing-table / already-exists
  }
}

/** Link tenants owned by this phone if WebsiteWebmaster rows are missing. */
export async function healOwnedWebsiteLinks(
  webmasterId: string,
  cleanPhone: string,
  alreadyLinkedIds: Set<string>
) {
  const ownedTenants = await db.tenant.findMany({
    where: { ownerPhone: cleanPhone },
    select: { id: true },
  });

  for (const tenant of ownedTenants) {
    if (alreadyLinkedIds.has(tenant.id)) continue;
    try {
      await db.websiteWebmaster.create({
        data: {
          websiteId: tenant.id,
          webmasterId,
          role: 'MAIN',
        },
      });
      alreadyLinkedIds.add(tenant.id);
    } catch {
      // ignore races / unique
    }
  }
}

export type { WebmasterWithSites };
