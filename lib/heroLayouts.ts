export type HeroLayoutId =
  | 'center-classic'
  | 'avatar-left'
  | 'avatar-right'
  | 'text-top'
  | 'bottom-band'
  | 'bottom-band-right'
  | 'framed-portrait'
  | 'framed-on-cover';

export type HeroBgMode = 'image' | 'soft-wash' | 'image-and-wash';

export interface HeroLayoutOption {
  id: HeroLayoutId;
  label: string;
  description: string;
}

/** Hero layout options for all site categories. */
export const HERO_LAYOUTS: HeroLayoutOption[] = [
  {
    id: 'center-classic',
    label: 'ตรงกลางคลาสสิก',
    description: 'รูปโปรไฟล์กลางด้านบน ชื่ออยู่ด้านล่าง',
  },
  {
    id: 'avatar-left',
    label: 'โปรไฟล์ซ้าย',
    description: 'วงกลมซ้าย · ชื่อและคำโปรยด้านขวา',
  },
  {
    id: 'avatar-right',
    label: 'โปรไฟล์ขวา',
    description: 'วงกลมขวา · ชื่อและคำโปรยด้านซ้าย',
  },
  {
    id: 'text-top',
    label: 'ตัวอักษรนำ',
    description: 'ชื่อด้านบน · รูปโปรไฟล์กลางด้านล่าง',
  },
  {
    id: 'bottom-band',
    label: 'แถบล่างนิ่ง (ซ้าย)',
    description: 'รูปปกเต็ม · โปรไฟล์ซ้ายบนแถบล่าง',
  },
  {
    id: 'bottom-band-right',
    label: 'แถบล่างนิ่ง (ขวา)',
    description: 'รูปปกเต็ม · โปรไฟล์ขวาบนแถบล่าง',
  },
  {
    id: 'framed-portrait',
    label: 'ภาพเด่นกรอบ',
    description: 'รูปสี่เหลี่ยมมุมมนกลาง · เส้นบาง · ชื่อด้านล่าง',
  },
  {
    id: 'framed-on-cover',
    label: 'ภาพเด่นบนปก',
    description: 'รูปปกเป็นพื้น · กรอบโปรไฟล์กลาง · ชื่อด้านล่าง',
  },
];

/** @deprecated Use HERO_LAYOUTS */
export const MEMORIAL_HERO_LAYOUTS = HERO_LAYOUTS;

const LEGACY_LAYOUT_MAP: Record<string, HeroLayoutId> = {
  'text-pattern': 'bottom-band',
  'card-overlay': 'framed-portrait',
};

const LEGACY_BG_MAP: Record<string, HeroBgMode> = {
  'text-pattern': 'soft-wash',
  'image-and-text': 'image-and-wash',
};

export function normalizeHeroLayout(value: unknown): HeroLayoutId {
  const id = typeof value === 'string' ? value : '';
  if (HERO_LAYOUTS.some((l) => l.id === id)) return id as HeroLayoutId;
  if (id in LEGACY_LAYOUT_MAP) return LEGACY_LAYOUT_MAP[id];
  return 'center-classic';
}

export function normalizeHeroBgMode(value: unknown, layout?: HeroLayoutId): HeroBgMode {
  if (value === 'image' || value === 'soft-wash' || value === 'image-and-wash') {
    return value;
  }
  if (typeof value === 'string' && value in LEGACY_BG_MAP) {
    return LEGACY_BG_MAP[value];
  }
  if (layout === 'bottom-band' || layout === 'bottom-band-right' || layout === 'framed-on-cover') {
    return 'image';
  }
  return 'image';
}
