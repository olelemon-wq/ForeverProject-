import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const RESERVED_WORDS = [
  'admin',
  'manage',
  'api',
  'payment',
  'www',
  'test',
  'billing',
  'login',
  'register',
  'system',
  'support',
  'root',
  'mail',
  'ftp',
  'demo',
  'favicon.ico',
  '_next',
  'static',
  'public',
  'images',
  'assets',
];

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'กรุณาระบุชื่อลิงก์ URL' }, { status: 400 });
    }

    const cleanSlug = slug.trim().toLowerCase();

    // 1. Length validation (BR006: 3 to 50 characters)
    if (cleanSlug.length < 3 || cleanSlug.length > 50) {
      return NextResponse.json(
        { error: 'ชื่อลิงก์ URL ต้องมีความยาวระหว่าง 3 ถึง 50 ตัวอักษร' },
        { status: 400 }
      );
    }

    // 2. Character set validation (BR006: a-z, 0-9, and hyphen)
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(cleanSlug)) {
      return NextResponse.json(
        { error: 'ชื่อลิงก์ URL ต้องประกอบด้วยตัวอักษรภาษาอังกฤษตัวพิมพ์เล็ก (a-z), ตัวเลข (0-9) หรือขีดกลาง (-) เท่านั้น' },
        { status: 400 }
      );
    }

    // 3. Reserved keywords check
    if (RESERVED_WORDS.includes(cleanSlug)) {
      return NextResponse.json(
        { error: 'ชื่อลิงก์นี้เป็นชื่อที่ระบบสงวนไว้ใช้งานภายใน ไม่สามารถเลือกใช้ได้' },
        { status: 400 }
      );
    }

    // 4. Database duplicate check (BR006)
    const existing = await db.tenant.findUnique({
      where: { slug: cleanSlug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'ชื่อลิงก์นี้ถูกผู้อื่นใช้งานไปแล้ว กรุณาป้อนชื่อใหม่อีกครั้ง' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      isValid: true,
      slug: cleanSlug,
      message: 'ชื่อลิงก์นี้สามารถใช้งานได้',
    });
  } catch (error) {
    console.error('Slug validation error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์ในการตรวจสอบชื่อลิงก์' },
      { status: 500 }
    );
  }
}
