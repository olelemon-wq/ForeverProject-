export type AnnouncementOrientation = 'portrait' | 'landscape';

const DUAL_ORIENTATION_CATEGORIES = new Set(['Memorial', 'Wedding']);

export function categorySupportsCardOrientation(category: string) {
  return DUAL_ORIENTATION_CATEGORIES.has(category);
}

export function normalizeAnnouncementOrientation(
  category: string,
  value: unknown,
): AnnouncementOrientation {
  if (!categorySupportsCardOrientation(category)) return 'portrait';
  return value === 'landscape' ? 'landscape' : 'portrait';
}

export function announcementFrameClass(
  orientation: AnnouncementOrientation,
  compact = false,
) {
  if (compact) {
    return orientation === 'landscape'
      ? 'w-full max-w-[300px] aspect-[4/3]'
      : 'w-full max-w-[188px] aspect-[3/4]';
  }
  return orientation === 'landscape'
    ? 'w-full max-w-xl max-sm:aspect-auto sm:aspect-[4/3]'
    : 'w-full max-w-md max-sm:aspect-auto sm:aspect-[3/4]';
}

export const ANNOUNCEMENT_FRAMED_CARD_CLASS =
  'max-w-none h-full w-full rounded-none border-0 shadow-none';

export function announcementShowsPhoto(value: unknown) {
  return value !== false;
}

export function announcementUploadHint(orientation: AnnouncementOrientation) {
  return orientation === 'landscape'
    ? { size: '1440 × 1080 px', ratio: '4:3' }
    : { size: '1080 × 1440 px', ratio: '3:4' };
}
