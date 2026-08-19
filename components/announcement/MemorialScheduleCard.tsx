import {
  ExternalLink,
  Phone,
} from 'lucide-react';
import type { CSSProperties } from 'react';
import DeceasedAvatar from '@/app/(public)/[slug]/announcement/DeceasedAvatar';
import { CardVineBorders } from '@/components/announcement/CardVineBorder';
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

function splitInviteAroundName(inviteText: string, tenantName: string) {
  const nameMatch = tenantName.match(NAME_PREFIX);
  const deceasedName = (nameMatch ? nameMatch[2] : tenantName).trim();
  if (deceasedName && inviteText.includes(deceasedName)) {
    const index = inviteText.indexOf(deceasedName);
    return {
      beforeName: inviteText.slice(0, index).trim(),
      nameAndAfter: inviteText.slice(index).trim(),
    };
  }
  return { beforeName: inviteText.trim(), nameAndAfter: null as string | null };
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
  showPhoto?: boolean;
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
  showPhoto = true,
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
    dividerUrl,
    dividerOpacity = 0.92,
    dividerColor = '#171717',
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
  const inviteParts = splitInviteAroundName(tagline, tenantName);
  const vineBorderUrl = dividerUrl;
  const showAvatar = showPhoto && Boolean(avatarUrl);
  const resolvedFont = resolveCardFontFamily(fontFamily, siteFontFamily);
  const showGuidelines = Boolean(dressCode || contactPhone || showWreathPolicy);

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
        'relative flex min-h-full flex-col overflow-hidden rounded-3xl border-2 text-left transition-all duration-300',
        compact
          ? vineBorderUrl
            ? 'p-12'
            : 'p-5'
          : vineBorderUrl
            ? 'p-12 sm:p-14 md:p-16'
            : 'p-8 sm:p-10',
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

      {vineBorderUrl && (
        <CardVineBorders
          url={vineBorderUrl}
          color={dividerColor}
          opacity={dividerOpacity}
          compact={compact}
        />
      )}

      <div
        className={cn(
          'relative z-10 flex flex-1 flex-col max-sm:justify-start sm:justify-between',
          compact ? 'gap-3' : 'gap-5 sm:gap-6',
        )}
      >
        <header className={cn('text-center', compact ? 'space-y-2' : 'space-y-3')}>
          {showAvatar ? (
            <DeceasedAvatar
              avatarUrl={avatarUrl}
              avatarScale={avatarScale}
              avatarX={avatarX}
              avatarY={avatarY}
              avatarRotate={avatarRotate}
              imageCoordSpace={imageCoordSpace}
              tenantName={tenantName}
              primaryColor="var(--theme-primary, #a8a29e)"
              size={compact ? 'sm' : 'md'}
            />
          ) : null}

          <h2
            className={cn(
              'mx-auto max-w-md font-black tracking-tight',
              compact ? 'text-lg' : 'text-2xl sm:text-3xl',
            )}
            style={{ color: 'var(--theme-primary)' }}
          >
            {inviteParts.nameAndAfter ? (
              <>
                <span className="block">{inviteParts.beforeName}</span>
                <span className="block">{inviteParts.nameAndAfter}</span>
              </>
            ) : (
              inviteParts.beforeName
            )}
          </h2>
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

        {mapLink ? (
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
        ) : null}

        {showGuidelines && (
          <div className="space-y-3 text-xs">
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
        )}

        <footer className={cn('border-t text-center', compact ? 'pt-3' : 'pt-4', footerBorderClass || 'border-stone-200/50')}>
          <p className={cn('font-medium leading-relaxed', compact ? 'text-xs' : 'text-xs', textMutedClass)}>
            {labels.footerText}
          </p>
        </footer>
      </div>
    </section>
  );
}
