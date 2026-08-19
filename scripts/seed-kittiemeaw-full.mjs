#!/usr/bin/env node
/**
 * Enable every Pet Memorial feature for kittiemeaw and seed demo content.
 * Usage: node scripts/seed-kittiemeaw-full.mjs
 */
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();
const SLUG = 'kittiemeaw';
const ALBUM_PHOTOS = 'เด็กอ้วนคิตตี้';
const ALBUM_MOMENTS = 'โมเมนต์กับพี่น้องสี่ขา';
const ALBUM_VIDEOS = 'คลิปแสนซน';

const GALLERY_PATHS = [
  '/demo-media/f4d68f77-50a1-4799-b060-cf38af5d210d/1785398635928-gallery-1785398635709-a3ee928f-d9e5-42eb-83d6-5b3c49053306.jpg',
  '/demo-media/f4d68f77-50a1-4799-b060-cf38af5d210d/1785398636047-gallery-1785398636035-1ad2aa01-639f-4d2d-840f-3df8cba4b9b3.jpg',
  '/demo-media/f4d68f77-50a1-4799-b060-cf38af5d210d/1785398636099-gallery-1785398636083-695b3d20-4fb0-4c96-afd2-21a121fff880.jpeg',
  '/demo-media/f4d68f77-50a1-4799-b060-cf38af5d210d/1785398636147-gallery-1785398636131-0374c879-75e3-4960-870f-771d215f9d5b.jpeg',
  '/demo-media/f4d68f77-50a1-4799-b060-cf38af5d210d/1785398636190-gallery-1785398636177-be1d970a-2094-4771-b7f8-6e9208ce7e16.jpeg',
  '/demo-media/f4d68f77-50a1-4799-b060-cf38af5d210d/1785398636232-gallery-1785398636217-d1a27035-77a0-4531-9f31-36dc77574e81.jpeg',
  '/demo-media/f4d68f77-50a1-4799-b060-cf38af5d210d/1785398636282-gallery-1785398636262-0c92f1ef-59e5-421d-8669-c6be8bed1378.jpeg',
  '/demo-media/f4d68f77-50a1-4799-b060-cf38af5d210d/1785398636318-gallery-1785398636305-2159e4f4-a876-4d89-8ec5-2f33430b4744.jpeg',
  '/demo-media/f4d68f77-50a1-4799-b060-cf38af5d210d/1785398636358-gallery-1785398636345-1ca184df-4cf0-47f4-b9d2-34e78b9d674c.jpeg',
  '/demo-media/f4d68f77-50a1-4799-b060-cf38af5d210d/1785398636401-gallery-1785398636387-47beb55b-4e2c-41ab-ab93-777921176363.jpeg',
];

const GALLERY_MEDIA_IDS = [
  '4cde4e6a-ca3f-4b5d-889e-854e9f4b062e',
  '0e6ba19f-6588-4c5a-b8f1-47cbbc662083',
  'd3e3dcdc-3457-44ac-b272-16177afcd971',
  '9d30fdc5-c16b-4c83-85c8-dc04343b3251',
  'f3bf1e80-2cfd-4618-9b2a-7b783dc4c660',
  '9341d278-df0b-4e41-819f-49b2cd1ae95a',
  '15f0c8c6-7e58-483c-a7fa-1f62d381abde',
  '4e5f0948-989e-44b1-8a21-8abb97813a0c',
  '76aba6c5-91dd-48ed-96d8-9175ce1afa37',
  'a4440245-7b10-4a60-bb0c-4fbf136c10fe',
];

const VIDEO_MEDIA_IDS = [
  'aad1829e-a6fe-46e6-8155-bb7c4d6a553b',
  '6d13aeb5-d53a-4a7a-9a9e-33428393a5f6',
];

const BIO =
  'น้องคิตตี้เป็นหมาพันธุ์ชิวาว่าที่ร่าเริงและแสนรู้ นำความสุขและรอยยิ้มมาให้ครอบครัวเราตลอดเวลาที่อยู่ด้วยกัน';

