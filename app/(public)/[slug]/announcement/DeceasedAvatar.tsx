'use client';

import React, { useState } from 'react';
import { Flame } from 'lucide-react';
import { imageTransformStyle, toRelativeOffset } from '@/lib/imagePosition';
import { resolveMediaSrc } from '@/lib/mediaUrl';
import { cn } from '@/lib/utils';

interface DeceasedAvatarProps {
  avatarUrl?: string | null;
  avatarScale?: number;
  avatarX?: number;
  avatarY?: number;
  avatarRotate?: number;
  imageCoordSpace?: string | null;
  tenantName: string;
  primaryColor?: string;
  size?: 'sm' | 'md';
}

export default function DeceasedAvatar({
  avatarUrl,
  avatarScale = 1,
  avatarX = 0,
  avatarY = 0,
  avatarRotate = 0,
  imageCoordSpace,
  tenantName,
  primaryColor = '#0d9488',
  size = 'md',
}: DeceasedAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const hasValidAvatar = !!avatarUrl && !imageError;
  const x = toRelativeOffset(avatarX, 224, imageCoordSpace);
  const y = toRelativeOffset(avatarY, 224, imageCoordSpace);

  return (
    <div 
      className={cn(
        'mx-auto flex items-center justify-center overflow-hidden rounded-full bg-stone-50 shadow-md print-avatar-container',
        size === 'sm' ? 'h-20 w-20 border-[3px]' : 'h-28 w-28 border-4',
      )}
      style={{ borderColor: primaryColor }}
    >
      {hasValidAvatar ? (
        <img 
          src={resolveMediaSrc(avatarUrl)} 
          alt={tenantName} 
          className="pointer-events-none"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            ...imageTransformStyle({
              x,
              y,
              scale: avatarScale,
              rotate: avatarRotate,
            }),
          }}
          onError={() => setImageError(true)}
        />
      ) : (
        <Flame className={cn('animate-pulse', size === 'sm' ? 'size-8' : 'size-12')} style={{ color: primaryColor }} />
      )}
    </div>
  );
}
