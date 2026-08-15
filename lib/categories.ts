import {
  FeatureKey,
  FeatureMap,
  FEATURE_CATALOG,
  PHASE_HIDDEN_FEATURES,
  applyPhaseFeatureConstraints,
} from './features';

export type CategoryKey =
  | 'Memorial'
  | 'Family Legacy'
  | 'Couple'
  | 'Wedding'
  | 'Friends'
  | 'Pet Memorial';

export const MANDATORY_FEATURES: FeatureKey[] = ['gallery', 'videos'];

export interface CategoryJourney {
  label: string;
  tagline: string;
  optional: FeatureKey[];
  defaultOn: FeatureKey[];
  featureLabels?: Partial<
    Record<FeatureKey, { label?: string; description?: string; pageDescription?: string }>
  >;
  home?: {
    biographyHeading?: string;
    condolenceHeading?: string;
    condolenceCta?: string;
    galleryHeading?: string;
  };
}

export const CATEGORY_JOURNEYS: Record<CategoryKey, CategoryJourney> = {
  'Memorial': {
    label: 'Memorial (รำลึกถึงผู้ล่วงลับ)',
    tagline: 'เว็บไซต์อนุสรณ์และคำรำลึกถึงผู้ล่วงลับ',
    optional: ['announcement', 'condolence', 'memory', 'feed', 'family', 'ebooks', 'activities', 'donation'],
    defaultOn: ['condolence', 'memory'],
    featureLabels: {
      announcement: {
        label: 'การ์ดกำหนดการพิธี',
        description: 'การ์ดประกาศกำหนดการพิธีและแชร์แจ้งข่าว',
        pageDescription:
          'ดูวันเวลา สถานที่ และรายละเอียดพิธีได้ในที่เดียว แชร์ให้ญาติมิตรทราบได้ทันที',
      },
      gallery: {
        label: 'คลังภาพรำลึก',
        description: 'อัลบั้มรูปถ่ายความทรงจำของผู้ล่วงลับ',
        pageDescription:
          'รวมภาพความทรงจำที่อยากเก็บไว้ เปิดดูทีละภาพ หรือดูตามอัลบั้ม',
      },
      videos: {
        label: 'คลังวิดีโอ',
        description: 'คลิปวิดีโอและภาพยนตร์สั้นรำลึกถึงผู้ล่วงลับ',
        pageDescription: 'คลิปและช่วงเวลาที่ยังอยากได้ยิน ได้เห็นอีกครั้ง',
      },
      condolence: {
        label: 'สมุดไว้อาลัย',
        description: 'รับคำไว้อาลัยพร้อมระบบคัดกรองเนื้อหา',
        pageDescription:
          'พื้นที่ฝากคำอาลัย ความคิดถึง และกำลังใจถึงครอบครัว — ข้อความจะผ่านการกลั่นกรองก่อนเผยแพร่',
      },
      memory: {
        label: 'กระดานความทรงจำ',
        description: 'โพสต์เล่าเรื่องราวความทรงจำอันมีค่าร่วมกัน',
        pageDescription:
          'เล่าเรื่องราว รูปภาพ หรือโมเมนต์ที่อยากแบ่งปันร่วมกัน เก็บเป็นบันทึกร่วมของทุกคนที่รักท่าน',
      },
      feed: {
        label: 'ฟีดสมุดไว้อาลัย',
        description: 'ฟีดคอมเมนต์ส่งคำรำลึกและแสดงความระลึกถึง',
      },
      family: {
        label: 'ผังครอบครัว',
        description: 'แผนผังเครือญาติสืบสานสายสัมพันธ์สายเลือด',
        pageDescription: 'ดูสายสัมพันธ์และคนในครอบครัวที่เชื่อมโยงถึงท่าน',
      },
      ebooks: {
        label: 'หนังสือที่ระลึก',
        description: 'หนังสืออนุสรณ์อิเล็กทรอนิกส์ (E-Book) อ่านออนไลน์',
        pageDescription:
          'อ่านหนังสืออนุสรณ์ออนไลน์ เก็บเรื่องราวและภาพในรูปแบบเล่มดิจิทัล',
      },
      activities: {
        label: 'กิจกรรมรำลึก',
        description: 'งานทำบุญ งานประจำปี หรือกิจกรรมพิเศษที่จัดเพื่ออุทิศ',
        pageDescription:
          'งานทำบุญ งานประจำปี หรือกิจกรรมที่จัดเพื่อระลึกและอุทิศส่วนกุศล',
      },
      donation: {
        label: 'ร่วมทำบุญอุทิศกุศล',
        description: 'ร่วมทำบุญกุศลและส่งความช่วยเหลือผ่าน PromptPay',
        pageDescription:
          'ร่วมทำบุญผ่าน PromptPay แนบสลิปได้ และฝากข้อความอนุโมทนาตามเจตนา',
      },
    },
    home: {
      biographyHeading: 'อาลัยและคำรำลึก',
      condolenceHeading: 'ข้อความไว้อาลัยล่าสุด',
      condolenceCta: 'เขียนข้อความ/ร่วมจุดเทียนออนไลน์',
      galleryHeading: 'คลังภาพรำลึก',
    },
  },
  'Family Legacy': {
    label: 'Family Legacy (เรื่องเล่าครอบครัว)',
    tagline: 'เก็บเรื่องราว ภาพ และความทรงจำของครอบครัวไว้ด้วยกัน',
    optional: ['announcement', 'condolence', 'memory', 'feed', 'family', 'ebooks', 'activities', 'donation'],
    defaultOn: ['memory', 'family', 'ebooks'],
    featureLabels: {
      announcement: { label: 'การ์ดงานครอบครัว', description: 'ประกาศวันนัดหมาย งานสำคัญ และกำหนดการของครอบครัว' },
      gallery: { label: 'คลังภาพครอบครัว', description: 'อัลบั้มภาพถ่ายและความทรงจำของครอบครัว' },
      videos: { label: 'คลังวิดีโอครอบครัว', description: 'คลิปวิดีโอและบันทึกช่วงเวลาร่วมกัน' },
      condolence: { label: 'สมุดข้อความถึงครอบครัว', description: 'บันทึกคำอวยพรและข้อความถึงสมาชิกในครอบครัว' },
      memory: { label: 'กระดานเรื่องเล่า', description: 'แชร์เรื่องราว คำสอน และความทรงจำจากสมาชิกในครอบครัว' },
      feed: { label: 'ฟีดอัปเดตครอบครัว', description: 'ฟีดแชร์เรื่องราวและความรู้สึกจากสมาชิกในครอบครัว' },
      family: { label: 'ผังครอบครัว', description: 'แผนผังเครือญาติและความสัมพันธ์ในครอบครัว' },
      ebooks: { label: 'หนังสือครอบครัว', description: 'สมุดเรื่องราวและบันทึกครอบครัวออนไลน์' },
      activities: {
        label: 'กิจกรรมครอบครัว',
        description: 'งานรวมญาติ งานประจำปี หรือกิจกรรมที่ครอบครัวจัดร่วมกัน',
      },
      donation: { label: 'สมทบกองทุนครอบครัว', description: 'ร่วมสมทบทุนเพื่อกิจกรรมครอบครัวหรือทำบุญสาธารณะ' },
    },
    home: {
      biographyHeading: 'เรื่องราวของครอบครัวเรา',
      galleryHeading: 'คลังภาพแห่งความทรงจำ',
    },
  },
  'Couple': {
    label: 'Couple (เรื่องราวเธอกับฉัน)',
    tagline: 'บันทึกการเดินทางความรักและเรื่องราวคู่ชีวิต',
    optional: ['announcement', 'condolence', 'memory', 'feed', 'family', 'ebooks', 'activities', 'donation'],
    defaultOn: ['announcement', 'memory'],
    featureLabels: {
      announcement: { label: 'บันทึกวันสำคัญ', description: 'การ์ดบันทึกโมเมนต์และเส้นทางความรัก — วันที่ใส่เมื่อจำได้ ไม่บังคับให้เป๊ะ' },
      gallery: { label: 'คลังภาพแสนรัก', description: 'อัลบั้มรูปถ่ายบันทึกการเดินทางความรักของคู่เรา' },
      videos: { label: 'คลิปวิดีโอแห่งรัก', description: 'วิดีโอโมเมนต์พิเศษและช่วงเวลาแสนหวานของคู่ชีวิต' },
      condolence: { label: 'สมุดบันทึกรัก', description: 'สมุดฝากข้อความรักและคำอธิษฐานดี ๆ ส่งถึงกัน' },
      memory: { label: 'ไดอารี่ความทรงจำ', description: 'เขียนบอกเล่าเรื่องราวประทับใจและความรู้สึกระหว่างเรา' },
      feed: { label: 'ฟีดส่งความรัก', description: 'ฟีดส่งรัก ข้อความกำลังใจ และคอมเมนต์แชร์โมเมนต์หวาน' },
      family: { label: 'ครอบครัวและคนสำคัญ', description: 'แผนผังบุคคลอันเป็นที่รักและผู้มีพระคุณในชีวิตคู่ของเรา' },
      ebooks: { label: 'สมุดภาพความรัก', description: 'สมุดภาพเรื่องราวความรักอิเล็กทรอนิกส์อ่านออนไลน์ (E-Book)' },
      donation: { label: 'เป้าหมายของเรา', description: 'เปิดเมื่อมีแพลนร่วมกัน เช่น ทริป บ้าน หรือของขวัญครบรอบ — ตั้งชื่อเป้าหมายเอง แล้วรับสมทบผ่าน PromptPay' },
      activities: {
        label: 'วันสำคัญ & แพลนวันเดท',
        description: 'บันทึกวันพิเศษและกิจกรรมที่อยากทำด้วยกัน',
      },
    },
    home: {
      biographyHeading: 'เรื่องราวความรักของเรา',
      galleryHeading: 'บันทึกภาพความทรงจำ',
    },
  },
  'Wedding': {
    label: 'Wedding (งานวิวาห์)',
    tagline: 'บันทึกความสุขในวันสำคัญและแชร์ภาพความประทับใจ',
    optional: ['announcement', 'condolence', 'memory', 'feed', 'family', 'ebooks', 'activities', 'donation'],
    defaultOn: ['announcement'],
    featureLabels: {
      announcement: { label: 'การ์ดเชิญ & กำหนดการ', description: 'การ์ดเชิญร่วมงานแต่งงานออนไลน์และแจ้งกำหนดการพิธี' },
      gallery: { label: 'แกลเลอรีคู่บ่าวสาว', description: 'อัลบั้มรูป Pre-Wedding และภาพบรรยากาศวันงานแต่งงาน' },
      videos: { label: 'วิดีโองานแต่งงาน', description: 'วิดีโอ Presentation บ่าวสาว และวิดีโอบรรยากาศในงาน' },
      condolence: { label: 'สมุดลงนามอวยพร', description: 'สมุดเขียนข้อความอวยพรและคำยินดีสำหรับคู่บ่าวสาว' },
      memory: { label: 'บอร์ดส่งคำยินดี', description: 'แชร์เรื่องราวยินดีและรวมรูปถ่ายจากเพื่อนๆ ที่มาร่วมงาน' },
      feed: { label: 'ฟีดเฉลิมฉลอง', description: 'ฟีดคอมเมนต์ส่งรัก แสดงความยินดี และกดส่งหัวใจให้บ่าวสาว' },
      family: { label: 'สองครอบครัวชื่นมื่น', description: 'แผนแนะนำครอบครัวและเครือญาติฝั่งเจ้าบ่าวและเจ้าสาว' },
      ebooks: { label: 'อัลบั้มงานแต่ง', description: 'สมุดภาพและบันทึกงานแต่งงานออนไลน์' },
      activities: {
        label: 'กิจกรรมรอบงาน',
        description: 'งานเลี้ยง after party หรือกิจกรรมก่อน-หลังวันแต่ง',
      },
      donation: { label: 'ร่วมใส่ซองออนไลน์', description: 'ร่วมส่งของขวัญและเงินของขวัญวันแต่งงานผ่าน PromptPay' },
    },
    home: {
      biographyHeading: 'เรื่องราวของเรา',
      condolenceHeading: 'คำอวยพรล่าสุด',
      condolenceCta: 'ร่วมเขียนคำอวยพร',
      galleryHeading: 'ภาพความประทับใจ',
    },
  },
  'Friends': {
    label: 'Friends (แก๊งเพื่อน)',
    tagline: 'พื้นที่เก็บความทรงจำร่วม ทริป และเรื่องราวของกลุ่มที่เติบโตไปด้วยกัน',
    optional: ['announcement', 'condolence', 'memory', 'feed', 'family', 'ebooks', 'activities', 'donation'],
    defaultOn: ['memory', 'condolence'],
    featureLabels: {
      announcement: { label: 'บอร์ดนัดหมายกลุ่ม', description: 'การ์ดนัดแนะ กำหนดการรวมตัว หรือทริปร่วมกัน' },
      gallery: { label: 'คลังภาพของกลุ่ม', description: 'อัลบั้มรูปทริป งานรวมตัว และโมเมนต์ร่วมกัน' },
      videos: { label: 'คลังวิดีโอของกลุ่ม', description: 'คลิปโมเมนต์ตลก ๆ และช่วงเวลาประทับใจของพวกเรา' },
      condolence: { label: 'สมุดข้อความถึงกัน', description: 'พื้นที่เขียนข้อความฝากถึงกันและบันทึกความรู้สึกดี ๆ' },
      memory: { label: 'บอร์ดแชร์เรื่องราว', description: 'โพสต์เรื่องเล่า ความหลัง และโมเมนต์น่าจดจำ' },
      feed: { label: 'ฟีดอัปเดตของกลุ่ม', description: 'ฟีดอัปเดตเรื่องราวในกลุ่ม คอมเมนต์ และส่งความรู้สึกถึงกัน' },
      family: { label: 'ทำเนียบสมาชิก', description: 'แนะนำสมาชิกในกลุ่มและแผนผังความสัมพันธ์ในกลุ่ม' },
      ebooks: { label: 'หนังสือรุ่นออนไลน์', description: 'หนังสือรุ่นออนไลน์บันทึกความทรงจำร่วมกัน (E-Yearbook)' },
      activities: {
        label: 'งานรวมตัว & ทริป',
        description: 'นัดหมายรวมรุ่น ทริปประจำปี หรืองานพบปะของกลุ่ม',
      },
      donation: { label: 'กองทุนรวมตัว', description: 'ร่วมสมทบทุนส่วนกลางสำหรับจัดทริปหรืองานรวมตัว' },
    },
    home: {
      biographyHeading: 'เรื่องราวของพวกเรา',
      condolenceHeading: 'ข้อความถึงกันล่าสุด',
      condolenceCta: 'เขียนข้อความถึงกลุ่ม',
      galleryHeading: 'ภาพความทรงจำร่วม',
    },
  },
  'Pet Memorial': {
    label: 'Pet (น้องที่รัก)',
    tagline: 'พื้นที่เก็บความทรงจำและเรื่องราวของน้อง ทั้งวันที่อยู่ด้วยกันและในความทรงจำ',
    optional: ['announcement', 'condolence', 'memory', 'feed', 'family', 'activities', 'donation'],
    defaultOn: ['memory'],
    featureLabels: {
      announcement: {
        label: 'การ์ดงานวันสำคัญ',
        description: 'การ์ดวันเกิดน้อง งานอำลา หรือกิจกรรมพิเศษ',
      },
      gallery: { label: 'คลังภาพเจ้าตัวน้อย', description: 'อัลบั้มภาพถ่ายความทรงจำและโมเมนต์น่ารักของเด็ก ๆ' },
      videos: { label: 'วิดีโอแสนซนของน้อง', description: 'คลิปวิดีโอแสนซนและช่วงเวลาป่วนปนน่ารักของเด็ก ๆ' },
      condolence: { label: 'สมุดส่งความคิดถึง', description: 'สมุดฝากคำรักและข้อความคิดถึงส่งตรงถึงดาวหมาแมว' },
      memory: { label: 'ไดอารี่ความสุข', description: 'พื้นที่โพสต์รูปถ่ายและเขียนบอกเล่าเรื่องราวความสุขระหว่างเรา' },
      feed: { label: 'ฟีดรักสัตว์เลี้ยง', description: 'ฟีดคอมเมนต์ส่งความระลึกถึง ส่งกอดอุ่น ๆ และแสดงความรู้สึกดี ๆ' },
      family: { label: 'พี่น้องสี่ขา', description: 'แผนผังพี่น้องและเพื่อนแก๊งสี่ขาของเจ้าตัวน้อย' },
      activities: {
        label: 'กิจกรรมของน้อง',
        description: 'วันเกิด วันพาไปเที่ยว หรือกิจกรรมพิเศษของน้อง',
      },
      donation: { label: 'สมทบกองทุนสี่ขา', description: 'ร่วมบริจาคสมทบทุนเพื่อช่วยเหลือสัตว์ยากไร้/สัตว์พิการ' },
    },
    home: {
      biographyHeading: 'เรื่องราวของเจ้าตัวน้อย',
      condolenceHeading: 'ข้อความถึงน้องล่าสุด',
      galleryHeading: 'ภาพความทรงจำแสนรัก',
    },
  },
};

