/**
 * Single source of truth for the optional memorial-site features.
 *
 * Visibility for these features is stored in `Tenant.themeConfig.features`
 * (a JSON map of FeatureKey -> boolean). This module owns the catalog,
 * the default preset used at creation time, and the normalization helper
 * that reads the map with backward-compatible fallbacks for older tenants
 * that predate the `features` map.
 */

export type FeatureKey =
  | 'announcement'
  | 'condolence'
  | 'memory'
  | 'feed'
  | 'family'
  | 'gallery'
  | 'videos'
  | 'ebooks'
  | 'donation';

export interface FeatureDef {
  key: FeatureKey;
  /** Thai label used for the public nav menu item. */
  label: string;
  /** Short Thai description shown in the toggle UI. */
  description: string;
  /** URL segment after `/[slug]` (HOME is implicit and always on). */
  pathSegment: string;
  /** lucide-react icon name, resolved to a component in the UI layer. */
  icon: string;
  /** Whether this feature is pre-selected in the post-payment checklist. */
  defaultOn: boolean;
}

/**
 * The 9 toggleable features. Order here drives the order of nav items and
 * of the checklist cards. HOME is intentionally NOT in this list — it is
 * always visible and handled by the Menu table.
 */
export const FEATURE_CATALOG: FeatureDef[] = [
  {
    key: 'announcement',
    label: 'การ์ดกำหนดการ',
    description: 'การ์ดประกาศกำหนดการพิธีและการแชร์',
    pathSegment: 'announcement',
    icon: 'Megaphone',
    defaultOn: false,
  },
  {
    key: 'gallery',
    label: 'คลังภาพรำลึก',
    description: 'อัลบั้มรูปถ่ายความทรงจำของผู้ล่วงลับ',
    pathSegment: 'gallery',
    icon: 'Image',
    defaultOn: true,
  },
  {
    key: 'videos',
    label: 'คลังวิดีโอ',
    description: 'คลิปวิดีโอและภาพยนตร์สั้นรำลึกถึงผู้ล่วงลับ',
    pathSegment: 'videos',
    icon: 'Video',
    defaultOn: true,
  },
  {
    key: 'condolence',
    label: 'สมุดไว้อาลัย',
    description: 'รับคำไว้อาลัยพร้อมระบบคัดกรอง',
    pathSegment: 'condolence',
    icon: 'Flame',
    defaultOn: true,
  },
  {
    key: 'memory',
    label: 'กระดานความทรงจำ',
    description: 'โพสต์เล่าความทรงจำร่วมกัน',
    pathSegment: 'memory',
    icon: 'StickyNote',
    defaultOn: true,
  },
  {
    key: 'feed',
    label: 'ฟีดไว้อาลัย',
    description: 'ฟีดโพสต์ คอมเมนต์ และการแสดงความรู้สึก',
    pathSegment: 'feed',
    icon: 'MessagesSquare',
    defaultOn: false,
  },
  {
    key: 'family',
    label: 'ผังครอบครัว',
    description: 'แผนผังเครือญาติของผู้ล่วงลับ',
    pathSegment: 'family',
    icon: 'Network',
    defaultOn: false,
  },
  {
    key: 'ebooks',
    label: 'หนังสือที่ระลึก',
    description: 'หนังสืออิเล็กทรอนิกส์อ่านออนไลน์',
    pathSegment: 'ebooks',
    icon: 'BookOpen',
    defaultOn: false,
  },
  {
    key: 'donation',
    label: 'ร่วมทำบุญ',
    description: 'รับบริจาคผ่าน PromptPay (ตั้งค่าบัญชีเพิ่มภายหลัง)',
    pathSegment: 'donation',
    icon: 'HandHeart',
    defaultOn: false,
  },
];

export type FeatureMap = Record<FeatureKey, boolean>;

/** Build a FeatureMap from each feature's `defaultOn` flag. */
function presetFromCatalog(): FeatureMap {
  return FEATURE_CATALOG.reduce((acc, f) => {
    acc[f.key] = f.defaultOn;
    return acc;
  }, {} as FeatureMap);
}

/**
 * Core-on preset seeded at tenant creation and used as the initial state of
 * the post-payment checklist (gallery, condolence, memory enabled).
 */
export const DEFAULT_FEATURES_ON_CREATE: FeatureMap = presetFromCatalog();

interface ThemeConfigShape {
  features?: Partial<Record<FeatureKey, unknown>>;
  announcement?: { active?: boolean | null } | null;
}

type TenantLike = { donationActive?: boolean | null } | null | undefined;

/**
 * Normalize a tenant's feature visibility into a complete FeatureMap.
 *
 * Accepts the raw Prisma `themeConfig` (a JSON value of any shape). Reads
 * `themeConfig.features[key]` when present; otherwise falls back to the
 * pre-`features`-map behavior so existing tenants keep their current menus:
 *  - announcement -> `themeConfig.announcement.active`
 *  - donation     -> `tenant.donationActive`
 *  - everything else -> `true` (previously always shown)
 */
export function getEnabledFeatures(
  themeConfig: unknown,
  tenant?: TenantLike
): FeatureMap {
  const cfg: ThemeConfigShape =
    themeConfig && typeof themeConfig === 'object' && !Array.isArray(themeConfig)
      ? (themeConfig as ThemeConfigShape)
      : {};
  const features = cfg.features;
  const read = (key: FeatureKey, fallback: boolean): boolean => {
    const v = features?.[key];
    return typeof v === 'boolean' ? v : fallback;
  };

  return {
    announcement: read('announcement', false) || !!cfg.announcement?.active,
    condolence: read('condolence', true),
    memory: read('memory', true),
    feed: read('feed', true),
    family: read('family', true),
    gallery: read('gallery', true),
    videos: read('videos', true),
    ebooks: read('ebooks', true),
    donation: read('donation', !!tenant?.donationActive),
  };
}

/** Coerce an arbitrary input into a complete, boolean-only FeatureMap. */
export function normalizeFeatureMap(input: unknown): FeatureMap {
  const src = (input ?? {}) as Partial<Record<FeatureKey, unknown>>;
  return FEATURE_CATALOG.reduce((acc, f) => {
    acc[f.key] = src[f.key] === true;
    return acc;
  }, {} as FeatureMap);
}