const LIFE_STORY = {
  biography: BIO,
  honors: '',
  teachings: '',
  legacy:
    'ชอบนอนตากแดดตรงหน้าต่างทุกเช้า / วิ่งมาต้อนรับทุกครั้งที่กลับบ้าน / ชอบกินไก่ย่างและขนมสุนัขรสเนย / นอนตักเวลาดูทีวีทุกคืน',
  timeline: [
    {
      id: 'kitty-tl-1',
      year: '2563',
      title: 'วันแรกที่รับน้องมาเลี้ยง',
      description: 'น้องตัวจิ๋ววิ่งมากอดขา ตั้งแต่นั้นมาบ้านก็ไม่เคยเงียบอีกเลย',
    },
    {
      id: 'kitty-tl-2',
      year: '2565',
      title: 'ทริปแรกไปทะเล',
      description: 'น้องชอบวิ่งเล่นบนชายหาดมาก แต่กลับมาบ้านแล้วนอนหลับยาวสามวัน',
    },
    {
      id: 'kitty-tl-3',
      year: '2568',
      title: 'วันสุดท้ายที่อยู่ด้วยกัน',
      description: 'เราจะจำรอยยิ้มและความรักของน้องไว้ตลอดไป',
    },
  ],
};

const FAMILY_MEMBERS = [
  {
    name: 'แชปแมวหัวแปะ',
    nickname: 'แมววัว',
    relationship: 'SIBLING',
    birthYear: '2562',
    deathYear: null,
    isDeceased: false,
    avatarUrl:
      '/uploads/f4d68f77-50a1-4799-b060-cf38af5d210d/1786108786322-pet-avatar-2-1786108786284-0c92f1ef-59e5-421d-8669-c6be8bed1378.jpeg',
  },
  {
    name: 'ม็อกกี้',
    nickname: 'จอมซน',
    relationship: 'SIBLING',
    birthYear: '2560',
    deathYear: null,
    isDeceased: false,
    avatarUrl: GALLERY_PATHS[6],
  },
  {
    name: 'น้องอุ่นใจ',
    nickname: 'ขนฟู',
    relationship: 'SIBLING',
    birthYear: '2563',
    deathYear: null,
    isDeceased: false,
    avatarUrl: GALLERY_PATHS[8],
  },
  {
    name: 'ปุยฝ้าย',
    nickname: 'พี่ใหญ่',
    relationship: 'SIBLING',
    birthYear: '2558',
    deathYear: '2566',
    isDeceased: true,
    avatarUrl: GALLERY_PATHS[5],
  },
];

const ACTIVITIES = [
  {
    title: 'วันเกิดน้องคิตตี้ ครบรอบ',
    description:
      'งานฉลองวันเกิดเล็ก ๆ ที่บ้าน — มีเค้กสุนัข ของเล่นใหม่ และถ่ายรูปกับพี่น้องสี่ขาทุกตัว เชิญเพื่อนบ้านมาร่วมส่งความสุขให้น้อง',
    images: GALLERY_PATHS.slice(0, 4),
    eventDate: new Date('2026-01-01T00:00:00+07:00'),
    isRecurring: true,
    sortOrder: 0,
  },
  {
    title: 'ทริปชายหาดครอบครัว + สี่ขา',
    description:
      'พาน้องไปเดินเล่นริมทะเลครั้งแรกของปี — วิ่งเล่น ถ่ายรูป และพักผ่อนใต้ร่มไม้ อย่าลืมครีมกันแดดและน้ำดื่มสำหรับน้องนะคะ',
    images: GALLERY_PATHS.slice(3, 7),
    eventDate: new Date('2026-03-20T00:00:00+07:00'),
    isRecurring: false,
    sortOrder: 1,
  },
  {
    title: 'วันรวมแก๊งพี่น้องสี่ขา',
    description:
      'นัดรวมตัวแมวหมาในบ้านและเพื่อนบ้านใกล้เคียง เล่นของเล่นด้วยกัน แลกเปลี่ยนขนม และอัปเดตสุขภาพน้อง ๆ',
    images: [GALLERY_PATHS[6], GALLERY_PATHS[7], GALLERY_PATHS[8]],
    eventDate: new Date('2026-08-15T00:00:00+07:00'),
    isRecurring: true,
    sortOrder: 2,
  },
];