/** Get CategoryJourney configuration, falling back to 'Memorial'. */
export function getCategoryJourney(category?: string): CategoryJourney {
  if (category && category in CATEGORY_JOURNEYS) {
    return CATEGORY_JOURNEYS[category as CategoryKey];
  }
  return CATEGORY_JOURNEYS['Memorial'];
}

/** Get the initial FeatureMap based on category mandatory and default-on features. */
export function getInitialFeatureMapForCategory(category?: string): FeatureMap {
  const journey = getCategoryJourney(category);
  const initialMap = {} as FeatureMap;
  
  // Set all features in the catalog
  for (const f of FEATURE_CATALOG) {
    const isMandatory = MANDATORY_FEATURES.includes(f.key);
    const isDefaultOn = journey.defaultOn.includes(f.key);
    initialMap[f.key] = isMandatory || isDefaultOn;
  }
  
  return applyPhaseFeatureConstraints(initialMap);
}

/** Resolves dynamic description and label, merging default catalog value with journey overrides. */
export function getFeatureLabel(
  category: string | undefined,
  key: FeatureKey,
): { label: string; description: string; pageDescription: string } {
  const def = FEATURE_CATALOG.find((f) => f.key === key);
  const defaultLabel = def?.label || '';
  const defaultDesc = def?.description || '';

  const journey = getCategoryJourney(category);
  const override = journey.featureLabels?.[key];
  const description = override?.description || defaultDesc;

  return {
    label: override?.label || defaultLabel,
    description,
    pageDescription: override?.pageDescription || description,
  };
}

/** Visible features with marketing/public page copy for a category. */
export function getCategoryFeatureShowcase(category?: string) {
  return getVisibleKeys(category).map((key) => {
    const def = FEATURE_CATALOG.find((f) => f.key === key);
    const copy = getFeatureLabel(category, key);
    return {
      key,
      icon: def?.icon || 'Flame',
      label: copy.label,
      description: copy.description,
      pageDescription: copy.pageDescription,
    };
  });
}

/** Get keys that are visible (mandatory + optional) for the category checklist. */
export function getVisibleKeys(category?: string): FeatureKey[] {
  const journey = getCategoryJourney(category);
  // Merge mandatory features and optional ones
  const keys = new Set<FeatureKey>([...MANDATORY_FEATURES, ...journey.optional]);
  return Array.from(keys).filter((key) => !PHASE_HIDDEN_FEATURES.includes(key));
}
