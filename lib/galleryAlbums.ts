/** Albums that contain at least one photo in the public gallery. */
export function getPhotoGalleryAlbums(
  albums: string[],
  photoMediaIds: string[],
  mediaAlbums: Record<string, string>,
): string[] {
  const photoIdSet = new Set(photoMediaIds);
  return albums.filter((name) =>
    Object.entries(mediaAlbums).some(
      ([mediaId, albumName]) => albumName === name && photoIdSet.has(mediaId),
    ),
  );
}

/** Remove gallery albums that only exist for videos (no photo assignments). */
export function prunePhotoGalleryAlbums(
  albums: string[],
  photoMedias: Array<{ id: string }>,
  mediaAlbums: Record<string, string>,
): { albums: string[]; mediaAlbums: Record<string, string> } {
  const keptAlbums = getPhotoGalleryAlbums(
    albums,
    photoMedias.map((m) => m.id),
    mediaAlbums,
  );
  return { albums: keptAlbums, mediaAlbums };
}
