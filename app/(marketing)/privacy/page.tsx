import MarketingPageShell, { MarketingSection } from '@/components/marketing/MarketingPageShell';

export default function PrivacyPage() {
  return (
    <MarketingPageShell
      eyebrow="Privacy Policy"
      title="นโยบายความเป็นส่วนตัว"
      subtitle="อัปเดตล่าสุด: กรกฎาคม 2026"
    >
      <MarketingSection title="ข้อมูลที่เราเก็บ">
        <p>
          เราเก็บข้อมูลที่จำเป็นสำหรับการให้บริการ เช่น เบอร์โทรศัพท์สำหรับเข้าสู่ระบบ
          เนื้อหาและไฟล์ที่คุณอัปโหลด และบันทึกการใช้งานเพื่อความปลอดภัยของระบบ
        </p>
      </MarketingSection>

      <MarketingSection title="การใช้ข้อมูล">
        <p>
          ข้อมูลใช้เพื่อให้บริการเว็บไซต์ความทรงจำ การชำระเงิน การแจ้งเตือนต่ออายุ
          และการสนับสนุนลูกค้าเท่านั้น เราไม่ขายข้อมูลส่วนบุคคลให้บุคคลที่สาม
        </p>
      </MarketingSection>

      <MarketingSection title="สิทธิของคุณ">
        <p>
          คุณสามารถขอแก้ไขหรือลบข้อมูลผ่านผู้ดูแลระบบของเว็บไซต์
          หรือติดต่อ hello@forever.co.th สำหรับคำขอที่เกี่ยวกับบัญชีและข้อมูลส่วนบุคคล
        </p>
      </MarketingSection>
    </MarketingPageShell>
  );
}
