#!/usr/bin/env node
/**
 * Enable every Family Legacy feature for bts-family and seed demo content.
 * Usage: node scripts/seed-bts-family-full.mjs
 */
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();
const SLUG = 'bts-family';
const ALBUM_PHOTOS = 'รวมใจตระกูลจิตใจดี';
const ALBUM_VIDEOS = 'บันทึกวิดีโอ';

const GALLERY_PATHS = [
  '/demo-media/4041f2c5-d9e2-4367-8877-a88214b3a76e/1785401220694-gallery-1785401220641-0b198e66-3d04-403a-9c6f-9ca6770334de.jpeg',
  '/demo-media/4041f2c5-d9e2-4367-8877-a88214b3a76e/1785401220798-gallery-1785401220778-298bf361-e8b9-40bd-bdb3-0d60c92498cd.jpeg',
  '/demo-media/4041f2c5-d9e2-4367-8877-a88214b3a76e/1785401220845-gallery-1785401220828-7f401b80-8dd9-405d-b816-b0824fbbf8b7.jpeg',
  '/demo-media/4041f2c5-d9e2-4367-8877-a88214b3a76e/1785401220893-gallery-1785401220876-fa2cb0a5-f36d-426c-af7e-131ae4bf8aa9.jpg',
  '/demo-media/4041f2c5-d9e2-4367-8877-a88214b3a76e/1785401220942-gallery-1785401220924-3628ac2a-0411-45e5-bd1e-dd3e2146e9ce.jpeg',
  '/demo-media/4041f2c5-d9e2-4367-8877-a88214b3a76e/1785401220744-gallery-1785401220728-5367b0b2-7235-4e80-b5d2-2a7668b87409.jpg',
];

const GALLERY_MEDIA_IDS = [
  '9b187665-22a2-417c-b4d1-ceeb7ddb19c4',
  '02aa20ad-313e-42af-ba6e-101ebc08d14f',
  '2c10bf8c-0499-4bcc-b019-b0389fbaa6aa',
  'c121a9f0-7367-403e-8edb-8f4efd0c0ba6',
  'c482b954-b036-4fae-9c02-8d69f5840739',
  '88807032-9485-4311-a00e-5792c8df2588',
  'c227eee7-f911-470f-93ad-b70a816822b3',
  'bdf989d2-a1e8-481d-b232-e94183de166a',
  '7d34602b-d5aa-47f2-8384-8520806e6772',
];

const VIDEO_MEDIA_IDS = ['9f7a179b-615f-4318-971a-6d245054b3a2'];

const PENDING_MEMORY = [
  {
    senderName: 'ลูกหลานรุ่นใหม่',
    title: 'คำสอนจากคุณปู่',
    content:
      'คุณปู่เคยบอกว่า "ตระกูลเราอยู่ด้วยกันเมื่อยังมีชีวิต และอยู่ด้วยกันในความทรงจำ" ขอจดจำไว้เสมอ',
    mediaUrl: '',
    mediaType: 'NONE',
  },
  {
    senderName: 'ญาติต่างจังหวัด',
    title: '',
    content:
      'ฝากเรื่องเล่าวันงานรวมตระกูลปีที่แล้ว บรรยากาศอบอุ่นมาก อยากให้จัดอีกเร็ว ๆ นี้',
    mediaUrl: '',
    mediaType: 'NONE',
  },
];

