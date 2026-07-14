'use client';

import React, { useState } from 'react';
import { Flame } from 'lucide-react';
import { imageTransformStyle, toRelativeOffset } from '@/lib/imagePosition';

interface DeceasedAvatarProps {
  avatarUrl?: string | null;
  avatarScale?: number;
  avatarX?: number;
  avatarY?: number;
  avatarRotate?: number;
  imageCoordSpace?: string | null;
  tenantName: string;
  primaryColor?: string;
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
}: DeceasedAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const hasValidAvatar = !!avatarUrl && !imageError;
  const x = toRelativeOffset(avatarX, 224, imageCoordSpace);
  const y = toRelativeOffset(avatarY, 224, imageCoordSpace);

  return (
    <div 
      className="w-28 h-28 print-avatar-container rounded-full border-4 mx-auto shadow-md overflow-hidden flex items-center justify-center bg-stone-50"
      style={{ borderColor: primaryColor }}
    >
      {hasValidAvatar ? (
        <img 
          src={avatarUrl.startsWith('http') || avatarUrl.startsWith('/') ? avatarUrl : `/${avatarUrl}`} 
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
        <Flame className="w-12 h-12 animate-pulse" style={{ color: primaryColor }} />
      )}
    </div>
  );
}
