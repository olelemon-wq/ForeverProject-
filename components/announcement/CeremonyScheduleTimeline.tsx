import { Calendar } from 'lucide-react';
import type { CeremonyScheduleItem } from '@/lib/announcementSchedule';
import { formatCeremonyDisplayLine } from '@/lib/announcementSchedule';
import { cn } from '@/lib/utils';

const PATTERN_MASK =
  'linear-gradient(to left, black 0%, black 30%, rgba(0,0,0,0.58) 56%, transparent 100%)';

type CardFloralPatternProps = {
  patternUrl: string;
  opacityMobile: number;
  opacityDesktop: number;
  masked?: boolean;
  maskGradient?: string;
  maxWidthMobile?: number;
  maxWidthDesktop?: number;
  widthMobile?: string;
  widthDesktop?: string;
  height?: string;
  fit?: 'cover' | 'contain';
};

export function CardFloralPattern({
  patternUrl,
  opacityMobile,
  opacityDesktop,
  masked = true,
  maskGradient,
  maxWidthMobile = 156,
  maxWidthDesktop = 176,
  widthMobile = '36%',
  widthDesktop = '38%',
  height = '100%',
  fit = 'cover',
}: CardFloralPatternProps) {
  const maskStyle = masked
    ? {
        WebkitMaskImage: maskGradient ?? PATTERN_MASK,
        maskImage: maskGradient ?? PATTERN_MASK,
      }
    : undefined;

  const objectClass = fit === 'contain' ? 'object-contain' : 'object-cover';

  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden sm:hidden"
        style={{ opacity: opacityMobile }}
        aria-hidden
      >
        <img
          src={patternUrl}
          alt=""
          className={cn(
            'absolute right-0 bottom-0',
            objectClass,
            'object-right-bottom',
          )}
          style={{
            height,
            width: widthMobile,
            maxWidth: maxWidthMobile,
            ...maskStyle,
          }}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 hidden overflow-hidden sm:block"
        style={{ opacity: opacityDesktop }}
        aria-hidden
      >
        <img
          src={patternUrl}
          alt=""
          className={cn(
            'absolute right-0 bottom-0',
            objectClass,
            'object-right-bottom',
          )}
          style={{
            height,
            width: widthDesktop,
            maxWidth: maxWidthDesktop,
            ...maskStyle,
          }}
        />
      </div>
    </>
  );
}

type CeremonyScheduleTimelineProps = {
  items: CeremonyScheduleItem[];
  title: string;
  innerCardBg?: string;
  compact?: boolean;
  className?: string;
};

export default function CeremonyScheduleTimeline({
  items,
  title,
  compact = false,
  className,
}: CeremonyScheduleTimelineProps) {
  if (items.length === 0) return null;

  return (
    <div className={cn('space-y-4 text-left', className)}>
      <h3
        className={cn(
          'flex items-center gap-1.5 font-black uppercase tracking-wider',
          compact ? 'text-xs' : 'text-xs',
        )}
        style={{ color: 'var(--ceremony-primary)' }}
      >
        <Calendar className="size-4 shrink-0" aria-hidden />
        <span>{title}</span>
      </h3>

      <ol className="relative space-y-0" aria-label={title}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const Icon = item.icon;
          const displayLine = formatCeremonyDisplayLine(item);

          return (
            <li
              key={item.id}
              className={cn('relative', compact ? 'pb-3.5' : 'pb-4', isLast && 'pb-0')}
            >
              {!isLast && (
                <span
                  aria-hidden
                  className="absolute top-8 bottom-0 left-[15px] w-px"
                  style={{ backgroundColor: 'var(--ceremony-line)' }}
                />
              )}

              <div className="flex gap-3">
                <div
                  className={cn(
                    'relative z-10 mt-0.5 flex shrink-0 items-center justify-center rounded-full border',
                    compact ? 'size-8' : 'size-9',
                  )}
                  style={{
                    color: 'var(--ceremony-primary)',
                    borderColor: 'var(--ceremony-border)',
                    backgroundColor: 'var(--ceremony-soft)',
                  }}
                  aria-hidden
                >
                  <Icon className={compact ? 'size-3.5' : 'size-4'} strokeWidth={1.75} />
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                  <h4
                    className={cn('font-bold leading-snug', compact ? 'text-xs' : 'text-sm')}
                    style={{ color: 'var(--ceremony-primary)' }}
                  >
                    {item.title}
                  </h4>
                  <p
                    className={cn(
                      'mt-0.5 font-medium leading-relaxed',
                      compact ? 'text-xs' : 'text-sm',
                    )}
                    style={{ color: 'var(--ceremony-muted)' }}
                  >
                    {displayLine}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
