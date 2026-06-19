import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import MemoryWallClient from './MemoryWallClient';

async function getTenantData(slug: string) {
  return await db.tenant.findUnique({
    where: { slug: slug.toLowerCase() },
  });
}

async function getApprovedPosts(websiteId: string) {
  const posts = await db.memoryPost.findMany({
    where: {
      websiteId,
      isApproved: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Convert BigInt or Date types to serializable format for client-side React
  return posts.map(p => ({
    id: p.id,
    title: p.title,
    content: p.content,
    mediaUrl: p.mediaUrl,
    mediaType: p.mediaType,
    senderName: p.senderName,
    createdAt: p.createdAt.toISOString(),
  }));
}

export default async function PublicMemoryWallPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const tenant = await getTenantData(slug);

  if (!tenant) {
    notFound();
  }

  const posts = await getApprovedPosts(tenant.id);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-8 shadow-xl">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2"
            style={{ color: 'var(--theme-primary, #0d9488)' }}>
          <span>📸</span> กระดานแชร์ความทรงจำร่วม
        </h2>
        <p className="text-slate-400 text-xs leading-normal">
          ร่วมลงบันทึกภาพถ่ายโบราณ เรื่องเล่าประทับใจ หรือความทรงจำอันทรงคุณค่าที่ได้สัมผัสร่วมกัน แผงความทรงจำนี้รวบรวมเรื่องราวดีๆ ให้อยู่คู่ตราบนานเท่านาน
        </p>
      </div>

      {/* Render Client-side interactive Memory Wall list and submit forms */}
      <MemoryWallClient websiteId={tenant.id} initialPosts={posts} />
    </div>
  );
}
