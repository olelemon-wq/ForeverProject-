'use client';

import { GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type ManageGalleryMedia = {
  id: string;
  filePath: string;
  fileName: string;
};

type ManageGalleryGridProps = {
  items: ManageGalleryMedia[];
  albums: string[];
  mediaAlbums: Record<string, string>;
  draggedIndex: number | null;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onDelete: (mediaId: string) => void;
  onAlbumChange: (mediaId: string, album: string) => void;
};

export default function ManageGalleryGrid({
  items,
  albums,
  mediaAlbums,
  draggedIndex,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onDelete,
  onAlbumChange,
}: ManageGalleryGridProps) {
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 sm:gap-2 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((m, index) => {
        const isDraggingItem = draggedIndex === index;
        const albumName = mediaAlbums[m.id] || '';

        return (
          <div
            key={m.id}
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDrop={(e) => onDrop(e, index)}
            onDragEnd={onDragEnd}
            className={cn(
              'group relative aspect-square overflow-hidden rounded-lg border bg-stone-100 transition-all duration-150',
              isDraggingItem
                ? 'scale-[0.97] border-emerald-500 opacity-50 ring-2 ring-emerald-500/20'
                : 'border-stone-200 hover:border-stone-300',
            )}
          >
            <img
              src={m.filePath}
              alt={m.fileName}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              draggable={false}
            />

            <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-1 bg-gradient-to-b from-black/50 to-transparent p-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
              <span
                className="flex size-6 cursor-grab items-center justify-center rounded-md bg-black/35 text-white backdrop-blur-sm active:cursor-grabbing"
                title="ลากเพื่อเรียงลำดับ"
              >
                <GripVertical className="size-3" />
              </span>
              <Button
                variant="ghost"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(m.id);
                }}
                className="size-6 rounded-md border-0 bg-red-600/90 p-0 text-white hover:bg-red-700"
                title="ลบรูปภาพ"
                aria-label="ลบรูปภาพ"
              >
                <Trash2 className="size-3" />
              </Button>
            </div>

            {albums.length > 0 && (
              <div
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/25 to-transparent p-1 pt-4"
                onClick={(e) => e.stopPropagation()}
              >
                <Select
                  value={albumName || '__empty__'}
                  onValueChange={(raw) => {
                    const value = raw === '__empty__' ? '' : raw;
                    onAlbumChange(m.id, value);
                  }}
                >
                  <SelectTrigger className="h-6 w-full cursor-pointer rounded-md border-0 bg-white/95 px-1.5 text-xs font-semibold text-stone-800 shadow-none focus-visible:ring-1 focus-visible:ring-white/80 sm:text-xs">
                    <SelectValue placeholder="อัลบั้ม" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="__empty__">(ไม่มีอัลบั้ม)</SelectItem>
                    {albums.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
