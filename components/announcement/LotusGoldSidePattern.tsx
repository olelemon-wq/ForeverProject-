type LotusGoldSidePatternProps = {
  imageUrl: string;
  opacity?: number;
};

const GOLD_LINE_FILTER =
  'sepia(0.42) saturate(2.35) hue-rotate(352deg) brightness(0.86) contrast(1.14)';

const LEFT_FADE_MASK =
  'linear-gradient(to left, transparent 0%, rgba(0,0,0,0.12) 28%, rgba(0,0,0,0.42) 48%, rgba(0,0,0,0.72) 64%, black 80%)';

export function LotusGoldSidePattern({
  imageUrl,
  opacity = 1,
}: LotusGoldSidePatternProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <img
        src={imageUrl}
        alt=""
        className="absolute inset-y-0 right-0 h-full w-[52%] object-cover object-right-bottom sm:w-[48%]"
        style={{
          opacity,
          filter: GOLD_LINE_FILTER,
          WebkitMaskImage: LEFT_FADE_MASK,
          maskImage: LEFT_FADE_MASK,
        }}
      />
    </div>
  );
}
