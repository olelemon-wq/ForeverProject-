#!/usr/bin/env node
/**
 * Enable every Couple feature for pluemploy and seed demo content.
 * Usage: node scripts/seed-pluemploy-full.mjs
 */
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();
const SLUG = 'pluemploy';
const ALBUM_DATES = 'วันเดทของเรา';
const ALBUM_TRIPS = 'ทริปด้วยกัน';
const ALBUM_VIDEOS = 'คลิปความทรงจำ';

const GALLERY_PATHS = [
  '/demo-media/350b0b44-5a07-4173-aa75-0ce6e78ab71c/1784971702290-gallery-1784971702194-6a7ed7c6-b5a9-4119-9b4c-b5d22879ffbb.jpeg',
  '/demo-media/350b0b44-5a07-4173-aa75-0ce6e78ab71c/1784971710951-gallery-1784971710896-dddd8cfc-9135-415b-8b50-c9716f879f31.jpeg',
  '/demo-media/350b0b44-5a07-4173-aa75-0ce6e78ab71c/1784969245414-gallery-1784969245203-CleanShot 2569-07-25 at 15.23.09@2x.jpg',
  '/demo-media/350b0b44-5a07-4173-aa75-0ce6e78ab71c/1784969254875-gallery-1784969254813-CleanShot 2569-07-25 at 15.23.19@2x.jpg',
  '/demo-media/350b0b44-5a07-4173-aa75-0ce6e78ab71c/1784969261567-gallery-1784969261514-CleanShot 2569-07-25 at 15.23.29@2x.jpg',
  '/demo-media/350b0b44-5a07-4173-aa75-0ce6e78ab71c/1784969266780-gallery-1784969266742-CleanShot 2569-07-25 at 15.27.45@2x.jpg',
  '/demo-media/350b0b44-5a07-4173-aa75-0ce6e78ab71c/1784971721991-gallery-1784971721951-30ead0c5-6672-4994-acaa-ee67f1536ec5.jpeg',
];

const GALLERY_MEDIA_IDS = [
  '4dbb03ca-9fb6-43e4-b8d0-527c36ea7450',
  '4b303b68-1894-424f-924a-9aac8f527ad2',
  'dd8f9cf1-e66a-4287-969f-b78770ed4a05',
  '9ee90c24-0a40-4781-9dab-6e6e73d5c0ab',
  '75d718ca-5d61-41b4-afc7-a7389df332ae',
  'd73d6ed7-7ae9-4339-8e49-db14d020d8a0',
  'f87b4337-26ea-448d-9ea3-3549a2d1984c',
];

const VIDEO_MEDIA_IDS = ['0e111605-7aef-4f1e-9eea-02f1b052f4eb'];

const AVATAR =
  '/uploads/350b0b44-5a07-4173-aa75-0ce6e78ab71c/1786549374765-deceased-avatar-1786549374681-30ead0c5-6672-4994-acaa-ee67f1536ec5.jpeg';
const COVER =
  '/uploads/350b0b44-5a07-4173-aa75-0ce6e78ab71c/1786549395116-deceased-cover-1786549395024-CleanShot 2569-07-25 at 15.23.09@2x.png';

const BIO =
  'ปลื้มกับพลอยเริ่มจากการเจอกันแบบไม่ได้ตั้งใจ แต่กลายเป็นคนที่อยากแชร์ทุกวันให้กัน\n\nเว็บนี้เก็บเส้นทางความรักของเรา — ตั้งแต่วันแรกที่คุยกันไม่รู้จบ ทริปแรกที่ไม่ต้องรีบ และวันที่เริ่มมี “บ้าน” ร่วมกัน';

