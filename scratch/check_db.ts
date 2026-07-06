import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tenants = await prisma.tenant.findMany({
    where: {
      slug: {
        in: ['kittiemeaw', 'kukimiyafamily'],
      },
    },
    select: {
      slug: true,
      name: true,
      themeConfig: true,
    },
  });

  console.log("Database Query Results:");
  for (const t of tenants) {
    console.log(`\nWebsite Slug: ${t.slug} (${t.name})`);
    console.log(JSON.stringify(t.themeConfig, null, 2));
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
