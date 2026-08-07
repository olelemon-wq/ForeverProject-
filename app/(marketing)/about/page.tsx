import Link from 'next/link';
import MarketingPageShell, { MarketingSection } from '@/components/marketing/MarketingPageShell';

export default function AboutPage() {
  return (
    <MarketingPageShell
      eyebrow="About FOREVER"
      title="เกี่ยวกับเรา"
      subtitle="แพลตฟอร์มสร้างเว็บไซต์ความทรงจำออนไลน์ที่ออกแบบมาให้ทำได้เองทั้งหมด — เรียบง่าย สง่างาม และเคารพทุกช่วงเวลาสำคัญในชีวิต"
    >
      <MarketingSection title="พันธกิจของเรา">
        <p>
          FOREVER เกิดขึ้นเพื่อช่วยให้ครอบครัวและคนรักสามารถเก็บรักษาเรื่องราว ภาพถ่าย
          และคำรำลึกไว้ในพื้นที่ดิจิทัลที่สง่างามและเข้าถึงได้ง่าย ไม่ว่าจะเป็นงานอนุสรณ์
          งานแต่งงาน มรดกตระกูล กลุ่มเพื่อน หรือการรำลึกสัตว์เลี้ยง
        </p>
      </MarketingSection>

      <MarketingSection title="สิ่งที่เราเชื่อ">
        <p>
          ความทรงจำควรได้รับการดูแลอย่างมีเกียรติ ระบบของเราจึงเน้นความเรียบง่าย
          การควบคุมความเป็นส่วนตัว และการอนุมัติเนื้อหาก่อนเผยแพร่ เพื่อให้ผู้ดูแลระบบมั่นใจว่า
          หน้าเว็บจะสะท้อนความรู้สึกของครอบครัวได้อย่างเหมาะสม
        </p>
      </MarketingSection>

      <MarketingSection title="เริ่มต้นใช้งาน">
        <p>
          ดู{' '}
          <Link href="/examples" className="text-emerald-700 font-semibold hover:underline">
            ตัวอย่างเว็บจริงทุกหมวด
          </Link>{' '}
          หรือ{' '}
          <Link href="/login" className="text-emerald-700 font-semibold hover:underline">
            สร้างเว็บของคุณ
          </Link>{' '}
          ได้ทันที
        </p>
      </MarketingSection>
    </MarketingPageShell>
  );
}
