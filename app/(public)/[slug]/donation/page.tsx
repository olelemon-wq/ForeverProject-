import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import Link from 'next/link';
import DonationClientForm from './DonationClientForm';

export const dynamic = 'force-dynamic';

async function getTenantData(slug: string) {
  return await db.tenant.findUnique({
    where: { slug: slug.toLowerCase() },
  });
}

export default async function PublicDonationPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const tenant = await getTenantData(slug);

  if (!tenant || !tenant.donationActive || !tenant.donationPromptPay) {
    notFound();
  }

  const accountFallback =
    tenant.category === 'Couple'
      ? 'เป้าหมายของเรา'
      : tenant.category === 'Wedding'
        ? 'ของขวัญวันแต่งงาน'
        : tenant.category === 'Friends'
          ? 'กองทุนรวมตัว'
          : tenant.category === 'Pet Memorial'
            ? 'กองทุนช่วยเหลือสัตว์'
            : tenant.category === 'Family Legacy'
              ? 'กองทุนครอบครัว'
              : 'ครอบครัวผู้ล่วงลับ';

  return (
    <div className="animate-fade-in">
      <DonationClientForm 
        websiteId={tenant.id}
        donationPromptPay={tenant.donationPromptPay}
        donationAccountName={tenant.donationAccountName || accountFallback}
        category={tenant.category}
      />
    </div>
  );
}
