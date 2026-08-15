import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ตัวอย่างเว็บไซต์ | FOREVER',
  description:
    'สำรวจเว็บตัวอย่าง FOREVER ครบทุกหมวด — รำลึกถึงผู้ล่วงลับ เรื่องเล่าครอบครัว เรื่องราวเธอกับฉัน งานวิวาห์ แก๊งเพื่อน และน้องที่รัก',
};

export default function ExamplesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
