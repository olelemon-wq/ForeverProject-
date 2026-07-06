const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Querying database tables...');
    const tenants = await prisma.tenant.findMany();
    const webmasters = await prisma.webmaster.findMany();
    const websiteWebmasters = await prisma.websiteWebmaster.findMany();
    const subscriptions = await prisma.subscription.findMany();
    const payments = await prisma.payment.findMany();
    const familyMembers = await prisma.familyMember.findMany();
    const ebooks = await prisma.ebook.findMany();
    const medias = await prisma.media.findMany();
    const condolences = await prisma.condolence.findMany();
    const memoryPosts = await prisma.memoryPost.findMany();
    const donations = await prisma.donation.findMany();

    const dbData = {
      tenants,
      webmasters,
      websiteWebmasters,
      subscriptions,
      payments,
      familyMembers,
      ebooks,
      medias,
      condolences,
      memoryPosts,
      donations,
      timestamp: new Date().toISOString()
    };

    console.log('Serializing data to JSON (handling BigInt fields)...');
    const jsonString = JSON.stringify(dbData, (key, value) => {
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return value;
    }, 2);

    const targetPath = path.join(__dirname, '../state.json');
    fs.writeFileSync(targetPath, jsonString, 'utf-8');
    console.log(`Successfully saved database state to: ${targetPath}`);
  } catch (error) {
    console.error('Error saving state:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
