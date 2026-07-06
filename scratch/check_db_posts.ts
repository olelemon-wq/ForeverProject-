import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const sites = ['kittiemeaw', 'kukimiyafamily'];

  for (const slug of sites) {
    const tenant = await prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) continue;

    console.log(`\n=================== SITE: ${slug} ===================`);

    // Fetch Condolences
    const condolences = await prisma.condolence.findMany({
      where: { websiteId: tenant.id },
      select: {
        id: true,
        senderName: true,
        message: true,
        isApproved: true,
      },
    });

    console.log(`Condolences (${condolences.length}):`);
    condolences.forEach(c => {
      console.log(`- [${c.isApproved ? 'APPROVED' : 'PENDING'}] From: ${c.senderName} | Message: "${c.message}"`);
    });

    // Fetch Memory Posts
    const memories = await prisma.memoryPost.findMany({
      where: { websiteId: tenant.id },
      select: {
        id: true,
        senderName: true,
        title: true,
        content: true,
        isApproved: true,
      },
    });

    console.log(`\nMemories (${memories.length}):`);
    memories.forEach(m => {
      console.log(`- [${m.isApproved ? 'APPROVED' : 'PENDING'}] From: ${m.senderName} | Title: "${m.title}" | Content: "${m.content}"`);
    });
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
