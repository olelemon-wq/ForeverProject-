import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ตัวอย่างเว็บไซต์ | FOREVER',
  description:
    'สำรวจเว็บตัวอย่าง FOREVER ครบทุกหมวด — อนุสรณ์บุคคล คู่รัก งานแต่งงาน มรดกตระกูล กลุ่มเพื่อน และสัตว์เลี้ยง',
};

export default function ExamplesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
