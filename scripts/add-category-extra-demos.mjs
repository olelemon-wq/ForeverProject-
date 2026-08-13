/**
 * Add 2 extra showcase demos for each non-Memorial category (10 sites),
 * with dedicated Unsplash media folders (no shared assets across demos).
 *
 * Usage: node scripts/add-category-extra-demos.mjs
 */
import { createHash, randomUUID } from "crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DATA_PATH = join(ROOT, "prisma/data/demo-sites.json");
const DEMO_MEDIA = join(ROOT, "public/demo-media");

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function mediaRecord(filePath, album, sortOrder) {
  const abs = join(ROOT, "public", filePath.replace(/^\//, ""));
  const size = existsSync(abs) ? statSync(abs).size : 0;
  const ext = filePath.split(".").pop()?.toLowerCase();
  const mimeType =
    ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
  return {
    id: randomUUID(),
    websiteId: "pending",
    filePath,
    thumbnailPath: null,
    fileName: filePath.split("/").pop(),
    fileSize: String(size),
    mimeType,
    fileHash: createHash("sha1").update(filePath).digest("hex").slice(0, 24),
    album,
    isDeleted: false,
    sortOrder,
    createdAt: new Date().toISOString(),
  };
}

function buildMenus(entries) {
  const now = new Date().toISOString();
  return entries.map((entry, i) => ({
    id: randomUUID(),
    websiteId: "pending",
    title: entry.title,
    pageType: entry.pageType,
    isVisible: true,
    sortOrder: i + 1,
    parentId: null,
    createdAt: now,
  }));
}

async function download(url, dest) {
  if (existsSync(dest) && statSync(dest).size > 1000) return true;
  const res = await fetch(url, {
    headers: { "User-Agent": "ForeverDemoBot/1.0" },
    redirect: "follow",
  });
  if (!res.ok) {
    console.warn(`FAIL ${res.status} ${url}`);
    return false;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1000) {
    console.warn(`TOO SMALL ${url}`);
    return false;
  }
  writeFileSync(dest, buf);
  return true;
}

function unsplash(id, w = 1200) {
  return `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;
}

function picsum(seed, w = 1200, h = 900) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

/** @type {Array<object>} */
const DEMOS = [
  // —— Couple ——
  {
    slug: "napat-mintra",
    templateSlug: "pluemploy",
    category: "Couple",
    folderId: "c0a01e01-napat-4min-tra0-couple000001",
    name: "ณภัทร & มินตรา",
    cardTitle: "ณภัทร & มินตรา",
    cardDescription: "ไดอารี่คู่รัก วันครบรอบ และแกลเลอรีทริปด้วยกัน",
    cardHighlights: ["ไดอารี่คู่รัก", "วันครบรอบ", "แกลเลอรี"],
    primaryColor: "#C4787A",
    secondaryColor: "#F3E4E5",
    biography:
      "ณภัทรและมินตราคบกันมาตั้งแต่ปีหนึ่งมหาวิทยาลัย ชอบทำอาหารด้วยกันและเก็บโมเมนต์เล็ก ๆ ไว้ในไดอารี่",
    subjects: [
      { name: "ณภัทร", role: "ฝ่ายชาย", note: "สายแพลนทริป", birthYear: 1995 },
      { name: "มินตรา", role: "ฝ่ายหญิง", note: "สายถ่ายรูป", birthYear: 1996 },
    ],
    features: {
      feed: false,
      ebooks: false,
      family: false,
      memory: true,
      videos: false,
      gallery: true,
      donation: false,
      activities: true,
      condolence: true,
      announcement: false,
    },
    menus: [
      { title: "หน้าแรก", pageType: "HOME" },
      { title: "แกลเลอรี", pageType: "GALLERY" },
      { title: "ความทรงจำ", pageType: "MEMORY" },
      { title: "วันสำคัญ", pageType: "ACTIVITY" },
    ],
    photos: [
      "photo-1516589178581-6cd7833ae3b2",
      "photo-1522673607200-164a1a4a0f7d",
      "photo-1518199266791-5375a83190b7",
      "photo-1529634593702-3c428d6e1a8a",
      "photo-1515934751635-c81c6bc9a2d8",
      "photo-1529626455594-4ff0802cfb7e",
      "photo-1518621736915-f3b1c41bfd00",
      "photo-1545232979-8bf68ee9b386",
    ],
    condolences: [
      {
        senderName: "เพื่อนมหาลัย",
        relationship: "Friend",
        message: "น่ารักมาก ขอให้มีความสุขด้วยกันไปนาน ๆ นะ",
        type: "GENERAL",
      },
      {
        senderName: "พี่สาวมินตรา",
        relationship: "Relative",
        message: "เห็นแล้วยิ้มตาม ดูแลกันดี ๆ นะคะ",
        type: "FAMILY",
      },
    ],
    memoryPosts: [
      {
        title: "วันครบรอบ 5 ปี",
        content: "ดินเนอร์เล็ก ๆ ที่บ้านและเค้กที่ทำเองด้วยกัน",
        senderName: "มินตรา",
      },
      {
        title: "ทริปเชียงใหม่",
        content: "เช้าหมอกที่ดอยและกาแฟร้อน ๆ คู่กัน",
        senderName: "ณภัทร",
      },
    ],
    activities: [
      {
        title: "ครบรอบวันแรกที่เจอกัน",
        description: "ทุกวันที่ 14 กุมภา เราจะเขียนจดหมายสั้น ๆ ให้กัน",
        isRecurring: true,
      },
    ],
  },
  {
    slug: "beam-fah",
    templateSlug: "pluemploy",
    category: "Couple",
    folderId: "c0a01e02-beam0-4fah-couple00000002",
    name: "บีม & ฟ้า",
    cardTitle: "บีม & ฟ้า",
    cardDescription: "บอร์ดทริปคู่ กิจกรรมด้วยกัน และข้อความถึงกัน",
    cardHighlights: ["บอร์ดทริป", "กิจกรรมคู่", "ข้อความถึงกัน"],
    primaryColor: "#6B8E9F",
    secondaryColor: "#E2EEF3",
    biography:
      "บีมและฟ้าชอบออกทริปสั้น ๆ ทุกเดือน เก็บแผนที่ ความทรงจำ และรูปจากทุกเส้นทางไว้ที่นี่",
    subjects: [
      { name: "บีม", role: "ฝ่ายชาย", note: "สายขับรถ", birthYear: 1993 },
      { name: "ฟ้า", role: "ฝ่ายหญิง", note: "สายแพลนคาเฟ่", birthYear: 1994 },
    ],
    features: {
      feed: false,
      ebooks: false,
      family: false,
      memory: true,
      videos: false,
      gallery: true,
      donation: false,
      activities: true,
      condolence: true,
      announcement: false,
    },
    menus: [
      { title: "หน้าแรก", pageType: "HOME" },
      { title: "แกลเลอรี", pageType: "GALLERY" },
      { title: "ทริปของเรา", pageType: "ACTIVITY" },
      { title: "ข้อความ", pageType: "CONDOLENCE" },
    ],
    photos: [
      "photo-1476514525535-07fb3b4ae5f1",
      "photo-1501785888041-af3bb730e1f5",
      "photo-1469854523086-cc02fe5d8800",
      "photo-1488646953015-61967af72be1",
      "photo-1506905925346-21bda4d32df4",
      "photo-1493246507139-91e8fad9978e",
      "photo-1500530855697-b586d89ba3ee",
      "photo-1478131143081-80f7f84ca84d",
    ],
    condolences: [
      {
        senderName: "เพื่อนทริป",
        relationship: "Friend",
        message: "คู่สายลุยตัวจริง ขอให้มีทริปสนุก ๆ ต่อไปนะ",
        type: "GENERAL",
      },
    ],
    memoryPosts: [
      {
        title: "แคมป์ปิ้งครั้งแรก",
        content: "ฝนตกแต่ยังหัวเราะกันได้ทั้งคืน",
        senderName: "ฟ้า",
      },
    ],
    activities: [
      {
        title: "ทริปทะเลประจำปี",
        description: "เก็บรูปและแพลนร้านอาหารไว้ในบอร์ดนี้",
        isRecurring: true,
      },
      {
        title: "โร้ดทริปอีสาน",
        description: "เส้นทางคาเฟ่และวัดสวย ๆ ที่อยากไปด้วยกัน",
        isRecurring: false,
      },
    ],
  },

  // —— Wedding ——
  {
    slug: "porjai-nicha",
    templateSlug: "kukimiyafamily",
    category: "Wedding",
    folderId: "c0a02e01-porja-4nic-ha0-wedding00001",
    name: "ปอใจ & ณิชา",
    cardTitle: "ปอใจ & ณิชา",
    cardDescription: "การ์ดเชิญ สมุดอวยพร และใส่ซองออนไลน์",
    cardHighlights: ["การ์ดเชิญ", "สมุดอวยพร", "ใส่ซองออนไลน์"],
    primaryColor: "#D4A5A5",
    secondaryColor: "#F7EDED",
    biography:
      "งานแต่งงานของปอใจและณิชา จัดขึ้นด้วยธีมอบอุ่นแบบสวนบ้าน พร้อมพื้นที่ให้เพื่อนฝูงส่งคำอวยพรและร่วมใส่ซองออนไลน์",
    subjects: [
      { name: "ปอใจ", role: "เจ้าบ่าว", note: "", birthYear: 1992 },
      { name: "ณิชา", role: "เจ้าสาว", note: "", birthYear: 1993 },
    ],
    features: {
      feed: false,
      ebooks: false,
      family: true,
      memory: false,
      videos: false,
      gallery: true,
      donation: true,
      activities: false,
      condolence: true,
      announcement: true,
    },
    menus: [
      { title: "หน้าแรก", pageType: "HOME" },
      { title: "การ์ดเชิญ", pageType: "ANNOUNCEMENT" },
      { title: "สมุดอวยพร", pageType: "CONDOLENCE" },
      { title: "ใส่ซอง", pageType: "DONATION" },
      { title: "แกลเลอรี", pageType: "GALLERY" },
    ],
    photos: [
      "photo-1511285560929-80b456fea0bc",
      "photo-1465495976277-4387d4b0b4c6",
      "photo-1520854221256-17451cc403bf",
      "photo-1529633162685-41fcbec6460d",
      "photo-1460978812857-470ed1c77af0",
      "photo-1606800052052-a08af714cff7",
      "photo-1583939003579-730e3918a45a",
      "photo-1591604466107-ec19560b3cda",
    ],
    donationActive: true,
    condolences: [
      {
        senderName: "เพื่อนเจ้าสาว",
        relationship: "Friend",
        message: "ขอให้อยู่ด้วยกันอย่างมีความสุขและเข้าใจกันเสมอ",
        type: "GENERAL",
      },
      {
        senderName: "คุณแม่ฝ่ายชาย",
        relationship: "Relative",
        message: "ยินดีกับทั้งสองคนจากใจแม่",
        type: "FAMILY",
      },
    ],
    donations: [
      { donorName: "เพื่อนมหาลัย", amount: 1000, message: "ยินดีด้วยนะ" },
      { donorName: "พี่สาวณิชา", amount: 2000, message: "รักและยินดีเสมอ" },
    ],
    familyMembers: [
      { name: "ปอใจ สุขใจ", nickname: "ปอใจ", relationship: "PARENT_1" },
      { name: "ณิชา ใจดี", nickname: "ณิชา", relationship: "PARENT_2" },
    ],
  },
  {
    slug: "win-praew",
    templateSlug: "kukimiyafamily",
    category: "Wedding",
    folderId: "c0a02e02-winpr-4aew-wedding00002",
    name: "วิน & แพรว",
    cardTitle: "วิน & แพรว",
    cardDescription: "กำหนดการ แกลเลอรีพรีเวด และผังสองครอบครัว",
    cardHighlights: ["กำหนดการ", "พรีเวดดิ้ง", "ผังครอบครัว"],
    primaryColor: "#9AAE8C",
    secondaryColor: "#E8EFE3",
    biography:
      "วินและแพรวอยากให้แขกดูกำหนดการและรูปพรีเวดได้ง่าย ๆ พร้อมทำความรู้จักสองครอบครัวก่อนวันงาน",
    subjects: [
      { name: "วิน", role: "เจ้าบ่าว", note: "", birthYear: 1990 },
      { name: "แพรว", role: "เจ้าสาว", note: "", birthYear: 1991 },
    ],
    features: {
      feed: false,
      ebooks: false,
      family: true,
      memory: true,
      videos: false,
      gallery: true,
      donation: false,
      activities: true,
      condolence: true,
      announcement: true,
    },
    menus: [
      { title: "หน้าแรก", pageType: "HOME" },
      { title: "กำหนดการ", pageType: "ANNOUNCEMENT" },
      { title: "แกลเลอรี", pageType: "GALLERY" },
      { title: "ครอบครัว", pageType: "FAMILY" },
      { title: "อวยพร", pageType: "CONDOLENCE" },
    ],
    photos: [
      "photo-1465495976277-4387d4b0b4c6",
      "photo-1507504031003-b417219a0f71",
      "photo-1519741497674-611481863552",
      "photo-1606216794074-735e91aa2c92",
      "photo-1525772767592-309bf243df33",
      "photo-1487412912498-0447578fcca8",
      "photo-1478144592103-25e218a500bb",
      "photo-1442512595331-e89e73853f31",
    ],
    condolences: [
      {
        senderName: "เพื่อนร่วมงาน",
        relationship: "Colleague",
        message: "งานสวยมาก ขอให้เป็นครอบครัวที่อบอุ่นนะ",
        type: "GENERAL",
      },
    ],
    memoryPosts: [
      {
        title: "วันถ่ายพรีเวด",
        content: "แสงเย็นที่สวนทำให้ทุกอย่างดูอบอุ่น",
        senderName: "แพรว",
      },
    ],
    activities: [
      {
        title: "พิธีเช้าและรับประทานอาหารเย็น",
        description: "ดูรายละเอียดเวลาและสถานที่ในหน้ากำหนดการ",
        isRecurring: false,
      },
    ],
    familyMembers: [
      { name: "วิน วัฒนา", nickname: "วิน", relationship: "PARENT_1" },
      { name: "แพรว พิมพ์ใจ", nickname: "แพรว", relationship: "PARENT_2" },
      { name: "คุณพ่อวิน", nickname: "พ่อ", relationship: "CHILD" },
      { name: "คุณแม่แพรว", nickname: "แม่", relationship: "CHILD" },
    ],
  },

  // —— Family Legacy ——
  {
    slug: "saengdao-lineage",
    templateSlug: "bts-family",
    category: "Family Legacy",
    folderId: "c0a03e01-saeng-4dao-family000001",
    name: "ตระกูลแสงดาว",
    cardTitle: "ตระกูลแสงดาว",
    cardDescription: "ผังตระกูล หนังสือครอบครัว และคลังภาพรุ่นสู่รุ่น",
    cardHighlights: ["ผังตระกูล", "หนังสือครอบครัว", "คลังภาพ"],
    primaryColor: "#7A8F6E",
    secondaryColor: "#E6EDE2",
    biography:
      "ตระกูลแสงดาวรวบรวมเรื่องราวจากรุ่นปู่ย่าตายายถึงลูกหลาน เพื่อให้คนในบ้านได้อ่านและต่อยอดความทรงจำร่วมกัน",
    subjects: [
      {
        name: "ตระกูลแสงดาว",
        role: "ครอบครัว",
        note: "เชียงราย → กรุงเทพฯ",
        birthYear: null,
      },
    ],
    features: {
      feed: false,
      ebooks: true,
      family: true,
      memory: true,
      videos: false,
      gallery: true,
      donation: false,
      activities: false,
      condolence: true,
      announcement: false,
    },
    menus: [
      { title: "หน้าแรก", pageType: "HOME" },
      { title: "ผังครอบครัว", pageType: "FAMILY" },
      { title: "แกลเลอรี", pageType: "GALLERY" },
      { title: "หนังสือครอบครัว", pageType: "EBOOKS" },
      { title: "ความทรงจำ", pageType: "MEMORY" },
    ],
    photos: [
      "photo-1600880292089-90a7e086ee0c",
      "photo-1542037104857-ff80f8f6a6b0",
      "photo-1505576399279-565b52d5ac37",
      "photo-1511632765486-a01980e01a18",
      "photo-1529333166437-7750a6dd5a70",
      "photo-1475721027785-f74eccf877e2",
      "photo-1506863536034-6f56cd3ee2df",
      "photo-1607746882042-944635dfe10e",
    ],
    condolences: [
      {
        senderName: "ลูกพี่ลูกน้อง",
        relationship: "Relative",
        message: "ดีใจที่มีที่เก็บเรื่องราวบ้านเราไว้แบบนี้",
        type: "FAMILY",
      },
    ],
    memoryPosts: [
      {
        title: "งานรวมญาติปีใหม่",
        content: "ทุกคนกลับบ้านพร้อมเรื่องเล่าและของฝาก",
        senderName: "หลานสาว",
      },
    ],
    familyMembers: [
      {
        name: "ปู่แสง",
        nickname: "ปู่",
        relationship: "PARENT_1",
        isDeceased: true,
        birthYear: "2470",
      },
      {
        name: "ย่าดาว",
        nickname: "ย่า",
        relationship: "PARENT_2",
        isDeceased: false,
        birthYear: "2475",
      },
      {
        name: "พ่อสมหมาย",
        nickname: "พ่อ",
        relationship: "CHILD",
        birthYear: "2505",
      },
      {
        name: "แม่ศรี",
        nickname: "แม่",
        relationship: "CHILD",
        birthYear: "2508",
      },
    ],
    ebooks: [
      {
        title: "เรื่องเล่าตระกูลแสงดาว",
        author: "ลูกหลานแสงดาว",
        pdfUrl: "",
        totalPages: 12,
        pages: ["บทนำ", "รุ่นปู่ย่า", "รุ่นพ่อแม่", "รุ่นลูกหลาน"],
      },
    ],
  },
  {
    slug: "rungarun-house",
    templateSlug: "bts-family",
    category: "Family Legacy",
    folderId: "c0a03e02-runga-4run-family000002",
    name: "บ้านรุ่งอรุณ",
    cardTitle: "บ้านรุ่งอรุณ",
    cardDescription: "งานรวมญาติ ความทรงจำร่วม และแกลเลอรีบ้านเกิด",
    cardHighlights: ["งานรวมญาติ", "ความทรงจำ", "แกลเลอรีบ้านเกิด"],
    primaryColor: "#B08968",
    secondaryColor: "#F0E6DA",
    biography:
      "บ้านรุ่งอรุณเป็นบ้านเกิดของหลายรุ่นในครอบครัว ใช้พื้นที่นี้เก็บกิจกรรมประจำปีและเรื่องราวจากทุกคนที่เคยเติบโตที่นี่",
    subjects: [
      {
        name: "บ้านรุ่งอรุณ",
        role: "ครอบครัว",
        note: "นครปฐม",
        birthYear: null,
      },
    ],
    features: {
      feed: false,
      ebooks: false,
      family: true,
      memory: true,
      videos: false,
      gallery: true,
      donation: true,
      activities: true,
      condolence: true,
      announcement: false,
    },
    menus: [
      { title: "หน้าแรก", pageType: "HOME" },
      { title: "กิจกรรม", pageType: "ACTIVITY" },
      { title: "แกลเลอรี", pageType: "GALLERY" },
      { title: "ความทรงจำ", pageType: "MEMORY" },
      { title: "สมทบทุนงานบ้าน", pageType: "DONATION" },
    ],
    photos: [
      "photo-1560518883-ce09059eeffa",
      "photo-1600596542815-ffad4c1539a9",
      "photo-1600585154340-be6161a56a0c",
      "photo-1600047509807-ba8f99d36b0f",
      "photo-1600607687939-ce8a6c25118c",
      "photo-1600566753190-17f0baa2a6c3",
      "photo-1600210492486-724fe5c67fb0",
      "photo-1600585154526-990dced4db0d",
    ],
    donationActive: true,
    condolences: [
      {
        senderName: "หลานชาย",
        relationship: "Relative",
        message: "คิดถึงกลิ่นครัวและเสียงหัวเราะที่บ้านเกิด",
        type: "FAMILY",
      },
    ],
    memoryPosts: [
      {
        title: "สนามหญ้าหน้าบ้าน",
        content: "เคยวิ่งเล่นกันจนมืดทุกเย็นฤดูร้อน",
        senderName: "ลูกชายคนกลาง",
      },
    ],
    activities: [
      {
        title: "งานรวมญาติประจำปี",
        description: "ทำบุญและกินข้าวด้วยกันที่บ้านเกิด",
        isRecurring: true,
      },
    ],
    donations: [
      { donorName: "ลูกหลานกรุงเทพ", amount: 3000, message: "สมทบงานบ้านปีนี้" },
    ],
    familyMembers: [
      { name: "พ่อบุญมี", nickname: "พ่อ", relationship: "PARENT_1" },
      { name: "แม่บุญศรี", nickname: "แม่", relationship: "PARENT_2" },
      { name: "ลูกคนโต", nickname: "พี่ใหญ่", relationship: "CHILD" },
    ],
  },

  // —— Friends ——
  {
    slug: "campus-crew",
    templateSlug: "friendforever",
    category: "Friends",
    folderId: "c0a04e01-campu-4scr-ew0-friends0001",
    name: "เพื่อนมหาลัย รุ่น 58",
    cardTitle: "เพื่อนมหาลัย รุ่น 58",
    cardDescription: "ทริปรุ่น ความทรงจำมหาลัย และข้อความถึงกัน",
    cardHighlights: ["ทริปรุ่น", "ข้อความถึงกัน", "แกลเลอรี"],
    primaryColor: "#5B7C99",
    secondaryColor: "#E3ECF4",
    biography:
      "กลุ่มเพื่อนมหาลัยรุ่น 58 ที่ยังนัดเจอกันทุกปี เก็บรูปทริป เรื่องตลก และข้อความคิดถึงไว้ที่นี่",
    subjects: [
      {
        name: "เพื่อนมหาลัย รุ่น 58",
        role: "กลุ่มเพื่อน",
        note: "คณะบริหาร",
        birthYear: null,
      },
    ],
    features: {
      feed: false,
      ebooks: false,
      family: false,
      memory: true,
      videos: false,
      gallery: true,
      donation: false,
      activities: true,
      condolence: true,
      announcement: false,
    },
    menus: [
      { title: "หน้าแรก", pageType: "HOME" },
      { title: "แกลเลอรี", pageType: "GALLERY" },
      { title: "ทริปรุ่น", pageType: "ACTIVITY" },
      { title: "ข้อความ", pageType: "CONDOLENCE" },
      { title: "ความทรงจำ", pageType: "MEMORY" },
    ],
    photos: [
      "photo-1543269865-cbf427effbad",
      "photo-1539635278303-d4002c07eae3",
      "photo-1469571486292-0ba58a3f068b",
      "photo-1506869640319-fe1a24fd6723",
      "photo-1492681290082-e95288289099",
      "photo-1517457373958-b7bdd337875e",
      "photo-1527529486470-da60b3d93fd6",
      "photo-1511795409834-ef04bbd61622",
    ],
    condolences: [
      {
        senderName: "มาย",
        relationship: "Friend",
        message: "คิดถึงมุขเก่า ๆ ในห้องสมุดมาก",
        type: "GENERAL",
      },
      {
        senderName: "โอ๊ต",
        relationship: "Friend",
        message: "ปีนี้ต้องมีทริปทะเลอีกแล้วนะ",
        type: "GENERAL",
      },
    ],
    memoryPosts: [
      {
        title: "ค้างคืนหน้าหอ",
        content: "คุยกันจนเช้าก่อนสอบไฟนอล",
        senderName: "แนน",
      },
    ],
    activities: [
      {
        title: "ทริปรุ่นประจำปี",
        description: "หมุนเวียนเจ้าภาพทุกปี เก็บรูปและแพลนไว้ที่นี่",
        isRecurring: true,
      },
    ],
  },
  {
    slug: "office-buddies",
    templateSlug: "friendforever",
    category: "Friends",
    folderId: "c0a04e02-offic-4ebu-ddi-friends0002",
    name: "เพื่อนที่ทำงาน Team Sunrise",
    cardTitle: "เพื่อนที่ทำงาน Team Sunrise",
    cardDescription: "นัดหมายทีม แกลเลอรีออฟฟิศ และข้อความให้กำลังใจ",
    cardHighlights: ["นัดหมายทีม", "แกลเลอรีออฟฟิศ", "ให้กำลังใจ"],
    primaryColor: "#8C7AA9",
    secondaryColor: "#EDE8F4",
    biography:
      "Team Sunrise คือเพื่อนร่วมงานที่กลายเป็นเพื่อนสนิท ใช้พื้นที่นี้เก็บนัดหมาย ทริปทีม และข้อความให้กำลังใจกัน",
    subjects: [
      {
        name: "Team Sunrise",
        role: "กลุ่มเพื่อน",
        note: "ทีมโปรดักต์",
        birthYear: null,
      },
    ],
    features: {
      feed: false,
      ebooks: false,
      family: false,
      memory: true,
      videos: false,
      gallery: true,
      donation: false,
      activities: true,
      condolence: true,
      announcement: false,
    },
    menus: [
      { title: "หน้าแรก", pageType: "HOME" },
      { title: "นัดหมาย", pageType: "ACTIVITY" },
      { title: "แกลเลอรี", pageType: "GALLERY" },
      { title: "ข้อความ", pageType: "CONDOLENCE" },
    ],
    photos: [
      "photo-1522071820081-009f0129c71c",
      "photo-1556761175-5973dc0f32e7",
      "photo-1517245386807-bb43f82c33c4",
      "photo-1600880292203-757bb62b4baf",
      "photo-1552664730-d307ca884978",
      "photo-1515187029135-18ee286d815b",
      "photo-1542744173-8e7e53415bb0",
      "photo-1557804506-669a70965c04",
    ],
    condolences: [
      {
        senderName: "พี่มิ้น",
        relationship: "Colleague",
        message: "ขอบคุณที่ซัพพอร์ตกันเสมอในช่วงงานหนัก",
        type: "GENERAL",
      },
    ],
    memoryPosts: [
      {
        title: "วันส่งโปรเจกต์ใหญ่",
        content: "พิซซ่ากลางดึกและเสียงหัวเราะหลังเดโมผ่าน",
        senderName: "เจ",
      },
    ],
    activities: [
      {
        title: "ทีมดินเนอร์เดือนละครั้ง",
        description: "หมุนเวียนร้านและเก็บรูปไว้ในแกลเลอรี",
        isRecurring: true,
      },
    ],
  },

  // —— Pet Memorial ——
  {
    slug: "nong-mango",
    templateSlug: "kittiemeaw",
    category: "Pet Memorial",
    folderId: "c0a05e01-mango-4cat-pet0-memorial01",
    name: "น้องมะม่วงจอมซน",
    cardTitle: "น้องมะม่วงจอมซน",
    cardDescription: "สมุดส่งความคิดถึง ไดอารี่ และแกลเลอรีน้องแมว",
    cardHighlights: ["สมุดส่งความคิดถึง", "ไดอารี่", "แกลเลอรี"],
    primaryColor: "#D4A574",
    secondaryColor: "#F6EBDD",
    biography:
      "น้องมะม่วงเป็นแมวส้มที่ชอบนอนกลิ้งแดดและตามงับนิ้วเท้าทุกเช้า แม้จะจากไปแล้วแต่ความน่ารักยังอยู่กับเรา",
    subjects: [
      {
        name: "น้องมะม่วง",
        role: "แมว",
        note: "แมวส้มขนฟู",
        breed: "Thai Domestic",
        birthYear: 2018,
        isAlive: false,
      },
    ],
    features: {
      feed: false,
      ebooks: false,
      family: true,
      memory: true,
      videos: false,
      gallery: true,
      donation: false,
      activities: false,
      condolence: true,
      announcement: false,
    },
    menus: [
      { title: "หน้าแรก", pageType: "HOME" },
      { title: "แกลเลอรี", pageType: "GALLERY" },
      { title: "ส่งความคิดถึง", pageType: "CONDOLENCE" },
      { title: "ไดอารี่", pageType: "MEMORY" },
    ],
    photos: [
      "photo-1514888286974-6c03e2ca1dba",
      "photo-1574158622682-e40e69881006",
      "photo-1495360010541-f48722b34f7d",
      "photo-1573865526739-10659fec78a5",
      "photo-1511044567668-c9d0e3d3c7f7",
      "photo-1526336024174-e58f5cdd8e13",
      "photo-1533738363-b7f9aef128ce",
      "photo-1592194996308-7b43878e84a6",
    ],
    condolences: [
      {
        senderName: "เพื่อนบ้าน",
        relationship: "Friend",
        message: "คิดถึงเสียงร้องเรียกข้าวของน้องมาก",
        type: "GENERAL",
      },
      {
        senderName: "พี่สาว",
        relationship: "Relative",
        message: "มะม่วงคือความสุขของบ้านเรา",
        type: "FAMILY",
      },
    ],
    memoryPosts: [
      {
        title: "นอนกล่องกระดาษ",
        content: "ไม่ว่ากล่องจะเล็กแค่ไหน น้องก็จะยัดตัวเข้าไปได้เสมอ",
        senderName: "คุณแม่ของน้อง",
      },
      {
        title: "ตามงับนิ้วเท้า",
        content: "พิธีเช้าที่ขาดไม่ได้ทุกวัน",
        senderName: "คุณพ่อของน้อง",
      },
    ],
    familyMembers: [
      {
        name: "น้องมะม่วง",
        nickname: "มะม่วง",
        relationship: "PARENT_1",
        isDeceased: true,
        birthYear: "2561",
        deathYear: "2568",
      },
      {
        name: "น้องนุ่น",
        nickname: "นุ่น",
        relationship: "SIBLING",
        birthYear: "2563",
      },
    ],
  },
  {
    slug: "nong-bao",
    templateSlug: "kittiemeaw",
    category: "Pet Memorial",
    folderId: "c0a05e02-baodg-4pet-memorial0002",
    name: "น้องเบาผู้ซื่อสัตย์",
    cardTitle: "น้องเบาผู้ซื่อสัตย์",
    cardDescription: "กิจกรรมรำลึก กองทุนช่วยเหลือสัตว์ และแกลเลอรีน้องหมา",
    cardHighlights: ["กิจกรรมรำลึก", "กองทุนสัตว์", "แกลเลอรี"],
    primaryColor: "#8B9A7D",
    secondaryColor: "#E8EDE4",
    biography:
      "น้องเบาเป็นหมาพันธุ์ผสมที่ซื่อสัตย์และรอประตูบ้านทุกเย็น เราจัดพื้นที่นี้เพื่อรำลึกและสมทบทุนช่วยเหลือสัตว์ไร้บ้านตามเจตนารมณ์ของน้อง",
    subjects: [
      {
        name: "น้องเบา",
        role: "หมา",
        note: "หมาบ้านขนสั้น",
        breed: "Mixed",
        birthYear: 2015,
        isAlive: false,
      },
    ],
    features: {
      feed: false,
      ebooks: false,
      family: false,
      memory: true,
      videos: false,
      gallery: true,
      donation: true,
      activities: true,
      condolence: true,
      announcement: false,
    },
    menus: [
      { title: "หน้าแรก", pageType: "HOME" },
      { title: "แกลเลอรี", pageType: "GALLERY" },
      { title: "กิจกรรม", pageType: "ACTIVITY" },
      { title: "บริจาค", pageType: "DONATION" },
      { title: "ส่งความคิดถึง", pageType: "CONDOLENCE" },
    ],
    photos: [
      "photo-1552053831-71594a27632d",
      "photo-1517849845537-4d257902454a",
      "photo-1587300003388-59208cc962cb",
      "photo-1530281700549-e82e7bf110d6",
      "photo-1477884213360-7e9d7dcc1e48",
      "photo-1583511655857-d19b40a7a54e",
      "photo-1561037404-61cd46aa615b",
      "photo-1543466835-00a7907e9de1",
    ],
    donationActive: true,
    condolences: [
      {
        senderName: "คนเดินจูงสุนัขในซอย",
        relationship: "Friend",
        message: "น้องเบาร่าเริงเสมอ จะคิดถึงหางไกว ๆ",
        type: "GENERAL",
      },
    ],
    memoryPosts: [
      {
        title: "รอประตูบ้าน",
        content: "ไม่ว่าจะกลับกี่โมง น้องก็รออยู่ตรงนั้น",
        senderName: "เจ้าของ",
      },
    ],
    activities: [
      {
        title: "วันรำลึกน้องเบา",
        description: "พาดอกไม้ไปที่ต้นไม้ใต้ซึ่งเราฝังของเล่นชิ้นโปรด",
        isRecurring: true,
      },
    ],
    donations: [
      {
        donorName: "เพื่อนรักสัตว์",
        amount: 500,
        message: "สมทบทุนช่วยเหลือสัตว์ไร้บ้าน",
      },
      {
        donorName: "เพื่อนร่วมซอย",
        amount: 300,
        message: "เพื่อน้องเบาและเพื่อน ๆ",
      },
    ],
  },
];

async function ensurePhotos(demo) {
  const dir = join(DEMO_MEDIA, demo.folderId);
  mkdirSync(dir, { recursive: true });
  const paths = [];
  // Prefer curated Unsplash IDs when they resolve; fill remaining with unique Picsum seeds.
  const targets = Math.max(8, (demo.photos || []).length || 8);
  for (let i = 0; i < targets; i++) {
    const filename = `${demo.slug}-${String(i + 1).padStart(2, "0")}.jpg`;
    const dest = join(dir, filename);
    let ok = false;
    if (demo.photos?.[i]) {
      ok = await download(unsplash(demo.photos[i]), dest);
    }
    if (!ok) {
      ok = await download(picsum(`${demo.slug}-${i + 1}-v2`, 1200, 900), dest);
    }
    if (ok) paths.push(`/demo-media/${demo.folderId}/${filename}`);
  }
  if (paths.length < 5) {
    throw new Error(`${demo.slug}: only ${paths.length} photos downloaded`);
  }
  return paths;
}

function buildSite(template, demo, photoPaths) {
  const site = cloneJson(template);
  const now = new Date().toISOString();
  const cover = photoPaths[0];
  const avatar = photoPaths[1] || photoPaths[0];

  site.slug = demo.slug;
  site.tenant = {
    ...site.tenant,
    slug: demo.slug,
    name: demo.name,
    category: demo.category,
    status: "ACTIVE",
    visibility: "PUBLIC",
    donationActive: Boolean(demo.donationActive),
    donationPromptPay: demo.donationActive ? "0810000000" : "",
    donationAccountName: demo.donationActive ? demo.name : "",
    createdAt: now,
    updatedAt: now,
    themeConfig: {
      ...site.tenant.themeConfig,
      isDemo: true,
      demoCustomized: true,
      primaryColor: demo.primaryColor,
      secondaryColor: demo.secondaryColor,
      coverUrl: cover,
      avatarUrl: avatar,
      coverScale: 1.12,
      coverX: 0,
      coverY: 0,
      coverRotate: 0,
      avatarScale: 1.15,
      avatarX: 0,
      avatarY: 0,
      avatarRotate: 0,
      biography: demo.biography,
      features: demo.features,
      featureOrder: Object.keys(demo.features),
      subjects: (demo.subjects || []).map((s) => ({
        name: s.name,
        note: s.note || "",
        role: s.role || "",
        breed: s.breed || "",
        avatarX: 0,
        avatarY: 0,
        dislike: "",
        isAlive: s.isAlive !== false,
        favorite: "",
        avatarUrl: "",
        birthDate: null,
        birthYear: s.birthYear ?? null,
        deathDate: null,
        deathYear: null,
        avatarScale: 1,
        personality: "",
        avatarRotate: 0,
        birthYearOnly: Boolean(s.birthYear),
        deathYearOnly: false,
      })),
      announcement: {
        ...(site.tenant.themeConfig.announcement || {}),
        active: Boolean(demo.features.announcement),
        text: demo.name,
        customCardUrl: "",
      },
    },
  };

  site.menus = buildMenus(demo.menus);
  site.medias = photoPaths.map((p, i) => mediaRecord(p, "GALLERY", i + 1));

  site.condolences = (demo.condolences || []).map((c, i) => ({
    id: randomUUID(),
    websiteId: "pending",
    senderName: c.senderName,
    relationship: c.relationship,
    message: c.message,
    type: c.type,
    isApproved: true,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  }));

  site.memoryPosts = (demo.memoryPosts || []).map((p, i) => ({
    id: randomUUID(),
    websiteId: "pending",
    title: p.title,
    content: p.content,
    mediaUrl: photoPaths[(i + 2) % photoPaths.length],
    mediaType: "IMAGE",
    senderName: p.senderName,
    isApproved: true,
    createdAt: new Date(Date.now() - i * 172800000).toISOString(),
  }));

  site.familyMembers = (demo.familyMembers || []).map((m, i) => ({
    id: randomUUID(),
    websiteId: "pending",
    name: m.name,
    nickname: m.nickname || null,
    relationship: m.relationship,
    birthYear: m.birthYear || null,
    deathYear: m.deathYear || null,
    isDeceased: Boolean(m.isDeceased),
    hideAge: false,
    avatarUrl: photoPaths[(i + 1) % photoPaths.length],
    avatarScale: 1,
    avatarX: 0,
    avatarY: 0,
    avatarRotate: 0,
    spouseOfId: null,
    parentId: null,
    createdAt: now,
  }));

  site.activities = (demo.activities || []).map((a, i) => ({
    id: randomUUID(),
    websiteId: "pending",
    title: a.title,
    description: a.description,
    images: [
      photoPaths[(i + 3) % photoPaths.length],
      photoPaths[(i + 4) % photoPaths.length],
    ],
    pdfUrl: null,
    eventDate: new Date(Date.now() + (i + 1) * 30 * 86400000).toISOString(),
    isRecurring: Boolean(a.isRecurring),
    sortOrder: i + 1,
    createdAt: now,
    updatedAt: now,
  }));

  site.donations = (demo.donations || []).map((d, i) => ({
    id: randomUUID(),
    websiteId: "pending",
    donorName: d.donorName,
    amount: d.amount,
    message: d.message,
    isAnonymous: false,
    hideAmount: false,
    slipUrl: null,
    isVerified: true,
    createdAt: new Date(Date.now() - i * 43200000).toISOString(),
  }));

  site.ebooks = (demo.ebooks || []).map((e) => ({
    id: randomUUID(),
    websiteId: "pending",
    title: e.title,
    author: e.author,
    pdfUrl: e.pdfUrl || cover,
    totalPages: e.totalPages || 4,
    pages: e.pages || ["หน้า 1", "หน้า 2"],
    createdAt: now,
  }));

  return site;
}

const data = JSON.parse(readFileSync(DATA_PATH, "utf8"));
const bySlug = Object.fromEntries(data.sites.map((s) => [s.slug, s]));

const built = [];
for (const demo of DEMOS) {
  const template = bySlug[demo.templateSlug];
  if (!template) throw new Error(`Missing template ${demo.templateSlug}`);
  console.log(`Preparing ${demo.slug}...`);
  const photos = await ensurePhotos(demo);
  built.push({
    site: buildSite(template, demo, photos),
    card: {
      slug: demo.slug,
      category: demo.category,
      categoryLabel: {
        Couple: "คู่รัก",
        Wedding: "งานแต่งงาน",
        "Family Legacy": "เรื่องราวครอบครัว",
        Friends: "กลุ่มเพื่อน",
        "Pet Memorial": "สัตว์เลี้ยง",
      }[demo.category],
      title: demo.cardTitle,
      description: demo.cardDescription,
      coverUrl: photos[0],
      primaryColor: demo.primaryColor,
      highlights: demo.cardHighlights,
    },
  });
}

const newSlugs = new Set(DEMOS.map((d) => d.slug));
data.sites = [
  ...data.sites.filter((s) => !newSlugs.has(s.slug)),
  ...built.map((b) => b.site),
];
writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + "\n");

const cardsPath = join(__dirname, "category-extra-demo-cards.json");
writeFileSync(
  cardsPath,
  JSON.stringify(
    built.map((b) => b.card),
    null,
    2
  ) + "\n"
);

console.log(
  `Updated demo-sites.json with ${built.length} demos:`,
  built.map((b) => b.site.slug).join(", ")
);
console.log(`Card metadata written to ${cardsPath}`);
