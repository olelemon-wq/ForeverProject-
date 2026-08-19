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
  | 'activities'
  | 'donation';

/** Categories that may enable the activities feature. */
export const ACTIVITY_ELIGIBLE_CATEGORIES = [
  'Memorial',
  'Family Legacy',
  'Friends',
  'Couple',
  'Wedding',
  'Pet Memorial',
] as const;

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
    key: 'activities',
    label: 'กิจกรรม',
    description: 'งานประจำปี งานทำบุญ หรือสิ่งที่ลูกหลานจัดสืบต่อ',
    pathSegment: 'activities',
    icon: 'CalendarDays',
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

/** Default nav/manage order — mirrors FEATURE_CATALOG. */
export const DEFAULT_FEATURE_ORDER: FeatureKey[] = FEATURE_CATALOG.map((f) => f.key);

export interface PublicNavItem {
  key: FeatureKey | 'home';
  title: string;
  href: string;
}

/** Features hidden from manage UI and the public site until a future release. */
export const PHASE_HIDDEN_FEATURES: readonly FeatureKey[] = ['feed'];

export function isPhaseHiddenFeature(key: FeatureKey): boolean {
  return PHASE_HIDDEN_FEATURES.includes(key);
}

/** Force phase-hidden features off while keeping the rest of the map intact. */
export function applyPhaseFeatureConstraints(map: FeatureMap): FeatureMap {
  const next = { ...map };
  for (const key of PHASE_HIDDEN_FEATURES) {
    next[key] = false;
  }
  return next;
}

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
  featureOrder?: unknown;
  announcement?: { active?: boolean | null } | null;
}

type TenantLike = { donationActive?: boolean | null; category?: string | null } | null | undefined;

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

  const activitiesEligible = ACTIVITY_ELIGIBLE_CATEGORIES.includes(
    tenant?.category as (typeof ACTIVITY_ELIGIBLE_CATEGORIES)[number],
  );

  return applyPhaseFeatureConstraints({
    announcement: read('announcement', false) || !!cfg.announcement?.active,
    condolence: read('condolence', true),
    memory: read('memory', true),
    feed: read('feed', true),
    family: read('family', true),
    gallery: read('gallery', true),
    videos: read('videos', true),
    ebooks:
      tenant?.category === 'Pet Memorial'
        ? false
        : read('ebooks', true),
    activities: activitiesEligible ? read('activities', false) : false,
    donation: read('donation', !!tenant?.donationActive),
  });
}

/** Coerce an arbitrary input into a complete, boolean-only FeatureMap. */
export function normalizeFeatureMap(input: unknown): FeatureMap {
  const src = (input ?? {}) as Partial<Record<FeatureKey, unknown>>;
  return applyPhaseFeatureConstraints(
    FEATURE_CATALOG.reduce((acc, f) => {
      acc[f.key] = src[f.key] === true;
      return acc;
    }, {} as FeatureMap)
  );
}

/** Merge saved order with catalog defaults; unknown keys are dropped. */
export function normalizeFeatureOrder(
  input: unknown,
  allowedKeys?: readonly FeatureKey[],
): FeatureKey[] {
  const allowed =
    allowedKeys ??
    FEATURE_CATALOG.map((f) => f.key).filter((key) => !isPhaseHiddenFeature(key));
  const allowedSet = new Set<FeatureKey>(allowed);

  const fromInput = Array.isArray(input)
    ? input.filter(
        (key): key is FeatureKey =>
          typeof key === 'string' && allowedSet.has(key as FeatureKey),
      )
    : [];

  const seen = new Set<FeatureKey>(fromInput);
  const remainder = DEFAULT_FEATURE_ORDER.filter(
    (key) => allowedSet.has(key) && !seen.has(key),
  );

  return [...fromInput, ...remainder];
}

export function getFeatureOrderFromThemeConfig(
  themeConfig: unknown,
  allowedKeys?: readonly FeatureKey[],
): FeatureKey[] {
  const cfg: ThemeConfigShape =
    themeConfig && typeof themeConfig === 'object' && !Array.isArray(themeConfig)
      ? (themeConfig as ThemeConfigShape)
      : {};

  return normalizeFeatureOrder(cfg.featureOrder, allowedKeys);
}

/** Build public nav items (home first) from enabled features and saved order. */
export function buildPublicNavItems(options: {
  slug: string;
  enabledFeatures: FeatureMap;
  featureOrder: FeatureKey[];
  labelFor: (key: FeatureKey, defaultLabel: string) => string;
}): PublicNavItem[] {
  const { slug, enabledFeatures, featureOrder, labelFor } = options;
  const catalogByKey = Object.fromEntries(
    FEATURE_CATALOG.map((feature) => [feature.key, feature]),
  ) as Record<FeatureKey, FeatureDef>;

  const items: PublicNavItem[] = [
    { key: 'home', title: 'หน้าแรก', href: `/${slug}` },
  ];

  for (const key of featureOrder) {
    if (isPhaseHiddenFeature(key) || !enabledFeatures[key]) continue;

    const feature = catalogByKey[key];
    if (!feature) continue;

    items.push({
      key,
      title: labelFor(key, feature.label),
      href: `/${slug}/${feature.pathSegment}`,
    });
  }

  return items;
}
