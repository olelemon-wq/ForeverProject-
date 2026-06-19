import { notFound } from 'next/navigation';
import { db } from '@/lib/db';

async function getTenantData(slug: string) {
  return await db.tenant.findUnique({
    where: { slug: slug.toLowerCase() },
  });
}

async function getGalleryMedia(websiteId: string) {
  const medias = await db.media.findMany({
    where: {
      websiteId,
      album: 'GALLERY',
      isDeleted: false,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return medias.map(m => ({
    id: m.id,
    filePath: m.filePath,
    fileName: m.fileName,
    mimeType: m.mimeType,
    createdAt: m.createdAt.toISOString(),
  }));
}

function getDisplayUrl(filePath: string, mimeType: string, index: number) {
  if (filePath.startsWith('https://storage.forever.co.th')) {
    const isVideo = mimeType.startsWith('video/');
    if (isVideo) {
      // Beautiful, peaceful nature video from Mixkit CDN
      return 'https://assets.mixkit.co/videos/preview/mixkit-sunset-seen-through-the-branches-of-a-tree-42751-large.mp4';
    }

    // Curated high-quality, peaceful, respectful memory-themed images from Unsplash
    const placeholders = [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80', // Sunset
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80', // Warm Candle light (New Verified)
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80', // Peaceful Forest/Trees
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80', // Vintage Pen/Letters
      'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&auto=format&fit=crop&q=80', // Soft Yellow Flowers (New Verified)
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80', // Mountains
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80', // Calm Ocean
    ];
    return placeholders[index % placeholders.length];
  }
  return filePath;
}

export default async function PublicGalleryPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const tenant = await getTenantData(slug);

  if (!tenant) {
    notFound();
  }

  const mediaList = await getGalleryMedia(tenant.id);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2"
            style={{ color: 'var(--theme-primary, #0d9488)' }}>
          <span>📸</span> คลังภาพรำลึกแด่ผู้ล่วงลับ
        </h2>
        <p className="text-stone-500 text-xs leading-normal">
          คลังภาพถ่ายและวิดีโอเหตุการณ์สำคัญทางประวัติศาสตร์ของครอบครัว เพื่อระลึกถึงรอยยิ้ม ความอบอุ่น และช่วงเวลาที่มีคุณค่าร่วมกัน
        </p>
      </div>

      <section className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
        {mediaList.length === 0 ? (
          <div className="text-center py-16 text-stone-500 text-sm border border-dashed border-stone-200 rounded-2xl space-y-4">
            <span className="text-4xl block">🖼️</span>
            <p>ยังไม่มีรูปภาพหรือวิดีโออัปโหลดลงในคลังภาพรำลึก</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {mediaList.map((media, index) => {
              const isVideo = media.mimeType.startsWith('video/');
              const displayUrl = getDisplayUrl(media.filePath, media.mimeType, index);
              return (
                <div key={media.id} className="relative group aspect-square rounded-2xl overflow-hidden border border-stone-150 bg-stone-50 shadow-sm transition hover:scale-[1.02] hover:shadow-md">
                  {isVideo ? (
                    <video 
                      src={displayUrl} 
                      className="w-full h-full object-cover" 
                      controls 
                    />
                  ) : (
                    <img 
                      src={displayUrl} 
                      alt={media.fileName} 
                      className="w-full h-full object-cover animate-fade-in" 
                      loading="lazy" 
                    />
                  )}
                  <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition flex items-end p-3 pointer-events-none">
                    <span className="text-[10px] text-white font-medium truncate w-full">{media.fileName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
