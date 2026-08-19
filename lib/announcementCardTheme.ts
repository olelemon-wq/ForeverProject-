import type { CSSProperties } from 'react';

export type AnnouncementStyle =
  | 'ELEGANT_WHITE'
  | 'WARM_CREAM'
  | 'CHARCOAL_SLATE'
  | 'THAI_TRADITIONAL'
  | string;

const themePrimary = 'var(--theme-primary, #e09f9f)';
const themeSecondary = 'var(--theme-secondary, #e6c1a8)';

const MEMORIAL_PATTERN = '/patterns/memorial-condolence-floral-right.jpg';
export const MEMORIAL_VINE_BORDER = '/patterns/memorial-vine-border.png';
const WEDDING_PATTERN = '/patterns/wedding-condolence-floral-right.jpg';
const PET_PATTERN = '/patterns/pet-condolence-floral-right.jpg';
const FRIENDS_PATTERN = '/patterns/friends-condolence-floral-right.jpg';

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

/** Timeline + section accents for ceremony / memorial schedule cards. */
export const ceremonySiteThemeVars = {
  '--ceremony-primary': 'var(--theme-primary, #a8a29e)',
  '--ceremony-secondary': 'var(--theme-secondary, #d6d3d1)',
  '--ceremony-line': 'color-mix(in srgb, var(--theme-primary, #a8a29e) 26%, transparent)',
  '--ceremony-border': 'color-mix(in srgb, var(--theme-primary, #a8a29e) 20%, transparent)',
  '--ceremony-soft': 'color-mix(in srgb, var(--theme-primary, #a8a29e) 9%, white)',
  '--ceremony-muted': 'color-mix(in srgb, var(--theme-primary, #a8a29e) 58%, #78716c)',
} as CSSProperties;

export const charcoalCeremonyThemeVars = {
  '--ceremony-primary': '#C2A878',
  '--ceremony-secondary': '#a89060',
  '--ceremony-line': 'rgba(194, 168, 120, 0.35)',
  '--ceremony-border': 'rgba(194, 168, 120, 0.28)',
  '--ceremony-soft': 'rgba(194, 168, 120, 0.12)',
  '--ceremony-muted': 'rgba(194, 168, 120, 0.78)',
} as CSSProperties;

export const thaiCeremonyThemeVars = {
  '--ceremony-primary': '#9A7B4F',
  '--ceremony-secondary': '#B8956A',
  '--ceremony-line': 'rgba(184, 149, 106, 0.34)',
  '--ceremony-border': 'rgba(184, 149, 106, 0.26)',
  '--ceremony-soft': 'rgba(184, 149, 106, 0.1)',
  '--ceremony-muted': 'rgba(122, 107, 82, 0.9)',
} as CSSProperties;

const CLASSIC_WHITE_INK = '#171717';

export const elegantWhiteCeremonyVars = {
  '--theme-primary': CLASSIC_WHITE_INK,
  '--theme-secondary': CLASSIC_WHITE_INK,
  '--ceremony-primary': CLASSIC_WHITE_INK,
  '--ceremony-secondary': CLASSIC_WHITE_INK,
  '--ceremony-line': 'rgba(23, 23, 23, 0.2)',
  '--ceremony-border': 'rgba(23, 23, 23, 0.28)',
  '--ceremony-soft': 'rgba(23, 23, 23, 0.05)',
  '--ceremony-muted': CLASSIC_WHITE_INK,
} as CSSProperties;

const VINE_BORDER_CATEGORIES = new Set(['Memorial', 'Family', 'Family Legacy']);

export function getAnnouncementPatternUrl(category: string): string | undefined {
  if (category === 'Couple' || category === 'Wedding') return WEDDING_PATTERN;
  if (category === 'Pet Memorial') return PET_PATTERN;
  if (category === 'Friends') return FRIENDS_PATTERN;
  if (category === 'Family' || category === 'Family Legacy') return MEMORIAL_PATTERN;
  return MEMORIAL_PATTERN;
}

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
  /** Subtle floral strip — omitted for dark charcoal memorial texture cards */
  patternUrl?: string;
  patternOpacityMobile?: number;
  patternOpacityDesktop?: number;
  patternMasked?: boolean;
  patternMaskGradient?: string;
  patternMaxWidthMobile?: number;
  patternMaxWidthDesktop?: number;
  patternWidthMobile?: string;
  patternWidthDesktop?: string;
  patternHeight?: string;
  patternFit?: 'cover' | 'contain';
  cardShadowClass?: string;
  footerBorderClass?: string;
  showCornerOrnaments?: boolean;
  ceremonyThemeVars?: CSSProperties;
  /** Full-bleed texture opacity (charcoal lotus cards) */
  bgImageOpacity?: number;
  /** Corner treatment: subtle ring vs Thai horizontal dividers */
  ornamentStyle?: 'ring' | 'thai-horizontal';
  /** Top/bottom divider strip (Thai Classic) */
  dividerUrl?: string;
  dividerOpacity?: number;
  dividerColor?: string;
  /** Charcoal lotus texture tinted gold on cream (Thai Classic) */
  lotusGoldPattern?: boolean;
  lotusGoldImageUrl?: string;
  lotusGoldOpacity?: number;
}

