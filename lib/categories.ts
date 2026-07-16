import { FeatureKey, FeatureMap, FEATURE_CATALOG } from './features';

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
  featureLabels?: Partial<Record<FeatureKey, { label?: string; description?: string }>>;
  home?: {
    biographyHeading?: string;
    condolenceHeading?: string;
    condolenceCta?: string;
    galleryHeading?: string;
  };
}

export const CATEGORY_JOURNEYS: Record<CategoryKey, CategoryJourney> = {
  'Memorial': {
    label: 'Memorial (รำลึกบุคคลทั่วไป)',
    tagline: 'เว็บไซต์อนุสรณ์และคำรำลึกถึงผู้ล่วงลับ',
    optional: ['announcement', 'condolence', 'memory', 'feed', 'family', 'ebooks', 'donation'],
    defaultOn: ['condolence', 'memory'],
    featureLabels: {
      announcement: { label: 'การ์ดกำหนดการพิธี', description: 'การ์ดประกาศกำหนดการพิธีการและแชร์แจ้งข่าว' },
      gallery: { label: 'คลังภาพรำลึก', description: 'อัลบั้มรูปถ่ายความทรงจำของผู้ล่วงลับ' },
      videos: { label: 'คลังวิดีโอ', description: 'คลิปวิดีโอและภาพยนตร์สั้นรำลึกถึงผู้ล่วงลับ' },
      condolence: { label: 'สมุดไว้อาลัย', description: 'รับคำไว้อาลัยพร้อมระบบคัดกรองเนื้อหา' },
      memory: { label: 'กระดานความทรงจำ', description: 'โพสต์เล่าเรื่องราวความทรงจำอันมีค่าร่วมกัน' },
      feed: { label: 'ฟีดสมุดไว้อาลัย', description: 'ฟีดคอมเมนต์ส่งคำรำลึกและแสดงความระลึกถึง' },
      family: { label: 'ผังครอบครัว', description: 'แผนผังเครือญาติสืบสานสายสัมพันธ์สายเลือด' },
      ebooks: { label: 'หนังสือที่ระลึก', description: 'หนังสืออนุสรณ์อิเล็กทรอนิกส์ (E-Book) อ่านออนไลน์' },
      donation: { label: 'ร่วมทำบุญอุทิศกุศล', description: 'ร่วมทำบุญกุศลและส่งความช่วยเหลือผ่าน PromptPay' },
    },
    home: {
      biographyHeading: 'อาลัยและคำรำลึก',
      condolenceHeading: 'ข้อความไว้อาลัยล่าสุด',
      condolenceCta: 'เขียนข้อความ/ร่วมจุดเทียนออนไลน์',
      galleryHeading: 'คลังภาพรำลึก',
    },
  },
  'Family Legacy': {
    label: 'Family Legacy (มรดกวงศ์ตระกูล)',
    tagline: 'ประวัติครอบครัวและบันทึกประวัติศาสตร์ตระกูล',
    optional: ['announcement', 'memory', 'feed', 'family', 'ebooks'],
    defaultOn: ['memory', 'family', 'ebooks'],
    featureLabels: {
      announcement: { label: 'การ์ดพิธีรำลึกตระกูล', description: 'การ์ดประกาศวันพิธีการรำลึกบรรพบุรุษประจำปี' },
      gallery: { label: 'คลังภาพประวัติศาสตร์', description: 'อัลบั้มรวมภาพถ่ายโบราณและบันทึกความทรงจำของตระกูล' },
      videos: { label: 'คลังวิดีโอตระกูล', description: 'ภาพยนตร์สารคดีประวัติศาสตร์ครอบครัวและคำสอน' },
      condolence: { label: 'สมุดคารวะบรรพชน', description: 'บันทึกคำคารวะและรำลึกถึงพระคุณของบรรพบุรุษ' },
      memory: { label: 'บันทึกเกียรติประวัติ', description: 'บอร์ดแชร์เรื่องราวความดีงาม คำสอน และข้อคิดในการดำเนินชีวิต' },
      feed: { label: 'ฟีดกตัญญูรำลึก', description: 'ฟีดแชร์ความรัก ความกตัญญู และแสดงความระลึกถึง' },
      family: { label: 'ผังวงศ์ตระกูล', description: 'แผนผังต้นไม้เครือญาติเชื่อมความสัมพันธ์ในวงศ์ตระกูล' },
      ebooks: { label: 'หนังสือประวัติตระกูล', description: 'หนังสือประวัติศาสตร์วงศ์ตระกูลและหนังสือออนไลน์' },
      donation: { label: 'สมทบกองทุนตระกูล', description: 'ร่วมสมทบทุนเพื่อกิจกรรมเครือญาติหรือทำบุญสาธารณะ' },
    },
    home: {
      biographyHeading: 'ประวัติและความเป็นมาของตระกูล',
      galleryHeading: 'คลังภาพแห่งความทรงจำ',
    },
  },
  'Couple': {
    label: 'Couple (ความรักคู่รัก)',
    tagline: 'บันทึกการเดินทางความรักและเรื่องราวคู่ชีวิต',
    optional: ['announcement', 'memory', 'feed', 'ebooks'],
    defaultOn: ['memory', 'feed'],
    featureLabels: {
      announcement: { label: 'บันทึกวันสำคัญ', description: 'การ์ดบันทึกวันสำคัญ ครบรอบ และเส้นทางความรักของสองเรา' },
      gallery: { label: 'คลังภาพแสนรัก', description: 'อัลบั้มรูปถ่ายบันทึกการเดินทางความรักของคู่เรา' },
      videos: { label: 'คลิปวิดีโอแห่งรัก', description: 'วิดีโอโมเมนต์พิเศษและช่วงเวลาแสนหวานของคู่ชีวิต' },
      condolence: { label: 'สมุดบันทึกรัก', description: 'สมุดฝากข้อความรักและคำอธิษฐานดี ๆ ส่งถึงกัน' },
      memory: { label: 'ไดอารี่ความทรงจำ', description: 'เขียนบอกเล่าเรื่องราวประทับใจและความรู้สึกระหว่างเรา' },
      feed: { label: 'ฟีดส่งความรัก', description: 'ฟีดส่งรัก ข้อความกำลังใจ และคอมเมนต์แชร์โมเมนต์หวาน' },
      family: { label: 'ครอบครัวและคนสำคัญ', description: 'แผนผังบุคคลอันเป็นที่รักและผู้มีพระคุณในชีวิตคู่ของเรา' },
      ebooks: { label: 'สมุดภาพความรัก', description: 'สมุดภาพเรื่องราวความรักอิเล็กทรอนิกส์อ่านออนไลน์ (E-Book)' },
      donation: { label: 'กองทุนแห่งความรัก', description: 'ร่วมสนับสนุนเป้าหมายในชีวิตหรือทำบุญร่วมชาติ' },
    },
    home: {
      biographyHeading: 'เรื่องราวความรักของเรา',
      galleryHeading: 'บันทึกภาพความทรงจำ',
    },
  },
  'Wedding': {
    label: 'Wedding (ความทรงจำแต่งงาน)',
    tagline: 'บันทึกความสุขในวันสำคัญและแชร์ภาพความประทับใจ',
    optional: ['announcement', 'condolence', 'memory', 'feed', 'family', 'ebooks', 'donation'],
    defaultOn: ['announcement', 'feed'],
    featureLabels: {
      announcement: { label: 'การ์ดเชิญ & กำหนดการ', description: 'การ์ดเชิญร่วมงานแต่งงานออนไลน์และแจ้งกำหนดการพิธี' },
      gallery: { label: 'แกลเลอรีคู่บ่าวสาว', description: 'อัลบั้มรูป Pre-Wedding และภาพบรรยากาศวันงานแต่งงาน' },
      videos: { label: 'วิดีโองานแต่งงาน', description: 'วิดีโอ Presentation บ่าวสาว และวิดีโอบรรยากาศในงาน' },
      condolence: { label: 'สมุดลงนามอวยพร', description: 'สมุดเขียนข้อความอวยพรและคำยินดีสำหรับคู่บ่าวสาว' },
      memory: { label: 'บอร์ดส่งคำยินดี', description: 'แชร์เรื่องราวยินดีและรวมรูปถ่ายจากเพื่อนๆ ที่มาร่วมงาน' },
      feed: { label: 'ฟีดเฉลิมฉลอง', description: 'ฟีดคอมเมนต์ส่งรัก แสดงความยินดี และกดส่งหัวใจให้บ่าวสาว' },
      family: { label: 'สองครอบครัวชื่นมื่น', description: 'แผนแนะนำครอบครัวและเครือญาติฝั่งเจ้าบ่าวและเจ้าสาว' },
      ebooks: { label: 'ของชำร่วยออนไลน์', description: 'หนังสือของชำร่วยและอัลบั้มแทนคำขอบคุณอ่านออนไลน์' },
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
    label: 'Friends (กลุ่มเพื่อนรัก)',
    tagline: 'เรื่องราวความทรงจำในมิตรภาพและความรักระหว่างเพื่อน',
    optional: ['announcement', 'condolence', 'memory', 'feed', 'ebooks', 'donation'],
    defaultOn: ['memory', 'feed'],
    featureLabels: {
      announcement: { label: 'บอร์ดนัดหมายแก๊ง', description: 'การ์ดนัดแนะ กำหนดการปาร์ตี้ หรือการออกทริปร่วมกัน' },
      gallery: { label: 'คลังภาพแก๊งเพื่อน', description: 'อัลบั้มรูปถ่ายทริปสนุกสนานและภาพหลุดสุดฮาของกลุ่มเพื่อน' },
      videos: { label: 'วีรกรรมแก๊งเพื่อน', description: 'วิดีโอรวมวีรกรรม โมเมนต์ตลก ๆ และโมเมนต์ซึ้ง ๆ ของพวกเรา' },
      condolence: { label: 'สมุดเฟรนด์ชิป', description: 'สมุดเขียนข้อความฝากถึงเพื่อนและบันทึกความในใจตลอดไป' },
      memory: { label: 'บอร์ดแชร์วีรกรรม', description: 'โพสต์เรื่องเล่าสุดเกรียนและเรื่องราวความหลังสมัยวัยรุ่น' },
      feed: { label: 'ฟีดความเคลื่อนไหวแก๊ง', description: 'ฟีดอัปเดตเรื่องราวในแก๊ง คอมเมนต์แซว และส่งอีโมจิต่าง ๆ' },
      family: { label: 'ทำเนียบเพื่อนซี้', description: 'แผนผังแนะนำแก๊งเพื่อนและแผนผังทำเนียบรุ่นเพื่อนซี้' },
      ebooks: { label: 'หนังสือรุ่นออนไลน์', description: 'หนังสือรุ่นออนไลน์บันทึกความทรงจำร่วมกัน (E-Yearbook)' },
      donation: { label: 'กองทุนสังสรรค์', description: 'ร่วมสมทบทุนส่วนกลางสำหรับจัดทริปหรือจัดงานเลี้ยงรุ่น' },
    },
    home: {
      biographyHeading: 'เรื่องราวของพวกเรา',
      galleryHeading: 'มิตรภาพในภาพถ่าย',
    },
  },
  'Pet Memorial': {
    label: 'Pet Memorial (สัตว์เลี้ยงแสนรัก)',
    tagline: 'อนุสรณ์สถานรำลึกถึงสัตว์เลี้ยงสมาชิกในครอบครัว',
    optional: ['announcement', 'condolence', 'memory', 'feed', 'donation'],
    defaultOn: ['condolence', 'memory'],
    featureLabels: {
      announcement: { label: 'การ์ดส่งน้องกลับดาว', description: 'การ์ดแจ้งข่าวส่งน้องกันกลับดาวดึงดูดความรักและความคิดถึง' },
      gallery: { label: 'คลังภาพเจ้าตัวน้อย', description: 'อัลบั้มภาพถ่ายความทรงจำและโมเมนต์น่ารักของเด็ก ๆ' },
      videos: { label: 'วิดีโอแสนซนของน้อง', description: 'คลิปวิดีโอแสนซนและช่วงเวลาป่วนปนน่ารักของเด็ก ๆ' },
      condolence: { label: 'สมุดส่งความคิดถึง', description: 'สมุดฝากคำรักและข้อความคิดถึงส่งตรงถึงดาวหมาแมว' },
      memory: { label: 'ไดอารี่ความสุข', description: 'พื้นที่โพสต์รูปถ่ายและเขียนบอกเล่าเรื่องราวความสุขระหว่างเรา' },
      feed: { label: 'ฟีดรักสัตว์เลี้ยง', description: 'ฟีดคอมเมนต์ส่งความระลึกถึง ส่งกอดอุ่น ๆ และแสดงความรู้สึกดี ๆ' },
      family: { label: 'สมาชิกสี่ขา', description: 'แผนผังพี่น้องและเพื่อนแก๊งสี่ขาของเจ้าตัวน้อย' },
      donation: { label: 'สมทบกองทุนสี่ขา', description: 'ร่วมบริจาคสมทบทุนเพื่อช่วยเหลือสัตว์ยากไร้/สัตว์พิการ' },
    },
    home: {
      biographyHeading: 'เรื่องราวของเจ้าตัวน้อย',
      condolenceHeading: 'ข้อความรำลึกล่าสุด',
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
  
  return initialMap;
}

/** Resolves dynamic description and label, merging default catalog value with journey overrides. */
export function getFeatureLabel(
  category: string | undefined,
  key: FeatureKey
): { label: string; description: string } {
  const def = FEATURE_CATALOG.find((f) => f.key === key);
  const defaultLabel = def?.label || '';
  const defaultDesc = def?.description || '';

  const journey = getCategoryJourney(category);
  const override = journey.featureLabels?.[key];

  return {
    label: override?.label || defaultLabel,
    description: override?.description || defaultDesc,
  };
}

/** Get keys that are visible (mandatory + optional) for the category checklist. */
export function getVisibleKeys(category?: string): FeatureKey[] {
  const journey = getCategoryJourney(category);
  // Merge mandatory features and optional ones
  const keys = new Set<FeatureKey>([...MANDATORY_FEATURES, ...journey.optional]);
  return Array.from(keys);
}
