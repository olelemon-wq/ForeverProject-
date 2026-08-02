import type { CSSProperties } from 'react';

export type AnnouncementStyle = 'ELEGANT_WHITE' | 'WARM_CREAM' | 'CHARCOAL_SLATE' | string;

const themePrimary = 'var(--theme-primary, #e09f9f)';
const themeSecondary = 'var(--theme-secondary, #e6c1a8)';

/** Shared site-theme text colors for Couple announcement sections. */
export const coupleSiteTextStyles = {
  primary: { color: themePrimary } satisfies CSSProperties,
  secondary: { color: themeSecondary } satisfies CSSProperties,
  muted: {
    color: `color-mix(in srgb, ${themePrimary} 72%, #a8a29e)`,
  } satisfies CSSProperties,
  border: {
    borderColor: `color-mix(in srgb, ${themePrimary} 28%, transparent)`,
  } satisfies CSSProperties,
} as const;

export const coupleSiteThemeVars = {
  '--milestone-primary': themePrimary,
  '--milestone-secondary': themeSecondary,
  '--milestone-line': `color-mix(in srgb, ${themePrimary} 32%, transparent)`,
  '--milestone-border': `color-mix(in srgb, ${themePrimary} 28%, transparent)`,
  '--milestone-soft': `color-mix(in srgb, ${themePrimary} 12%, white)`,
  '--milestone-muted': `color-mix(in srgb, ${themePrimary} 72%, #a8a29e)`,
} as CSSProperties;

export interface AnnouncementCardTheme {
  cardBgClass: string;
  textMutedClass: string;
  headingColorClass: string;
  innerCardBg: string;
  borderGoldClass: string;
  borderAccentClass: string;
  accentBadgeClass: string;
  mapButtonClass: string;
  dotBgClass: string;
  timelineLineClass: string;
  hasBackgroundImage: boolean;
  bgImageUrl: string;
}

const DEFAULT_THEME: AnnouncementCardTheme = {
  cardBgClass: 'bg-white border-stone-200 text-stone-900',
  textMutedClass: 'text-stone-500',
  headingColorClass: 'text-stone-900',
  innerCardBg: 'bg-stone-50/60 border-stone-200/80',
  borderGoldClass: 'border-amber-600/30',
  borderAccentClass: 'border-stone-300/50',
  accentBadgeClass: 'bg-rose-100 text-rose-700',
  mapButtonClass:
    'border-stone-300/80 bg-white/70 text-stone-700 hover:bg-white hover:text-stone-900',
  dotBgClass: 'bg-white',
  timelineLineClass: 'bg-stone-300/55',
  hasBackgroundImage: false,
  bgImageUrl: '',
};

function withMilestoneAccents(
  theme: Omit<
    AnnouncementCardTheme,
    'borderAccentClass' | 'accentBadgeClass' | 'mapButtonClass' | 'dotBgClass' | 'timelineLineClass'
  >,
  accents: Pick<
    AnnouncementCardTheme,
    'borderAccentClass' | 'accentBadgeClass' | 'mapButtonClass' | 'dotBgClass' | 'timelineLineClass'
  >
): AnnouncementCardTheme {
  return { ...theme, ...accents };
}