const EBOOKS = [
  {
    title: 'บันทึกประวัติตระกูลจิตใจดี',
    author: 'คณะผู้จัดทำตระกูล',
    pdfUrl: '',
    totalPages: 4,
    pages: [
      'บทนำ\n\nหนังสือประวัติตระกูลเล่มนี้จัดทำขึ้นเพื่อบันทึกเส้นทางของตระกูลจิตใจดี ตั้งแต่คุณปู่สมชาย ผู้ก่อตั้งรากฐานของบ้าน จนถึงลูกหลานทั้งเจ็ดที่เติบโตมาพร้อมกัน ทุกบทความสะท้อนความผูกพัน ความภาคภูมิใจ และคุณค่าที่ส่งต่อกันมาในครอบครัว',
      'หน้า 2: จุดเริ่มต้นของตระกูล\n\nคุณปู่สมชาย เริ่มต้นจากร้านเล็ก ๆ ในชุมชน ด้วยความขยันและจิตใจดีต่อเพื่อนบ้าน ตระกูลจึงเติบโตขึ้นและเป็นที่รักของทุกคน ลูกหลานทุกคนได้เรียนรู้ว่าความดีงามเริ่มจากการดูแลกันในบ้าน',
      'หน้า 3: มรดกทางใจ\n\n"ตระกูลเราอยู่ด้วยกันเมื่อยังมีชีวิต และอยู่ด้วยกันในความทรงจำ" — คำสอนนี้ถูกส่งต่อจากคุณปู่สู่ลูกหลานทุกรุ่น ไม่ว่าจะเป็นวันรวมญาติ การเดินทาง หรือช่วงเวลาสำคัญ ทุกคนในตระกูลจะกลับมารวมตัวกันเสมอ',
      'บทส่งท้าย\n\nขอขอบคุณลูกหลานและญาติทุกท่านที่ร่วมกันบันทึกเรื่องราว ภาพความทรงจำ และคำสอนที่มีค่า ขอให้มรดกทางใจของตระกูลจิตใจดีคงอยู่ในใจทุกคนตลอดไป\n\nด้วยความเคารพและรัก\nคณะผู้จัดทำ',
    ],
  },
  {
    title: 'คำสอนและเรื่องเล่าจากคุณปู่ชาย',
    author: 'ลูกหลานรุ่นใหม่',
    pdfUrl: '',
    totalPages: 3,
    pages: [
      'คำนำ\n\nเล่มนี้รวบรวมเรื่องเล่าและคำสอนจากคุณปู่สมชาย ที่ลูกหลานจดจำและอยากส่งต่อให้รุ่นต่อไป ทุกเรื่องสะท้อนความอบอุ่น ความขยัน และจิตใจดีที่เป็นหัวใจของตระกูล',
      'หน้า 2: เรื่องเล่าที่ยังจำได้\n\nทุกปีเราจะรวมญาติกัน แล้วเล่าเรื่องเก่า ๆ ของคุณปู่ชาย ว่าเคยช่วยเหลือเพื่อนบ้านและสร้างความอบอุ่นให้ชุมชน ลูกหลานฟังกันทุกปีและไม่เคยเบื่อ',
      'หน้า 3: คำสัญญาของลูกหลาน\n\n"เราสัญญาว่าจะดูแลกัน จะรักษามรดกทางใจของตระกูล และจะกลับมารวมตัวกันเสมอ ไม่ว่าจะอยู่ที่ไหน ตระกูลจิตใจดีคือบ้านของเราเสมอ"',
    ],
  },
];

const ACTIVITIES = [
  {
    title: 'งานรวมญาติประจำปี 2569',
    description:
      'งานรวมญาติครอบครัวจิตใจดีประจำปี — รวมตัวที่บ้านเกิด แลกเปลี่ยนข่าวคราว เล่าเรื่องราว และถ่ายรูปครอบครัวร่วมกัน ลูกหลานทุกคนช่วยกันจัดกิจกรรมและอาหาร',
    images: GALLERY_PATHS.slice(0, 4),
    eventDate: new Date('2026-12-26T00:00:00+07:00'),
    isRecurring: true,
    sortOrder: 0,
  },
  {
    title: 'ทำบุญวันเกิดคุณปู่สมชาย',
    description:
      'พิธีทำบุญตักบาตรและร่วมถวายอาหารเช้า เนื่องในวันเกิดคุณปู่ ลูกหลานและญาติที่อยู่ใกล้เคียงจะมาร่วมกัน หลังพิธีมีการรวมตัวถ่ายรูปและรับประทานอาหารกลางวัน',
    images: GALLERY_PATHS.slice(2, 5),
    eventDate: new Date('2026-01-15T00:00:00+07:00'),
    isRecurring: true,
    sortOrder: 1,
  },
  {
    title: 'กิจกรรมสอนทำอาหารครอบครัว',
    description:
      'คุณย่าสอนลูกหลานทำเมนูโบราณของครอบครัว — แกงส้มปลาและขนมไทย บันทึกสูตรและภาพไว้ให้รุ่นหลังได้เรียนรู้ต่อ',
    images: [GALLERY_PATHS[0], GALLERY_PATHS[5]],
    eventDate: new Date('2026-04-13T00:00:00+07:00'),
    isRecurring: false,
    sortOrder: 2,
  },
];

