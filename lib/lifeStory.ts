import type { CategoryKey } from '@/lib/categories';

export type LifeStoryTimelineItem = {
  id: string;
  year: string;
  title: string;
  description: string;
};

export type LifeStoryData = {
  biography: string;
  honors: string;
  legacy: string;
  teachings: string;
  timeline: LifeStoryTimelineItem[];
};

export type LifeStorySectionId =
  | 'biography'
  | 'honors'
  | 'legacy'
  | 'teachings'
  | 'timeline';

export interface LifeStorySectionConfig {
  id: LifeStorySectionId;
  label: string;
  description: string;
  placeholder?: string;
}

const MEMORIAL_SECTIONS: LifeStorySectionConfig[] = [
  {
    id: 'biography',
    label: 'ชีวประวัติ',
    description: 'ชีวิตโดยละเอียด — ครอบครัว การศึกษา อาชีพ และช่วงเวลาสำคัญ',
    placeholder:
      'เช่น ท่านเกิดเมื่อปี … ที่จังหวัด … สำเร็จการศึกษา … ทำงานด้าน … มีครอบครัว …',
  },
  {
    id: 'honors',
    label: 'เกียรติประวัติและคุณูปการ',
    description: 'รางวัล ตำแหน่ง ผลงาน และคุณธรรมที่ผู้คนจดจำ',
    placeholder: 'เช่น เคยดำรงตำแหน่ง … ได้รับรางวัล … เป็นที่รู้จักในด้านความซื่อสัตย์และ …',
  },
  {
    id: 'legacy',
    label: 'มรดกที่สืบทอดต่อ',
    description: 'กิจกรรม โครงการ หรือสิ่งที่ลูกหลานยังทำต่อไปเพื่ออุทิศ',
    placeholder:
      'เช่น ตั้งทุนการศึกษาในนามท่าน / จัดงานทำบุญประจำปี / ดำเนินมูลนิธิที่ท่านริเริ่ม …',
  },
  {
    id: 'teachings',
    label: 'คำสอนและคติธรรม',
    description: 'คำพูดประจำตัว บทเรียนชีวิต หรือเรื่องที่อยากให้รุ่นหลังจำ',
    placeholder:
      'เช่น “ความซื่อสัตย์มาก่อนผลประโยชน์” / สูตรอาหารที่ท่านสอน / คติที่ใช้เตือนลูกหลาน …',
  },
  {
    id: 'timeline',
    label: 'เส้นทางชีวิต',
    description: 'ไทม์ไลน์ตามปีหรือช่วงชีวิต พร้อมเรื่องสั้น ๆ แต่ละจุด',
  },
];

const FAMILY_LEGACY_SECTIONS: LifeStorySectionConfig[] = [
  {
    id: 'biography',
    label: 'เรื่องราวครอบครัว',
    description: 'จุดเริ่มต้น รากเหง้า และเรื่องเล่าที่อยากให้ลูกหลานรู้จัก',
    placeholder:
      'เช่น ครอบครัวเราเริ่มจากคุณปู่คุณย่าที่ … ลูกหลานเติบโตมาด้วย … หน้าเว็บนี้เก็บเรื่องราวไว้เพื่อ …',
  },
  {
    id: 'teachings',
    label: 'คำสอนและคุณค่าที่ส่งต่อ',
    description: 'คติธรรม คำสอน หรือแนวทางที่ครอบครัวยึดถือและส่งต่อรุ่นต่อรุ่น',
    placeholder:
      'เช่น “ตระกูลเราอยู่ด้วยกันเมื่อยังมีชีวิต และอยู่ด้วยกันในความทรงจำ” / ค่านิยมที่ยึดถือ …',
  },
  {
    id: 'timeline',
    label: 'ไทม์ไลน์ครอบครัว',
    description: 'เหตุการณ์สำคัญของครอบครัว เช่น งานรวมญาติ รุ่นใหม่ หรือช่วงเวลาที่ภาคภูมิใจ',
  },
];

const PET_MEMORIAL_SECTIONS: LifeStorySectionConfig[] = [
  {
    id: 'biography',
    label: 'เรื่องราวของน้อง',
    description: 'แนะนำนิสัย บุคลิก และช่วงเวลาที่อยู่ด้วยกัน',
    placeholder:
      'เช่น น้องเป็นหมาที่ร่าเริง ชอบ … มาอยู่กับเราเมื่อ … ทำให้บ้านอบอุ่นด้วย …',
  },
  {
    id: 'legacy',
    label: 'โมเมนต์ที่อยากจำ',
    description: 'ความทรงจำสั้น ๆ ที่อยากเก็บไว้ — นิสัยน่ารัก ที่ชอบ หรือวันพิเศษ',
    placeholder:
      'เช่น ชอบนอนตากแดดตรงหน้าต่าง / วิ่งมาต้อนรับทุกครั้งที่กลับบ้าน / ชอบกิน …',
  },
  {
    id: 'timeline',
    label: 'เส้นทางชีวิตน้อง',
    description: 'ไทม์ไลน์ช่วงเวลาสำคัญ เช่น วันรับมาเลี้ยง ทริปแรก หรือวันสุดท้ายที่อยู่ด้วยกัน',
  },
];

/** @deprecated Use getLifeStorySections(category) */
export const LIFE_STORY_SECTIONS = MEMORIAL_SECTIONS;

export function categoryUsesLifeStory(category: string | null | undefined): boolean {
  return (
    category === 'Memorial' ||
    category === 'Family Legacy' ||
    category === 'Pet Memorial'
  );
}

