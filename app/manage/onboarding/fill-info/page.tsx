'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RotateCw } from 'lucide-react';

function FillInfoRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const site = searchParams.get('site');
    router.replace(site ? '/manage' : '/manage/create');
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center text-stone-600">
      <RotateCw className="w-8 h-8 animate-spin text-blue-600 mb-3" />
      <p className="text-sm font-medium">กำลังไปหน้าจัดการเว็บไซต์...</p>
    </div>
  );
}

export default function OnboardingFillInfoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center text-stone-600">
          <p className="text-sm font-semibold tracking-wider animate-pulse">กำลังโหลด...</p>
        </div>
      }
    >
      <FillInfoRedirect />
    </Suspense>
  );
}
