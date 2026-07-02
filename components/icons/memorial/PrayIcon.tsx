import React from 'react';

export default function PrayIcon({ className = '', size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2C12 2 9 8 9 12C9 16 12 22 12 22C12 22 15 16 15 12C15 8 12 2 12 2Z" />
      <path d="M12 10C10.5 7.5 7 8 7 12C7 16 10.5 20.5 12 22" />
      <path d="M12 10C13.5 7.5 17 8 17 12C17 16 13.5 20.5 12 22" />
      <path d="M12 15C9.5 13 4 14 4 17C4 20 8.5 21.5 12 22" />
      <path d="M12 15C14.5 13 20 14 20 17C20 20 15.5 21.5 12 22" />
    </svg>
  );
}
