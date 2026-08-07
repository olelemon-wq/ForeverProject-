export type CondolenceSectionCategory = string;

export type CondolenceSectionTheme = {
  /** Soft floral strips along section edges */
  patternUrl?: string;
  /** White wash so text stays readable over pattern */
  overlayClass: string;
  borderClass: string;
  surfaceClass: string;
};

const WEDDING_PATTERN = '/patterns/wedding-condolence-floral-right.jpg';
const MEMORIAL_PATTERN = '/patterns/memorial-condolence-floral-right.jpg';
const FRIENDS_PATTERN = '/patterns/friends-condolence-floral-right.jpg';
const PET_PATTERN = '/patterns/pet-condolence-floral-right.jpg';
const FAMILY_LEGACY_PATTERN = '/patterns/family-legacy-branch-right.jpg';

/** Category-specific condolence section decoration. */
export function getCondolenceSectionTheme(
  category: CondolenceSectionCategory,
): CondolenceSectionTheme {
  if (category === 'Couple') {
    return {
      patternUrl: WEDDING_PATTERN,
      overlayClass: 'bg-white/78',
      borderClass: 'border-[#EDD5C8]/80',
      surfaceClass: 'bg-[#FFF6F0]',
    };
  }

  if (category === 'Wedding') {
    return {
      patternUrl: WEDDING_PATTERN,
      overlayClass: 'bg-white/78',
      borderClass: 'border-rose-100/80',
      surfaceClass: 'bg-[#fffcfa]',
    };
  }

  if (category === 'Memorial') {
    return {
      patternUrl: MEMORIAL_PATTERN,
      overlayClass: 'bg-white/82',
      borderClass: 'border-stone-200/70',
      surfaceClass: 'bg-[#faf9f7]',
    };
  }

  if (category === 'Friends') {
    return {
      patternUrl: FRIENDS_PATTERN,
      overlayClass: 'bg-white/80',
      borderClass: 'border-sky-100/70',
      surfaceClass: 'bg-[#fbfcff]',
    };
  }

  if (category === 'Pet Memorial') {
    return {
      patternUrl: PET_PATTERN,
      overlayClass: 'bg-white/80',
      borderClass: 'border-emerald-100/60',
      surfaceClass: 'bg-[#fbfdfb]',
    };
  }

  if (category === 'Family Legacy') {
    return {
      patternUrl: FAMILY_LEGACY_PATTERN,
      overlayClass: 'bg-white/82',
      borderClass: 'border-sky-100/75',
      surfaceClass: 'bg-[#f7f9fb]',
    };
  }

  return {
    overlayClass: 'bg-white',
    borderClass: 'border-stone-200/80',
    surfaceClass: 'bg-white',
  };
}

export function hasCondolenceSectionPattern(category: CondolenceSectionCategory): boolean {
  return Boolean(getCondolenceSectionTheme(category).patternUrl);
}

/** @deprecated Use getCondolenceSectionTheme */
export const getCondolenceCardTheme = getCondolenceSectionTheme;

/** @deprecated Use hasCondolenceSectionPattern */
export const hasCondolenceCardPattern = hasCondolenceSectionPattern;
