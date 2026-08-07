import React from 'react';

interface MarketingPageShellProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function MarketingPageShell({
  eyebrow,
  title,
  subtitle,
  children,
}: MarketingPageShellProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      <div className="text-center mb-12 animate-fade-in">
        {eyebrow ? (
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 mt-4 leading-tight">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-stone-600 mt-4 text-sm sm:text-base leading-relaxed">{subtitle}</p>
        ) : null}
      </div>
      <div className="space-y-8 text-sm text-stone-600 leading-relaxed">{children}</div>
    </div>
  );
}

export function MarketingSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="p-6 sm:p-8 rounded-3xl border border-stone-200 bg-white space-y-3">
      <h2 className="text-base font-bold text-stone-900">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