const DONATIONS = [
  {
    donorName: 'คุณมิ้นท์',
    amount: 500,
    message: 'ขอบคุณน้องคิตตี้ที่ทำให้บ้านอบอุ่นเสมอ ส่งต่อความรักให้น้องสี่ขาตัวอื่นด้วยนะคะ',
    isAnonymous: false,
    hideAmount: false,
    isVerified: true,
    createdAt: new Date('2026-02-08T11:00:00+07:00'),
  },
  {
    donorName: 'ผู้ไม่ประสงค์ออกนาม',
    amount: 200,
    message: 'ร่วมสมทบกองทุนช่วยเหลือสัตว์จรแทนความคิดถึงน้อง',
    isAnonymous: true,
    hideAmount: true,
    isVerified: true,
    createdAt: new Date('2026-02-09T15:30:00+07:00'),
  },
  {
    donorName: 'พี่ต้น & ครอบครัว',
    amount: 1000,
    message: 'ขอให้ความรักที่มีให้น้องส่งต่อเป็นกำลังใจให้น้องสี่ขาที่รอความช่วยเหลือ',
    isAnonymous: false,
    hideAmount: false,
    isVerified: true,
    createdAt: new Date('2026-02-10T09:45:00+07:00'),
  },
];

const CONDOLENCES = [
  {
    senderName: 'เพื่อนบ้าน',
    relationship: 'เพื่อนบ้าน',
    message:
      'คิดถึงน้องคิตตี้ที่ชอบมานั่งหน้าบ้านทุกเย็น ขอให้น้องมีความสุขบนดาวสัตว์เลี้ยง',
    type: 'GENERAL',
    isApproved: true,
    createdAt: new Date('2026-02-05T10:00:00+07:00'),
  },
  {
    senderName: 'คุณแม่บ้าน',
    relationship: 'คนใกล้ชิด',
    message: 'ขอบคุณน้องที่ทำให้ทุกวันมีรอยยิ้ม จะจำน้องไว้ตลอดไปค่ะ',
    type: 'GENERAL',
    isApproved: true,
    createdAt: new Date('2026-02-06T14:00:00+07:00'),
  },
  {
    senderName: 'พี่เลี้ยง',
    relationship: 'ผู้ดูแล',
    message:
      'ยังจำวันที่น้องวิ่งมากอดขาทุกเช้า ขอบคุณที่เป็นสมาชิกตัวน้อยที่น่ารักที่สุดของบ้านเรา',
    type: 'FAMILY',
    isApproved: true,
    createdAt: new Date('2026-02-07T09:30:00+07:00'),
  },
];

const PENDING_MEMORY = [
  {
    senderName: 'เพื่อนบ้านข้างบ้าน',
    title: 'วันที่เจอน้องที่รั้ว',
    content: 'ฝากรูปวันที่น้องมายืนมองเราผ่านรั้ว แล้วยิ้มแบบแมว — น่ารักมาก ขออนุญาตลงในไดอารี่นะคะ',
    mediaUrl: '',
    mediaType: 'NONE',
  },
  {
    senderName: 'น้องชาย',
    title: '',
    content: 'ฝากคลิปน้องชอบนอนตัก ดูแล้วคิดถึงทุกครั้ง ช่วยกลั่นกรองให้หน่อยนะครับ',
    mediaUrl: '',
    mediaType: 'NONE',
  },
];

