/** Quote font names with spaces for CSS font-family. */
export function formatCssFontFamily(fontFamily?: string | null): string | undefined {
  if (!fontFamily) return undefined;
  return fontFamily.includes(' ') ? `"${fontFamily}"` : fontFamily;
}

/** Card font falls back to site theme font when not set separately. */
export function resolveCardFontFamily(
  cardFont?: string | null,
  siteFont?: string | null,
): string | undefined {
  return cardFont?.trim() || siteFont?.trim() || undefined;
}

export const SITE_FONT_OPTIONS = [
  'LINE Seed Sans TH',
  'Inter',
  'Sarabun',
  'Niramit',
] as const;

export const CARD_FONT_OPTIONS = [
  'LINE Seed Sans TH',
  'Inter',
  'Sarabun',
  'Niramit',
  'Charmonman',
  'Srisakdi',
  'Charm',
  'Thasadith',
] as const;
