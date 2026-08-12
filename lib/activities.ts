export type ActivityRecord = {
  id: string;
  websiteId: string;
  title: string;
  description: string | null;
  images: string[];
  pdfUrl: string | null;
  eventDate: string | null;
  isRecurring: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export function normalizeActivityImages(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
}

export function normalizeActivityRow(row: {
  id: string;
  websiteId: string;
  title: string;
  description: string | null;
  images: unknown;
  pdfUrl: string | null;
  eventDate: Date | null;
  isRecurring: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}): ActivityRecord {
  return {
    id: row.id,
    websiteId: row.websiteId,
    title: row.title,
    description: row.description,
    images: normalizeActivityImages(row.images),
    pdfUrl: row.pdfUrl,
    eventDate: row.eventDate ? row.eventDate.toISOString() : null,
    isRecurring: row.isRecurring,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function formatActivityDate(iso: string | null, isRecurring: boolean): string | null {
  if (!iso) {
    return isRecurring ? 'จัดเป็นประจำ' : null;
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const formatted = date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return isRecurring ? `${formatted} (ประจำปี)` : formatted;
}
