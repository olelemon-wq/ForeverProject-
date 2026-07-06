import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.findUnique({ where: { slug: 'kittiemeaw' } });
  if (!tenant) return;

  const media = await prisma.media.findMany({
    where: { websiteId: tenant.id },
    select: {
      id: true,
      fileName: true,
      filePath: true,
      mimeType: true,
      album: true,
      isDeleted: true,
    },
  });

  console.log(`Media list for kittiemeaw (${media.length} items):`);
  for (const m of media) {
    console.log(`- [${m.isDeleted ? 'DELETED' : 'ACTIVE'}] Album: ${m.album} | MimeType: ${m.mimeType} | File: ${m.fileName} | Path: ${m.filePath}`);
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