const CONDOLENCES = [
  {
    senderName: 'หลานสาวพิมพ์ใจ',
    relationship: 'หลานสาว',
    message:
      'คุณปู่คะ ขอบคุณที่สอนให้เรารู้จักความขยันและความเมตตา ทุกครั้งที่กลับบ้านยังรู้สึกอบอุ่นเหมือนเดิม ขอให้สุขภาพแข็งแรง รอวันรวมญาติปีนี้นะคะ',
    type: 'FAMILY',
    isApproved: true,
    createdAt: new Date('2026-02-01T10:00:00+07:00'),
  },
  {
    senderName: 'พี่วิชัย จิตใจดี',
    relationship: 'ลูกชาย',
    message:
      'ขอบคุณพ่อที่ส่งต่อคุณค่าดี ๆ ให้พวกเรา หน้าเว็บนี้เป็นเหมือนบ้านดิจิทัลของครอบครัว ที่ลูกหลานเปิดอ่านได้ทุกเมื่อ',
    type: 'FAMILY',
    isApproved: true,
    createdAt: new Date('2026-02-05T14:30:00+07:00'),
  },
  {
    senderName: 'ญาติที่อยู่เชียงใหม่',
    relationship: 'ญาติ',
    message:
      'คิดถึงทุกคนในครอบครัวจิตใจดีค่ะ ปีที่แล้วได้กลับมางานรวมญาติ บรรยากาศอบอุ่นมาก อยากให้จัดอีกเร็ว ๆ นี้',
    type: 'GENERAL',
    isApproved: true,
    createdAt: new Date('2026-02-10T09:15:00+07:00'),
  },
  {
    senderName: 'น้องนภา จิตใจดี',
    relationship: 'ลูกสาว',
    message:
      'ฝากข้อความถึงคุณปู่และทุกคนในครอบครัว — ขอให้เรายังคงดูแลกันแบบนี้ไปเรื่อย ๆ ไม่ว่าจะอยู่ที่ไหน บ้านของเราคือที่นี่',
    type: 'FAMILY',
    isApproved: true,
    createdAt: new Date('2026-02-12T18:00:00+07:00'),
  },
];