const MILESTONES = [
  {
    id: '56caeac4-7a86-4ce6-9f8c-f632daee3d28',
    date: 'ประมาณปี 66',
    note: 'วันที่เริ่มต้นทุกอย่าง — จำวันเป๊ะไม่ได้ แต่จำความรู้สึกได้',
    time: 'ช่วงเย็น',
    place: 'คาเฟ่ Ari, กรุงเทพฯ',
    title: 'วันแรกที่เจอกัน',
  },
  {
    id: '4e943cb8-9015-412b-b6db-be83922e6d12',
    date: '20 พ.ย. 67',
    note: 'ทริปแรกที่ไม่ต้องรีบไปไหน',
    time: 'เช้า',
    place: 'เชียงใหม่',
    title: 'ทริปเชียงใหม่ครั้งแรก',
  },
  {
    id: '2714c27a-8e34-4074-8a09-6f9d4e6949fe',
    date: '1 มี.ค. 68',
    note: 'วันแรกที่มี “บ้าน” ร่วมกัน',
    time: '09:00 น.',
    place: 'บ้านหลังเล็กของเรา',
    title: 'วันย้ายเข้าบ้านเดียวกัน',
  },
  {
    id: '2801e94a-e0a8-4cab-a4bf-1722998eaea6',
    date: '20 ก.ค. 69',
    note: 'ฉลองความรักที่เติบโตไปด้วยกัน',
    time: '19:00 น.',
    place: 'ร้านอาหารโปรดของเรา',
    title: 'ครบรอบ 3 ปี',
  },
];

const FAMILY_MEMBERS = [
  {
    name: 'คุณแม่ปลื้ม',
    nickname: 'แม่ปลื้ม',
    relationship: 'PARENT_1',
    birthYear: '2510',
    avatarUrl: GALLERY_PATHS[0],
  },
  {
    name: 'คุณพ่อพลอย',
    nickname: 'พ่อพลอย',
    relationship: 'PARENT_2',
    birthYear: '2508',
    avatarUrl: GALLERY_PATHS[1],
  },
  {
    name: 'น้องทราย',
    nickname: 'น้องพลอย',
    relationship: 'SIBLING',
    birthYear: '2543',
    avatarUrl: GALLERY_PATHS[2],
  },
  {
    name: 'พี่ต้น',
    nickname: 'พี่ปลื้ม',
    relationship: 'SIBLING',
    birthYear: '2535',
    avatarUrl: GALLERY_PATHS[3],
  },
  {
    name: 'ป้าแจ๋ว',
    nickname: 'ป้าที่รัก',
    relationship: 'CHILD',
    birthYear: '2505',
    avatarUrl: GALLERY_PATHS[4],
  },
];

const ACTIVITIES = [
  {
    title: 'ครบรอบ 3 ปี — ดินเนอร์ร้านโปรด',
    description:
      'จองโต๊ะมุมเงียบ ๆ สั่งเมนูที่เคยกินวันแรกที่คบกัน และเขียนการ์ดสั้น ๆ ให้กันอีกครั้ง',
    images: GALLERY_PATHS.slice(0, 3),
    eventDate: new Date('2026-07-20T00:00:00+07:00'),
    isRecurring: true,
    sortOrder: 0,
  },
  {
    title: 'แพลนเดทดูหนังกลางแจ้ง',
    description:
      'หาหนังที่ทั้งคู่ยังไม่เคยดู เตรียมผ้าห่มและของว่าง แล้วถ่ายรูปคู่ก่อนหนังเริ่ม',
    images: GALLERY_PATHS.slice(2, 5),
    eventDate: new Date('2026-09-05T00:00:00+07:00'),
    isRecurring: false,
    sortOrder: 1,
  },
  {
    title: 'ทริปหัวหินแบบชิล ๆ',
    description:
      'ขับรถไปด้วยกัน ไม่ต้องแพลนแน่น — เช้ากินซีฟู้ด บ่ายเดินชายหาด เย็นดูพระอาทิตย์ตก',
    images: [GALLERY_PATHS[4], GALLERY_PATHS[5], GALLERY_PATHS[6]],
    eventDate: new Date('2026-11-14T00:00:00+07:00'),
    isRecurring: false,
    sortOrder: 2,
  },
];

