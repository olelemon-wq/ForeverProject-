import MarketingCategoryPage from '@/components/marketing/MarketingCategoryPage';
import { getMarketingCategory, type MarketingCategorySlug } from '@/lib/marketingCategories';
import { notFound } from 'next/navigation';

export function createMarketingCategoryPage(slug: MarketingCategorySlug) {
  if (!getMarketingCategory(slug)) notFound();
  return <MarketingCategoryPage slug={slug} />;
}
