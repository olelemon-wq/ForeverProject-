const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const websiteId = "71c8328d-857d-440e-a77d-8de0a06b3232";
  
  const tenant = await prisma.tenant.findUnique({
    where: { id: websiteId }
  });
  
  if (!tenant) {
    console.error("Tenant not found!");
    return;
  }
  
  const currentConfig = tenant.themeConfig || {};
  
  const restoredAnnouncement = {
    "text": "กำหนดการพิธีรดน้ำ สวดอภิธรรม และฌาปนกิจศพ คุณพ่อบุญเครือ เขมาภิรัตน์",
    "style": "CHARCOAL_SLATE",
    "active": true,
    "mapLink": "https://maps.app.goo.gl/z3upohubQT154DT77",
    "pavilion": "ศาลา 1",
    "dressCode": "ชุดสุภาพโทนดำ หรือ ขาว ",
    "waterDate": "วันที่  15 พ.ย. 67",
    "waterTime": "16:00 น.",
    "fontFamily": "Charmonman",
    "templeName": "วัดศรีมหาราชา (วัดใน)",
    "contactPhone": "คุณฉัตรมงคล 081-2345678",
    "wreathPolicy": "NORMAL",
    "cremationDate": "วันเสาร์ที่ 23 พฤศจิกายน 2567",
    "cremationTime": "16:30 น.",
    "abhidhammaTime": "19:00 น.",
    "abhidhammaDateRange": "16-22 พ.ย. 67"
  };

  const updatedConfig = {
    ...currentConfig,
    announcement: restoredAnnouncement,
    features: {
      ...(currentConfig.features || {}),
      announcement: true
    }
  };

  const updated = await prisma.tenant.update({
    where: { id: websiteId },
    data: {
      themeConfig: updatedConfig
    }
  });

  console.log("Restored successfully:", JSON.stringify(updated.themeConfig, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