const MEMORY_POSTS = [
  {
    senderName: 'พี่เลี้ยง',
    title: 'วันที่รับน้องมา',
    content: 'ยังจำวันแรกที่น้องตัวจิ๋ววิ่งมากอดขา ตั้งแต่นั้นมาบ้านก็ไม่เคยเงียบอีกเลย',
    mediaUrl: GALLERY_PATHS[0],
    mediaType: 'IMAGE',
    isApproved: true,
    createdAt: new Date('2026-01-10T10:00:00+07:00'),
  },
  {
    senderName: 'คุณแม่',
    title: 'นอนตากแดดประจำ',
    content: 'ทุกเช้าต้องมาแย่งที่ตรงหน้าต่างกับน้อง คิตตี้ชนะเสมอ',
    mediaUrl: GALLERY_PATHS[2],
    mediaType: 'IMAGE',
    isApproved: true,
    createdAt: new Date('2026-01-18T08:00:00+07:00'),
  },
  {
    senderName: 'น้องชาย',
    title: 'ทริปทะเลครั้งแรก',
    content: 'วันนั้นน้องตื่นเต้นวิ่งไปทั่วชายหาด กลับบ้านแล้วนอนยาวสามวัน',
    mediaUrl: GALLERY_PATHS[4],
    mediaType: 'IMAGE',
    isApproved: true,
    createdAt: new Date('2026-02-01T16:00:00+07:00'),
  },
];

