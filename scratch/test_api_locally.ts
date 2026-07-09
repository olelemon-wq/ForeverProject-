import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const cleanPhone = '0816830368';
  const category = 'Memorial';
  
  console.log('--- Simulating Verify API logic locally ---');
  
  // Clean up any existing OTP request so we can generate a new one
  await prisma.otpRequest.deleteMany({ where: { phone: cleanPhone } }).catch(() => {});
  
  // Create an OTP request
  const otpCode = '123456';
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await prisma.otpRequest.create({
    data: {
      phone: cleanPhone,
      code: otpCode,
      expiresAt,
    }
  });
  console.log('Created OTP Request');

  // Let's run the exact verify block!
  try {
    // 6. Auto-register / Retrieve Webmaster profile via WebmasterPhone
    let phoneRecord = await prisma.webmasterPhone.findUnique({
      where: { phone: cleanPhone },
      include: { webmaster: true },
    });

    let webmaster;
    if (phoneRecord) {
      console.log('Found phoneRecord');
      webmaster = phoneRecord.webmaster;
    } else {
      console.log('No phoneRecord. Falling back...');
      const existingWebmaster = await prisma.webmaster.findUnique({
        where: { phone: cleanPhone },
      });

      if (existingWebmaster) {
        console.log('Found existingWebmaster:', existingWebmaster.id);
        webmaster = existingWebmaster;
        
        // Auto-heal relation
        await prisma.webmasterPhone.create({
          data: {
            webmasterId: webmaster.id,
            phone: cleanPhone,
            isPrimary: true,
          },
        });
        console.log('Healed WebmasterPhone relation');
      } else {
        console.log('Creating new Webmaster...');
        webmaster = await prisma.webmaster.create({
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
        console.log('Created new Webmaster:', webmaster.id);
      }
    }

    if (!webmaster) {
      throw new Error('Webmaster resolved as null/undefined!');
    }
    console.log('Resolved Webmaster ID:', webmaster.id);

    // 7. Draft creation
    let draftTenantId: string | null = null;
    if (category) {
      const uuid = Math.random().toString(36).substring(2, 10);
      const tempSlug = `draft-${uuid}`;
      const expiredAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      
      const defaultThemeConfig = {
        primaryColor: '#0071e3',
        secondaryColor: '#f59e0b',
        fontFamily: 'Inter',
        heroStyle: 'Classic',
        features: {},
      };

      const result = await prisma.$transaction(async (tx) => {
        console.log('Inside transaction...');
        const tenant = await tx.tenant.create({
          data: {
            slug: tempSlug,
            name: `ความทรงจำแสนรัก (${category})`,
            category,
            ownerPhone: cleanPhone,
            themeConfig: defaultThemeConfig,
            visibility: 'PUBLIC',
            status: 'PENDING_PAYMENT',
            expiredAt,
          },
        });
        console.log('Created draft Tenant:', tenant.id);

        await tx.menu.createMany({
          data: [
            { websiteId: tenant.id, title: 'หน้าแรก', pageType: 'HOME', sortOrder: 1, isVisible: true },
            { websiteId: tenant.id, title: 'คลังภาพรำลึก', pageType: 'GALLERY', sortOrder: 2, isVisible: true },
            { websiteId: tenant.id, title: 'สมุดไว้อาลัย', pageType: 'CONDOLENCE', sortOrder: 3, isVisible: true },
          ],
        });
        console.log('Created default menus');

        await tx.websiteWebmaster.create({
          data: {
            websiteId: tenant.id,
            webmasterId: webmaster.id,
            role: 'MAIN',
          },
        });
        console.log('Created WebsiteWebmaster link');

        const paymentRef = `QR-${tempSlug}-${Math.floor(10000 + Math.random() * 90000)}`;
        await tx.payment.create({
          data: {
            websiteId: tenant.id,
            refId: paymentRef,
            type: 'NEW_WEBSITE',
            amount: 2000.0,
            status: 'PENDING',
          },
        });
        console.log('Created Payment record');

        return tenant;
      });

      draftTenantId = result.id;
      console.log('Draft tenant created successfully:', draftTenantId);
    }
  } catch (err) {
    console.error('FAILED WITH ERROR:', err);
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});
