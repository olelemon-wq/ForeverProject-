type GalleryMediaLike = {
  fileName?: string | null;
  filePath?: string | null;
  album?: string | null;
};

/** Announcement/custom cards should not appear in the public photo gallery. */
export function isAnnouncementCardMedia(
  media: GalleryMediaLike,
  themeConfig?: unknown
): boolean {
  const fileName = (media.fileName || '').toLowerCase();
  const filePath = (media.filePath || '').toLowerCase();

  if (
    fileName.startsWith('announcement-') ||
    fileName.startsWith('announcement-card-') ||
    filePath.includes('announcement-card-') ||
    filePath.includes('-announcement-')
  ) {
    return true;
  }

  const customCardUrl = (themeConfig as { announcement?: { customCardUrl?: string } } | null)
    ?.announcement?.customCardUrl;
  if (customCardUrl && media.filePath === customCardUrl) {
    return true;
  }

  return false;
}

export function filterGalleryMedia<T extends GalleryMediaLike>(
  medias: T[],
  themeConfig?: unknown
): T[] {
  return medias.filter((media) => !isAnnouncementCardMedia(media, themeConfig));
}
