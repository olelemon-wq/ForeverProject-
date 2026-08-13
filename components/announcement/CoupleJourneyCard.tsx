import {
  Clock,
  ExternalLink,
  Heart,
  Info,
  MapPin,
  Phone,
  Sparkles,
} from 'lucide-react';
import DeceasedAvatar from '@/app/(public)/[slug]/announcement/DeceasedAvatar';
import CoupleMilestoneList from '@/components/announcement/CoupleMilestoneList';
import type { AnnouncementCardTheme } from '@/lib/announcementCardTheme';
import { ANNOUNCEMENT_CARD_CLASS } from '@/lib/publicLayout';
import { coupleSiteThemeVars } from '@/lib/announcementCardTheme';
import type { CoupleMilestone } from '@/lib/coupleMilestones';
import {
  formatMilestoneTime,
  parseMilestoneDateDisplay,
  splitCoupleMilestonesForDisplay,
} from '@/lib/coupleMilestones';
import { cn } from '@/lib/utils';
import { resolveCardFontFamily } from '@/lib/themeFont';

const COUPLE_PATTERN = '/patterns/wedding-condolence-floral-right.jpg';

const PATTERN_MASK =
  'linear-gradient(to left, black 0%, black 28%, rgba(0,0,0,0.55) 52%, transparent 100%)';

export type CoupleJourneyCardProps = {
  tenantName: string;
  inviteText?: string;
  inviteFallback: string;
  footerText: string;
  theme: AnnouncementCardTheme;
  milestones: CoupleMilestone[];
  timelineTitle?: string;
  fontFamily?: string;
  siteFontFamily?: string;
  avatarUrl?: string | null;
  avatarScale?: number;
  avatarX?: number;
  avatarY?: number;
  avatarRotate?: number;
  imageCoordSpace?: string | null;
  notes?: string;
  contactPhone?: string;
  className?: string;
};