const EBOOKS = [
  {
    title: 'สมุดภาพเส้นทางความรัก ปลื้ม & พลอย',
    author: 'ปลื้ม & พลอย',
    pdfUrl: '',
    totalPages: 4,
    pages: [
      'บทนำ\n\nสมุดภาพเล่มนี้เก็บโมเมนต์สั้น ๆ จากเส้นทางความรักของเรา ตั้งแต่วันแรกที่เจอกันจนถึงวันที่เริ่มมีบ้านร่วมกัน',
      'หน้า 2: วันแรกที่ Ari\n\nคุยกันจนลืมดูนาฬิกา คาเฟ่เล็ก ๆ กลายเป็นจุดเริ่มต้นของทุกอย่างที่ตามมา',
      'หน้า 3: ทริปเชียงใหม่\n\nทริปแรกที่ไม่ต้องรีบไปไหน — แค่ได้อยู่ด้วยกันก็พอ',
      'บทส่งท้าย\n\nขอให้เราเก็บความทรงจำดี ๆ ไว้ด้วยกันต่อไป และสร้างวันสำคัญใหม่ ๆ อีกมากมาย\n\nด้วยรัก\nปลื้ม & พลอย',
    ],
  },
  {
    title: '100 สิ่งที่อยากทำด้วยกัน',
    author: 'ปลื้ม & พลอย',
    pdfUrl: '',
    totalPages: 3,
    pages: [
      'รายการความฝันเล็ก ๆ\n\nรวมสิ่งที่อยากทำด้วยกัน ทั้งใกล้และไกล ทั้งจริงจังและขำ ๆ',
      'หน้า 2: ใกล้บ้าน\n\nดูหนังกลางแจ้ง / ทำอาหารด้วยกัน / ขี่จักรยานรอบสวน / ไปตลาดนัดวันหยุด',
      'หน้า 3: ไกลบ้าน\n\nทริปทะเล / เดินป่าเบา ๆ / เที่ยวเมืองที่ยังไม่เคยไป / ปีใหม่ด้วยกันทุกปี',
    ],
  },
];

const DONATIONS = [
  {
    donorName: 'เพื่อนสนิทจากมหาวิทยาลัย',
    amount: 500,
    message: 'ยินดีกับทั้งคู่เสมอ ส่งกำลังใจให้เติบโตไปด้วยกันนะ',
    isAnonymous: false,
    hideAmount: false,
    isVerified: true,
    createdAt: new Date('2026-07-18T11:00:00+07:00'),
  },
  {
    donorName: 'ผู้ไม่ประสงค์ออกนาม',
    amount: 300,
    message: 'ร่วมสมทบกองทุนแห่งความรักเล็กน้อย ขอให้มีความสุขมาก ๆ',
    isAnonymous: true,
    hideAmount: true,
    isVerified: true,
    createdAt: new Date('2026-07-19T15:30:00+07:00'),
  },
  {
    donorName: 'พี่สาวพลอย',
    amount: 1000,
    message: 'ของขวัญเล็ก ๆ จากพี่ สู้ต่อไปนะคนเก่ง',
    isAnonymous: false,
    hideAmount: false,
    isVerified: true,
    createdAt: new Date('2026-07-20T09:45:00+07:00'),
  },
];

const CONDOLENCES = [
  {
    senderName: 'มิ้นท์',
    relationship: 'เพื่อน',
    message: 'ชอบโมเมนต์ของพวกเธอมาก ขอให้มีความสุขและดูแลกันดี ๆ นะ',
    type: 'GENERAL',
    isApproved: true,
    createdAt: new Date('2026-07-10T10:00:00+07:00'),
  },
  {
    senderName: 'ต้น & บี',
    relationship: 'เพื่อนคู่',
    message: 'ยินดีกับครบรอบด้วยนะ อยากไปดินเนอร์ด้วยกันอีกรอบ!',
    type: 'GENERAL',
    isApproved: true,
    createdAt: new Date('2026-07-12T14:00:00+07:00'),
  },
  {
    senderName: 'คุณแม่ปลื้ม',
    relationship: 'ครอบครัว',
    message: 'ลูกทั้งสองคนน่ารักมาก ขอให้ดูแลกันและเติบโตไปด้วยกันอย่างอบอุ่น',
    type: 'FAMILY',
    isApproved: true,
    createdAt: new Date('2026-07-15T09:30:00+07:00'),
  },
];