const DONATIONS = [
  {
    donorName: 'ลูกหลานรุ่นใหม่',
    amount: 2000,
    message: 'สมทบกองทุนงานรวมญาติประจำปี 2569 ขอให้ทุกคนได้กลับมาเจอกันอีกครั้ง',
    isAnonymous: false,
    hideAmount: false,
    isVerified: true,
    createdAt: new Date('2026-02-08T11:00:00+07:00'),
  },
  {
    donorName: 'ผู้ไม่ประสงค์ออกนาม',
    amount: 500,
    message: 'ร่วมทำบุญวันเกิดคุณปู่ และสมทบกิจกรรมครอบครัว',
    isAnonymous: true,
    hideAmount: true,
    isVerified: true,
    createdAt: new Date('2026-02-09T16:00:00+07:00'),
  },
  {
    donorName: 'พี่มณี & ครอบครัว',
    amount: 1500,
    message: 'ส่งต่อความรักและกำลังใจให้งานรวมญาติปีนี้สำเร็จลุล่วง',
    isAnonymous: false,
    hideAmount: false,
    isVerified: true,
    createdAt: new Date('2026-02-11T10:30:00+07:00'),
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
  const avatarUrl =
    tc.avatarUrl ||
    '/demo-media/4041f2c5-d9e2-4367-8877-a88214b3a76e/1785401245880-deceased-avatar-1785401245825-7f401b80-8dd9-405d-b816-b0824fbbf8b7.jpg';
  const coverUrl =
    tc.coverUrl ||
    '/demo-media/4041f2c5-d9e2-4367-8877-a88214b3a76e/1785401266497-deceased-cover-1785401266442-298bf361-e8b9-40bd-bdb3-0d60c92498cd.jpeg';

  const newThemeConfig = {
    ...tc,
    isDemo: true,
    avatarUrl,
    coverUrl,
    albums: [ALBUM_PHOTOS, ALBUM_VIDEOS],
    mediaAlbums: buildMediaAlbums(),
    biography:
      'ตระกูลจิตใจดี เป็นครอบครัวที่เติบโตมาด้วยความอบอุ่น ความขยัน และจิตใจดีต่อกัน เริ่มจากคุณปู่สมชาย ผู้ก่อตั้งรากฐานของบ้านหลังนี้ ลูกหลานทั้งเจ็ดคนเติบโตมาพร้อมกัน เรียนรู้ว่าความสุขของครอบครัวอยู่ที่การดูแลกัน หน้าเว็บนี้จัดทำขึ้นเพื่อบันทึกความทรงจำ ประวัติวงศ์ และมรดกทางใจที่ส่งต่อจากรุ่นสู่รุ่น',
    lifeStory: {
      biography:
        'ตระกูลจิตใจดี เป็นครอบครัวที่เติบโตมาด้วยความอบอุ่น ความขยัน และจิตใจดีต่อกัน เริ่มจากคุณปู่สมชาย ผู้ก่อตั้งรากฐานของบ้านหลังนี้ ลูกหลานทั้งเจ็ดคนเติบโตมาพร้อมกัน เรียนรู้ว่าความสุขของครอบครัวอยู่ที่การดูแลกัน หน้าเว็บนี้จัดทำขึ้นเพื่อบันทึกความทรงจำ ประวัติวงศ์ และมรดกทางใจที่ส่งต่อจากรุ่นสู่รุ่น',
      honors: '',
      legacy: '',
      teachings:
        '“ตระกูลเราอยู่ด้วยกันเมื่อยังมีชีวิต และอยู่ด้วยกันในความทรงจำ” — ความซื่อสัตย์ ความขยัน และการดูแลกันเป็นคุณค่าที่ส่งต่อมาทุกรุ่น ลูกหลานทุกคนถูกสอนให้จำรากเหง้า ภูมิใจในครอบครัว และช่วยเหลือกันเมื่อใครต้องการ',
      timeline: [
        {
          id: 'bts-tl-1',
          year: '2483',
          title: 'คุณปู่สมชาย ก่อตั้งบ้านหลังแรก',
          description: 'เริ่มจากร้านขายของชำเล็ก ๆ ที่สุพรรณบุรี แล้วค่อย ๆ ขยายครอบครัว',
        },
        {
          id: 'bts-tl-2',
          year: '2520',
          title: 'งานรวมญาติครั้งแรก',
          description: 'ลูกหลานรุ่นแรกรวมตัวกันทุกปีสิงหา จนต่อเนื่องมาจนถึงทุกวันนี้',
        },
        {
          id: 'bts-tl-3',
          year: '2567',
          title: 'เปิดหน้าเว็บครอบครัวจิตใจดี',
          description: 'บันทึกเรื่องราว รูปภาพ และกิจกรรมเพื่อให้รุ่นหลังได้รู้จักรากเหง้า',
        },
      ],
    },
    heroLayout: tc.heroLayout || 'center-classic',
    heroBgMode: tc.heroBgMode || 'image',
    heroStyle: tc.heroStyle || 'Classic',
    fontFamily: tc.fontFamily || 'LINE Seed Sans TH',
    primaryColor: tc.primaryColor || '#8ba8bd',
    secondaryColor: tc.secondaryColor || '#ded2af',
    defaultFontSize: tc.defaultFontSize || 'NORMAL',
    imageCoordSpace: tc.imageCoordSpace || 'relative',
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
      'activities',
      'memory',
      'family',
      'ebooks',
      'condolence',
      'donation',
    ],
    subjects: [
      {
        ...(tc.subjects?.[0] || {}),
        name: 'คุณปู่สมชาย จิตใจดี',
        role: 'ผู้ก่อตั้งตระกูลจิตใจดี',
        isAlive: true,
        birthDate: '1940-01-15T17:00:00.000Z',
        avatarUrl,
      },
    ],
    announcement: {
      ...(tc.announcement || {}),
      mode: 'template',
      style: 'ELEGANT_WHITE',
      active: true,
      fontFamily: tc.fontFamily || 'LINE Seed Sans TH',
      text: 'เชิญร่วมพบปะและสืบสานสายใยครอบครัว',
      templeName: 'บ้านเกิดครอบครัวจิตใจดี อ.เมือง จ.สุพรรณบุรี',
      pavilion: 'ลานกิจกรรมหน้าบ้าน / ศาลาเก่า',
      dressCode: 'ชุดลำลองสบาย ๆ โทนอบอุ่น — นำของว่างหรือของฝากเล็ก ๆ มาร่วมแบ่งปันได้',
      contactPhone: 'คุณวิชัย 081-683-0368',
      mapLink: 'https://maps.app.goo.gl/example-family-home',
      waterDate: '26 ธ.ค. 2569',
      waterTime: '09:00 น.',
      abhidhammaDateRange: '26 ธ.ค. 2569',
      abhidhammaTime: '12:00 น.',
      cremationDate: '26 ธ.ค. 2569',
      cremationTime: '18:00 น.',
      wreathPolicy: 'NORMAL',
      customCardUrl: '',
    },
  };

  await db.tenant.update({
    where: { id: websiteId },
    data: {
      name: 'Jitjaidee-Family',
      donationActive: true,
      donationPromptPay: '0816830368',
      donationAccountName: 'กองทุนครอบครัวจิตใจดี (Demo)',
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
        filePath: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
        fileName: 'บันทึกความทรงจำครอบครัว (YouTube)',
        fileSize: BigInt(0),
        mimeType: 'video/youtube',
        fileHash: 'youtube-bts-family-demo',
        album: 'VIDEO',
      },
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

  await db.condolence.deleteMany({ where: { websiteId } });
  await db.condolence.createMany({
    data: CONDOLENCES.map((row) => ({
      websiteId,
      ...row,
    })),
  });

  await db.donation.deleteMany({ where: { websiteId } });
  await db.donation.createMany({
    data: DONATIONS.map((row) => ({
      websiteId,
      ...row,
    })),
  });

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

  const parent = await db.familyMember.findFirst({
    where: { websiteId, relationship: 'PARENT_1' },
  });
  if (parent) {
    await db.familyMember.updateMany({
      where: { websiteId, relationship: 'CHILD' },
      data: { parentId: parent.id },
    });
    if (!parent.avatarUrl) {
      await db.familyMember.update({
        where: { id: parent.id },
        data: { avatarUrl },
      });
    }
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

  console.log(`✓ ${SLUG}: all Family Legacy features enabled`);
  console.log(
    `  activities=${activities} condolences=${condolences} donations=${donations} memory=${memoryPosts} (pending=${memoryPending}) family=${familyMembers} ebooks=${ebooks} media=${media}`,
  );
  console.log(`  albums=${newThemeConfig.albums.join(', ')}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
