/** Shared width for feature pages and home snippets — fills the public layout main column. */
export const FEATURE_CARD_CLASS = 'w-full';

/** Tailwind safelist anchor — keep these utilities in production CSS. */
export const FEATURE_CARD_TAILWIND_ANCHOR =
  'mx-auto w-full max-w-5xl max-w-3xl max-w-2xl' as const;

/** Narrower width for announcement invitation cards (wedding, memorial, friends meetup). */
export const ANNOUNCEMENT_CARD_CLASS = 'mx-auto w-full max-w-2xl';
