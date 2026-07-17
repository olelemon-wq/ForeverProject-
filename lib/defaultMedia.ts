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
  Friends: 'png',
  'Pet Memorial': 'png',
};

const AVATAR_LABELS = ['ชุด 1', 'ชุด 2', 'ชุด 3', 'ชุด 4'];
const COVER_LABELS = ['พื้นหลัง 1', 'พื้นหลัง 2', 'พื้นหลัง 3', 'พื้นหลัง 4'];

function buildItems(category: CategoryKey, kind: DefaultMediaKind): DefaultMediaItem[] {
  const folder = CATEGORY_FOLDER[category] || CATEGORY_FOLDER.Memorial;
  const ext = CATEGORY_EXT[category] || 'svg';
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

export function getDefaultMediaForCategory(
  category: string | null | undefined,
  kind: DefaultMediaKind
): DefaultMediaItem[] {
  const key = (category && category in CATEGORY_FOLDER
    ? category
    : 'Memorial') as CategoryKey;
  return buildItems(key, kind);
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
