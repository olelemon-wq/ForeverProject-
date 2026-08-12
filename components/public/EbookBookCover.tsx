import { BookOpen } from 'lucide-react';

export default function EbookBookCover({ title, size = 'md' }: { title: string; size?: 'md' | 'lg' }) {
  const dimensions = size === 'lg' ? 'h-[128px] w-[90px]' : 'h-[108px] w-[76px]';

  return (
    <div className={`relative ${dimensions} flex-shrink-0`} aria-hidden>
      <div
        className="absolute inset-0 overflow-hidden rounded-l-[3px] rounded-r-lg shadow-[2px_6px_16px_rgba(28,25,23,0.14)]"
        style={{
          background:
            'linear-gradient(105deg, color-mix(in srgb, var(--theme-primary, #0d9488) 38%, #292524) 0%, color-mix(in srgb, var(--theme-primary, #0d9488) 38%, #292524) 7%, #f5f5f4 7%, #ffffff 15%)',
        }}
      >
        <div
          className="flex h-full flex-col justify-between p-2.5 pl-3.5"
          style={{
            background:
              'linear-gradient(180deg, color-mix(in srgb, var(--theme-primary, #0d9488) 10%, white) 0%, transparent 42%)',
          }}
        >
          <BookOpen
            className="h-3.5 w-3.5 opacity-80"
            style={{ color: 'var(--theme-primary, #0d9488)' }}
          />
          <p className="line-clamp-4 text-xs font-bold leading-[1.35] text-stone-600">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}
