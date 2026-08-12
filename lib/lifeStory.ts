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

export const LIFE_STORY_SECTIONS: {
  id: LifeStorySectionId;
  label: string;
  description: string;
  placeholder?: string;
}[] = [
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
    placeholder: 'เช่น “ความซื่อสัตย์มาก่อนผลประโยชน์” / สูตรอาหารที่ท่านสอน / คติที่ใช้เตือนลูกหลาน …',
  },
  {
    id: 'timeline',
    label: 'เส้นทางชีวิต',
    description: 'ไทม์ไลน์ตามปีหรือช่วงชีวิต พร้อมเรื่องสั้น ๆ แต่ละจุด',
  },
];

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

export function lifeStoryHasContent(data: LifeStoryData | null | undefined): boolean {
  if (!data) return false;
  return Boolean(
    data.biography.trim() ||
      data.honors.trim() ||
      data.legacy.trim() ||
      data.teachings.trim() ||
      data.timeline.some((t) => t.title.trim() || t.year.trim() || t.description.trim()),
  );
}
