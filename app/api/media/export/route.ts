import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';
import JSZip from 'jszip';

function escapeCSV(val: any): string {
  if (val === null || val === undefined) return '';
  let str = String(val);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    str = '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

export async function GET(request: Request) {
  try {
    // 1. Authenticate user
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('websiteId');

    if (!websiteId) {
      return NextResponse.json({ error: 'กรุณาระบุรหัสเว็บไซต์ที่ต้องการส่งออกข้อมูล' }, { status: 400 });
    }

    if (!session) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ' }, { status: 401 });
    }

    const decoded = await verifyToken(session);
    if (!decoded || !decoded.phone) {
      return NextResponse.json({ error: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง' }, { status: 401 });
    }

    const webmaster = await db.webmaster.findUnique({
      where: { phone: decoded.phone },
    });

    if (!webmaster) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลผู้ใช้งาน' }, { status: 403 });
    }

    // 2. Check permission for the websiteId
    const permission = await db.websiteWebmaster.findUnique({
      where: {
        websiteId_webmasterId: {
          websiteId,
          webmasterId: webmaster.id,
        },
      },
    });

    if (!permission) {
      return NextResponse.json({ error: 'คุณไม่มีสิทธิ์ดาวน์โหลดข้อมูลของเว็บไซต์นี้' }, { status: 403 });
    }

    // 3. Fetch all tenant-specific data
    const tenant = await db.tenant.findUnique({
      where: { id: websiteId },
    });

    if (!tenant) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลเว็บไซต์นี้' }, { status: 404 });
    }

    const condolences = await db.condolence.findMany({
      where: { websiteId },
      orderBy: { createdAt: 'desc' },
    });

    const familyMembers = await db.familyMember.findMany({
      where: { websiteId },
      orderBy: { createdAt: 'asc' },
    });

    const memoryPosts = await db.memoryPost.findMany({
      where: { websiteId },
      orderBy: { createdAt: 'desc' },
    });

    const ebooks = await db.ebook.findMany({
      where: { websiteId },
      orderBy: { createdAt: 'desc' },
    });

    // 4. Create ZIP archive with JSZip
    const zip = new JSZip();

    // A. README Guide
    const readmeContent = `================================================================================
FOREVER DIGITAL MEMORIAL PLATFORM — MEMORIAL WEBSITE BACKUP
================================================================================
รหัสเว็บไซต์ (Website ID): ${tenant.id}
ชื่อเว็บไซต์ (Name): ${tenant.name}
ลิงก์เว็บไซต์ (Slug): forever.co.th/${tenant.slug}
วันที่ส่งออกข้อมูล (Export Date): ${new Date().toLocaleString('th-TH')}

แฟ้มข้อมูลนี้ประกอบด้วย:
1. manifest.json: ไฟล์ข้อมูลโครงสร้างหลักและธีมของเว็บไซต์ในรูปแบบ JSON
2. condolences.csv: ตารางคำไว้อาลัยทั้งหมด (รายชื่อผู้ส่ง, ความสัมพันธ์, และข้อความไว้อาลัย)
3. family_tree.csv: ตารางลำดับผังครอบครัว 3 รุ่น
4. memory_wall.csv: ตารางเรื่องราวความทรงจำ รูปถ่าย และบทความบน Memory Wall
5. ebooks.csv: ตารางแสดงรายการหนังสือของชำร่วย/หนังสือที่ระลึกที่เคยอัปโหลดไว้

คุณสามารถนำข้อมูลเหล่านี้ไปใช้ในการเปิดอ่าน สำรองข้อมูลเก็บไว้ส่วนตัว หรือส่งต่อให้สมาชิกในครอบครัวได้ค่ะ
`;
    zip.file('README.txt', readmeContent);

    // B. manifest.json
    const manifest = {
      id: tenant.id,
      slug: tenant.slug,
      name: tenant.name,
      category: tenant.category,
      status: tenant.status,
      expiredAt: tenant.expiredAt,
      visibility: tenant.visibility,
      donationPromptPay: tenant.donationPromptPay,
      donationAccountName: tenant.donationAccountName,
      donationActive: tenant.donationActive,
      themeConfig: tenant.themeConfig,
      createdAt: tenant.createdAt,
    };
    zip.file('manifest.json', JSON.stringify(manifest, null, 2));

    // C. condolences.csv
    let condolencesCsv = 'id,senderName,relationship,message,type,isApproved,createdAt\n';
    condolences.forEach(c => {
      condolencesCsv += `${escapeCSV(c.id)},${escapeCSV(c.senderName)},${escapeCSV(c.relationship)},${escapeCSV(c.message)},${escapeCSV(c.type)},${escapeCSV(c.isApproved)},${escapeCSV(c.createdAt.toISOString())}\n`;
    });
    zip.file('condolences.csv', condolencesCsv);

    // D. family_tree.csv
    let familyCsv = 'id,name,relationship,birthYear,deathYear,isDeceased,createdAt\n';
    familyMembers.forEach(f => {
      familyCsv += `${escapeCSV(f.id)},${escapeCSV(f.name)},${escapeCSV(f.relationship)},${escapeCSV(f.birthYear)},${escapeCSV(f.deathYear)},${escapeCSV(f.isDeceased)},${escapeCSV(f.createdAt.toISOString())}\n`;
    });
    zip.file('family_tree.csv', familyCsv);

    // E. memory_wall.csv
    let memoryCsv = 'id,title,content,mediaUrl,mediaType,senderName,isApproved,createdAt\n';
    memoryPosts.forEach(p => {
      memoryCsv += `${escapeCSV(p.id)},${escapeCSV(p.title)},${escapeCSV(p.content)},${escapeCSV(p.mediaUrl)},${escapeCSV(p.mediaType)},${escapeCSV(p.senderName)},${escapeCSV(p.isApproved)},${escapeCSV(p.createdAt.toISOString())}\n`;
    });
    zip.file('memory_wall.csv', memoryCsv);

    // F. ebooks.csv
    let ebooksCsv = 'id,title,author,pdfUrl,totalPages,createdAt\n';
    ebooks.forEach(e => {
      ebooksCsv += `${escapeCSV(e.id)},${escapeCSV(e.title)},${escapeCSV(e.author)},${escapeCSV(e.pdfUrl)},${escapeCSV(e.totalPages)},${escapeCSV(e.createdAt.toISOString())}\n`;
    });
    zip.file('ebooks.csv', ebooksCsv);

    // G. Download and pack images, audio, documents, and book PDFs (Phase 3 spec)
    const medias = await db.media.findMany({
      where: { websiteId, isDeleted: false },
    });

    const videoLinks: string[] = [];

    // 1. Pack standard site Media files
    for (const m of medias) {
      if (m.mimeType.startsWith('video/')) {
        videoLinks.push(`คลังวีดีโอ - ${m.fileName}: ${m.filePath}`);
        continue;
      }

      if (m.mimeType.startsWith('image/') || m.mimeType.startsWith('audio/') || m.mimeType === 'application/pdf') {
        try {
          let url = m.filePath;
          if (!url.startsWith('http://') && !url.startsWith('https://')) {
            const origin = new URL(request.url).origin;
            url = `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
          }
          const fileRes = await fetch(url);
          if (fileRes.ok) {
            const arrayBuffer = await fileRes.arrayBuffer();
            let folder = 'media/others/';
            if (m.mimeType.startsWith('image/')) folder = 'media/images/';
            else if (m.mimeType.startsWith('audio/')) folder = 'media/audio/';
            else if (m.mimeType === 'application/pdf') folder = 'media/documents/';

            zip.file(`${folder}${m.fileName}`, arrayBuffer);
          }
        } catch (fetchErr) {
          console.error(`Failed to fetch media file ${m.fileName}:`, fetchErr);
        }
      }
    }

    // 2. Pack Ebook PDFs
    for (const ebook of ebooks) {
      if (ebook.pdfUrl) {
        try {
          let url = ebook.pdfUrl;
          if (!url.startsWith('http://') && !url.startsWith('https://')) {
            const origin = new URL(request.url).origin;
            url = `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
          }
          const fileRes = await fetch(url);
          if (fileRes.ok) {
            const arrayBuffer = await fileRes.arrayBuffer();
            const safeTitle = ebook.title.replace(/[/\\?%*:|"<>]/g, '-');
            zip.file(`media/ebooks/${safeTitle}.pdf`, arrayBuffer);
          }
        } catch (fetchErr) {
          console.error(`Failed to fetch ebook PDF ${ebook.title}:`, fetchErr);
        }
      }
    }

    // 3. Pack Memory Wall post media
    for (const post of memoryPosts) {
      if (post.mediaUrl && post.mediaType === 'IMAGE') {
        try {
          let url = post.mediaUrl;
          if (!url.startsWith('http://') && !url.startsWith('https://')) {
            const origin = new URL(request.url).origin;
            url = `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
          }
          const fileRes = await fetch(url);
          if (fileRes.ok) {
            const arrayBuffer = await fileRes.arrayBuffer();
            zip.file(`media/memories/post-${post.id}-${post.senderName}.jpg`, arrayBuffer);
          }
        } catch (fetchErr) {
          console.error(`Failed to fetch memory post image for post ${post.id}:`, fetchErr);
        }
      } else if (post.mediaUrl && post.mediaType === 'VIDEO') {
        videoLinks.push(`โพสต์ความทรงจำ - Post by ${post.senderName}: ${post.mediaUrl}`);
      }
    }

    // 4. Save video link records index if any
    if (videoLinks.length > 0) {
      zip.file('media/videos/links.txt', `วิดีโอเหล่านี้มีขนาดใหญ่และต้องใช้แบนด์วิดท์สูง เพื่อหลีกเลี่ยงความล่าช้า/ปัญหา Timeout ในการบีบอัดไฟล์ ZIP คุณสามารถเปิดเข้าดูและดาวน์โหลดได้โดยตรงจากลิงก์ด้านล่างนี้:\n\n` + videoLinks.join('\n'));
    }

    // 5. Generate ZIP content as buffer
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    // 6. Return response
    return new Response(zipBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${tenant.slug}-memorial-backup.zip"`,
      },
    });

  } catch (err: any) {
    console.error('Error generating export ZIP:', err);
    return NextResponse.json({ error: err.message || 'เกิดข้อผิดพลาดในการรวบรวมไฟล์สำรองข้อมูล' }, { status: 500 });
  }
}
