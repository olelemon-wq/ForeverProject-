import React from 'react';
import { BookOpen } from 'lucide-react';
import {
  LIFE_STORY_SECTIONS,
  lifeStoryHasContent,
  type LifeStoryData,
} from '@/lib/lifeStory';
import { cn } from '@/lib/utils';

export default function LifeStorySection({
  data,
  className,
}: {
  data: LifeStoryData;
  className?: string;
}) {
  if (!lifeStoryHasContent(data)) return null;

  const textSections = LIFE_STORY_SECTIONS.filter(
    (s) => s.id !== 'timeline' && data[s.id].trim(),
  );
  const timeline = data.timeline.filter(
    (t) => t.title.trim() || t.year.trim() || t.description.trim(),
  );

  return (
    <section
      className={cn(
        'space-y-6 rounded-3xl border border-stone-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] sm:p-8',
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
        <BookOpen
          className="size-5"
          style={{ color: 'var(--theme-primary, #0d9488)' }}
        />
        <h2
          className="text-xl font-bold"
          style={{ color: 'var(--theme-primary, #0d9488)' }}
        >
          เรื่องราวชีวิต
        </h2>
      </div>

      <div className="space-y-8">
        {textSections.map((section) => {
          const body =
            section.id === 'biography'
              ? data.biography
              : section.id === 'honors'
                ? data.honors
                : section.id === 'legacy'
                  ? data.legacy
                  : data.teachings;
          return (
            <div key={section.id} className="space-y-2 text-left">
              <h3 className="text-sm font-bold tracking-wide text-stone-800">
                {section.label}
              </h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-600">
                {body}
              </p>
            </div>
          );
        })}

        {timeline.length > 0 ? (
          <div className="space-y-4 text-left">
            <h3 className="text-sm font-bold tracking-wide text-stone-800">
              เส้นทางชีวิต
            </h3>
            <ol className="relative space-y-5 border-l border-stone-200 pl-5">
              {timeline.map((item) => (
                <li key={item.id} className="relative">
                  <span
                    className="absolute -left-[1.4rem] top-1.5 size-2.5 rounded-full border-2 border-white"
                    style={{ backgroundColor: 'var(--theme-primary, #0d9488)' }}
                  />
                  {item.year.trim() ? (
                    <p
                      className="text-xs font-bold"
                      style={{ color: 'var(--theme-primary, #0d9488)' }}
                    >
                      {item.year}
                    </p>
                  ) : null}
                  {item.title.trim() ? (
                    <p className="text-sm font-bold text-stone-900">{item.title}</p>
                  ) : null}
                  {item.description.trim() ? (
                    <p className="mt-1 text-sm leading-relaxed text-stone-600 whitespace-pre-wrap">
                      {item.description}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </div>
    </section>
  );
}
