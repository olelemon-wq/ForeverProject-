#!/usr/bin/env node
/**
 * Refresh bts-family (Jitjaidee-Family) demo content.
 * Usage: DATABASE_URL=... node scripts/update-bts-family-demo.mjs
 */
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();
const SLUG = 'bts-family';
const WEBSITE_ID = '4041f2c5-d9e2-4367-8877-a88214b3a76e';
const ALBUM_PHOTOS = 'รวมใจตระกูลจิตใจดี';
const ALBUM_VIDEOS = 'บันทึกวิดีโอ';

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

const FAMILY_RENAMES = [
  { id: 'ca9fc267-8e88-4852-b009-3b12bb8b37e8', name: 'นาย สมชาย จิตใจดี', nickname: 'คุณปู่ชาย', relationship: 'PARENT_1', birthYear: '2483' },
  { id: 'dbf70ed9-c381-4d8a-8ce2-090220846300', name: 'นาย วิชัย จิตใจดี', nickname: 'พี่วิช', relationship: 'CHILD', birthYear: '2535' },
  { id: '2da49b50-91e2-44b0-8974-b96446bad632', name: 'นาย สุรชัย จิตใจดี', nickname: 'พี่ชัย', relationship: 'CHILD', birthYear: '2536' },
  { id: '5d57be38-47f0-45e3-a0aa-6c6065944b60', name: 'นาย ประเสริฐ จิตใจดี', nickname: 'พี่เป้', relationship: 'CHILD', birthYear: '2537' },
  { id: '1eee20fc-9c75-4e6b-a54a-b743e1ee1162', name: 'นาย ธนกฤต จิตใจดี', nickname: 'พี่ต้น', relationship: 'CHILD', birthYear: '2537' },
  { id: '60e4b5bb-800b-4a93-b84a-0ce263378780', name: 'นางสาว มณี จิตใจดี', nickname: 'พี่มณี', relationship: 'CHILD', birthYear: '2538' },
  { id: '4416c1f8-7781-4386-a056-9dfa9fc10c9d', name: 'นาย ภูมิพัฒน์ จิตใจดี', nickname: 'น้องภูมิ', relationship: 'CHILD', birthYear: '2538' },
  { id: 'ad50b083-3363-4c63-984a-d172c2d3d57d', name: 'นางสาว นภา จิตใจดี', nickname: 'น้องนภา', relationship: 'CHILD', birthYear: '2540' },
];

const MEMORY_POSTS = [
  {
    id: 'e0b2ad6a-1849-406d-8254-7df78977251b',
    senderName: 'คุณย่า',
    title: 'ความทรงจำงานรวมญาติประจำปี',
    content:
      'ทุกปีเราจะรวมญาติกัน แล้วเล่าเรื่องเก่า ๆ ของคุณปู่ชาย ว่าเคยทำอะไรให้ตระกูลภูมิใจ ลูกหลานฟังกันทุกคน ยิ้มไม่หุบ',
    galleryIndex: 0,
  },
  {
    id: 'd0aac15a-2c96-445b-81bf-8e75beea8852',
    senderName: 'พี่สาว',
    title: 'คำสอนที่ส่งต่อมาทุกรุ่น',
    content:
      'คุณปู่บอกเสมอว่า ความสำเร็จของครอบครัวไม่ได้อยู่ที่ชื่อเสียงอย่างเดียว แต่อยู่ที่การดูแลกัน เราจะจำคำนี้ไว้และส่งต่อให้ลูกหลาน',
    galleryIndex: 1,
  },
  {
    id: '3cc3f672-c317-413b-8943-94afa6aa2c72',
    senderName: 'น้องชาย',
    title: 'โมเมนต์เล็ก ๆ ที่อยากเก็บไว้',
    content:
      'ตอนเดินทางกลับบ้าน ทุกคนยังร้องเพลงครอบครัวในรถด้วยกัน แม้จะเหนื่อยแต่หัวเราะกันจนลืมความเหนื่อยไปเลย อยากเก็บความรู้สึกนี้ไว้ตลอด',
    galleryIndex: 2,
  },
  {
    id: '9b5d2b19-aa68-46ad-b885-316bad517e52',
    senderName: 'ลูกหลานรุ่นใหม่',
    title: 'วันที่ทั้งครอบครัวรวมตัวกันที่บ้านเกิด',
    content:
      'ทุกคนในบ้านตื่นเต้นมาก ตั้งแต่คุณปู่จนถึงหลานเล็ก ได้นั่งทานข้าวและถ่ายรูปพร้อมกันทั้งบ้าน เป็นวันที่รู้สึกว่าเรายังเป็นครอบครัวเดียวกันเสมอ',
    galleryIndex: 3,
  },
  {
    id: 'abf0d69d-a8fe-455b-8706-7ff4a824a524',
    senderName: 'ลูกหลานรุ่นใหม่',
    title: 'คำสอนจากคุณปู่',
    content:
      'คุณปู่เคยบอกว่า "ตระกูลเราอยู่ด้วยกันเมื่อยังมีชีวิต และอยู่ด้วยกันในความทรงจำ" ขอจดจำไว้เสมอ',
    galleryIndex: 4,
  },
  {
    id: '0715fb96-afe4-4f71-8538-b98852e78a19',
    senderName: 'ญาติต่างจังหวัด',
    title: 'ฝากความคิดถึงจากต่างจังหวัด',
    content:
      'ฝากเรื่องเล่าวันงานรวมตระกูลปีที่แล้ว บรรยากาศอบอุ่นมาก อยากให้จัดอีกเร็ว ๆ นี้ คิดถึงทุกคนในตระกูลจิตใจดีค่ะ',
    galleryIndex: 5,
  },
];

