import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const cleanPhone = '0816830368';
  console.log('--- Simulating Legacy Webmaster Fallback ---');

  // Ensure Webmaster exists but has no WebmasterPhone record
  await prisma.webmasterPhone.deleteMany({ where: { phone: cleanPhone } }).catch(() => {});
  
  let webmaster = await prisma.webmaster.findUnique({ where: { phone: cleanPhone } });
  if (!webmaster) {
    webmaster = await prisma.webmaster.create({
      data: {
        phone: cleanPhone,
        name: 'Legacy User',
      }
    });
    console.log('Created legacy Webmaster record without WebmasterPhone link');
  } else {
    console.log('Legacy Webmaster record already exists');
  }

  // Now run the verify route's lookup and fallback logic
  try {
    let phoneRecord = await prisma.webmasterPhone.findUnique({
      where: { phone: cleanPhone },
      include: { webmaster: true },
    });

    let resolvedWebmaster;
    if (phoneRecord) {
      console.log('Found phoneRecord');
      resolvedWebmaster = phoneRecord.webmaster;
    } else {
      console.log('No phoneRecord. Checking fallback...');
      const existingWebmaster = await prisma.webmaster.findUnique({
        where: { phone: cleanPhone },
      });

      if (existingWebmaster) {
        console.log('Found existing legacy Webmaster:', existingWebmaster.id);
        resolvedWebmaster = existingWebmaster;
        
        // Auto-heal relation
        await prisma.webmasterPhone.create({
          data: {
            webmasterId: resolvedWebmaster.id,
            phone: cleanPhone,
            isPrimary: true,
          },
        });
        console.log('Successfully auto-healed WebmasterPhone relation!');
      } else {
        console.log('No existing Webmaster. Creating new...');
        resolvedWebmaster = await prisma.webmaster.create({
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
        });
      }
    }

    console.log('Resolved Webmaster ID:', resolvedWebmaster?.id);
  } catch (err) {
    console.error('FAILED WITH ERROR:', err);
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});
