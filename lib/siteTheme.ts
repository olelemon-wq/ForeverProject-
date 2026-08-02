import type { CSSProperties } from 'react';
import { formatCssFontFamily } from '@/lib/themeFont';

export function getSiteThemeStyle(options: {
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
}): CSSProperties {
  const primaryColor = options.primaryColor || '#0d9488';
  const secondaryColor = options.secondaryColor || '#f59e0b';
  const themeFont = formatCssFontFamily(options.fontFamily);

  return {
    '--theme-primary': primaryColor,
    '--theme-secondary': secondaryColor,
    ...(themeFont
      ? {
          '--theme-font': themeFont,
          fontFamily: `${themeFont}, ui-sans-serif, system-ui, sans-serif`,
        }
      : {}),
  } as CSSProperties;
}