async function main() {
  const tenant = await db.tenant.findUnique({ where: { slug: SLUG } });
  if (!tenant) throw new Error(`Tenant ${SLUG} not found`);

  const tc = tenant.themeConfig || {};
  const avatarUrl = tc.avatarUrl;
  const coverUrl = tc.coverUrl;

  const mediaAlbums = {};
  for (const id of NEW_GALLERY_IDS) mediaAlbums[id] = ALBUM_PHOTOS;
  for (const id of VIDEO_IDS) mediaAlbums[id] = ALBUM_VIDEOS;

  const newThemeConfig = {
    ...tc,
    isDemo: true,
    albums: [ALBUM_PHOTOS, ALBUM_VIDEOS],
    mediaAlbums,
    biography:
      'ตระกูลจิตใจดี เป็นครอบครัวที่เติบโตมาด้วยความอบอุ่น ความขยัน และจิตใจดีต่อกัน เริ่มจากคุณปู่สมชาย ผู้ก่อตั้งรากฐานของบ้านหลังนี้ ลูกหลานทั้งเจ็ดคนเติบโตมาพร้อมกัน เรียนรู้ว่าความสุขของครอบครัวอยู่ที่การดูแลกัน หน้าเว็บนี้จัดทำขึ้นเพื่อบันทึกความทรงจำ ประวัติวงศ์ และมรดกทางใจที่ส่งต่อจากรุ่นสู่รุ่น',
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
        name: 'คุณปู่สมชาย จิตใจดี',
        role: 'ผู้ก่อตั้งตระกูลจิตใจดี',
        isAlive: true,
        birthDate: '1940-01-15T17:00:00.000Z',
        avatarUrl,
      },
    ],
  };

  await db.tenant.update({
    where: { id: WEBSITE_ID },
    data: {
      name: 'Jitjaidee-Family',
      themeConfig: newThemeConfig,
    },
  });

  const parentId = FAMILY_RENAMES[0].id;
  for (const member of FAMILY_RENAMES) {
    await db.familyMember.update({
      where: { id: member.id },
      data: {
        name: member.name,
        nickname: member.nickname,
        relationship: member.relationship,
        birthYear: member.birthYear,
        parentId: member.relationship === 'CHILD' ? parentId : null,
        spouseOfId: null,
        ...(member.relationship === 'PARENT_1' ? { avatarUrl: avatarUrl || coverUrl } : {}),
      },
    });
  }

  await db.ebook.deleteMany({ where: { websiteId: WEBSITE_ID } });
  await db.ebook.createMany({
    data: [
      {
        websiteId: WEBSITE_ID,
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
        websiteId: WEBSITE_ID,
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
    ],
  });

  const galleryPaths = (
    await db.media.findMany({
      where: { id: { in: NEW_GALLERY_IDS } },
      select: { filePath: true },
      orderBy: { createdAt: 'asc' },
    })
  ).map((m) => m.filePath);

  for (const post of MEMORY_POSTS) {
    await db.memoryPost.update({
      where: { id: post.id },
      data: {
        senderName: post.senderName,
        title: post.title,
        content: post.content,
        mediaUrl: galleryPaths[post.galleryIndex] || '',
        mediaType: galleryPaths[post.galleryIndex] ? 'IMAGE' : 'NONE',
        isApproved: true,
      },
    });
  }

  console.log('✓ Rebranded bts-family to Jitjaidee-Family');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
