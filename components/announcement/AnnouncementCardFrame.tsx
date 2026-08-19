import { FitToFrame } from '@/components/announcement/FitToFrame';
import type { AnnouncementOrientation } from '@/lib/announcementCardLayout';
import {
  announcementFrameClass,
  normalizeAnnouncementOrientation,
} from '@/lib/announcementCardLayout';
import { cn } from '@/lib/utils';

export function AnnouncementCardFrame({
  orientation,
  compact = false,
  className,
  id,
  children,
}: {
  orientation: AnnouncementOrientation;
  compact?: boolean;
  className?: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      className={cn(
        'mx-auto overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm',
        announcementFrameClass(orientation, compact),
        className,
      )}
    >
      <FitToFrame>{children}</FitToFrame>
    </div>
  );
}

export function FramedAnnouncementCard({
  category,
  orientation,
  className,
  id,
  children,
}: {
  category: string;
  orientation?: unknown;
  className?: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <AnnouncementCardFrame
      id={id}
      orientation={normalizeAnnouncementOrientation(category, orientation)}
      className={className}
    >
      {children}
    </AnnouncementCardFrame>
  );
}
