const TITLE_PREFIX =
  /^(ด้วยรักและคิดถึง|ด้วยรักและอาลัย|ร่วมรำลึกถึง|รำลึกถึง|คิดถึง|อาลัยแด่)\s+(.+)$/;

export function splitMemorialTitle(title: string): { prefix: string | null; name: string } {
  const trimmed = title.trim();
  const match = trimmed.match(TITLE_PREFIX);
  if (match) return { prefix: match[1], name: match[2].trim() };
  return { prefix: null, name: trimmed };
}

/** Keep given name + surname on one line (last two space-separated tokens). */
export function keepNameTogether(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length < 2) return name;
  return [...parts.slice(0, -2), parts.slice(-2).join('\u00A0')].join(' ');
}
