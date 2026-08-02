import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import EbookBookCover from '@/components/public/EbookBookCover';

export type EbookCatalogItem = {
  title: string;
  author: string;
  totalPages: number;
};

type EbookCatalogCardProps = EbookCatalogItem & {
  className?: string;
  coverSize?: 'md' | 'lg';
  href?: string;
  onOpen?: () => void;
};

function CardContent({
  title,
  author,
  totalPages,
  coverSize = 'md',
}: Pick<EbookCatalogCardProps, 'title' | 'author' | 'totalPages' | 'coverSize'>) {
  return (
    <>
      <EbookBookCover title={title} size={coverSize} />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-stone-900 transition-colors group-hover:text-[color:var(--theme-primary,#0d9488)]">
          {title}
        </h3>
        <p className="text-[11px] leading-relaxed text-stone-500">ผู้จัดทำ · {author}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
          <span className="inline-flex items-center gap-1 rounded-full border border-stone-200/90 bg-white px-2.5 py-0.5 text-[10px] font-semibold text-stone-600">
            <FileText className="h-3 w-3 opacity-70" />
            {totalPages} หน้า
          </span>
          <span
            className="inline-flex items-center gap-0.5 text-[10px] font-bold sm:opacity-80 sm:transition sm:group-hover:opacity-100"
            style={{ color: 'var(--theme-primary, #0d9488)' }}
          >
            เปิดอ่าน
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </>
  );
}

const cardClassName =
  'group flex items-start gap-4 rounded-2xl border border-stone-200/75 bg-gradient-to-br from-white via-white to-stone-50/90 p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-stone-300/90 hover:shadow-[0_8px_24px_rgba(28,25,23,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--theme-primary,#0d9488)]/35 sm:p-5';

export default function EbookCatalogCard({
  title,
  author,
  totalPages,
  className,
  coverSize = 'md',
  href,
  onOpen,
}: EbookCatalogCardProps) {
  if (href) {
    return (
      <Link href={href} className={cn(cardClassName, className)}>
        <CardContent title={title} author={author} totalPages={totalPages} coverSize={coverSize} />
      </Link>
    );
  }

  return (
    <button type="button" onClick={onOpen} className={cn(cardClassName, 'w-full cursor-pointer', className)}>
      <CardContent title={title} author={author} totalPages={totalPages} coverSize={coverSize} />
    </button>
  );
}
