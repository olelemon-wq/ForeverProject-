'use client';

import React, { useState } from 'react';
import { Flame } from 'lucide-react';

interface DeceasedAvatarProps {
  avatarUrl?: string | null;
  avatarScale?: number;
  avatarX?: number;
  avatarY?: number;
  avatarRotate?: number;
  tenantName: string;
  primaryColor?: string;
}

export default function DeceasedAvatar({
  avatarUrl,
  avatarScale = 1,
  avatarX = 0,
  avatarY = 0,
  avatarRotate = 0,
  tenantName,
  primaryColor = '#0d9488',
}: DeceasedAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const hasValidAvatar = !!avatarUrl && !imageError;

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
            transform: `translate(${(avatarX / 224) * 100}%, ${(avatarY / 224) * 100}%) rotate(${avatarRotate}deg) scale(${avatarScale * (300 / 224)})`,
            transformOrigin: 'center center',
          }}
          onError={() => setImageError(true)}
        />
      ) : (
        <Flame className="w-12 h-12 animate-pulse" style={{ color: primaryColor }} />
      )}
    </div>
  );
}
