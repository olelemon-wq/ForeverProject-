import {
  ExternalLink,
  Info,
  MapPin,
  Phone,
} from 'lucide-react';
import type { CSSProperties } from 'react';
import DeceasedAvatar from '@/app/(public)/[slug]/announcement/DeceasedAvatar';
import CeremonyScheduleTimeline, { CardFloralPattern } from '@/components/announcement/CeremonyScheduleTimeline';
import { LotusGoldSidePattern } from '@/components/announcement/LotusGoldSidePattern';
import type { AnnouncementCardTheme } from '@/lib/announcementCardTheme';
import {
  buildCeremonyScheduleItems,
  type CeremonyScheduleLabels,
} from '@/lib/announcementSchedule';
import { ANNOUNCEMENT_CARD_CLASS } from '@/lib/publicLayout';
import { resolveCardFontFamily } from '@/lib/themeFont';
import { cn } from '@/lib/utils';

const NAME_PREFIX =
  /^(ด้วยรักและคิดถึง|ด้วยรักและอาลัย|ร่วมรำลึกถึง|รำลึกถึง|คิดถึง|อาลัยแด่)\s*(.*)$/;

function splitTenantName(tenantName: string) {
  const match = tenantName.match(NAME_PREFIX);
  if (!match) return { headline: tenantName, prefix: null as string | null, rest: null as string | null };
  return { headline: tenantName, prefix: match[1], rest: match[2] };
}

function renderInviteBody(
  inviteText: string | undefined,
  tenantName: string,
  textMutedClass: string,
) {
  if (!inviteText?.trim()) return null;

  const deceasedName = tenantName.replace(NAME_PREFIX, '');
  if (deceasedName && inviteText.includes(deceasedName)) {
    const index = inviteText.indexOf(deceasedName);
    const beforeName = inviteText.substring(0, index);
    const nameAndAfter = inviteText.substring(index);
    return (
      <p className={cn('mx-auto max-w-md text-sm leading-relaxed whitespace-pre-line', textMutedClass)}>
        {beforeName}
        <br className="hidden sm:inline" />
        {nameAndAfter}
      </p>
    );
  }

  return (
    <p className={cn('mx-auto max-w-md text-sm leading-relaxed whitespace-pre-line', textMutedClass)}>
      {inviteText}
    </p>
  );
}

export type MemorialScheduleCardLabels = CeremonyScheduleLabels & {
  venueTitle: string;
  venueLabel: string;
  venueDesc: string;
  guidelinesTitle: string;
  contactLabel: string;
  notesLabel?: string;
  footerText: string;
};

export type MemorialScheduleCardProps = {
  category: string;
  tenantName: string;
  inviteText?: string;
  inviteFallback: string;
  labels: MemorialScheduleCardLabels;
  theme: AnnouncementCardTheme;
  fontFamily?: string;
  siteFontFamily?: string;
  avatarUrl?: string | null;
  avatarScale?: number;
  avatarX?: number;
  avatarY?: number;
  avatarRotate?: number;
  imageCoordSpace?: string | null;
  waterDate?: string;
  waterTime?: string;
  abhidhammaDateRange?: string;
  abhidhammaTime?: string;
  cremationDate?: string;
  cremationTime?: string;
  templeName?: string;
  pavilion?: string;
  mapLink?: string;
  dressCode?: string;
  contactPhone?: string;
  wreathPolicy?: string;
  wreathPolicies?: Record<string, string>;
  showWreathPolicy?: boolean;
  isWedding?: boolean;
  compact?: boolean;
  className?: string;
  sectionClassName?: string;
};