const MEMORY_POSTS = [
  {
    senderName: 'ปลื้ม',
    title: 'วันแรกที่ Ari',
    content: 'ยังจำได้ว่าคุยกันจนร้านจะปิด แล้วเดินกลับบ้านยิ้มคนเดียวทั้งทาง',
    mediaUrl: GALLERY_PATHS[0],
    mediaType: 'IMAGE',
    isApproved: true,
    createdAt: new Date('2026-01-15T10:00:00+07:00'),
  },
  {
    senderName: 'พลอย',
    title: 'ทริปเชียงใหม่',
    content: 'ทริปแรกที่ไม่ต้องรีบ แค่ได้นั่งกินกาแฟด้วยกันบนดาดฟ้าก็มีความสุขแล้ว',
    mediaUrl: GALLERY_PATHS[2],
    mediaType: 'IMAGE',
    isApproved: true,
    createdAt: new Date('2026-02-01T16:00:00+07:00'),
  },
  {
    senderName: 'ปลื้ม & พลอย',
    title: 'วันย้ายเข้าบ้าน',
    content: 'กล่องเยอะไปหมด แต่รู้สึกว่านี่คือจุดเริ่มต้นของ “เรา” จริง ๆ',
    mediaUrl: GALLERY_PATHS[4],
    mediaType: 'IMAGE',
    isApproved: true,
    createdAt: new Date('2026-03-01T12:00:00+07:00'),
  },
];

const PENDING_MEMORY = [
  {
    senderName: 'เพื่อนจากที่ทำงาน',
    title: 'รูปดินเนอร์ครบรอบ',
    content: 'ฝากรูปคืนครบรอบ 3 ปี ดูแล้วอบอุ่นมาก ขอลงในไดอารี่ได้นะ',
    mediaUrl: '',
    mediaType: 'NONE',
  },
  {
    senderName: 'น้องทราย',
    title: '',
    content: 'ฝากข้อความสั้น ๆ ถึงพี่ปลื้มกับพี่พลอย — รักและเชียร์เสมอนะคะ',
    mediaUrl: '',
    mediaType: 'NONE',
  },
];

function buildMediaAlbums() {
  const mediaAlbums = {};
  GALLERY_MEDIA_IDS.slice(0, 4).forEach((id) => {
    mediaAlbums[id] = ALBUM_DATES;
  });
  GALLERY_MEDIA_IDS.slice(4).forEach((id) => {
    mediaAlbums[id] = ALBUM_TRIPS;
  });
  VIDEO_MEDIA_IDS.forEach((id) => {
    mediaAlbums[id] = ALBUM_VIDEOS;
  });
  return mediaAlbums;
}

