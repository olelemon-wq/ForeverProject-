import { type ClassValue } from 'clsx';
import { cn } from '@/lib/utils';

/** Shared width for feature pages and home snippets. */
export const FEATURE_CARD_CLASS = 'feature-page-card';

/** Narrower width for announcement invitation cards. */
export const ANNOUNCEMENT_CARD_CLASS = 'announcement-page-card';

export function featurePageCardClass(...inputs: ClassValue[]) {
  return cn(FEATURE_CARD_CLASS, inputs);
}

export function announcementPageCardClass(...inputs: ClassValue[]) {
  return cn(ANNOUNCEMENT_CARD_CLASS, inputs);
}
