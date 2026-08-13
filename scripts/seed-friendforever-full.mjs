#!/usr/bin/env node
/**
 * Enable every Friends feature for friendforever and seed demo content.
 * Usage: node scripts/seed-friendforever-full.mjs
 */
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();
const SLUG = 'friendforever';
const ALBUM_PHOTOS = 'ภาพความทรงจำ CN the Gang';
const ALBUM_VIDEOS = 'คลิปของกลุ่ม';

const GALLERY_PATHS = [
  '/defaults/friends/cover/1.jpg',
  '/defaults/friends/cover/2.jpg',
  '/defaults/friends/cover/3.jpg',
  '/demo-media/edd45dd0-39bf-4e0d-9b5a-d43562f1e044/1784993640439-gallery-1784993640385-5f87b724-6dba-4f3c-9a29-2c26b33fcf43.jpeg',
  '/demo-media/edd45dd0-39bf-4e0d-9b5a-d43562f1e044/1784993607104-gallery-1784993606994-b7b93478-45b9-40c1-8162-3349be8b5174.jpg',
  '/demo-media/edd45dd0-39bf-4e0d-9b5a-d43562f1e044/1784993620283-gallery-1784993620224-674abea3-a01d-46f8-a4ff-562c275121b1.jpg',
];

const GALLERY_MEDIA_IDS = [
  '5811acc0-d38f-479f-a83e-66015edc4aa1',
  'cf54dba6-0564-4acd-a82f-c6eb10a3c166',
  '326f043f-7fc8-4f5e-acdc-bf471501286f',
  'd2c8446b-68c4-426a-91c7-53901b7e8c9d',
  'e914987d-5846-4982-84df-f75977dc7a71',
  '6be45a03-c112-419e-a1e9-e826da15f435',
  '42e7168b-073c-4087-87c4-ae9d262193bc',
  'f9f163c3-706f-4237-9f37-38a434a09d89',
];

const VIDEO_MEDIA_IDS = ['6302ebd8-58e7-4e7a-a8b5-4451ad3b2bd7'];

/** ทำเนียบสมาชิก — FamilyMember records for /family page */
const MEMBERS = [
  {
    name: 'ป้าแจ๊ส',
    nickname: 'หัวหน้ากลุ่ม',
    relationship: 'PARENT_1',
    birthYear: '2520',
    avatarUrl: '/defaults/friends/avatar/1.png',
  },
  {
    name: 'พี่ต้อม',
    nickname: 'สายทริป',
    relationship: 'SIBLING',
    birthYear: '2532',
    avatarUrl: '/defaults/friends/avatar/2.png',
  },
  {
    name: 'น้องมิ้นท์',
    nickname: 'สายภาพ',
    relationship: 'SIBLING',
    birthYear: '2535',
    avatarUrl: '/defaults/friends/avatar/3.png',
  },
  {
    name: 'แอนนา',
    nickname: 'สายดีไซน์',
    relationship: 'SIBLING',
    birthYear: '2533',
    avatarUrl: '/defaults/friends/avatar/4.png',
  },
  {
    name: 'โอ๋',
    nickname: 'สายกิน',
    relationship: 'SIBLING',
    birthYear: '2534',
    avatarUrl: GALLERY_PATHS[3],
  },
  {
    name: 'เบนซ์',
    nickname: 'สายเทค',
    relationship: 'SIBLING',
    birthYear: '2536',
    avatarUrl: GALLERY_PATHS[4],
  },
];