export function getLifeStorySections(
  category: string | null | undefined,
): LifeStorySectionConfig[] {
  if (category === 'Family Legacy') return FAMILY_LEGACY_SECTIONS;
  if (category === 'Pet Memorial') return PET_MEMORIAL_SECTIONS;
  return MEMORIAL_SECTIONS;
}

export function getLifeStoryMenuTitle(category: string | null | undefined): string {
  if (category === 'Family Legacy') return 'เรื่องราวครอบครัว';
  if (category === 'Pet Memorial') return 'เรื่องราวของน้อง';
  return 'เรื่องราวชีวิต';
}

export function getLifeStoryMenuHint(category: string | null | undefined): string {
  if (category === 'Family Legacy') {
    return 'เลือกหัวข้อจากเมนูด้านซ้ายเพื่อกรอกเรื่องราว คำสอน และไทม์ไลน์ครอบครัว';
  }
  if (category === 'Pet Memorial') {
    return 'เลือกหัวข้อจากเมนูด้านซ้ายเพื่อกรอกเรื่องราว โมเมนต์ และเส้นทางชีวิตของน้อง';
  }
  return 'เลือกหัวข้อจากเมนูด้านซ้ายเพื่อกรอกชีวประวัติ เกียรติประวัติ มรดก และคำสอน';
}

export function getLifeStoryCategoryBadge(
  category: string | null | undefined,
): string {
  const map: Record<string, string> = {
    Memorial: 'Memorial',
    'Family Legacy': 'Family Legacy',
    'Pet Memorial': 'Pet Memorial',
  };
  return map[category || ''] || 'Memorial';
}

export function getDefaultLifeStorySection(
  category: string | null | undefined,
): LifeStorySectionId {
  return getLifeStorySections(category)[0]?.id ?? 'biography';
}

export function getTimelineEmptyHint(category: string | null | undefined): string {
  if (category === 'Family Legacy') {
    return 'ยังไม่มีจุดบนไทม์ไลน์ครอบครัว — กดเพิ่มด้านล่าง';
  }
  if (category === 'Pet Memorial') {
    return 'ยังไม่มีจุดบนเส้นทางชีวิตน้อง — กดเพิ่มด้านล่าง';
  }
  return 'ยังไม่มีจุดบนเส้นทางชีวิต — กดเพิ่มด้านล่าง';
}

export function getTimelineAddLabel(category: string | null | undefined): string {
  if (category === 'Family Legacy') return 'เพิ่มจุดบนไทม์ไลน์ครอบครัว';
  if (category === 'Pet Memorial') return 'เพิ่มจุดบนเส้นทางชีวิตน้อง';
  return 'เพิ่มจุดบนเส้นทางชีวิต';
}

export function emptyLifeStory(): LifeStoryData {
  return {
    biography: '',
    honors: '',
    legacy: '',
    teachings: '',
    timeline: [],
  };
}

export function createTimelineItem(
  partial?: Partial<LifeStoryTimelineItem>,
): LifeStoryTimelineItem {
  return {
    id:
      partial?.id ||
      (typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `tl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
    year: partial?.year || '',
    title: partial?.title || '',
    description: partial?.description || '',
  };
}

export function normalizeLifeStory(
  input: unknown,
  fallbackBiography = '',
): LifeStoryData {
  const src =
    input && typeof input === 'object' && !Array.isArray(input)
      ? (input as Record<string, unknown>)
      : {};

  const timelineRaw = Array.isArray(src.timeline) ? src.timeline : [];
  const timeline = timelineRaw
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const row = item as Record<string, unknown>;
      return createTimelineItem({
        id: typeof row.id === 'string' ? row.id : undefined,
        year: typeof row.year === 'string' ? row.year : '',
        title: typeof row.title === 'string' ? row.title : '',
        description: typeof row.description === 'string' ? row.description : '',
      });
    })
    .filter(Boolean) as LifeStoryTimelineItem[];

  const biography =
    typeof src.biography === 'string' && src.biography.trim()
      ? src.biography
      : fallbackBiography;

  return {
    biography,
    honors: typeof src.honors === 'string' ? src.honors : '',
    legacy: typeof src.legacy === 'string' ? src.legacy : '',
    teachings: typeof src.teachings === 'string' ? src.teachings : '',
    timeline,
  };
}

function fieldHasContent(data: LifeStoryData, id: LifeStorySectionId): boolean {
  if (id === 'timeline') {
    return data.timeline.some(
      (t) => t.title.trim() || t.year.trim() || t.description.trim(),
    );
  }
  return Boolean(data[id].trim());
}

export function lifeStoryHasContent(
  data: LifeStoryData | null | undefined,
  category?: string | null,
): boolean {
  if (!data) return false;
  const sections = categoryUsesLifeStory(category)
    ? getLifeStorySections(category)
    : MEMORIAL_SECTIONS;
  return sections.some((section) => fieldHasContent(data, section.id));
}

export function getLifeStoryFieldValue(
  data: LifeStoryData,
  id: LifeStorySectionId,
): string {
  if (id === 'biography') return data.biography;
  if (id === 'honors') return data.honors;
  if (id === 'legacy') return data.legacy;
  return data.teachings;
}

/** Categories that keep biography only in lifeStory (not the general textarea). */
export function categoryHidesGeneralBiography(
  category: string | null | undefined,
): category is CategoryKey {
  return categoryUsesLifeStory(category);
}