function buildMediaAlbums() {
  const mediaAlbums = {};
  GALLERY_MEDIA_IDS.slice(0, 5).forEach((id) => {
    mediaAlbums[id] = ALBUM_PHOTOS;
  });
  GALLERY_MEDIA_IDS.slice(5).forEach((id) => {
    mediaAlbums[id] = ALBUM_MOMENTS;
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

  const subjects = Array.isArray(tc.subjects) && tc.subjects.length >= 2
    ? tc.subjects
    : [
        {
          name: 'คิตตี้',
          breed: 'แมวส้ม ตัวอ้วนปุ๊กปิ๊ก',
          isAlive: false,
          birthYear: 2009,
          deathYear: 2024,
          birthYearOnly: true,
          deathYearOnly: true,
          birthDate: '2008-12-31T17:00:00.000Z',
          deathDate: '2023-12-31T17:00:00.000Z',
          personality: 'เลือกกินนิดหน่อย ขี้อ้อน',
          favorite: 'เปียก และจุ้งต้ม',
          dislike: 'ไม่ชอบอาบน้ำ และกินยา',
          avatarUrl:
            '/uploads/f4d68f77-50a1-4799-b060-cf38af5d210d/1786108759796-pet-avatar-1-1786108759652-a3ee928f-d9e5-42eb-83d6-5b3c49053306.jpg',
          avatarScale: 1.55,
          avatarX: 0,
          avatarY: 0,
          avatarRotate: 0,
        },
        {
          name: 'แชปแมวหัวแปะ',
          breed: 'แมวลายวัว หัวแปะ',
          isAlive: true,
          birthYear: 2019,
          birthYearOnly: true,
          birthDate: '2018-12-31T17:00:00.000Z',
          personality: 'แมววัวจอมทะเล้น ร่าเริง และหวังจะครองโลกกกก',
          favorite: 'คานิว่า รสแซลม่อน ม่อน ม่อน',
          dislike: 'กลัวผะ ผะ ผี',
          avatarUrl:
            '/uploads/f4d68f77-50a1-4799-b060-cf38af5d210d/1786108786322-pet-avatar-2-1786108786284-0c92f1ef-59e5-421d-8669-c6be8bed1378.jpeg',
          avatarScale: 1.4,
          avatarX: -0.15,
          avatarY: -0.08,
          avatarRotate: 0,
        },
      ];

  const newThemeConfig = {
    ...tc,
    isDemo: true,
    biography: BIO,
    lifeStory: LIFE_STORY,
    albums: [ALBUM_PHOTOS, ALBUM_MOMENTS, ALBUM_VIDEOS],
    mediaAlbums: buildMediaAlbums(),
    subjects,
    features: {
      gallery: true,
      videos: true,
      announcement: true,
      memory: true,
      family: true,
      ebooks: false,
      activities: true,
      condolence: true,
      donation: true,
      feed: false,
    },
    featureOrder: [
      'announcement',
      'gallery',
      'videos',
      'activities',
      'memory',
      'family',
      'condolence',
      'donation',
    ],
    announcement: {
      ...(tc.announcement || {}),
      mode: 'template',
      style: 'ELEGANT_WHITE',
      active: true,
      fontFamily: tc.fontFamily || 'LINE Seed Sans TH',
      text: 'เรียนเชิญร่วมส่งน้องคิตตี้ด้วยความรักและความคิดถึง',
      templeName: 'บ้านคิตตี้เหมียว อ.เมือง',
      pavilion: 'มุมสวนหน้าบ้าน',
      dressCode: 'แต่งตัวสบาย ๆ — พกของที่อยากฝากถึงน้องได้',
      contactPhone: '089-123-4567',
      mapLink: 'https://maps.app.goo.gl/example-pet-home',
      waterDate: '12 ธ.ค. 2567',
      waterTime: '10:00 น.',
      abhidhammaDateRange: '12 ธ.ค. 2567',
      abhidhammaTime: '14:00 น.',
      cremationDate: '13 ธ.ค. 2567',
      cremationTime: '09:00 น.',
      wreathPolicy: 'NORMAL',
      customCardUrl: '',
    },
  };

  await db.tenant.update({
    where: { id: websiteId },
    data: {
      donationActive: true,
      donationPromptPay: tenant.donationPromptPay || '0891234567',
      donationAccountName:
        tenant.donationAccountName || 'กองทุนช่วยเหลือสัตว์จร (Demo)',
      themeConfig: newThemeConfig,
    },
  });

  // Keep existing MP4 demos; add a YouTube sample only if no videos at all
  const videoCount = await db.media.count({
    where: {
      websiteId,
      OR: [
        { mimeType: { contains: 'video' } },
        { mimeType: { contains: 'youtube' } },
      ],
    },
  });
  if (videoCount === 0) {
    await db.media.create({
      data: {
        websiteId,
        filePath: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
        fileName: 'คลิปน่ารักของน้องคิตตี้ (YouTube Demo)',
        fileSize: BigInt(0),
        mimeType: 'video/youtube',
        fileHash: 'youtube-kittiemeaw-demo',
        album: 'VIDEO',
      },
    });
  }

  await db.familyMember.deleteMany({ where: { websiteId } });
  for (const member of FAMILY_MEMBERS) {
    await db.familyMember.create({
      data: { websiteId, ...member },
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

  await db.donation.deleteMany({ where: { websiteId } });
  await db.donation.createMany({
    data: DONATIONS.map((row) => ({ websiteId, ...row })),
  });

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
        senderName: 'ผู้มาเยือนออนไลน์',
        relationship: 'คนรู้จัก',
        message: 'ขอร่วมส่งกำลังใจและคิดถึงน้องคิตตี้ด้วยนะคะ (รอกลั่นกรอง)',
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
    media,
  ] = await Promise.all([
    db.activity.count({ where: { websiteId } }),
    db.condolence.count({ where: { websiteId } }),
    db.donation.count({ where: { websiteId } }),
    db.memoryPost.count({ where: { websiteId } }),
    db.memoryPost.count({ where: { websiteId, isApproved: false } }),
    db.familyMember.count({ where: { websiteId } }),
    db.media.count({ where: { websiteId, isDeleted: false } }),
  ]);

  console.log('✓ kittiemeaw: all Pet Memorial features seeded');
  console.log(
    `  activities=${activities} condolences=${condolences} donations=${donations} memory=${memoryPosts} (pending=${memoryPending}) family=${familyMembers} media=${media}`,
  );
  console.log(`  albums=${ALBUM_PHOTOS}, ${ALBUM_MOMENTS}, ${ALBUM_VIDEOS}`);
  console.log('  announcement=active lifeStory=yes donationActive=true');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
