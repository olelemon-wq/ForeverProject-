export interface CoupleMilestone {
  id: string;
  title: string;
  date: string;
  time?: string;
  place?: string;
  note?: string;
  mapLink?: string;
}

export function createCoupleMilestoneId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function emptyCoupleMilestone(): CoupleMilestone {
  return {
    id: createCoupleMilestoneId(),
    title: '',
    date: '',
    time: '',
    place: '',
    note: '',
    mapLink: '',
  };
}

export function parseCoupleMilestones(
  ann: Record<string, unknown> | null | undefined
): CoupleMilestone[] {
  if (!ann) return [emptyCoupleMilestone()];

  const raw = ann.milestones;
  if (Array.isArray(raw) && raw.length > 0) {
    return raw.map((item, index) => {
      const m = item as Record<string, unknown>;
      return {
        id: String(m.id || `m-${index}`),
        title: String(m.title || ''),
        date: String(m.date || ''),
        time: String(m.time || ''),
        place: String(m.place || ''),
        note: String(m.note || ''),
        mapLink: String(m.mapLink || ''),
      };
    });
  }

  if (ann.waterDate || ann.waterTime) {
    const place = [ann.templeName, ann.pavilion].filter(Boolean).join(' · ');
    return [
      {
        id: 'legacy-0',
        title: 'วันสำคัญ / ครบรอบ',
        date: String(ann.waterDate || ''),
        time: String(ann.waterTime || ''),
        place,
        note: String(ann.dressCode || ''),
        mapLink: String(ann.mapLink || ''),
      },
    ];
  }

  return [emptyCoupleMilestone()];
}

export function coupleMilestonesForSave(milestones: CoupleMilestone[]): CoupleMilestone[] {
  return milestones
    .filter(
      (m) =>
        m.title.trim() ||
        m.date.trim() ||
        m.time?.trim() ||
        m.place?.trim() ||
        m.note?.trim() ||
        m.mapLink?.trim()
    )
    .map((m) => ({
      id: m.id || createCoupleMilestoneId(),
      title: m.title.trim(),
      date: m.date.trim(),
      ...(m.time?.trim() ? { time: m.time.trim() } : {}),
      ...(m.place?.trim() ? { place: m.place.trim() } : {}),
      ...(m.note?.trim() ? { note: m.note.trim() } : {}),
      ...(m.mapLink?.trim() ? { mapLink: m.mapLink.trim() } : {}),
    }));
}

export function hasVisibleCoupleMilestones(
  ann: Record<string, unknown> | null | undefined
): boolean {
  if (!ann) return false;
  if (Array.isArray(ann.milestones) && ann.milestones.length > 0) {
    return coupleMilestonesForSave(ann.milestones as CoupleMilestone[]).length > 0;
  }
  return !!(ann.waterDate || ann.waterTime);
}

export function getCoupleMilestonesFromAnnouncement(
  ann: Record<string, unknown> | null | undefined
): CoupleMilestone[] {
  return coupleMilestonesForSave(parseCoupleMilestones(ann));
}