async function main() {
  const tenant = await db.tenant.findUnique({ where: { slug: SLUG } });
  if (!tenant) throw new Error(`Tenant "${SLUG}" not found — run demo seed first`);

  const websiteId = tenant.id;
  const tc =
    tenant.themeConfig && typeof tenant.themeConfig === 'object'
      ? { ...tenant.themeConfig }
      : {};

  const newThemeConfig = {
    ...tc,
    isDemo: true,
    avatarUrl: tc.avatarUrl || AVATAR,
    coverUrl: tc.coverUrl || COVER,
    biography: BIO,
    albums: [ALBUM_DATES, ALBUM_TRIPS, ALBUM_VIDEOS],
    mediaAlbums: buildMediaAlbums(),
    subjects: [
      {
        name: 'ธนกฤต (ปลื้ม)',
        role: 'ฝ่ายชาย',
        note: 'สายแพลนทริปและของหวาน',
        isAlive: true,
        birthYear: 1996,
        birthYearOnly: true,
        avatarUrl: AVATAR,
        avatarScale: 1,
        avatarX: 0,
        avatarY: 0,
        avatarRotate: 0,
      },
      {
        name: 'พลอยไพลิน (พลอย)',
        role: 'ฝ่ายหญิง',
        note: 'สายถ่ายรูปและแพลนวันเดท',
        isAlive: true,
        birthYear: 1997,
        birthYearOnly: true,
        avatarUrl: GALLERY_PATHS[6],
        avatarScale: 1,
        avatarX: 0,
        avatarY: 0,
        avatarRotate: 0,
      },
    ],
    features: {
      gallery: true,
      videos: true,
      announcement: true,
      memory: true,
      family: true,
      ebooks: true,
      activities: true,
      condolence: true,
      donation: false,
      feed: false,
    },
    featureOrder: [
      'announcement',
      'gallery',
      'videos',
      'memory',
      'activities',
      'ebooks',
      'family',
      'condolence',
      'donation',
    ],
    announcement: {
      ...(tc.announcement || {}),
      mode: 'template',
      style: 'WARM_CREAM',
      active: true,
      fontFamily: tc.fontFamily || 'LINE Seed Sans TH',
      text: 'บันทึกวันสำคัญและเส้นทางความรักของเรา',
      templeName: 'ร้านอาหารโปรดของเรา',
      pavilion: 'มุมโต๊ะริมหน้าต่าง',
      dressCode: 'ทุกวันสำคัญคือจุดเริ่มต้นของบทต่อไป — ปลื้ม & พลอย',
      contactPhone: '081-234-5678',
      mapLink: 'https://maps.app.goo.gl/example-couple-dinner',
      waterDate: '20 ก.ค. 69',
      waterTime: '19:00 น.',
      abhidhammaDateRange: '',
      abhidhammaTime: '',
      cremationDate: '',
      cremationTime: '',
      wreathPolicy: '',
      customCardUrl: '',
      milestones: MILESTONES,
    },
  };

  await db.tenant.update({
    where: { id: websiteId },
    data: {
      name: 'ปลื้ม & พลอย',
      donationActive: false,
      donationPromptPay: tenant.donationPromptPay || '',
      donationAccountName: tenant.donationAccountName || '',
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
        fileName: 'Highlight ความรักของเรา (YouTube Demo)',
        fileSize: BigInt(0),
        mimeType: 'video/youtube',
        fileHash: 'youtube-pluemploy-demo',
        album: 'VIDEO',
      },
    });
  }

  await db.familyMember.deleteMany({ where: { websiteId } });
  for (const member of FAMILY_MEMBERS) {
    await db.familyMember.create({
      data: {
        websiteId,
        name: member.name,
        nickname: member.nickname,
        relationship: member.relationship,
        birthYear: member.birthYear,
        deathYear: null,
        isDeceased: false,
        avatarUrl: member.avatarUrl,
      },
    });
  }

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

  await db.ebook.deleteMany({ where: { websiteId } });
  await db.ebook.createMany({
    data: EBOOKS.map((row) => ({ websiteId, ...row })),
  });

  await db.donation.deleteMany({ where: { websiteId } });
  // Couple keeps donation off by default — sample rows only if later enabled manually.

  const approvedCond = await db.condolence.count({
    where: { websiteId, isApproved: true },
  });
  if (approvedCond < 3) {
    await db.condolence.createMany({
      data: CONDOLENCES.map((row) => ({ websiteId, ...row })),
    });
  }

  const approvedMemory = await db.memoryPost.count({
    where: { websiteId, isApproved: true },
  });
  if (approvedMemory < 3) {
    await db.memoryPost.createMany({
      data: MEMORY_POSTS.map((row) => ({ websiteId, ...row })),
    });
  }

  const pendingMemory = await db.memoryPost.count({
    where: { websiteId, isApproved: false },
  });
  if (pendingMemory === 0) {
    await db.memoryPost.createMany({
      data: PENDING_MEMORY.map((row) => ({
        websiteId,
        ...row,
        isApproved: false,
      })),
    });
  }

  const pendingCond = await db.condolence.count({
    where: { websiteId, isApproved: false },
  });
  if (pendingCond === 0) {
    await db.condolence.create({
      data: {
        websiteId,
        senderName: 'เพื่อนใหม่จากงาน',
        relationship: 'คนรู้จัก',
        message: 'ขอร่วมส่งคำอวยพรให้นะคะ รักกันนาน ๆ (รอกลั่นกรอง)',
        type: 'GENERAL',
        isApproved: false,
      },
    });
  }

  const [
    activities,
    condolences,
    donations,
    memoryPosts,
    memoryPending,
    familyMembers,
    ebooks,
    media,
  ] = await Promise.all([
    db.activity.count({ where: { websiteId } }),
    db.condolence.count({ where: { websiteId } }),
    db.donation.count({ where: { websiteId } }),
    db.memoryPost.count({ where: { websiteId } }),
    db.memoryPost.count({ where: { websiteId, isApproved: false } }),
    db.familyMember.count({ where: { websiteId } }),
    db.ebook.count({ where: { websiteId } }),
    db.media.count({ where: { websiteId, isDeleted: false } }),
  ]);

  console.log('✓ pluemploy: all Couple features seeded');
  console.log(
    `  activities=${activities} condolences=${condolences} donations=${donations} memory=${memoryPosts} (pending=${memoryPending}) family=${familyMembers} ebooks=${ebooks} media=${media}`,
  );
  console.log(`  albums=${ALBUM_DATES}, ${ALBUM_TRIPS}, ${ALBUM_VIDEOS}`);
  console.log('  announcement=active milestones=4 donation=off (optional)');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
