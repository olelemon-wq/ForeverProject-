import type { LucideIcon } from 'lucide-react';
import { BookOpen, Droplets, Flame, PartyPopper, Sparkles, TreePine } from 'lucide-react';

export type CeremonyScheduleItem = {
  id: string;
  title: string;
  date?: string;
  time?: string;
  icon: LucideIcon;
};

export type CeremonyScheduleLabels = {
  title: string;
  item1: string;
  item2: string;
  item3: string;
};

type AnnouncementScheduleInput = {
  waterDate?: string;
  waterTime?: string;
  abhidhammaDateRange?: string;
  abhidhammaTime?: string;
  cremationDate?: string;
  cremationTime?: string;
};

const memorialIcons = [Droplets, BookOpen, Flame] as const;
const weddingIcons = [Sparkles, PartyPopper, TreePine] as const;

function pickIcons(category: string): readonly LucideIcon[] {
  if (category === 'Wedding') return weddingIcons;
  if (category === 'Pet Memorial') return [Sparkles, Flame, Sparkles];
  if (category === 'Family' || category === 'Family Legacy') {
    return [TreePine, PartyPopper, BookOpen];
  }
  return memorialIcons;
}

function formatScheduleLine(date?: string, time?: string): string {
  const parts = [date?.trim(), time?.trim() ? `เวลา ${time.trim()}` : ''].filter(Boolean);
  return parts.join(' · ');
}

export function buildCeremonyScheduleItems(
  category: string,
  labels: CeremonyScheduleLabels,
  announcement: AnnouncementScheduleInput,
): CeremonyScheduleItem[] {
  const icons = pickIcons(category);
  const items: CeremonyScheduleItem[] = [];

  const push = (id: string, title: string, date?: string, time?: string, iconIndex = 0) => {
    const line = formatScheduleLine(date, time);
    if (!line) return;
    items.push({
      id,
      title,
      date: date?.trim() || undefined,
      time: time?.trim() || undefined,
      icon: icons[iconIndex] ?? icons[0],
    });
  };

  push('water', labels.item1, announcement.waterDate, announcement.waterTime, 0);
  push(
    'abhidhamma',
    labels.item2,
    announcement.abhidhammaDateRange,
    announcement.abhidhammaTime,
    1,
  );
  push('cremation', labels.item3, announcement.cremationDate, announcement.cremationTime, 2);

  return items;
}

export function formatCeremonyDisplayLine(item: CeremonyScheduleItem): string {
  return formatScheduleLine(item.date, item.time);
}

export function stripCeremonyItemNumber(title: string) {
  return title.replace(/^\d+\.\s*/, '').trim();
}
