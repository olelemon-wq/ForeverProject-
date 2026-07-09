import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const phone = '0816830368'; // User's tested phone number from the screenshot
  console.log(`=== Inspecting DB for phone: ${phone} ===`);

  const webmaster = await prisma.webmaster.findUnique({
    where: { phone },
    include: {
      phones: true,
      websites: {
        include: {
          website: true
        }
      }
    }
  });
  console.log('Webmaster Profile:', JSON.stringify(webmaster, null, 2));

  const phoneRecord = await prisma.webmasterPhone.findUnique({
    where: { phone },
    include: {
      webmaster: true
    }
  });
  console.log('WebmasterPhone Record:', JSON.stringify(phoneRecord, null, 2));

  const allWebmasters = await prisma.webmaster.findMany({
    take: 5
  });
  console.log('Sample Webmasters:', JSON.stringify(allWebmasters, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