const DEFAULT_THEME: AnnouncementCardTheme = {
  cardBgClass: 'bg-white border-neutral-200 text-black',
  textMutedClass: 'text-black',
  headingColorClass: 'text-black',
  innerCardBg: 'bg-white border-neutral-200',
  borderGoldClass: 'border-black/20',
  borderAccentClass: 'border-neutral-200',
  accentBadgeClass: 'bg-neutral-100 text-black',
  mapButtonClass: 'border-black bg-white text-black hover:bg-neutral-50',
  dotBgClass: 'bg-white',
  timelineLineClass: 'bg-black/20',
  hasBackgroundImage: false,
  bgImageUrl: '',
  patternUrl: undefined,
  cardShadowClass: 'shadow-[0_10px_36px_rgba(0,0,0,0.08)]',
  footerBorderClass: 'border-black/15',
  showCornerOrnaments: false,
  ceremonyThemeVars: elegantWhiteCeremonyVars,
  dividerUrl: MEMORIAL_VINE_BORDER,
  dividerOpacity: 0.92,
  dividerColor: CLASSIC_WHITE_INK,
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

function elegantWhiteForCategory(category: string): AnnouncementCardTheme {
  return withMilestoneAccents(
    {
      cardBgClass: 'bg-white border-neutral-200 text-black',
      textMutedClass: 'text-black',
      headingColorClass: 'text-black',
      innerCardBg: 'bg-white border-neutral-200',
      borderGoldClass: 'border-black/20',
      hasBackgroundImage: false,
      bgImageUrl: '',
      patternUrl: undefined,
      cardShadowClass: 'shadow-[0_10px_36px_rgba(0,0,0,0.08)]',
      footerBorderClass: 'border-black/15',
      showCornerOrnaments: false,
      ceremonyThemeVars: elegantWhiteCeremonyVars,
      dividerUrl: VINE_BORDER_CATEGORIES.has(category) ? MEMORIAL_VINE_BORDER : undefined,
      dividerOpacity: 0.92,
      dividerColor: CLASSIC_WHITE_INK,
    },
    {
      borderAccentClass: 'border-neutral-200',
      accentBadgeClass: 'bg-neutral-100 text-black',
      mapButtonClass: 'border-black bg-white text-black hover:bg-neutral-50',
      dotBgClass: 'bg-white',
      timelineLineClass: 'bg-black/20',
    },
  );
}

export function resolveAnnouncementCardTheme(
  category: string | undefined,
  style: AnnouncementStyle | undefined
): AnnouncementCardTheme {
  const cat = category || 'Memorial';

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
          showCornerOrnaments: false,
          ceremonyThemeVars: ceremonySiteThemeVars,
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
            'bg-[#1a2e26] border-[#3d5c4f] text-[#d4e8dc] shadow-[0_12px_40px_rgba(0,0,0,0.35)]',
          textMutedClass: 'text-[#9cb8aa]',
          headingColorClass: 'text-[#e8f4ec]',
          innerCardBg: 'bg-[#223830]/75 border-[#4a6b5c]/45',
          borderGoldClass: 'border-[#7fa892]/45',
          hasBackgroundImage: false,
          bgImageUrl: '',
          patternUrl: PET_PATTERN,
          patternOpacityMobile: 0.18,
          patternOpacityDesktop: 0.28,
          cardShadowClass: 'shadow-[0_12px_40px_rgba(0,0,0,0.35)]',
          footerBorderClass: 'border-[#3d5c4f]/55',
          showCornerOrnaments: true,
          ceremonyThemeVars: {
            '--ceremony-primary': '#9cb8aa',
            '--ceremony-secondary': '#7fa892',
            '--ceremony-line': 'rgba(127, 168, 146, 0.35)',
            '--ceremony-border': 'rgba(127, 168, 146, 0.28)',
            '--ceremony-soft': 'rgba(127, 168, 146, 0.14)',
            '--ceremony-muted': 'rgba(180, 205, 192, 0.85)',
          } as CSSProperties,
        },
        {
          borderAccentClass: 'border-[#4a6b5c]/45',
          accentBadgeClass: 'bg-[#2a4238]/80 text-[#d4e8dc]',
          mapButtonClass:
            'border-[#4a6b5c]/60 bg-[#223830]/50 text-[#d4e8dc] hover:bg-[#223830]/70',
          dotBgClass: 'bg-[#1a2e26]',
          timelineLineClass: 'bg-[#4a6b5c]/50',
        }
      );
    }

    if (category === 'Family Legacy') {
      return withMilestoneAccents(
        {
          cardBgClass:
            'bg-[#0D1F2D] border-[#2A445C] text-[#E0A96D] shadow-[0_12px_40px_rgba(0,0,0,0.42)]',
          textMutedClass: 'text-[#B5834C]',
          headingColorClass: 'text-[#E0A96D]',
          innerCardBg: 'bg-[#152E40]/72 border-[#2A445C]/45',
          borderGoldClass: 'border-[#E0A96D]/35',
          hasBackgroundImage: false,
          bgImageUrl: '',
          patternUrl: MEMORIAL_PATTERN,
          patternOpacityMobile: 0.16,
          patternOpacityDesktop: 0.26,
          cardShadowClass: 'shadow-[0_12px_40px_rgba(0,0,0,0.42)]',
          footerBorderClass: 'border-[#2A445C]/55',
          showCornerOrnaments: true,
          ceremonyThemeVars: {
            '--ceremony-primary': '#E0A96D',
            '--ceremony-secondary': '#B5834C',
            '--ceremony-line': 'rgba(224, 169, 109, 0.32)',
            '--ceremony-border': 'rgba(224, 169, 109, 0.24)',
            '--ceremony-soft': 'rgba(224, 169, 109, 0.1)',
            '--ceremony-muted': 'rgba(224, 169, 109, 0.78)',
          } as CSSProperties,
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
          showCornerOrnaments: false,
          ceremonyThemeVars: ceremonySiteThemeVars,
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
          'bg-[#1c1917] border-[#4a4034] text-[#E8D4B0] shadow-[0_14px_44px_rgba(0,0,0,0.45)]',
        textMutedClass: 'text-[#C2A878]/88',
        headingColorClass: 'text-[#E8D4B0]',
        innerCardBg: 'bg-[#1c1917]/35 border-[#C2A878]/18',
        borderGoldClass: 'border-[#C2A878]/45',
        hasBackgroundImage: true,
        bgImageUrl: '/Template-cards/charcoal_gold.png',
        bgImageOpacity: 0.34,
        patternUrl: undefined,
        cardShadowClass: 'shadow-[0_14px_44px_rgba(0,0,0,0.45)]',
        footerBorderClass: 'border-[#C2A878]/25',
        showCornerOrnaments: true,
        ceremonyThemeVars: charcoalCeremonyThemeVars,
      },
      {
        borderAccentClass: 'border-[#C2A878]/28',
        accentBadgeClass: 'bg-[#C2A878]/14 text-[#E8D4B0]',
        mapButtonClass:
          'border-[#C2A878]/35 bg-stone-900/55 text-[#E8D4B0] hover:bg-stone-900/75',
        dotBgClass: 'bg-stone-950',
        timelineLineClass: 'bg-[#C2A878]/32',
      }
    );
  }

  if (style === 'WARM_CREAM') {
    return withMilestoneAccents(
      {
        cardBgClass: 'bg-[#FAF6EE] border-[#EADFC9] text-[#4A3E29]',
        textMutedClass: 'text-[#7D6B4E]',
        headingColorClass: 'text-[#362C1A]',
        innerCardBg: 'bg-[#FFF9F0]/78 border-[#E5D7B7]/85',
        borderGoldClass: 'border-[#C2A878]/38',
        hasBackgroundImage: false,
        bgImageUrl: '',
        patternUrl: getAnnouncementPatternUrl(cat),
        patternOpacityMobile: 0.28,
        patternOpacityDesktop: 0.44,
        cardShadowClass: 'shadow-[0_10px_36px_rgba(160,140,100,0.12)]',
        footerBorderClass: 'border-[#E5D7B7]/70',
        showCornerOrnaments: true,
        ceremonyThemeVars: ceremonySiteThemeVars,
      },
      {
        borderAccentClass: 'border-[#E5D7B7]',
        accentBadgeClass: 'bg-[#F3EBD9]/85 text-[#362C1A]',
        mapButtonClass:
          'border-[#E5D7B7] bg-white/75 text-[#362C1A] hover:bg-white hover:text-[#2A2215]',
        dotBgClass: 'bg-[#FAF6EE]',
        timelineLineClass: 'bg-[#E5D7B7]',
      }
    );
  }

  if (style === 'THAI_TRADITIONAL') {
    // Hidden from UI — fallback until Thai Classic is redesigned
    return elegantWhiteForCategory(cat);
  }

  return elegantWhiteForCategory(cat);
}