export default function CoupleJourneyCard({
  tenantName,
  inviteText,
  inviteFallback,
  footerText,
  theme,
  milestones,
  timelineTitle = 'เส้นทางที่ผ่านมา',
  fontFamily,
  siteFontFamily,
  avatarUrl,
  avatarScale,
  avatarX,
  avatarY,
  avatarRotate,
  imageCoordSpace,
  notes,
  contactPhone,
  className,
}: CoupleJourneyCardProps) {
  const { cardBgClass, textMutedClass, headingColorClass, innerCardBg } = theme;
  const { latest, earlier } = splitCoupleMilestonesForDisplay(milestones);
  const tagline = inviteText?.trim() || inviteFallback;
  const resolvedFont = resolveCardFontFamily(fontFamily, siteFontFamily);

  const latestDate = latest ? parseMilestoneDateDisplay(latest.date) : null;
  const latestTime = latest ? formatMilestoneTime(latest.time) : null;

  return (
    <section
      id="announcement-card"
      className={cn(
        ANNOUNCEMENT_CARD_CLASS,
        'relative overflow-hidden rounded-3xl border p-6 text-left shadow-[0_10px_32px_rgba(122,61,69,0.08)] transition-all duration-300 sm:p-8',
        cardBgClass,
        className,
      )}
      style={{
        fontFamily: resolvedFont
          ? `${resolvedFont}, ui-sans-serif, system-ui, sans-serif`
          : 'var(--theme-font), ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden sm:hidden"
        style={{ opacity: 0.26 }}
        aria-hidden
      >
        <img
          src={COUPLE_PATTERN}
          alt=""
          className="absolute inset-y-0 right-0 h-full w-[34%] max-w-[148px] object-cover object-right-bottom"
          style={{ WebkitMaskImage: PATTERN_MASK, maskImage: PATTERN_MASK }}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 hidden overflow-hidden sm:block"
        style={{ opacity: 0.38 }}
        aria-hidden
      >
        <img
          src={COUPLE_PATTERN}
          alt=""
          className="absolute inset-y-0 right-0 h-full w-[36%] max-w-[168px] object-cover object-right-bottom"
          style={{ WebkitMaskImage: PATTERN_MASK, maskImage: PATTERN_MASK }}
        />
      </div>

      <div className="relative z-10 space-y-5">
        <header className="space-y-3 pr-2 text-center sm:pr-4">
          <DeceasedAvatar
            avatarUrl={avatarUrl}
            avatarScale={avatarScale}
            avatarX={avatarX}
            avatarY={avatarY}
            avatarRotate={avatarRotate}
            imageCoordSpace={imageCoordSpace}
            tenantName={tenantName}
            primaryColor="var(--theme-primary, #c9a0a8)"
          />
          <div className="space-y-1.5">
            <h2
              className="text-2xl font-black tracking-tight sm:text-[1.65rem]"
              style={{ color: 'var(--theme-primary, #c9a0a8)' }}
            >
              {tenantName}
            </h2>
            <p className={cn('mx-auto max-w-md text-sm leading-relaxed', textMutedClass)}>
              {tagline}
            </p>
          </div>
        </header>

        {latest && (
          <div
            className={cn('space-y-4 rounded-2xl border p-5 sm:p-6', innerCardBg)}
            style={coupleSiteThemeVars}
          >
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold"
                style={{
                  color: 'var(--milestone-primary)',
                  backgroundColor: 'var(--milestone-soft)',
                }}
              >
                <Heart className="size-3" aria-hidden />
                วันสำคัญล่าสุด
              </span>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              {latestDate?.mode === 'exact' && (
                <div
                  className="flex shrink-0 items-center gap-3 sm:w-[5rem] sm:flex-col sm:items-center sm:gap-0"
                >
                  <p
                    className="text-3xl font-black leading-none tabular-nums sm:text-4xl"
                    style={{ color: 'var(--milestone-primary)' }}
                  >
                    {latestDate.day}
                  </p>
                  <p
                    className="text-xs font-bold sm:mt-1 sm:text-center"
                    style={{ color: 'var(--milestone-secondary)' }}
                  >
                    {latestDate.monthYear}
                  </p>
                </div>
              )}

              <div className="min-w-0 flex-1 space-y-2.5">
                <h3
                  className="text-lg font-bold leading-snug sm:text-xl"
                  style={{ color: 'var(--milestone-primary)' }}
                >
                  {latest.title || 'วันสำคัญล่าสุด'}
                </h3>

                {latestDate?.mode === 'fuzzy' && (
                  <p
                    className="text-sm font-semibold"
                    style={{ color: 'var(--milestone-secondary)' }}
                  >
                    {latestDate.label}
                  </p>
                )}

                {(latestTime || latest.place) && (
                  <div
                    className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm"
                    style={{ color: 'var(--milestone-muted)' }}
                  >
                    {latestTime && (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="size-3.5 shrink-0 opacity-80" aria-hidden />
                        {latestTime}
                      </span>
                    )}
                    {latest.place && (
                      <span className="inline-flex items-start gap-1.5">
                        <MapPin className="size-3.5 shrink-0 mt-0.5 opacity-80" aria-hidden />
                        {latest.place}
                      </span>
                    )}
                  </div>
                )}

                {latest.note && (
                  <p
                    className="text-sm italic leading-relaxed"
                    style={{ color: 'var(--milestone-muted)' }}
                  >
                    {latest.note}
                  </p>
                )}

                {latest.mapLink && (
                  <a
                    href={latest.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-105 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--theme-primary)]/25"
                    style={{ backgroundColor: 'var(--theme-primary, #c9a0a8)' }}
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden />
                    เปิดแผนที่
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {earlier.length > 0 && (
          <div className="space-y-1">
            <p
              className="mb-1 flex items-center gap-1.5 text-xs font-bold"
              style={{ color: 'var(--theme-primary, #c9a0a8)' }}
            >
              <Sparkles className="size-3.5" aria-hidden />
              {timelineTitle}
            </p>
            <CoupleMilestoneList
              milestones={earlier}
              innerCardBg={innerCardBg}
              compact
              hideTitle
            />
          </div>
        )}

        {(notes || contactPhone) && (
          <div className={cn('space-y-2.5 text-sm', textMutedClass)}>
            {notes && (
              <p className="flex items-start gap-2.5">
                <Info
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: 'var(--theme-primary, #c9a0a8)' }}
                  aria-hidden
                />
                <span>
                  <span className={cn('font-semibold', headingColorClass)}>โน้ต: </span>
                  {notes}
                </span>
              </p>
            )}
            {contactPhone && (
              <p className="flex items-start gap-2.5">
                <Phone
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: 'var(--theme-primary, #c9a0a8)' }}
                  aria-hidden
                />
                <span>
                  <span className={cn('font-semibold', headingColorClass)}>ติดต่อ: </span>
                  {contactPhone}
                </span>
              </p>
            )}
          </div>
        )}

        <footer className="border-t border-[#EDD5C8]/40 pt-4 text-center">
          <p className={cn('text-xs font-medium leading-relaxed', textMutedClass)}>
            {footerText}
          </p>
        </footer>
      </div>
    </section>
  );
}
