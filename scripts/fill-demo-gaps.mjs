#!/usr/bin/env node
/**
 * Fill recommended demo gaps: Friends video, Pet donations, pending moderation on other demos.
 */
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function setFeature(slug, key, value) {
  const tenant = await db.tenant.findUnique({ where: { slug } });
  if (!tenant) return;
  const config = { ...(tenant.themeConfig || {}) };
  config.features = { ...(config.features || {}), [key]: value };
  await db.tenant.update({ where: { id: tenant.id }, data: { themeConfig: config } });
}

async function main() {
  // --- friendforever: enable videos + add YouTube ---
  const friends = await db.tenant.findUnique({ where: { slug: 'friendforever' } });
  if (friends) {
    await setFeature('friendforever', 'videos', true);
    const hasVideo = await db.media.count({
      where: { websiteId: friends.id, mimeType: { contains: 'video' } },
    });
    if (hasVideo === 0) {
      await db.media.create({
        data: {
          websiteId: friends.id,
          filePath: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
          fileName: 'ทริปท่องเที่ยว CN the Gang',
          fileSize: BigInt(0),
          mimeType: 'video/youtube',
          fileHash: 'youtube-aqz-KE-bpKQ',
          album: 'GALLERY',
        },
      });
    }
    console.log('✓ friendforever: videos enabled + YouTube link');
  }

  // --- kittiemeaw: sample pet donations ---
  const pet = await db.tenant.findUnique({ where: { slug: 'kittiemeaw' } });
  if (pet) {
    await db.tenant.update({
      where: { id: pet.id },
      data: {
        donationActive: true,
        donationPromptPay: pet.donationPromptPay || '081-683-0368',
        donationAccountName: 'กองทุนช่วยเหลือสัตว์จร (Demo)',
      },
    });
    const donationCount = await db.donation.count({ where: { websiteId: pet.id } });
    if (donationCount === 0) {
      const samples = [
        {
          donorName: 'คุณมิ้นท์',
          amount: 500,
          message: 'ขอบคุณน้องคิตตี้ที่ทำให้บ้านอบอุ่นเสมอ ส่งต่อความรักให้น้องสี่ขาตัวอื่นด้วยนะคะ',
          isAnonymous: false,
          hideAmount: false,
          createdAt: new Date('2026-02-08T11:00:00+07:00'),
        },
        {
          donorName: 'ผู้ไม่ประสงค์ออกนาม',
          amount: 200,
          message: 'ร่วมสมทบกองทุนช่วยเหลือสัตว์จรแทนความคิดถึงน้อง',
          isAnonymous: true,
          hideAmount: true,
          createdAt: new Date('2026-02-09T15:30:00+07:00'),
        },
        {
          donorName: 'พี่ต้น & ครอบครัว',
          amount: 1000,
          message: 'ขอให้ความรักที่มีให้น้องส่งต่อเป็นกำลังใจให้น้องสี่ขาที่รอความช่วยเหลือ',
          isAnonymous: false,
          hideAmount: false,
          createdAt: new Date('2026-02-10T09:45:00+07:00'),
        },
      ];
      for (const d of samples) {
        await db.donation.create({
          data: { websiteId: pet.id, ...d, isVerified: true },
        });
      }
    }
    console.log('✓ kittiemeaw: donation samples');
  }

  // --- Pending moderation (skip kukimiyafamily — already has) ---
  const moderationSites = [
    {
      slug: 'boonkrua-family',
      condolences: [
        {
          senderName: 'ลูกสาวน้องใหญ่',
          relationship: 'ลูกสาว',
          message: 'คิดถึงพ่อทุกวันค่ะ ขอบคุณที่เลี้ยงดูเรามาด้วยความรักเสมอ',
          type: 'FAMILY',
        },
        {
          senderName: 'เพื่อนร่วมงาน',
          relationship: 'เพื่อน',
          message: 'ขอแสดงความเสียใจอย่างสุดซึ้ง พ่อเป็นที่รักของทุกคนในออฟฟิศ',
          type: 'GENERAL',
        },
      ],
      memoryPosts: [
        {
          senderName: 'หลานชาย',
          title: 'ความทรงจำวันพ่อสอนปั่นจักรยาน',
          content: 'ยังจำได้ดีว่าพ่ออดทนสอนเราทุกเย็น จนปั่นได้โดยไม่ล้ม ขอบคุณพ่อที่สอนให้ไม่ยอมแพ้',
          mediaUrl: '',
          mediaType: 'NONE',
        },
        {
          senderName: 'ญาติผู้ใหญ่',
          title: '',
          content: 'ฝากภาพวันครอบครัวไปเที่ยวทะเลครั้งสุดท้ายที่ได้ไปด้วยกัน ยิ้มของพ่อยังอยู่ในใจเสมอ',
          mediaUrl: '',
          mediaType: 'NONE',
        },
      ],
    },
    {
      slug: 'pluemploy',
      condolences: [],
      memoryPosts: [
        {
          senderName: 'เพื่อนสนิท',
          title: 'ทริปแรกที่ไปด้วยกัน',
          content: 'ยังจำได้ว่าทริปเชียงใหม่ครั้งแรก ปลื้มกับพลอยดูแลกันมาตลอดทาง ขอให้มีความสุขแบบนี้ยาวนาน',
          mediaUrl: '',
          mediaType: 'NONE',
        },
        {
          senderName: 'น้องสาวพลอย',
          title: '',
          content: 'ฝากรูปวันเกิดพลอยปีที่แล้ว ยินดีที่มีพี่ปลื้มดูแลน้องสาวเสมอ',
          mediaUrl: '',
          mediaType: 'NONE',
        },
      ],
    },
    {
      slug: 'bts-family',
      condolences: [],
      memoryPosts: [
        {
          senderName: 'ลูกหลานรุ่นใหม่',
          title: 'คำสอนจากคุณปู่',
          content: 'คุณปู่เคยบอกว่า "ตระกูลเราอยู่ด้วยกันเมื่อยังมีชีวิต และอยู่ด้วยกันในความทรงจำ" ขอจดจำไว้เสมอ',
          mediaUrl: '',
          mediaType: 'NONE',
        },
        {
          senderName: 'ญาติต่างจังหวัด',
          title: '',
          content: 'ฝากเรื่องเล่าวันงานรวมตระกูลปีที่แล้ว บรรยากาศอบอุ่นมาก อยากให้จัดอีกเร็ว ๆ นี้',
          mediaUrl: '',
          mediaType: 'NONE',
        },
      ],
    },
    {
      slug: 'friendforever',
      condolences: [
        {
          senderName: 'น้องเบล',
          relationship: 'เพื่อนในกลุ่ม',
          message: 'คิดถึงวันที่เรานั่งเล่ากันทุกศุกร์ ขอให้กลุ่มเรายังเจอกันบ่อย ๆ แบบนี้นะ',
          type: 'GENERAL',
        },
        {
          senderName: 'พี่โอ๋',
          relationship: 'เพื่อนร่วมรุ่น',
          message: 'ขอบคุณที่ยังรักษามิตรภาพกันมาตลอด 20 กว่าปี ภูมิใจที่ได้เป็นเพื่อนกัน',
          type: 'GENERAL',
        },
      ],
      memoryPosts: [
        {
          senderName: 'แก๊ง CN',
          title: 'ทริปทะเลปี 2568',
          content: 'แชร์โมเมนต์ตลก ๆ ตอนรถเสียกลางทาง แต่สุดท้ายก็หัวเราะกันทั้งรถ นี่แหละเพื่อนแท้',
          mediaUrl: '',
          mediaType: 'NONE',
        },
        {
          senderName: 'มิ้นท์',
          title: '',
          content: 'ฝากรูปวันรวมตัวรุ่น ยิ้มกันจนแก้มปวด ขอให้มีแบบนี้ทุกปี',
          mediaUrl: '',
          mediaType: 'NONE',
        },
      ],
    },
    {
      slug: 'kittiemeaw',
      condolences: [
        {
          senderName: 'เพื่อนบ้าน',
          relationship: 'เพื่อนบ้าน',
          message: 'คิดถึงน้องคิตตี้ที่ชอบมานั่งหน้าบ้านทุกเย็น ขอให้น้องมีความสุขบนดาวสัตว์เลี้ยง',
          type: 'GENERAL',
        },
        {
          senderName: 'คุณแม่บ้าน',
          relationship: 'คนใกล้ชิด',
          message: 'ขอบคุณน้องที่ทำให้ทุกวันมีรอยยิ้ม จะจำน้องไว้ตลอดไปค่ะ',
          type: 'GENERAL',
        },
      ],
      memoryPosts: [
        {
          senderName: 'พี่เลี้ยง',
          title: 'วันที่รับน้องมา',
          content: 'ยังจำวันแรกที่น้องตัวจิ๋ววิ่งมากอดขา ตั้งแต่นั้นมาบ้านก็ไม่เคยเงียบอีกเลย',
          mediaUrl: '',
          mediaType: 'NONE',
        },
        {
          senderName: 'น้องชาย',
          title: '',
          content: 'ฝากคลิปน้องชอบนอนตัก ดูแล้วคิดถึงทุกครั้ง',
          mediaUrl: '',
          mediaType: 'NONE',
        },
      ],
    },
  ];

  for (const site of moderationSites) {
    const tenant = await db.tenant.findUnique({ where: { slug: site.slug } });
    if (!tenant) continue;

    const pendingCond = await db.condolence.count({
      where: { websiteId: tenant.id, isApproved: false },
    });
    if (pendingCond === 0 && site.condolences.length) {
      for (const c of site.condolences) {
        await db.condolence.create({
          data: { websiteId: tenant.id, ...c, isApproved: false },
        });
      }
    }

    const pendingMem = await db.memoryPost.count({
      where: { websiteId: tenant.id, isApproved: false },
    });
    if (pendingMem === 0 && site.memoryPosts.length) {
      for (const p of site.memoryPosts) {
        await db.memoryPost.create({
          data: { websiteId: tenant.id, ...p, isApproved: false },
        });
      }
    }

    console.log(`✓ ${site.slug}: pending moderation`);
  }

  console.log('Done. Run: npm run demos:export');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
