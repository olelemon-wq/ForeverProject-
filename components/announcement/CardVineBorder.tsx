import { cn } from '@/lib/utils';

const TILES = 12;

function VineStrip({
  url,
  compact,
  flipY,
}: {
  url: string;
  compact?: boolean;
  flipY?: boolean;
}) {
  const tileClass = compact ? 'h-6 w-36' : 'h-7 w-44';

  return (
    <div className={cn('flex w-max', compact ? 'h-6' : 'h-7', flipY && '-scale-y-100')}>
      {Array.from({ length: TILES }, (_, index) => (
        <span
          key={index}
          className={cn(
            'block shrink-0 bg-current',
            tileClass,
            index % 2 === 1 && '-scale-x-100',
          )}
          style={{
            WebkitMaskImage: `url(${url})`,
            maskImage: `url(${url})`,
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
          }}
        />
      ))}
    </div>
  );
}

function VerticalVine({
  url,
  compact,
}: {
  url: string;
  compact?: boolean;
}) {
  const thickness = compact ? 24 : 28;

  return (
    <div
      className="absolute top-0 left-0"
      style={{
        transform: `translateX(${thickness}px) rotate(90deg)`,
        transformOrigin: 'top left',
      }}
    >
      <VineStrip url={url} compact={compact} />
    </div>
  );
}

export function CardVineBorders({
  url,
  color = '#171717',
  opacity = 0.92,
  compact = false,
}: {
  url: string;
  color?: string;
  opacity?: number;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-3 z-[2]',
      )}
      style={{ opacity, color }}
      aria-hidden
    >
      <div className={cn('absolute inset-x-0 top-0 overflow-hidden', compact ? 'h-6' : 'h-7')}>
        <VineStrip url={url} compact={compact} />
      </div>
      <div className={cn('absolute inset-x-0 bottom-0 overflow-hidden', compact ? 'h-6' : 'h-7')}>
        <VineStrip url={url} compact={compact} flipY />
      </div>
      <div className={cn('absolute inset-y-0 left-0 overflow-hidden', compact ? 'w-6' : 'w-7')}>
        <VerticalVine url={url} compact={compact} />
      </div>
      <div className={cn('absolute inset-y-0 right-0 overflow-hidden -scale-x-100', compact ? 'w-6' : 'w-7')}>
        <VerticalVine url={url} compact={compact} />
      </div>
    </div>
  );
}
