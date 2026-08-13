/**
 * Append mae-somsri + ajarn-somchai memorial demos into prisma/data/demo-sites.json
 * Clones structure/media from boonkrua-family; customizes tenant + content.
 *
 * Usage: node scripts/add-memorial-extra-demos.mjs
 */
import { randomUUID } from "crypto";
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, "../prisma/data/demo-sites.json");

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function remapEntityIds(items) {
  return (items || []).map((item) => ({
    ...item,
    id: randomUUID(),
  }));
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

function galleryPaths(boonkrua) {
  return (boonkrua.medias || [])
    .filter(
      (m) =>
        m.album === "GALLERY" &&
        typeof m.filePath === "string" &&
        (m.filePath.startsWith("/demo-media") ||
          m.filePath.startsWith("/defaults"))
    )
    .map((m) => m.filePath);
}

function buildMaeSomsri(boonkrua) {
  const site = cloneJson(boonkrua);
  const slug = "mae-somsri";
  const now = new Date().toISOString();
  const gallery = galleryPaths(boonkrua);
  const coverUrl = "/defaults/memorial/cover/2.png";
  const avatarUrl = "/defaults/memorial/avatar/2.png";

  site.slug = slug;
  site.tenant = {
    ...site.tenant,
    slug,
    name: "ด้วยรักและคิดถึง คุณแม่สมศรี",
    category: "Memorial",
    status: "ACTIVE",
    visibility: "PUBLIC",
    donationActive: false,
    donationPromptPay: "",
    donationAccountName: "",
    createdAt: now,
    updatedAt: now,
    themeConfig: {
      ...site.tenant.themeConfig,
      isDemo: true,
      demoCustomized: true,
      primaryColor: "#8B7355",
      secondaryColor: "#E8DFD0",
      coverUrl,
      avatarUrl,
      avatarScale: 1.2,
      avatarX: 0,
      avatarY: 0,
      avatarRotate: 0,
      coverScale: 1.1,
      coverX: 0,
      coverY: 0,
      coverRotate: 0,
      biography: [
        "คุณแม่สมศรี วงศ์สุวรรณ เกิดเมื่อปี พ.ศ. 2491 ที่จังหวัดเชียงใหม่",
        "เป็นแม่บ้านและพ่อครัวมือทองของครอบครัว ชอบทำอาหารพื้นบ้านและขนมไทย",
        "แม่สอนลูกให้รู้จักแบ่งปัน ความอดทน และความกตัญญู",
        "แม้จะจากไปแล้ว แต่กลิ่นหอมจากครัวและความอบอุ่นของแม่ยังอยู่กับเราเสมอ",
      ].join("\n\n"),
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
      featureOrder: [
        "gallery",
        "condolence",
        "memory",
        "family",
        "announcement",
        "videos",
        "activities",
        "ebooks",
        "donation",
      ],
      subjects: [
        {
          name: "คุณแม่สมศรี วงศ์สุวรรณ",
          note: "",
          role: "",
          breed: "",
          avatarX: 0,
          avatarY: 0,
          dislike: "",
          isAlive: false,
          favorite: "",
          avatarUrl: "",
          birthDate: "1948-03-12T00:00:00.000Z",
          birthYear: null,
          deathDate: "2024-11-08T00:00:00.000Z",
          deathYear: null,
          avatarScale: 1,
          personality: "",
          avatarRotate: 0,
          birthYearOnly: false,
          deathYearOnly: false,
        },
      ],
      announcement: {
        ...site.tenant.themeConfig.announcement,
        active: false,
        text: "ด้วยรักและคิดถึง คุณแม่สมศรี วงศ์สุวรรณ",
      },
      lifeStory: {
        honors: "",
        legacy: "ความอบอุ่นจากครัวและคำสอนเรื่องการแบ่งปัน",
        timeline: [],
        biography: [
          "คุณแม่สมศรี วงศ์สุวรรณ เกิดเมื่อปี พ.ศ. 2491 ที่จังหวัดเชียงใหม่",
          "เป็นแม่บ้านและพ่อครัวมือทองของครอบครัว ชอบทำอาหารพื้นบ้านและขนมไทย",
          "แม่สอนลูกให้รู้จักแบ่งปัน ความอดทน และความกตัญญู",
        ].join("\n\n"),
      },
    },
  };

  site.menus = buildMenus([
    { title: "หน้าแรก", pageType: "HOME" },
    { title: "คลังภาพรำลึก", pageType: "GALLERY" },
    { title: "สมุดไว้อาลัย", pageType: "CONDOLENCE" },
    { title: "ความทรงจำ", pageType: "MEMORY" },
    { title: "ครอบครัว", pageType: "FAMILY" },
  ]);

  site.medias = remapEntityIds(
    (boonkrua.medias || []).filter(
      (m) =>
        m.album === "GALLERY" &&
        typeof m.filePath === "string" &&
        !String(m.mimeType || "").includes("youtube")
    )
  ).slice(0, 12);

  site.condolences = [
    {
      senderName: "นภา วงศ์สุวรรณ",
      relationship: "Daughter",
      message:
        "แม่คือที่พึ่งและแบบอย่างที่ดีที่สุดของหนู ขอบคุณสำหรับทุกมื้ออาหารและความรักที่ไม่มีวันหมด",
      type: "FAMILY",
    },
    {
      senderName: "คุณป้ามาลี",
      relationship: "Relative",
      message:
        "สมศรีเป็นเพื่อนที่ใจดีและอบอุ่นเสมอ จะคิดถึงเสียงหัวเราะและการทำอาหารด้วยกันมาก",
      type: "GENERAL",
    },
    {
      senderName: "ครูอร",
      relationship: "Friend",
      message:
        "ขอแสดงความเสียใจอย่างสุดซึ้ง แม่สมศรีเป็นแม่ที่ดีและเป็นที่รักของทุกคนในชุมชน",
      type: "GENERAL",
    },
  ].map((c, i) => ({
    id: randomUUID(),
    websiteId: "pending",
    ...c,
    isApproved: true,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  }));

  site.memoryPosts = [
    {
      title: "กลิ่นข้าวหอมจากครัว",
      content:
        "ทุกเช้าแม่จะต้มข้าวและทอดไข่ให้ก่อนไปโรงเรียน กลิ่นนั้นยังติดอยู่ในความทรงจำจนถึงทุกวันนี้",
      senderName: "ลูกชายคนโต",
      mediaUrl: gallery[0] || coverUrl,
    },
    {
      title: "สูตรขนมไทยของแม่",
      content:
        "แม่สอนทำทองหยิบและฝอยทองด้วยความอดทน วันนี้เราทำตามสูตรนั้นในวันสำคัญของครอบครัว",
      senderName: "หลานสาว",
      mediaUrl: gallery[1] || avatarUrl,
    },
    {
      title: "คำสอนสั้น ๆ ที่จำได้",
      content:
        "แม่พูดเสมอว่า ‘กินอิ่มนอนหลับ แล้วแบ่งให้คนอื่นด้วย’ ประโยคนี้กลายเป็นเข็มทิศของเรา",
      senderName: "ลูกสาวคนเล็ก",
      mediaUrl: gallery[2] || coverUrl,
    },
  ].map((p, i) => ({
    id: randomUUID(),
    websiteId: "pending",
    title: p.title,
    content: p.content,
    mediaUrl: p.mediaUrl,
    mediaType: "IMAGE",
    senderName: p.senderName,
    isApproved: true,
    createdAt: new Date(Date.now() - i * 172800000).toISOString(),
  }));

  const familyAvatars = (boonkrua.familyMembers || [])
    .map((m) => m.avatarUrl)
    .filter(Boolean);

  site.familyMembers = [
    {
      name: "สมศรี วงศ์สุวรรณ",
      nickname: "แม่สมศรี",
      relationship: "PARENT_1",
      birthYear: "2491",
      deathYear: "2567",
      isDeceased: true,
      avatarUrl,
    },
    {
      name: "สมชาย วงศ์สุวรรณ",
      nickname: "พ่อสมชาย",
      relationship: "PARENT_2",
      birthYear: "2488",
      deathYear: null,
      isDeceased: false,
      avatarUrl: familyAvatars[0] || gallery[3] || avatarUrl,
    },
    {
      name: "นภา วงศ์สุวรรณ",
      nickname: "นภา",
      relationship: "CHILD",
      birthYear: "2518",
      deathYear: null,
      isDeceased: false,
      avatarUrl: familyAvatars[1] || gallery[4] || avatarUrl,
    },
    {
      name: "วิชัย วงศ์สุวรรณ",
      nickname: "วิชัย",
      relationship: "CHILD",
      birthYear: "2520",
      deathYear: null,
      isDeceased: false,
      avatarUrl: familyAvatars[2] || gallery[5] || avatarUrl,
    },
  ].map((m) => ({
    id: randomUUID(),
    websiteId: "pending",
    nickname: m.nickname,
    name: m.name,
    relationship: m.relationship,
    birthYear: m.birthYear,
    deathYear: m.deathYear,
    isDeceased: m.isDeceased,
    hideAge: false,
    avatarUrl: m.avatarUrl,
    avatarScale: 1,
    avatarX: 0,
    avatarY: 0,
    avatarRotate: 0,
    spouseOfId: null,
    parentId: null,
    createdAt: now,
  }));

  site.ebooks = [];
  site.donations = [];
  site.activities = [];

  return site;
}

function buildAjarnSomchai(boonkrua) {
  const site = cloneJson(boonkrua);
  const slug = "ajarn-somchai";
  const now = new Date().toISOString();
  const gallery = galleryPaths(boonkrua);
  const coverUrl = "/defaults/memorial/cover/3.png";
  const avatarUrl = "/defaults/memorial/avatar/3.png";

  site.slug = slug;
  site.tenant = {
    ...site.tenant,
    slug,
    name: "รำลึกอาจารย์สมชาย พิทักษ์ธรรม",
    category: "Memorial",
    status: "ACTIVE",
    visibility: "PUBLIC",
    donationActive: true,
    donationPromptPay: "0810000000",
    donationAccountName: "กองทุนอาจารย์สมชาย",
    createdAt: now,
    updatedAt: now,
    themeConfig: {
      ...site.tenant.themeConfig,
      isDemo: true,
      demoCustomized: true,
      primaryColor: "#4A5568",
      secondaryColor: "#CBD5E0",
      coverUrl,
      avatarUrl,
      avatarScale: 1.15,
      avatarX: 0,
      avatarY: 0,
      avatarRotate: 0,
      coverScale: 1.1,
      coverX: 0,
      coverY: 0,
      coverRotate: 0,
      biography: [
        "อาจารย์สมชาย พิทักษ์ธรรม เกิดเมื่อปี พ.ศ. 2498 ที่จังหวัดนครราชสีมา",
        "สอนวิชาสังคมศึกษาและจริยธรรมมากกว่า 35 ปี ในโรงเรียนมัธยมประจำจังหวัด",
        "ท่านเชื่อว่าการศึกษาไม่ใช่เพียงคะแนน แต่คือการสร้างคนดีของสังคม",
        "หลังเกษียณ ท่านยังจัดกิจกรรมอาสาและกองทุนช่วยเหลือนักเรียนยากจนต่อเนื่อง",
      ].join("\n\n"),
      features: {
        feed: false,
        ebooks: false,
        family: false,
        memory: false,
        videos: false,
        gallery: true,
        donation: true,
        activities: true,
        condolence: true,
        announcement: false,
      },
      featureOrder: [
        "gallery",
        "activities",
        "donation",
        "condolence",
        "announcement",
        "videos",
        "memory",
        "family",
        "ebooks",
      ],
      subjects: [
        {
          name: "อาจารย์สมชาย พิทักษ์ธรรม",
          note: "",
          role: "อาจารย์",
          breed: "",
          avatarX: 0,
          avatarY: 0,
          dislike: "",
          isAlive: false,
          favorite: "",
          avatarUrl: "",
          birthDate: "1955-07-21T00:00:00.000Z",
          birthYear: null,
          deathDate: "2025-01-15T00:00:00.000Z",
          deathYear: null,
          avatarScale: 1,
          personality: "",
          avatarRotate: 0,
          birthYearOnly: false,
          deathYearOnly: false,
        },
      ],
      announcement: {
        ...site.tenant.themeConfig.announcement,
        active: false,
        text: "รำลึกอาจารย์สมชาย พิทักษ์ธรรม",
      },
      lifeStory: {
        honors: "ครูดีเด่นระดับจังหวัด",
        legacy: "กองทุนทุนการศึกษาและจิตวิญญาณความเป็นครู",
        timeline: [],
        biography: [
          "อาจารย์สมชาย พิทักษ์ธรรม เกิดเมื่อปี พ.ศ. 2498 ที่จังหวัดนครราชสีมา",
          "สอนวิชาสังคมศึกษาและจริยธรรมมากกว่า 35 ปี",
          "หลังเกษียณ ท่านยังจัดกิจกรรมอาสาและกองทุนช่วยเหลือนักเรียนยากจนต่อเนื่อง",
        ].join("\n\n"),
      },
    },
  };

  site.menus = buildMenus([
    { title: "หน้าแรก", pageType: "HOME" },
    { title: "คลังภาพรำลึก", pageType: "GALLERY" },
    { title: "กิจกรรมรำลึก", pageType: "ACTIVITY" },
    { title: "บริจาค", pageType: "DONATION" },
    { title: "สมุดไว้อาลัย", pageType: "CONDOLENCE" },
  ]);

  site.medias = remapEntityIds(
    (boonkrua.medias || []).filter(
      (m) =>
        (m.album === "GALLERY" || m.album === "ACTIVITIES") &&
        typeof m.filePath === "string" &&
        !String(m.mimeType || "").includes("youtube")
    )
  ).slice(0, 14);

  site.condolences = [
    {
      senderName: "ศิษย์เก่า รุ่น 2538",
      relationship: "Colleague",
      message:
        "ขอบคุณอาจารย์ที่สอนให้เราคิดเป็นและมีน้ำใจ โลกนี้ยังต้องการครูแบบอาจารย์อีกมาก",
      type: "GENERAL",
    },
    {
      senderName: "ครูวิไล",
      relationship: "Colleague",
      message:
        "ร่วมงานกับอาจารย์มานานหลายสิบปี อาจารย์คือเพื่อนร่วมทางที่ซื่อสัตย์และเมตตาเสมอ",
      type: "GENERAL",
    },
    {
      senderName: "ครอบครัวพิทักษ์ธรรม",
      relationship: "Relative",
      message:
        "พ่อคือแบบอย่างของความมุ่งมั่นและการให้ เราจะรักษาจิตวิญญาณนี้ต่อไป",
      type: "FAMILY",
    },
  ].map((c, i) => ({
    id: randomUUID(),
    websiteId: "pending",
    ...c,
    isApproved: true,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  }));

  site.memoryPosts = [];
  site.familyMembers = [];
  site.ebooks = [];

  site.activities = [
    {
      title: "ทำบุญอุทิศส่วนกุศลประจำปี",
      description:
        "เชิญศิษย์เก่า ครอบครัว และผู้ที่เคารพรักมาร่วมทำบุญอุทิศส่วนกุศลให้อาจารย์สมชาย",
      images: [gallery[0] || coverUrl, gallery[1] || avatarUrl],
      eventDate: "2026-01-15T09:00:00.000Z",
      isRecurring: true,
      sortOrder: 1,
    },
    {
      title: "กองทุนทุนการศึกษานักเรียนยากจน",
      description:
        "สมทบทุนการศึกษาต่อเนื่องตามเจตนารมณ์ของอาจารย์ เพื่อเปิดโอกาสให้นักเรียนได้เรียนต่อ",
      images: [gallery[2] || coverUrl],
      eventDate: "2026-03-01T00:00:00.000Z",
      isRecurring: false,
      sortOrder: 2,
    },
  ].map((a) => ({
    id: randomUUID(),
    websiteId: "pending",
    title: a.title,
    description: a.description,
    images: a.images,
    pdfUrl: null,
    eventDate: a.eventDate,
    isRecurring: a.isRecurring,
    sortOrder: a.sortOrder,
    createdAt: now,
    updatedAt: now,
  }));

  site.donations = [
    {
      donorName: "ศิษย์เก่า รุ่น 2540",
      amount: 5000,
      message: "สมทบกองทุนการศึกษาตามเจตนารมณ์อาจารย์",
    },
    {
      donorName: "คุณแม่วรรณา",
      amount: 1000,
      message: "ขอเป็นส่วนหนึ่งในการสานต่อสิ่งดี ๆ",
    },
    {
      donorName: "เพื่อนครูโรงเรียนเดิม",
      amount: 2000,
      message: "ระลึกถึงอาจารย์ด้วยความเคารพรัก",
    },
  ].map((d, i) => ({
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

  return site;
}

const data = JSON.parse(readFileSync(DATA_PATH, "utf8"));
const boonkrua = data.sites.find((s) => s.slug === "boonkrua-family");
if (!boonkrua) {
  console.error("boonkrua-family not found in demo-sites.json");
  process.exit(1);
}

const extras = [buildMaeSomsri(boonkrua), buildAjarnSomchai(boonkrua)];
const keep = data.sites.filter(
  (s) => s.slug !== "mae-somsri" && s.slug !== "ajarn-somchai"
);
data.sites = [...keep, ...extras];

writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + "\n");
console.log(
  "Updated demo-sites.json with:",
  extras.map((s) => `${s.slug} (${s.tenant.name})`).join(", ")
);