export default function MemorialScheduleCard({
  category,
  tenantName,
  inviteText,
  inviteFallback,
  labels,
  theme,
  fontFamily,
  siteFontFamily,
  avatarUrl,
  avatarScale,
  avatarX,
  avatarY,
  avatarRotate,
  imageCoordSpace,
  waterDate,
  waterTime,
  abhidhammaDateRange,
  abhidhammaTime,
  cremationDate,
  cremationTime,
  templeName,
  pavilion,
  mapLink,
  dressCode,
  contactPhone,
  wreathPolicy,
  wreathPolicies,
  showWreathPolicy = false,
  isWedding = false,
  compact = false,
  className,
  sectionClassName,
}: MemorialScheduleCardProps) {
  const {
    cardBgClass,
    textMutedClass,
    headingColorClass,
    innerCardBg,
    borderGoldClass,
    hasBackgroundImage,
    bgImageUrl,
    patternUrl,
    patternOpacityMobile = 0.14,
    patternOpacityDesktop = 0.22,
    patternMasked = true,
    patternMaskGradient,
    patternMaxWidthMobile,
    patternMaxWidthDesktop,
    patternWidthMobile,
    patternWidthDesktop,
    patternHeight,
    patternFit,
    cardShadowClass,
    footerBorderClass,
    showCornerOrnaments,
    lotusGoldPattern,
    lotusGoldImageUrl,
    lotusGoldOpacity = 0.5,
    ceremonyThemeVars,
    bgImageOpacity = 0.4,
  } = theme;

  const scheduleItems = buildCeremonyScheduleItems(category, labels, {
    waterDate,
    waterTime,
    abhidhammaDateRange,
    abhidhammaTime,
    cremationDate,
    cremationTime,
  });

  const tagline = inviteText?.trim() || inviteFallback;
  const nameParts = splitTenantName(tenantName);
  const resolvedFont = resolveCardFontFamily(fontFamily, siteFontFamily);
  const showGuidelines = Boolean(dressCode || contactPhone || showWreathPolicy);
  const showVenue = Boolean(templeName || pavilion);

  const cardStyles: CSSProperties = {
    fontFamily: resolvedFont
      ? `${resolvedFont}, ui-sans-serif, system-ui, sans-serif`
      : 'var(--theme-font), ui-sans-serif, system-ui, sans-serif',
    ...(ceremonyThemeVars || {}),
  };

  return (
    <section
      id="announcement-card"
      className={cn(
        ANNOUNCEMENT_CARD_CLASS,
        'relative overflow-hidden rounded-3xl border-2 text-left transition-all duration-300',
        compact ? 'p-6' : 'p-8 sm:p-10',
        cardShadowClass || 'shadow-md',
        cardBgClass,
        sectionClassName,
        className,
      )}
      style={cardStyles}
    >
      {patternUrl && !hasBackgroundImage && (
        <CardFloralPattern
          patternUrl={patternUrl}
          opacityMobile={patternOpacityMobile}
          opacityDesktop={patternOpacityDesktop}
          masked={patternMasked}
          maskGradient={patternMaskGradient}
          maxWidthMobile={patternMaxWidthMobile}
          maxWidthDesktop={patternMaxWidthDesktop}
          widthMobile={patternWidthMobile}
          widthDesktop={patternWidthDesktop}
          height={patternHeight}
          fit={patternFit}
        />
      )}

      {hasBackgroundImage && bgImageUrl && (
        <>
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `url(${bgImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: bgImageOpacity,
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(105deg, rgba(28,25,23,0.88) 0%, rgba(28,25,23,0.62) 45%, rgba(28,25,23,0.38) 100%)',
            }}
            aria-hidden
          />
        </>
      )}

      {lotusGoldPattern && lotusGoldImageUrl && (
        <LotusGoldSidePattern imageUrl={lotusGoldImageUrl} opacity={lotusGoldOpacity} />
      )}

      {showCornerOrnaments && (
        <div
          className={cn(
            'pointer-events-none absolute inset-3 rounded-[1.2rem] border opacity-20',
            borderGoldClass,
          )}
          aria-hidden
        />
      )}

      <div className={cn('relative z-10 space-y-5', compact ? 'space-y-4' : 'sm:space-y-6')}>
        <header className={cn('space-y-3 text-center', compact ? 'pr-0' : 'pr-2 sm:pr-4')}>
          <span
            className={cn(
              'block font-semibold uppercase tracking-[0.18em]',
              compact ? 'text-xs' : 'text-xs',
              textMutedClass,
            )}
          >
            {tagline}
          </span>

          <DeceasedAvatar
            avatarUrl={avatarUrl}
            avatarScale={avatarScale}
            avatarX={avatarX}
            avatarY={avatarY}
            avatarRotate={avatarRotate}
            imageCoordSpace={imageCoordSpace}
            tenantName={tenantName}
            primaryColor="var(--theme-primary, #a8a29e)"
          />

          <div className="space-y-1.5">
            <h2
              className={cn(
                'font-black tracking-tight',
                compact ? 'text-xl' : 'text-2xl sm:text-[1.75rem]',
              )}
              style={{ color: 'var(--theme-primary)' }}
            >
              {nameParts.prefix ? (
                <>
                  <span className="block sm:inline">{nameParts.prefix}</span>
                  <span className="hidden sm:inline"> </span>
                  <span className="block sm:inline">{nameParts.rest}</span>
                </>
              ) : (
                nameParts.headline
              )}
            </h2>
            {inviteText?.trim() && inviteText.trim() !== tagline
              && renderInviteBody(inviteText, tenantName, textMutedClass)}
          </div>
        </header>

        {scheduleItems.length > 0 && (
          <>
            <hr className={cn('border-t', borderGoldClass)} />
            <CeremonyScheduleTimeline
              items={scheduleItems}
              title={labels.title}
              innerCardBg={innerCardBg}
              compact={compact}
            />
          </>
        )}

        {showVenue && (
          <div className="space-y-3">
            <h3
              className={cn(
                'flex items-center gap-1.5 font-black uppercase tracking-wider',
                compact ? 'text-xs' : 'text-xs',
                headingColorClass,
              )}
            >
              <MapPin className="size-4 shrink-0" aria-hidden />
              <span>{labels.venueTitle}</span>
            </h3>

            <div className="space-y-2.5">
              <div className="min-w-0">
                <h4
                  className={cn(
                    'font-bold leading-snug break-words',
                    compact ? 'text-xs' : 'text-sm',
                    headingColorClass,
                  )}
                >
                  {templeName || labels.venueLabel}
                  {pavilion ? ` (${pavilion})` : ''}
                </h4>
                <p
                  className={cn(
                    'mt-1 leading-relaxed break-words',
                    compact ? 'text-xs' : 'text-xs',
                    textMutedClass,
                  )}
                >
                  {labels.venueDesc}
                </p>
              </div>
              {mapLink && (
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex w-auto items-center justify-center gap-1.5 rounded-xl border bg-[color:var(--theme-primary)]/6 border-[color:var(--theme-primary)]/30 font-bold text-[color:var(--theme-primary)] transition hover:bg-[color:var(--theme-primary)]/10 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--theme-primary)]/25 print:hidden',
                    compact ? 'px-3 py-2 text-xs' : 'px-4 py-2.5 text-xs',
                  )}
                >
                  <ExternalLink className="size-3.5" aria-hidden />
                  <span>เปิด Google Maps นำทาง</span>
                </a>
              )}
            </div>
          </div>
        )}

        {showGuidelines && (
          <div className="space-y-3">
            <h3
              className={cn(
                'flex items-center gap-1.5 font-black uppercase tracking-wider',
                compact ? 'text-xs' : 'text-xs',
                headingColorClass,
              )}
            >
              <Info className="size-4 shrink-0" aria-hidden />
              <span>{labels.guidelinesTitle}</span>
            </h3>

            <div className={cn('space-y-3', compact ? 'text-xs' : 'text-xs')}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {dressCode && (
                  <div className="flex flex-col gap-0.5">
                    <span className={cn('font-bold', headingColorClass)}>
                      {isWedding ? 'การแต่งกาย:' : labels.notesLabel || 'โน้ต / รายละเอียด:'}
                    </span>
                    <span className={textMutedClass}>{dressCode}</span>
                  </div>
                )}
                {showWreathPolicy && wreathPolicy && wreathPolicies && (
                  <div className="flex flex-col gap-0.5">
                    <span className={cn('font-bold', headingColorClass)}>
                      {isWedding ? 'ของขวัญ / ซอง:' : 'นโยบายพวงหรีด:'}
                    </span>
                    <span className={textMutedClass}>
                      {wreathPolicies[wreathPolicy] || wreathPolicies.NORMAL}
                    </span>
                  </div>
                )}
              </div>
              {contactPhone && (
                <div className={cn('flex flex-wrap items-center gap-x-2 gap-y-1 border-t pt-3', footerBorderClass)}>
                  <Phone
                    className="size-3.5 shrink-0"
                    style={{ color: 'var(--theme-primary)' }}
                    aria-hidden
                  />
                  <span className={cn('shrink-0 font-bold', headingColorClass)}>
                    {labels.contactLabel}
                  </span>
                  <span className={textMutedClass}>{contactPhone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <footer className={cn('border-t pt-4 text-center', footerBorderClass || 'border-stone-200/50')}>
          <p className={cn('font-medium leading-relaxed', compact ? 'text-xs' : 'text-xs', textMutedClass)}>
            {labels.footerText}
          </p>
        </footer>
      </div>
    </section>
  );
}
