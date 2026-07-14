/**
 * Pan/zoom offsets as fractions of the image box (relative),
 * so the same values work in any preview size.
 * Legacy configs stored pixel offsets from the crop editor.
 */

export function clampImagePan(offset: number, scale: number) {
  const max = Math.max(0, (scale - 1) / 2);
  return Math.min(max, Math.max(-max, offset));
}

export function toRelativeOffset(
  value: number,
  legacyAxisPx: number,
  coordSpace?: string | null,
) {
  if (!value) return 0;
  if (coordSpace === 'relative') return value;
  // Relative max at scale 4 is 1.5 — larger values are legacy pixels
  if (Math.abs(value) > 1.5) return value / legacyAxisPx;
  return value;
}

export function imageTransformStyle({
  x,
  y,
  scale,
  rotate = 0,
}: {
  x: number;
  y: number;
  scale: number;
  rotate?: number;
}) {
  return {
    transform: `translate(${x * 100}%, ${y * 100}%) rotate(${rotate}deg) scale(${scale})`,
    transformOrigin: 'center center' as const,
  };
}
