import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';

export type VideoPlatform = 'youtube' | 'facebook' | 'tiktok' | 'instagram' | 'vimeo';

interface ParsedVideo {
  platform: VideoPlatform;
  id: string;
  canonicalUrl: string;
}

function parseVideoUrl(url: string): ParsedVideo | null {
  const trimmed = url.trim();

  // YouTube
  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|&v=))([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return { platform: 'youtube', id: ytMatch[1], canonicalUrl: `https://www.youtube.com/watch?v=${ytMatch[1]}` };
  }

  // Vimeo
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return { platform: 'vimeo', id: vimeoMatch[1], canonicalUrl: `https://vimeo.com/${vimeoMatch[1]}` };
  }

  // TikTok — handles both desktop & mobile links
  const tiktokMatch = trimmed.match(
    /tiktok\.com\/@[^/]+\/video\/(\d+)|tiktok\.com\/(?:t\/)?([a-zA-Z0-9]+)/
  );
  if (tiktokMatch) {
    const id = tiktokMatch[1] || tiktokMatch[2];
    return { platform: 'tiktok', id, canonicalUrl: trimmed };
  }

  // Facebook — handles fb.watch, facebook.com/watch, facebook.com/*/videos/*
  if (/facebook\.com|fb\.watch|fb\.com/.test(trimmed)) {
    const fbVideoMatch = trimmed.match(/\/videos\/(\d+)/) || trimmed.match(/v=(\d+)/);
    const id = fbVideoMatch?.[1] || trimmed.replace(/[^a-zA-Z0-9]/g, '').slice(0, 32);
    return { platform: 'facebook', id, canonicalUrl: trimmed };
  }

  // Instagram — Reels or /p/ posts
  const igMatch = trimmed.match(
    /instagram\.com\/(?:reel|reels|p)\/([a-zA-Z0-9_-]+)/
  );
  if (igMatch) {
    return { platform: 'instagram', id: igMatch[1], canonicalUrl: `https://www.instagram.com/reel/${igMatch[1]}/` };
  }

  return null;
}

const PLATFORM_LABELS: Record<VideoPlatform, string> = {
  youtube: 'YouTube',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  instagram: 'Instagram',
  vimeo: 'Vimeo',
};

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ' }, { status: 401 });
    }

    const decoded = await verifyToken(session);
    if (!decoded || !decoded.phone) {
      return NextResponse.json({ error: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง' }, { status: 401 });
    }

    const { videoUrl, title, websiteId } = await request.json();

    if (!videoUrl || !websiteId) {
      return NextResponse.json({ error: 'กรุณาระบุลิงก์วิดีโอและรหัสเว็บไซต์' }, { status: 400 });
    }

    const parsed = parseVideoUrl(videoUrl);
    if (!parsed) {
      return NextResponse.json(
        { error: 'ลิงก์ไม่ถูกต้อง — รองรับ YouTube, Facebook, TikTok, Instagram และ Vimeo' },
        { status: 400 }
      );
    }

    const webmaster = await db.webmaster.findUnique({
      where: { phone: decoded.phone },
    });

    if (!webmaster) {
      return NextResponse.json({ error: 'ไม่พบสิทธิ์ผู้ใช้งานดูแลระบบนี้' }, { status: 403 });
    }

    const permission = await db.websiteWebmaster.findUnique({
      where: {
        websiteId_webmasterId: { websiteId, webmasterId: webmaster.id },
      },
    });

    if (!permission) {
      return NextResponse.json({ error: 'คุณไม่มีสิทธิ์จัดเก็บข้อมูลของเว็บไซต์ความทรงจำนี้' }, { status: 403 });
    }

    const platformLabel = PLATFORM_LABELS[parsed.platform];
    const mimeType = `video/${parsed.platform}`;

    const media = await db.media.create({
      data: {
        websiteId,
        filePath: parsed.canonicalUrl,
        fileName: title || `วิดีโอ ${platformLabel}`,
        fileSize: BigInt(0),
        mimeType,
        fileHash: `${parsed.platform}-${parsed.id}`,
        album: 'GALLERY',
      },
    });

    await db.auditLog.create({
      data: {
        websiteId,
        webmasterId: webmaster.id,
        action: 'STORAGE',
        details: `เพิ่มลิงก์วิดีโอ ${platformLabel} สำเร็จ: ${title || `วิดีโอ ${platformLabel}`}`,
      },
    });

    return NextResponse.json({
      success: true,
      filePath: media.filePath,
      mediaId: media.id,
      platform: parsed.platform,
    });
  } catch (error) {
    console.error('Video link submit error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดภายในระบบในการบันทึกลิงก์วิดีโอ' },
      { status: 500 }
    );
  }
}