const ACTIVITIES = [
  {
    title: 'นัดรวมตัวเดือนสิงหา 2569',
    description:
      'เช็กใจก่อนลงมือจองร้าน — เป้าหมายคืองานรวมตัวแบบไม่เร่งรีบ มีเวลานั่งเล่าเรื่องเก่า กินของอร่อย และถ่ายรูปให้ครบทุกคน ที่ The Local Table, Ari',
    images: GALLERY_PATHS.slice(0, 3),
    eventDate: new Date('2026-08-15T00:00:00+07:00'),
    isRecurring: false,
    sortOrder: 0,
  },
  {
    title: 'ทริปหัวหิน — Flashback 2568',
    description:
      'จำได้ไหมวันที่ฝนตกแรงแต่เรายังยืนหยิบขนมตลาดน้ำอยู่ ทริปนี้สรุปว่า “แพลนไม่สำคัญ ขอแค่มาครบก็พอ”',
    images: GALLERY_PATHS.slice(0, 4),
    eventDate: new Date('2025-11-20T00:00:00+07:00'),
    isRecurring: true,
    sortOrder: 1,
  },
  {
    title: 'คอนเสิร์ตวงโปรดของกลุ่ม',
    description:
      'รวมตัวดูคอนเสิร์ตด้วยกันอีกครั้ง — ใครว่างฝากชื่อในกลุ่มไลน์นะ อยากให้มีโมเมนต์แบบปีที่แล้วอีก',
    images: [GALLERY_PATHS[2], GALLERY_PATHS[5]],
    eventDate: new Date('2026-10-10T00:00:00+07:00'),
    isRecurring: false,
    sortOrder: 2,
  },
];

const DONATIONS = [
  {
    donorName: 'มิ้นท์ & ต้อม',
    amount: 800,
    message: 'สมทบกองทุนรวมตัวเดือนสิงหา — ขอให้ได้นั่งกินข้าวพร้อมหน้ากันนะ',
    isAnonymous: false,
    hideAmount: false,
    isVerified: true,
    createdAt: new Date('2026-07-20T11:00:00+07:00'),
  },
  {
    donorName: 'ผู้ไม่ประสงค์ออกนาม',
    amount: 500,
    message: 'ร่วมสมทบทริปปีหน้า ขอบคุณที่ยังมีกลุ่มนี้เสมอ',
    isAnonymous: true,
    hideAmount: true,
    isVerified: true,
    createdAt: new Date('2026-07-25T16:00:00+07:00'),
  },
  {
    donorName: 'แอนนา',
    amount: 1200,
    message: 'ส่งต่อกำลังใจให้งานรวมตัวสำเร็จ — รอเจอกันนะเพื่อน ๆ',
    isAnonymous: false,
    hideAmount: false,
    isVerified: true,
    createdAt: new Date('2026-08-01T10:30:00+07:00'),
  },
];

const EBOOKS = [
  {
    title: 'หนังสือรุ่นและบันทึกมิตรสหายเฟรนด์ชิป',
    author: 'แก๊ง CN the Gang',
    pdfUrl: '',
    totalPages: 4,
    pages: [
      'บันทึกมิตรภาพของพวกเรา\n\nยินดีต้อนรับเพื่อน ๆ ทุกคนเข้าสู่ทำเนียบความทรงจำ สมุดหนังสือรุ่นออนไลน์นี้ทำขึ้นเพื่อรวบรวมรูปภาพ มิตรภาพ และความรู้สึกดี ๆ ของ CN the Gang',
      'หน้า 2: วันวานวัยหวาน\n\nจำได้ไหมตอนที่เราต้องอดนอนอ่านหนังสือสอบด้วยกัน การไปตั้งแคมป์ฤดูร้อน และการแอบตื่นสายไปเรียนไม่ทัน',
      'หน้า 3: สายใยที่ไม่มีวันขาด\n\nแม้วันนี้แต่ละคนจะแยกย้ายไปมีเส้นทางชีวิตของตัวเอง แต่เมื่อไหร่ที่กลับมาเจอกัน ความรู้สึกอบอุ่นใจก็หวนกลับมาเสมอ',
      'บทส่งท้าย\n\nขอให้มิตรภาพของพวกเรายั่งยืนนานตลอดไป\n\nด้วยความรักและคิดถึง\nแก๊งเพื่อนซี้',
    ],
  },
  {
    title: 'บันทึกวีรกรรมความทรงจำแสนเกรียน',
    author: 'กลุ่มเพื่อนสนิท',
    pdfUrl: '',
    totalPages: 3,
    pages: [
      'รวมเรื่องเล่าสุดขำ\n\nสมุดบันทึกที่รวบรวมวีรกรรมแสนตลกและภาพหลุดในตำนานของกลุ่มเพื่อนสนิท',
      'หน้า 2: วีรกรรมในห้องเรียน\n\nการแอบกินขนมหลังห้องครู การโดนทำโทษให้ยืนหน้าห้องร่วมกัน และทริปที่รถเสียกลางทางแต่หัวเราะกันทั้งคัน',
      'หน้า 3: คำอธิษฐานถึงเพื่อน\n\n"ขอให้เพื่อนทุกคนมีความสุขและประสบความสำเร็จในชีวิต — แล้วเจอกันบ่อย ๆ นะ"',
    ],
  },
];

