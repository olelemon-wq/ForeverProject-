import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import EbookCatalogCard from '@/components/public/EbookCatalogCard';
import { FEATURE_CARD_CLASS } from '@/lib/publicLayout';

export type FeaturedEbook = {
  id: string;
  title: string;
  author: string;
  totalPages: number;
};

type FeaturedEbooksSnippetProps = {
  slug: string;
  title: string;
  ctaText: string;
  books: FeaturedEbook[];
};

export default function FeaturedEbooksSnippet({
  slug,
  title,
  ctaText,
  books,
}: FeaturedEbooksSnippetProps) {
  return (
    <div className={`${FEATURE_CARD_CLASS} space-y-5 rounded-3xl border border-stone-200/80 bg-white p-5 text-left shadow-[0_4px_20px_rgba(0,0,0,0.015)] sm:space-y-6 sm:p-8`}>
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <h2
          className="flex items-center gap-2 text-xl font-bold"
          style={{ color: 'var(--theme-primary, #0d9488)' }}
        >
          <BookOpen className="h-5 w-5" style={{ color: 'var(--theme-primary)' }} />
          {title}
        </h2>
        <Link
          href={`/${slug}/ebooks`}
          className="hidden flex-shrink-0 items-center gap-1 text-xs font-bold transition hover:underline sm:inline-flex"
          style={{ color: 'var(--theme-primary, #0d9488)' }}
        >
          <span>{ctaText}</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {books.map((book) => (
          <EbookCatalogCard
            key={book.id}
            title={book.title}
            author={book.author}
            totalPages={book.totalPages}
            href={`/${slug}/ebooks`}
          />
        ))}
      </div>

      <div className="flex justify-end sm:hidden">
        <Link
          href={`/${slug}/ebooks`}
          className="flex items-center gap-1 text-xs font-bold transition hover:underline"
          style={{ color: 'var(--theme-primary, #0d9488)' }}
        >
          <span>{ctaText}</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
