const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tenants = await prisma.tenant.findMany();
  for (const tenant of tenants) {
    let cfg = tenant.themeConfig;
    if (cfg && typeof cfg === 'object') {
      let feats = cfg.features || {};
      
      const family = feats.familyTree !== undefined ? feats.familyTree : (feats.family !== undefined ? feats.family : true);
      const ebooks = feats.ebook !== undefined ? feats.ebook : (feats.ebooks !== undefined ? feats.ebooks : true);
      const donation = feats.donations !== undefined ? feats.donations : (feats.donation !== undefined ? feats.donation : true);
      const gallery = feats.gallery !== undefined ? feats.gallery : true;
      const videos = feats.videos !== undefined ? feats.videos : true;
      const announcement = feats.announcement !== undefined ? feats.announcement : true;
      const condolence = feats.condolence !== undefined ? feats.condolence : true;
      const memory = feats.memory !== undefined ? feats.memory : true;
      const feed = feats.feed !== undefined ? feats.feed : true;

      const newFeatures = {
        family,
        gallery,
        videos,
        announcement,
        ebooks,
        condolence,
        donation,
        memory,
        feed
      };

      cfg.features = newFeatures;

      await prisma.tenant.update({
        where: { id: tenant.id },
        data: { 
          themeConfig: cfg,
          donationActive: donation
        }
      });
      console.log(`Updated tenant ${tenant.slug} features successfully.`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
