#!/usr/bin/env node
/**
 * Refresh bts-family demo: content, albums, ebooks, family tree, memory posts.
 * Usage: DATABASE_URL=... node scripts/update-bts-family-demo.mjs
 */
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();
const SLUG = 'bts-family';
const WEBSITE_ID = '4041f2c5-d9e2-4367-8877-a88214b3a76e';

const NEW_GALLERY_IDS = [
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

const VIDEO_IDS = [
  '9f7a179b-615f-4318-971a-6d245054b3a2',
  'c3373448-c4c5-48f8-992e-41fadf63b015',
  '9c228911-ac73-48cb-b7d6-919732008a06',
];

const OLD_GALLERY_IDS = [
  '8125c009-2246-43f6-a744-c7b5656d53b6',
  '74d1fb13-714d-47c7-91ee-427c87282390',
  'f0bbb637-4f57-43a4-a5dd-a75f525869d1',
  '12ae6398-34b1-4b65-a296-27453b1b58fb',
  'c88c517e-45f9-47dd-8dfe-797cdd3d6b6b',
  'a844cbbd-ff96-4dfe-8594-b5583603a52d',
  'cc866726-b7bc-41d4-a353-45347334dc04',
];

async function main() {
  const tenant = await db.tenant.findUnique({ where: { slug: SLUG } });
  if (!tenant) throw new Error(`Tenant ${SLUG} not found`);

  const tc = tenant.themeConfig || {};
  const avatarUrl = tc.avatarUrl;
  const coverUrl = tc.coverUrl;

  // Remove stale gallery items
  await db.media.deleteMany({ where: { id: { in: OLD_GALLERY_IDS }, websiteId: WEBSITE_ID } });

  // Album mapping for new image set
  const mediaAlbums = {};
  for (const id of NEW_GALLERY_IDS) mediaAlbums[id] = 'รวมใจตระกูลบังทัน';
  for (const id of VIDEO_IDS) mediaAlbums[id] = 'บันทึกวิดีโอ';

  const newThemeConfig = {
    ...tc,
    isDemo: true,
    albums: ['รวมใจตระกูลบังทัน', 'บันทึกวิดีโอ'],
    mediaAlbums,
    biography:
      'ตระกูลบังทัน เป็นตระกูลที่สร้างชื่อเสียงในแวดวงดนตรีระดับโลก เริ่มจากคุณปู่ HYBE ผู้ก่อตั้งมรดกทางศิลปะและการทำงานเป็นทีม ลูกหลานทั้งเจ็ดคนเติบโตมาพร้อมกัน เรียนรู้คุณค่าของความขยัน ความซื่อสัตย์ และการดูแลกันและกัน หน้าเว็บนี้จัดทำขึ้นเพื่อบันทึกความทรงจำ ประวัติวงศ์ และมรดกทางใจที่ส่งต่อจากรุ่นสู่รุ่น',
    features: {
      feed: false,
      ebooks: true,
      family: true,
      memory: true,
      videos: true,
      gallery: true,
      donation: false,
      condolence: false,
      announcement: false,
    },
    subjects: [
      {
        ...(tc.subjects?.[0] || {}),
        name: 'คุณปู่ HYBE',
        role: 'ผู้ก่อตั้งตระกูลบังทัน',
        isAlive: true,
        birthDate: '1967-08-09T17:00:00.000Z',
        avatarUrl,
      },
    ],
  };

  await db.tenant.update({
    where: { id: WEBSITE_ID },
    data: {
      name: 'Bangtan Legacy',
      themeConfig: newThemeConfig,
    },
  });

  // Family tree: add parent + link children
  const members = await db.familyMember.findMany({ where: { websiteId: WEBSITE_ID } });
  let parent = members.find((m) => m.relationship === 'PARENT_1');

  if (!parent) {
    parent = await db.familyMember.create({
      data: {
        websiteId: WEBSITE_ID,
        name: 'นาย บัง ชี-ฮยอก',
        nickname: 'คุณปู่ HYBE',
        relationship: 'PARENT_1',
        birthYear: '2510',
        isDeceased: false,
        avatarUrl: avatarUrl || coverUrl,
      },
    });
  } else {
    parent = await db.familyMember.update({
      where: { id: parent.id },
      data: {
        name: 'นาย บัง ชี-ฮยอก',
        nickname: 'คุณปู่ HYBE',
        birthYear: '2510',
        avatarUrl: avatarUrl || coverUrl,
      },
    });
  }

  const childOrder = [
    { match: 'ซอกจิน', nickname: 'Jin' },
    { match: 'ยุนกิ', nickname: 'Suga' },
    { match: 'โฮซอก', nickname: 'J-Hope' },
    { match: 'นัมจุน', nickname: 'RM' },
    { match: 'จีมิน', nickname: 'Jimin' },
    { match: 'แทฮยอง', nickname: 'V' },
    { match: 'จองกุก', nickname: 'Jungkook' },
  ];

  for (const child of childOrder) {
    const member = members.find((m) => m.name.includes(child.match));
    if (!member) continue;
    await db.familyMember.update({
      where: { id: member.id },
      data: {
        relationship: 'CHILD',
        nickname: child.nickname,
        parentId: parent.id,
        spouseOfId: null,
      },
    });
  }

  // Ebooks — family history content
  await db.ebook.deleteMany({ where: { websiteId: WEBSITE_ID } });
  await db.ebook.createMany({
    data: [
      {
        websiteId: WEBSITE_ID,
        title: 'บันทึกประวัติตระกูลบังทัน',
        author: 'คณะผู้จัดทำตระกูล',
        pdfUrl: '',
        totalPages: 4,
        pages: [
          'บทนำ\n\nหนังสือประวัติตระกูลเล่มนี้จัดทำขึ้นเพื่อบันทึกเส้นทางของตระกูลบังทัน ตั้งแต่คุณปู่ HYBE ผู้ก่อตั้งมรดกทางดนตรี จนถึงลูกหลานทั้งเจ็ดที่เติบโตมาพร้อมกัน ทุกบทความในเล่มนี้สะท้อนความผูกพัน ความภาคภูมิใจ และคุณค่าที่ส่งต่อกันมาในครอบครัว',
          'หน้า 2: จุดเริ่มต้นของตระกูล\n\nคุณปู่ HYBE เริ่มต้นจากความฝันเล็ก ๆ ในการสร้างพื้นที่ให้ศิลปินได้แสดงออกอย่างเต็มที่ ด้วยความมุ่งมั่นและการทำงานหนัก ตระกูลจึงเติบโตขึ้นและสร้างชื่อเสียงในแวดวงดนตรีระดับโลก ลูกหลานทุกคนได้เรียนรู้ว่าความสำเร็จมาจากการทำงานเป็นทีมและการเคารพซึ่งกันและกัน',
          'หน้า 3: มรดกทางใจ\n\n"ตระกูลเราอยู่ด้วยกันเมื่อยังมีชีวิต และอยู่ด้วยกันในความทรงจำ" — คำสอนนี้ถูกส่งต่อจากคุณปู่สู่ลูกหลานทุกรุ่น ไม่ว่าจะเป็นวันรวมญาติ การเดินทาง หรือช่วงเวลาสำคัญ ทุกคนในตระกูลจะกลับมารวมตัวกันเสมอ',
          'บทส่งท้าย\n\nขอขอบคุณลูกหลานและญาติทุกท่านที่ร่วมกันบันทึกเรื่องราว ภาพความทรงจำ และคำสอนที่มีค่า ขอให้มรดกทางใจของตระกูลบังทันคงอยู่ในใจทุกคนตลอดไป\n\nด้วยความเคารพและรัก\nคณะผู้จัดทำ',
        ],
      },
      {
        websiteId: WEBSITE_ID,
        title: 'คำสอนและเรื่องเล่าจากคุณปู่',
        author: 'ลูกหลานรุ่นใหม่',
        pdfUrl: '',
        totalPages: 3,
        pages: [
          'คำนำ\n\nเล่มนี้รวบรวมเรื่องเล่าและคำสอนจากคุณปู่ HYBE ที่ลูกหลานจดจำและอยากส่งต่อให้รุ่นต่อไป ทุกเรื่องสะท้อนความอบอุ่น ความขยัน และจิตวิญญาณการทำงานเป็นทีมของตระกูล',
          'หน้า 2: เรื่องเล่าที่ยังจำได้\n\nทุกปีเราจะรวมญาติกัน แล้วเล่าเรื่องเก่า ๆ ของคุณปู่บังทัน ว่าเคยทำอะไรให้ตระกูลภูมิใจ ลูกหลานฟังกันทุกปีและไม่เคยเบื่อ บางทีก็หัวเราะ บางทีก็น้ำตาไหล เพราะรู้สึกถึงความผูกพันที่ลึกซึ้ง',
          'หน้า 3: คำสัญญาของลูกหลาน\n\n"เราสัญญาว่าจะดูแลกัน จะรักษามรดกทางใจของตระกูล และจะกลับมารวมตัวกันเสมอ ไม่ว่าจะอยู่ที่ไหนในโลก ตระกูลบังทันคือบ้านของเราเสมอ"',
        ],
      },
    ],
  });

  // Memory posts — refresh with new gallery images
  const galleryPaths = (
    await db.media.findMany({
      where: { id: { in: NEW_GALLERY_IDS } },
      select: { filePath: true },
    })
  ).map((m) => m.filePath);

  const memoryUpdates = [
    {
      id: 'e0b2ad6a-1849-406d-8254-7df78977251b',
      mediaUrl: galleryPaths[0],
      mediaType: 'IMAGE',
      isApproved: true,
    },
    {
      id: 'd0aac15a-2c96-445b-81bf-8e75beea8852',
      mediaUrl: galleryPaths[1],
      mediaType: 'IMAGE',
      isApproved: true,
    },
    {
      id: '3cc3f672-c317-413b-8943-94afa6aa2c72',
      mediaUrl: galleryPaths[2],
      mediaType: 'IMAGE',
      isApproved: true,
    },
    {
      id: '9b5d2b19-aa68-46ad-b885-316bad517e52',
      mediaUrl: galleryPaths[3],
      mediaType: 'IMAGE',
      isApproved: true,
    },
    {
      id: 'abf0d69d-a8fe-455b-8706-7ff4a824a524',
      mediaUrl: galleryPaths[4],
      mediaType: 'IMAGE',
      isApproved: true,
    },
    {
      id: '0715fb96-afe4-4f71-8538-b98852e78a19',
      mediaUrl: galleryPaths[5],
      mediaType: 'IMAGE',
      isApproved: true,
    },
  ];

  for (const upd of memoryUpdates) {
    await db.memoryPost.update({
      where: { id: upd.id },
      data: {
        mediaUrl: upd.mediaUrl,
        mediaType: upd.mediaType,
        isApproved: upd.isApproved,
      },
    });
  }

  console.log('✓ Updated bts-family demo content');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
