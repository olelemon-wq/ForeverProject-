const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const slug = 'boonkrua-family';
  const tenant = await prisma.tenant.findUnique({
    where: { slug: slug.toLowerCase() },
  });

  if (!tenant) {
    console.log(`Tenant with slug ${slug} not found.`);
    return;
  }

  console.log('Current tenant data:', {
    name: tenant.name,
    slug: tenant.slug,
    themeConfig: tenant.themeConfig,
  });

  // Update themeConfig to use LINE Seed Sans TH
  const themeConfig = tenant.themeConfig || {};
  themeConfig.fontFamily = 'LINE Seed Sans TH';

  const updated = await prisma.tenant.update({
    where: { slug: slug.toLowerCase() },
    data: {
      themeConfig,
    },
  });

  console.log('Updated themeConfig:', updated.themeConfig);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
