'use client';

import { Check, Minus, Plus, RotateCw, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { clampImagePan, imageTransformStyle } from '@/lib/imagePosition';

export type CircularImageTransform = {
  x: number;
  y: number;
  scale: number;
  rotate: number;
};

type CircularImageCropModalProps = {
  open: boolean;
  imageUrl: string;
  title: string;
  transform: CircularImageTransform;
  saving?: boolean;
  onClose: () => void;
  onTransformChange: (patch: Partial<CircularImageTransform>) => void;
  onConfirm: () => void | Promise<void>;
};

export default function CircularImageCropModal({
  open,
  imageUrl,
  title,
  transform,
  saving = false,
  onClose,
  onTransformChange,
  onConfirm,
}: CircularImageCropModalProps) {
  if (!open || !imageUrl) return null;

  const { x, y, scale, rotate } = transform;

  const setScale = (next: number) => {
    onTransformChange({
      scale: next,
      x: clampImagePan(x, next),
      y: clampImagePan(y, next),
    });
  };

  const bindPan = (startNX: number, startNY: number, startClientX: number, startClientY: number, viewportWidth: number) => {
    const handleMove = (clientX: number, clientY: number) => {
      const dx = (clientX - startClientX) / viewportWidth;
      const dy = (clientY - startClientY) / viewportWidth;
      onTransformChange({
        x: clampImagePan(startNX + dx, scale),
        y: clampImagePan(startNY + dy, scale),
      });
    };

    return { handleMove };
  };

  return (
    <div className="fixed inset-0 z-55 flex flex-col items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm animate-fade-in select-none">
      <div className="flex w-full max-w-sm flex-col gap-6 rounded-3xl border border-stone-200 bg-white p-6 text-left text-stone-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-stone-150 pb-3">
          <h3 className="flex items-center gap-1.5 text-sm font-black text-emerald-800">
            <Settings className="h-4 w-4 text-emerald-650" />
            <span>{title}</span>
          </h3>
          <Button
            variant="ghost"
            type="button"
            onClick={onClose}
            className="cursor-pointer p-1 text-stone-400 transition hover:text-stone-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center justify-center rounded-2xl border border-stone-200/60 bg-stone-50 p-6">
          <div
            className="relative flex h-48 w-48 cursor-move items-center justify-center overflow-hidden rounded-full border-2 border-emerald-600/80 bg-stone-100 shadow-inner"
            onMouseDown={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const { handleMove } = bindPan(x, y, e.clientX, e.clientY, rect.width);
              const handleMouseMove = (ev: MouseEvent) => handleMove(ev.clientX, ev.clientY);
              const handleMouseUp = () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
              };
              window.addEventListener('mousemove', handleMouseMove);
              window.addEventListener('mouseup', handleMouseUp);
            }}
            onTouchStart={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const touch = e.touches[0];
              const { handleMove } = bindPan(x, y, touch.clientX, touch.clientY, rect.width);
              const handleTouchMove = (ev: TouchEvent) => {
                const t = ev.touches[0];
                handleMove(t.clientX, t.clientY);
              };
              const handleTouchEnd = () => {
                window.removeEventListener('touchmove', handleTouchMove);
                window.removeEventListener('touchend', handleTouchEnd);
              };
              window.addEventListener('touchmove', handleTouchMove, { passive: true });
              window.addEventListener('touchend', handleTouchEnd);
            }}
          >
            <img
              src={imageUrl}
              alt=""
              className="pointer-events-none max-w-none"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                ...imageTransformStyle({ x, y, scale, rotate }),
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex justify-between text-xs font-bold text-stone-500">
            <span>ขนาด (Zoom)</span>
            <span className="font-mono">{scale.toFixed(2)}x</span>
          </label>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setScale(Math.max(1, scale - 0.05))}
              className="cursor-pointer rounded-lg p-1 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 active:scale-90"
              title="ลดขนาด"
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <Input
              type="range"
              min="1"
              max="4"
              step="0.05"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-lg bg-stone-250 accent-emerald-600"
            />
            <Button
              variant="ghost"
              type="button"
              onClick={() => setScale(Math.min(4, scale + 0.05))}
              className="cursor-pointer rounded-lg p-1 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 active:scale-90"
              title="เพิ่มขนาด"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            type="button"
            onClick={() => onTransformChange({ rotate: (rotate + 90) % 360 })}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-stone-250 bg-stone-50 px-4 py-2 text-xs font-bold text-stone-700 transition hover:bg-stone-100 active:scale-95"
          >
            <RotateCw className="h-3.5 w-3.5" />
            <span>หมุนภาพ 90°</span>
          </Button>
          <Button
            variant="ghost"
            type="button"
            onClick={() =>
              onTransformChange({ scale: 1, x: 0, y: 0, rotate: 0 })
            }
            className="cursor-pointer text-xs font-semibold text-stone-505 transition hover:text-stone-900"
          >
            รีเซ็ตค่าเริ่มต้น
          </Button>
        </div>

        <Button
          variant="ghost"
          type="button"
          disabled={saving}
          onClick={() => void onConfirm()}
          className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md transition hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50"
        >
          <Check className="h-4 w-4" />
          <span>{saving ? 'กำลังบันทึก...' : 'เสร็จสิ้นและนำไปใช้'}</span>
        </Button>
      </div>
    </div>
  );
}
