import { Calendar, Clock, ExternalLink, MapPin, Sparkles } from 'lucide-react';
import type { CoupleMilestone } from '@/lib/coupleMilestones';
import {
  formatMilestoneTime,
  parseMilestoneDateDisplay,
} from '@/lib/coupleMilestones';
import { coupleSiteThemeVars } from '@/lib/announcementCardTheme';

interface CoupleMilestoneListProps {
  milestones: CoupleMilestone[];
  title?: string;
  innerCardBg: string;
  compact?: boolean;
}

const milestoneThemeStyle = coupleSiteThemeVars;

export default function CoupleMilestoneList({
  milestones,
  title = 'วันสำคัญของเรา',
  innerCardBg,
  compact = false,
}: CoupleMilestoneListProps) {
  if (milestones.length === 0) return null;

  return (
    <div className="space-y-5 text-left" style={milestoneThemeStyle}>
      <h3
        className={`${compact ? 'text-[10px]' : 'text-xs'} font-black uppercase tracking-wider flex items-center gap-1.5`}
        style={{ color: 'var(--milestone-primary)' }}
      >
        <Calendar className="w-4 h-4" aria-hidden />
        <span>{title}</span>
      </h3>

      <ol className="relative space-y-0" aria-label={title}>
        {milestones.map((milestone, index) => {
          const isFirst = index === 0;
          const isLast = index === milestones.length - 1;
          const dateDisplay = parseMilestoneDateDisplay(milestone.date);
          const timeLabel = formatMilestoneTime(milestone.time);
          const titleText = milestone.title || `วันสำคัญที่ ${index + 1}`;

          return (
            <li
              key={milestone.id || `milestone-${index}`}
              className={`relative ${compact ? 'pb-4' : 'pb-6'} ${isLast ? 'pb-0' : ''}`}
            >
              {!isLast && (
                <span
                  aria-hidden
                  className={`absolute left-[11px] top-7 bottom-0 w-px ${compact ? '' : ''}`}
                  style={{ backgroundColor: 'var(--milestone-line)' }}
                />
              )}

              <div className="flex gap-3 sm:gap-4">
                <div
                  className={`relative z-10 mt-1 flex shrink-0 items-center justify-center rounded-full border-2 shadow-sm ${compact ? 'size-6 text-[9px]' : 'size-7 text-[10px]'}`}
                  style={{
                    color: 'var(--milestone-primary)',
                    borderColor: 'var(--milestone-border)',
                    backgroundColor: 'var(--milestone-soft)',
                  }}
                  aria-hidden
                >
                  <span className="font-black leading-none">{index + 1}</span>
                </div>

                <article
                  className={`group min-w-0 flex-1 rounded-2xl border shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md ${compact ? 'p-3' : 'p-4 sm:p-5'} ${innerCardBg}`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                    {dateDisplay && (
                      <div
                        className={`flex shrink-0 items-center gap-3 sm:w-[4.5rem] sm:flex-col sm:items-center sm:justify-start sm:gap-0 sm:border-r sm:pr-4 ${compact ? 'sm:w-14' : ''}`}
                        style={{ borderColor: 'var(--milestone-border)' }}
                      >
                        <p
                          className={`font-black leading-none tabular-nums ${compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'}`}
                          style={{ color: 'var(--milestone-primary)' }}
                        >
                          {dateDisplay.day}
                        </p>
                        <p
                          className={`font-bold leading-snug ${compact ? 'text-[9px] sm:text-[10px]' : 'text-[10px] sm:text-[11px]'} sm:mt-1 sm:text-center`}
                          style={{ color: 'var(--milestone-secondary)' }}
                        >
                          {dateDisplay.monthYear}
                        </p>
                      </div>
                    )}

                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-start gap-2">
                        <h4
                          className={`font-bold leading-snug ${compact ? 'text-sm' : 'text-base'}`}
                          style={{ color: 'var(--milestone-primary)' }}
                        >
                          {titleText}
                        </h4>
                        {isFirst && (
                          <span
                            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
                            style={{
                              color: 'var(--milestone-primary)',
                              backgroundColor: 'var(--milestone-soft)',
                            }}
                          >
                            <Sparkles className="size-3" aria-hidden />
                            จุดเริ่มต้น
                          </span>
                        )}
                      </div>

                      {(timeLabel || milestone.place) && (
                        <div
                          className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs"
                          style={{ color: 'var(--milestone-muted)' }}
                        >
                          {timeLabel && (
                            <span className="inline-flex items-center gap-1.5">
                              <Clock className="size-3.5 shrink-0 opacity-70" aria-hidden />
                              <span>{timeLabel}</span>
                            </span>
                          )}
                          {timeLabel && milestone.place && (
                            <span className="hidden sm:inline opacity-40" aria-hidden>
                              ·
                            </span>
                          )}
                          {milestone.place && (
                            <span className="inline-flex items-start gap-1.5">
                              <MapPin className="size-3.5 shrink-0 mt-0.5 opacity-70" aria-hidden />
                              <span>{milestone.place}</span>
                            </span>
                          )}
                        </div>
                      )}

                      {milestone.note && (
                        <p
                          className={`border-l-2 pl-3 italic leading-relaxed ${compact ? 'text-[11px]' : 'text-xs'}`}
                          style={{
                            color: 'var(--milestone-muted)',
                            borderColor: 'var(--milestone-border)',
                          }}
                        >
                          {milestone.note}
                        </p>
                      )}

                      {milestone.mapLink && (
                        <a
                          href={milestone.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex min-h-11 items-center gap-1.5 rounded-xl border px-3 py-2 text-[11px] font-bold transition active:scale-95 focus-visible:outline-none focus-visible:ring-4 ${compact ? 'mt-1' : 'mt-2'}`}
                          style={{
                            color: 'var(--milestone-primary)',
                            borderColor: 'var(--milestone-border)',
                            backgroundColor: 'color-mix(in srgb, var(--milestone-primary) 8%, white)',
                          }}
                        >
                          <ExternalLink className="size-3.5" aria-hidden />
                          <span>เปิดแผนที่</span>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
