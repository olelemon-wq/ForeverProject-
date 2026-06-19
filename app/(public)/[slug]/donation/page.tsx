import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import Link from 'next/link';
import DonationClientForm from './DonationClientForm';

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

  return (
    <div className="space-y-8 animate-fade-in">
      <DonationClientForm 
        websiteId={tenant.id}
        donationPromptPay={tenant.donationPromptPay}
        donationAccountName={tenant.donationAccountName || 'ครอบครัวผู้ล่วงลับ'}
      />
    </div>
  );
}