function buildMediaAlbums() {
  const mediaAlbums = {};
  for (const id of GALLERY_MEDIA_IDS) mediaAlbums[id] = ALBUM_PHOTOS;
  for (const id of VIDEO_MEDIA_IDS) mediaAlbums[id] = ALBUM_VIDEOS;
  return mediaAlbums;
}

async function main() {
  const tenant = await db.tenant.findUnique({ where: { slug: SLUG } });
  if (!tenant) throw new Error(`Tenant "${SLUG}" not found — run demo seed first`);

  const websiteId = tenant.id;
  const tc = tenant.themeConfig && typeof tenant.themeConfig === 'object' ? { ...tenant.themeConfig } : {};

  const newThemeConfig = {
    ...tc,
    isDemo: true,
    albums: [ALBUM_PHOTOS, ALBUM_VIDEOS],
    mediaAlbums: buildMediaAlbums(),
    features: {
      gallery: true,
      videos: true,
      announcement: true,
      memory: true,
      family: true,
      ebooks: true,
      activities: true,
      condolence: true,
      donation: true,
      feed: false,
    },
    featureOrder: [
      'announcement',
      'gallery',
      'videos',
      'condolence',
      'memory',
      'activities',
      'family',
      'ebooks',
      'donation',
    ],
    subjects: [
      { name: 'ป้าแจ๊ส', role: 'หัวหน้ากลุ่ม', note: 'สายจัดตาราง สายประชุม สายเก็บเรื่อง', isAlive: true },
      { name: 'พี่ต้อม', role: 'สายทริป', note: 'ดูแลแผนเดินทางและที่พัก', isAlive: true },
      { name: 'น้องมิ้นท์', role: 'สายภาพ', note: 'ถ่ายรูป เก็บอัลบั้ม ทำไฮไลต์', isAlive: true },
      { name: 'แอนนา', role: 'สายดีไซน์', note: 'ทำการ์ดชวน ป้ายทริป โปสเตอร์รุ่น', isAlive: true },
      { name: 'โอ๋', role: 'สายกิน', note: 'รีวิวร้าน จัดเมนู หาของอร่อย', isAlive: true },
      { name: 'เบนซ์', role: 'สายเทค', note: 'ถ่ายวิดีโอ ตัดต่อ ทำสไลด์งานรุ่น', isAlive: true },
    ],
    announcement: {
      ...(tc.announcement || {}),
      mode: 'template',
      style: 'CHARCOAL_SLATE',
      active: true,
      text: 'เชิญชวนเพื่อน ๆ ในกลุ่มมาร่วมพบปะ สร้างความทรงจำ และอัปเดตเรื่องราวล่าสุด',
      templeName: 'The Local Table, Ari',
      pavilion: 'โซนรวมตัวชั้น 2',
      dressCode: 'แต่งตัวสบาย ๆ ธีมสีพาสเทลของกลุ่มก็ได้',
      contactPhone: '089-876-5543',
      mapLink: 'https://maps.google.com/?q=Ari+BTS+Bangkok',
      waterDate: 'วันเสาร์ที่ 15 ส.ค. 69',
      waterTime: '14:00 น.',
      fontFamily: tc.fontFamily || 'Inter',
      wreathPolicy: '',
      cremationDate: '',
      cremationTime: '',
      customCardUrl: '',
      abhidhammaTime: '',
      abhidhammaDateRange: '',
    },
  };

  await db.tenant.update({
    where: { id: websiteId },
    data: {
      donationActive: true,
      donationPromptPay: tenant.donationPromptPay || '08987655432',
      donationAccountName: tenant.donationAccountName || 'คุณศิรินภา เหรัญญิกตลอดมาและตลอดไป',
      themeConfig: newThemeConfig,
    },
  });

  const youtubeCount = await db.media.count({
    where: { websiteId, mimeType: { contains: 'youtube' } },
  });
  if (youtubeCount === 0) {
    await db.media.create({
      data: {
        websiteId,
        filePath: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
        fileName: 'ทริปท่องเที่ยว CN the Gang (YouTube)',
        fileSize: BigInt(0),
        mimeType: 'video/youtube',
        fileHash: 'youtube-friendforever-demo',
        album: 'VIDEO',
      },
    });
  }

  await db.familyMember.deleteMany({ where: { websiteId } });
  const createdMembers = [];
  for (const member of MEMBERS) {
    const row = await db.familyMember.create({
      data: {
        websiteId,
        name: member.name,
        nickname: member.nickname,
        relationship: member.relationship,
        birthYear: member.birthYear,
        deathYear: null,
        isDeceased: false,
        avatarUrl: member.avatarUrl,
        parentId: null,
        spouseOfId: null,
      },
    });
    createdMembers.push(row);
  }
  const leader = createdMembers.find((m) => m.relationship === 'PARENT_1');
  if (leader) {
    await db.familyMember.updateMany({
      where: { websiteId, relationship: 'SIBLING' },
      data: { parentId: leader.id },
    });
  }

  await db.ebook.deleteMany({ where: { websiteId } });
  await db.ebook.createMany({
    data: EBOOKS.map((row) => ({ websiteId, ...row })),
  });

  await db.activity.deleteMany({ where: { websiteId } });
  await db.activity.createMany({
    data: ACTIVITIES.map((row) => ({
      websiteId,
      title: row.title,
      description: row.description,
      images: row.images,
      pdfUrl: null,
      eventDate: row.eventDate,
      isRecurring: row.isRecurring,
      sortOrder: row.sortOrder,
    })),
  });

  await db.donation.deleteMany({ where: { websiteId } });
  await db.donation.createMany({
    data: DONATIONS.map((row) => ({ websiteId, ...row })),
  });

  const pendingMemory = await db.memoryPost.count({
    where: { websiteId, isApproved: false },
  });
  if (pendingMemory < 2) {
    const existing = await db.memoryPost.count({ where: { websiteId, isApproved: false } });
    if (existing === 0) {
      await db.memoryPost.createMany({
        data: [
          {
            websiteId,
            senderName: 'มิ้นท์',
            title: '',
            content: 'ฝากรูปวันรวมตัวรุ่น ยิ้มกันจนแก้มปวด ขอให้มีแบบนี้ทุกปี',
            mediaUrl: '',
            mediaType: 'NONE',
            isApproved: false,
          },
          {
            websiteId,
            senderName: 'แก๊ง CN',
            title: 'ทริปทะเลปี 2568',
            content:
              'แชร์โมเมนต์ตลก ๆ ตอนรถเสียกลางทาง แต่สุดท้ายก็หัวเราะกันทั้งรถ นี่แหละเพื่อนแท้',
            mediaUrl: '',
            mediaType: 'NONE',
            isApproved: false,
          },
        ],
      });
    }
  }

  const [family, activities, donations, ebooks, activityCount, media] = await Promise.all([
    db.familyMember.count({ where: { websiteId } }),
    db.activity.count({ where: { websiteId } }),
    db.donation.count({ where: { websiteId } }),
    db.ebook.count({ where: { websiteId } }),
    db.activity.count({ where: { websiteId } }),
    db.media.count({ where: { websiteId, isDeleted: false } }),
  ]);

  const updated = await db.tenant.findUnique({ where: { slug: SLUG } });
  console.log(`✓ ${SLUG}: Friends demo seeded`);
  console.log(
    `  family=${family} activities=${activities} donations=${donations} ebooks=${ebooks} media=${media}`,
  );
  console.log(`  donationActive=${updated.donationActive} albums=${newThemeConfig.albums.join(', ')}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
