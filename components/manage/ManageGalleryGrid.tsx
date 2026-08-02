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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((m, index) => {
        const isDraggingItem = draggedIndex === index;
        return (
          <div
            key={m.id}
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDrop={(e) => onDrop(e, index)}
            onDragEnd={onDragEnd}
            className={`
              group flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-200
              ${isDraggingItem
                ? 'scale-[0.97] border-emerald-500 opacity-50 ring-2 ring-emerald-500/20'
                : 'border-stone-200 hover:border-stone-300 hover:shadow-md'
              }
            `}
          >
            <div className="relative aspect-square bg-stone-100">
              <img
                src={m.filePath}
                alt={m.fileName}
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                draggable={false}
              />
              <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-1 bg-gradient-to-b from-black/55 via-black/25 to-transparent p-1.5">
                <span
                  className="flex h-7 w-7 cursor-grab items-center justify-center rounded-lg bg-black/35 text-white backdrop-blur-sm active:cursor-grabbing"
                  title="ลากเพื่อเรียงลำดับ"
                >
                  <GripVertical className="h-3.5 w-3.5" />
                </span>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(m.id);
                  }}
                  className="h-7 w-7 shrink-0 rounded-lg border-0 bg-red-600/90 p-0 text-white hover:bg-red-700"
                  title="ลบรูปภาพ"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {albums.length > 0 && (
              <div
                className="border-t border-stone-100 bg-stone-50/80 p-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <Select
                  value={(mediaAlbums[m.id] || '') || '__empty__'}
                  onValueChange={(raw) => {
                    const value = raw === '__empty__' ? '' : raw;
                    onAlbumChange(m.id, value);
                  }}
                >
                  <SelectTrigger className="h-7 w-full cursor-pointer rounded-lg border-stone-200 bg-white px-2 text-[10px] font-semibold text-stone-800 focus:outline-none">
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
