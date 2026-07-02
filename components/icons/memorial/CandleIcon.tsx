import React from 'react';

export default function CandleIcon({ className = '', size = 20 }: { className?: string; size?: number }) {
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
      <path d="M12 2C12 2 10.5 4.5 10.5 6C10.5 7.5 12 8.5 12 8.5C12 8.5 13.5 7.5 13.5 6C13.5 4.5 12 2 12 2Z" />
      <path d="M12 8.5V11" />
      <rect x="8" y="11" width="8" height="11" rx="2" ry="2" />
      <path d="M8 14C8 14 9 14.5 9.5 14C10 13.5 10.5 14 10.5 14" />
      <path d="M13.5 14C13.5 14 14.5 14.5 15 14C15.5 13.5 16 14 16 14" />
    </svg>
  );
}
