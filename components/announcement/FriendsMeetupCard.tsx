import {
  Calendar,
  ExternalLink,
  Info,
  MapPin,
  Phone,
} from 'lucide-react';
import DeceasedAvatar from '@/app/(public)/[slug]/announcement/DeceasedAvatar';
import { cn } from '@/lib/utils';
import { resolveCardFontFamily } from '@/lib/themeFont';
import type { AnnouncementCardTheme } from '@/lib/announcementCardTheme';
import { ANNOUNCEMENT_CARD_CLASS } from '@/lib/publicLayout';

const FRIENDS_PATTERN = '/patterns/friends-condolence-floral-right.jpg';

const PATTERN_MASK =
  'linear-gradient(to left, black 0%, black 28%, rgba(0,0,0,0.55) 52%, transparent 100%)';

export type FriendsMeetupCardProps = {
  tenantName: string;
  inviteText?: string;
  inviteFallback: string;
  footerText: string;
  theme: AnnouncementCardTheme;
  fontFamily?: string;
  /** Site-wide font — used when card font is not set separately */
  siteFontFamily?: string;
  avatarUrl?: string | null;
  avatarScale?: number;
  avatarX?: number;
  avatarY?: number;
  avatarRotate?: number;
  imageCoordSpace?: string | null;
  meetupDate?: string;
  meetupTime?: string;
  venueName?: string;
  venueDetail?: string;
  mapLink?: string;
  notes?: string;
  contactPhone?: string;
  className?: string;
};

export default function FriendsMeetupCard({
  tenantName,
  inviteText,
  inviteFallback,
  footerText,
  theme,
  fontFamily,
  siteFontFamily,
  avatarUrl,
  avatarScale,
  avatarX,
  avatarY,
  avatarRotate,
  imageCoordSpace,
  meetupDate,
  meetupTime,
  venueName,
  venueDetail,
  mapLink,
  notes,
  contactPhone,
  className,
}: FriendsMeetupCardProps) {
  const { cardBgClass, textMutedClass, headingColorClass, innerCardBg } = theme;

  const scheduleLine = [meetupDate, meetupTime ? `เวลา ${meetupTime}` : '']
    .filter(Boolean)
    .join(' · ');

  const venueLine = [venueName, venueDetail ? `(${venueDetail})` : '']
    .filter(Boolean)
    .join(' ');

  const hasSchedule = Boolean(scheduleLine);
  const hasVenue = Boolean(venueLine);
  const tagline = inviteText?.trim() || inviteFallback;

  const resolvedFont = resolveCardFontFamily(fontFamily, siteFontFamily);

  return (
    <section
      id="announcement-card"
      className={cn(
        ANNOUNCEMENT_CARD_CLASS,
        'relative overflow-hidden rounded-3xl border p-6 text-left shadow-[0_8px_28px_rgba(30,72,72,0.08)] transition-all duration-300 sm:p-8',
        cardBgClass,
        className,
      )}
      style={{
        fontFamily: resolvedFont ? `${resolvedFont}, ui-sans-serif, system-ui, sans-serif` : 'var(--theme-font), ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden sm:hidden"
        style={{ opacity: 0.28 }}
        aria-hidden
      >
        <img
          src={FRIENDS_PATTERN}
          alt=""
          className="absolute inset-y-0 right-0 h-full w-[34%] max-w-[148px] object-cover object-right-bottom"
          style={{
            WebkitMaskImage: PATTERN_MASK,
            maskImage: PATTERN_MASK,
          }}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 hidden overflow-hidden sm:block"
        style={{ opacity: 0.42 }}
        aria-hidden
      >
        <img
          src={FRIENDS_PATTERN}
          alt=""
          className="absolute inset-y-0 right-0 h-full w-[36%] max-w-[168px] object-cover object-right-bottom"
          style={{
            WebkitMaskImage: PATTERN_MASK,
            maskImage: PATTERN_MASK,
          }}
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
            primaryColor="var(--theme-primary, #1E4848)"
          />
          <div className="space-y-1.5">
            <h2
              className="text-2xl font-black tracking-tight sm:text-[1.65rem]"
              style={{ color: 'var(--theme-primary, #1E4848)' }}
            >
              {tenantName}
            </h2>
            <p className={cn('mx-auto max-w-md text-sm leading-relaxed', textMutedClass)}>
              {tagline}
            </p>
          </div>
        </header>

        {(hasSchedule || hasVenue) && (
          <div className={cn('space-y-4 rounded-2xl border p-5 sm:p-6', innerCardBg)}>
            {hasSchedule && (
              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--theme-primary, #1E4848) 12%, white)',
                  }}
                >
                  <Calendar
                    className="h-5 w-5"
                    style={{ color: 'var(--theme-primary, #1E4848)' }}
                    aria-hidden
                  />
                </div>
                <div className="min-w-0 pt-0.5">
                  <p className={cn('text-xs font-semibold', textMutedClass)}>วันและเวลานัดพบ</p>
                  <p className={cn('mt-0.5 text-lg font-bold leading-snug sm:text-xl', headingColorClass)}>
                    {scheduleLine}
                  </p>
                </div>
              </div>
            )}

            {hasVenue && (
              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--theme-primary, #1E4848) 12%, white)',
                  }}
                >
                  <MapPin
                    className="h-5 w-5"
                    style={{ color: 'var(--theme-primary, #1E4848)' }}
                    aria-hidden
                  />
                </div>
                <div className="min-w-0 pt-0.5">
                  <p className={cn('text-xs font-semibold', textMutedClass)}>สถานที่นัดพบ</p>
                  <p className={cn('mt-0.5 text-base font-bold leading-snug', headingColorClass)}>
                    {venueLine}
                  </p>
                </div>
              </div>
            )}

            {mapLink && (
              <a
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition hover:brightness-105 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--theme-primary)]/25"
                style={{ backgroundColor: 'var(--theme-primary, #1E4848)' }}
              >
                <ExternalLink className="h-4 w-4" aria-hidden />
                เปิด Google Maps นำทาง
              </a>
            )}
          </div>
        )}

        {(notes || contactPhone) && (
          <div className={cn('space-y-2.5 text-sm', textMutedClass)}>
            {notes && (
              <p className="flex items-start gap-2.5">
                <Info
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: 'var(--theme-primary, #1E4848)' }}
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
                  style={{ color: 'var(--theme-primary, #1E4848)' }}
                  aria-hidden
                />
                <span>
                  <span className={cn('font-semibold', headingColorClass)}>ติดต่อประสานงาน: </span>
                  {contactPhone}
                </span>
              </p>
            )}
          </div>
        )}

        <footer className="border-t border-[#A8D1D1]/35 pt-4 text-center">
          <p className={cn('text-[10px] font-medium leading-relaxed', textMutedClass)}>
            {footerText}
          </p>
        </footer>
      </div>
    </section>
  );
}
