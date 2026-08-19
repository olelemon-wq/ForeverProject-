import type { CategoryKey } from '@/lib/categories';

export type DefaultMediaKind = 'avatar' | 'cover';

export interface DefaultMediaItem {
  id: string;
  label: string;
  src: string;
}

const CATEGORY_FOLDER: Record<CategoryKey, string> = {
  Memorial: 'memorial',
  'Family Legacy': 'family-legacy',
  Couple: 'couple',
  Wedding: 'wedding',
  Friends: 'friends',
  'Pet Memorial': 'pet-memorial',
};

/** Categories with custom PNG presets; others keep SVG presets */
const CATEGORY_EXT: Partial<Record<CategoryKey, 'svg' | 'png' | 'jpg' | 'webp'>> = {
  Memorial: 'png',
  'Family Legacy': 'png',
  Wedding: 'png',
  Friends: 'png',
  'Pet Memorial': 'png',
};

/** Per-kind overrides when preset files use a non-default extension */
const CATEGORY_KIND_EXT: Partial<
  Record<CategoryKey, Partial<Record<DefaultMediaKind, 'svg' | 'png' | 'jpg' | 'webp'>>>
> = {
  Couple: { cover: 'png' },
  Wedding: { cover: 'jpg' },
  Friends: { cover: 'jpg' },
};

/** Legacy `.png` paths after gallery compression — map to on-disk `.jpg` presets */
const LEGACY_DEFAULT_MEDIA_SRC: Record<string, string> = {
  '/defaults/wedding/cover/1.png': '/defaults/wedding/cover/1.jpg',
  '/defaults/wedding/cover/2.png': '/defaults/wedding/cover/2.jpg',
  '/defaults/wedding/cover/3.png': '/defaults/wedding/cover/3.jpg',
  '/defaults/wedding/cover/4.png': '/defaults/wedding/cover/4.jpg',
  '/defaults/friends/cover/1.png': '/defaults/friends/cover/1.jpg',
  '/defaults/friends/cover/2.png': '/defaults/friends/cover/2.jpg',
  '/defaults/friends/cover/3.png': '/defaults/friends/cover/3.jpg',
  '/defaults/friends/cover/4.png': '/defaults/friends/cover/4.jpg',
  '/defaults/pet-memorial/cover/3.png': '/defaults/pet-memorial/cover/3.jpg',
};

export function resolveDefaultMediaSrc(src: string | null | undefined): string {
  if (!src) return '';
  return LEGACY_DEFAULT_MEDIA_SRC[src] ?? src;
}

const AVATAR_LABELS = ['ชุด 1', 'ชุด 2', 'ชุด 3', 'ชุด 4'];
const EXTRA_AVATAR_LABELS = Array.from({ length: 5 }, (_, i) => `ชุด ${i + 5}`);
const COVER_LABELS = ['พื้นหลัง 1', 'พื้นหลัง 2', 'พื้นหลัง 3', 'พื้นหลัง 4'];
const EXTRA_COVER_LABELS = Array.from({ length: 15 }, (_, i) => `พื้นหลัง ${i + 5}`);

export interface DefaultMediaGroup {
  title: string;
  items: DefaultMediaItem[];
}

function buildItems(category: CategoryKey, kind: DefaultMediaKind): DefaultMediaItem[] {
  const folder = CATEGORY_FOLDER[category] || CATEGORY_FOLDER.Memorial;
  const ext = CATEGORY_KIND_EXT[category]?.[kind] ?? CATEGORY_EXT[category] ?? 'svg';
  const labels = kind === 'avatar' ? AVATAR_LABELS : COVER_LABELS;
  return labels.map((label, i) => {
    const n = i + 1;
    return {
      id: `${folder}-${kind}-${n}`,
      label,
      src: `/defaults/${folder}/${kind}/${n}.${ext}`,
    };
  });
}

function buildExtraCovers(): DefaultMediaItem[] {
  return EXTRA_COVER_LABELS.map((label, i) => {
    const n = i + 5;
    return {
      id: `shared-cover-${n}`,
      label,
      src: `/defaults/shared/cover/${n}.svg`,
    };
  });
}

function buildExtraAvatars(category: CategoryKey): DefaultMediaItem[] {
  const folder = CATEGORY_FOLDER[category] || CATEGORY_FOLDER.Memorial;
  return EXTRA_AVATAR_LABELS.map((label, i) => {
    const n = i + 1;
    return {
      id: `${folder}-avatar-extra-${n}`,
      label,
      src: `/defaults/shared/avatar/${folder}/${n}.svg`,
    };
  });
}

export function getDefaultMediaForCategory(
  category: string | null | undefined,
  kind: DefaultMediaKind
): DefaultMediaItem[] {
  const key = (category && category in CATEGORY_FOLDER
    ? category
    : 'Memorial') as CategoryKey;
  const base = buildItems(key, kind);
  if (kind === 'avatar') return [...base, ...buildExtraAvatars(key)];
  return [...base, ...buildExtraCovers()];
}

export function getDefaultMediaGroups(
  category: string | null | undefined,
  kind: DefaultMediaKind
): DefaultMediaGroup[] {
  const key = (category && category in CATEGORY_FOLDER
    ? category
    : 'Memorial') as CategoryKey;
  const base = buildItems(key, kind);
  if (kind === 'avatar') {
    return [
      { title: 'หมวดนี้', items: base },
      { title: 'มีลวดลาย', items: buildExtraAvatars(key) },
    ];
  }
  return [
    { title: 'หมวดนี้', items: base },
    { title: 'มีลวดลาย', items: buildExtraCovers() },
  ];
}

/** First (or random) pair for seeding new sites */
export function getSeedDefaultMedia(
  category: string | null | undefined,
  options?: { random?: boolean }
): { avatarUrl: string; coverUrl: string } {
  const avatars = getDefaultMediaForCategory(category, 'avatar');
  const covers = getDefaultMediaForCategory(category, 'cover');
  const idx = options?.random
    ? Math.floor(Math.random() * Math.min(avatars.length, covers.length))
    : 0;
  return {
    avatarUrl: avatars[idx]?.src || avatars[0].src,
    coverUrl: covers[idx]?.src || covers[0].src,
  };
}

export function isDefaultMediaUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.startsWith('/defaults/');
}