export function resolveAnnouncementCardTheme(
  category: string | undefined,
  style: AnnouncementStyle | undefined
): AnnouncementCardTheme {
  if (style === 'CHARCOAL_SLATE') {
    if (category === 'Couple' || category === 'Wedding') {
      return withMilestoneAccents(
        {
          cardBgClass:
            category === 'Couple'
              ? 'bg-[#FFF6F0] border-[#EDD5C8] text-[#7A3D45] shadow-[0_10px_32px_rgba(237,213,200,0.35)]'
              : 'bg-[#FFF0F2] border-[#FBC5CD] text-[#8C3A4F] shadow-[0_10px_30px_rgba(251,197,205,0.3)]',
          textMutedClass: category === 'Couple' ? 'text-[#A66B62]' : 'text-[#A25F70]',
          headingColorClass: category === 'Couple' ? 'text-[#7A3D45]' : 'text-[#8C3A4F]',
          innerCardBg:
            category === 'Couple'
              ? 'bg-[#FFFBF7]/85 border-[#EDD5C8]/45'
              : 'bg-[#FFF5F6]/70 border-[#FBC5CD]/40',
          borderGoldClass: category === 'Couple' ? 'border-[#EDD5C8]/60' : 'border-[#FBC5CD]/60',
          hasBackgroundImage: false,
          bgImageUrl: '',
        },
        {
          borderAccentClass: category === 'Couple' ? 'border-[#EDD5C8]/45' : 'border-[#FBC5CD]/45',
          accentBadgeClass:
            category === 'Couple'
              ? 'bg-[#EDD5C8]/40 text-[#7A3D45]'
              : 'bg-[#FBC5CD]/45 text-[#8C3A4F]',
          mapButtonClass:
            category === 'Couple'
              ? 'border-[#EDD5C8]/60 bg-white/75 text-[#7A3D45] hover:bg-white hover:text-[#5F2D35]'
              : 'border-[#FBC5CD]/60 bg-white/70 text-[#8C3A4F] hover:bg-white hover:text-[#6F2D3E]',
          dotBgClass: category === 'Couple' ? 'bg-[#FFFBF7]' : 'bg-[#FFF5F6]',
          timelineLineClass: category === 'Couple' ? 'bg-[#EDD5C8]/55' : 'bg-[#FBC5CD]/55',
        }
      );
    }

    if (category === 'Pet Memorial') {
      return withMilestoneAccents(
        {
          cardBgClass:
            'bg-[#F2F6F3] border-[#C8D9CD] text-[#2C4A3E] shadow-[0_10px_30px_rgba(200,217,205,0.3)]',
          textMutedClass: 'text-[#4E7062]',
          headingColorClass: 'text-[#2C4A3E]',
          innerCardBg: 'bg-[#FAFDFB]/75 border-[#C8D9CD]/40',
          borderGoldClass: 'border-[#C8D9CD]/60',
          hasBackgroundImage: false,
          bgImageUrl: '',
        },
        {
          borderAccentClass: 'border-[#C8D9CD]/45',
          accentBadgeClass: 'bg-[#C8D9CD]/40 text-[#2C4A3E]',
          mapButtonClass:
            'border-[#C8D9CD]/60 bg-white/70 text-[#2C4A3E] hover:bg-white hover:text-[#1F332B]',
          dotBgClass: 'bg-[#FAFDFB]',
          timelineLineClass: 'bg-[#C8D9CD]/55',
        }
      );
    }

    if (category === 'Family Legacy') {
      return withMilestoneAccents(
        {
          cardBgClass:
            'bg-[#0D1F2D] border-[#2A445C] text-[#E0A96D] shadow-[0_10px_30px_rgba(0,0,0,0.4)]',
          textMutedClass: 'text-[#B5834C]',
          headingColorClass: 'text-[#E0A96D]',
          innerCardBg: 'bg-[#152E40]/65 border-[#2A445C]/40',
          borderGoldClass: 'border-[#2A445C]/60',
          hasBackgroundImage: false,
          bgImageUrl: '',
        },
        {
          borderAccentClass: 'border-[#2A445C]/50',
          accentBadgeClass: 'bg-[#2A445C]/55 text-[#E0A96D]',
          mapButtonClass:
            'border-[#2A445C]/60 bg-[#152E40]/40 text-[#E0A96D] hover:bg-[#152E40]/60',
          dotBgClass: 'bg-[#152E40]',
          timelineLineClass: 'bg-[#2A445C]/55',
        }
      );
    }

    if (category === 'Friends') {
      return withMilestoneAccents(
        {
          cardBgClass:
            'bg-[#EAF4F4] border-[#A8D1D1] text-[#1E4848] shadow-[0_10px_30px_rgba(168,209,209,0.3)]',
          textMutedClass: 'text-[#3E7D7D]',
          headingColorClass: 'text-[#1E4848]',
          innerCardBg: 'bg-[#F4FAFA]/75 border-[#A8D1D1]/40',
          borderGoldClass: 'border-[#A8D1D1]/60',
          hasBackgroundImage: false,
          bgImageUrl: '',
        },
        {
          borderAccentClass: 'border-[#A8D1D1]/45',
          accentBadgeClass: 'bg-[#A8D1D1]/40 text-[#1E4848]',
          mapButtonClass:
            'border-[#A8D1D1]/60 bg-white/70 text-[#1E4848] hover:bg-white hover:text-[#143333]',
          dotBgClass: 'bg-[#F4FAFA]',
          timelineLineClass: 'bg-[#A8D1D1]/55',
        }
      );
    }

    return withMilestoneAccents(
      {
        cardBgClass:
          'bg-stone-900 border-stone-800 text-[#C2A878] shadow-[0_10px_30px_rgba(0,0,0,0.4)]',
        textMutedClass: 'text-[#C2A878]/80',
        headingColorClass: 'text-[#C2A878]',
        innerCardBg: 'bg-stone-850/65 border-[#C2A878]/20',
        borderGoldClass: 'border-[#C2A878]/45',
        hasBackgroundImage: true,
        bgImageUrl: '/Template-cards/charcoal_gold.png',
      },
      {
        borderAccentClass: 'border-[#C2A878]/30',
        accentBadgeClass: 'bg-[#C2A878]/15 text-[#C2A878]',
        mapButtonClass:
          'border-[#C2A878]/35 bg-stone-900/50 text-[#C2A878] hover:bg-stone-900/70',
        dotBgClass: 'bg-stone-900',
        timelineLineClass: 'bg-[#C2A878]/35',
      }
    );
  }

  if (style === 'WARM_CREAM') {
    return withMilestoneAccents(
      {
        cardBgClass: 'bg-[#FAF6EE] border-[#EADFC9] text-[#4A3E29]',
        textMutedClass: 'text-[#7D6B4E]',
        headingColorClass: 'text-[#362C1A]',
        innerCardBg: 'bg-[#F3EBD9]/60 border-[#E5D7B7]',
        borderGoldClass: 'border-[#C2A878]/30',
        hasBackgroundImage: false,
        bgImageUrl: '',
      },
      {
        borderAccentClass: 'border-[#E5D7B7]',
        accentBadgeClass: 'bg-[#E5D7B7]/70 text-[#362C1A]',
        mapButtonClass:
          'border-[#E5D7B7] bg-white/70 text-[#362C1A] hover:bg-white hover:text-[#2A2215]',
        dotBgClass: 'bg-[#FAF6EE]',
        timelineLineClass: 'bg-[#E5D7B7]',
      }
    );
  }

  return { ...DEFAULT_THEME };
}
