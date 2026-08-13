'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { resolveMediaSrc } from '@/lib/mediaUrl';
import { cn } from '@/lib/utils';

type ImageOrientation = 'portrait' | 'landscape' | 'square';

function detectOrientation(width: number, height: number): ImageOrientation {
  if (width <= 0 || height <= 0) return 'portrait';
  const ratio = width / height;
  if (ratio > 1.08) return 'landscape';
  if (ratio < 0.92) return 'portrait';
  return 'square';
}

function frameClasses(
  orientation: ImageOrientation | null,
  compact: boolean,
): string {
  const o = orientation ?? 'portrait';

  if (compact) {
    return o === 'landscape'
      ? 'aspect-[4/3] w-full max-w-[11rem]'
      : 'aspect-[3/4] w-full max-w-[9rem]';
  }

  if (o === 'landscape') return 'aspect-[4/3] w-full max-w-sm';
  if (o === 'square') return 'aspect-square w-full max-w-xs';
  return 'aspect-[3/4] w-full max-w-xs';
}

export default function ActivityImagesCarousel({
  images,
  title,
  className,
  compact = false,
}: {
  images: string[];
  title: string;
  className?: string;
  compact?: boolean;
}) {
  if (images.length === 0) return null;

  return (
    <Carousel
      opts={{ align: 'center' }}
      className={cn('mx-auto w-full max-w-sm', className)}
    >
      <CarouselContent className="-ml-1">
        {images.map((src, index) => (
          <CarouselItem key={`${src}-${index}`} className="basis-full pl-1">
            <ActivityImageSlide
              src={src}
              title={title}
              page={index + 1}
              compact={compact}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 1 ? (
        <>
          <CarouselPrevious className="left-0 bg-white/95" />
          <CarouselNext className="right-0 bg-white/95" />
        </>
      ) : null}
    </Carousel>
  );
}

function ActivityImageSlide({
  src,
  title,
  page,
  compact,
}: {
  src: string;
  title: string;
  page: number;
  compact?: boolean;
}) {
  const [orientation, setOrientation] = useState<ImageOrientation | null>(null);
  const resolved = src.startsWith('blob:') ? src : resolveMediaSrc(src);

  return (
    <div className="flex justify-center p-1">
      <Card className="w-fit overflow-hidden py-0 shadow-sm">
        <CardContent className="flex flex-col items-center gap-2 p-2">
          <div
            className={cn(
              'relative overflow-hidden rounded-lg bg-stone-50',
              frameClasses(orientation, compact ?? false),
            )}
          >
            <img
              src={resolved}
              alt={`${title} หน้า ${page}`}
              className="block h-full w-full object-contain"
              loading="lazy"
              onLoad={(event) => {
                const img = event.currentTarget;
                setOrientation(
                  detectOrientation(img.naturalWidth, img.naturalHeight),
                );
              }}
            />
          </div>
          <p className="text-xs font-medium text-stone-500">หน้า {page}</p>
        </CardContent>
      </Card>
    </div>
  );
}
