import MarketingPageShell, { MarketingSection } from '@/components/marketing/MarketingPageShell';

export default function TermsPage() {
  return (
    <MarketingPageShell
      eyebrow="Terms of Service"
      title="ข้อกำหนดการใช้งาน"
      subtitle="อัปเดตล่าสุด: กรกฎาคม 2026"
    >
      <MarketingSection title="การยอมรับข้อกำหนด">
        <p>
          การใช้งาน FOREVER ถือว่าคุณยอมรับข้อกำหนดนี้
          หากไม่เห็นด้วย กรุณาหยุดใช้บริการ
        </p>
      </MarketingSection>

      <MarketingSection title="การใช้งานที่เหมาะสม">
        <p>
          ผู้ใช้ต้องไม่อัปโหลดเนื้อหาที่ผิดกฎหมาย ละเมิดสิทธิ์ผู้อื่น หรือก่อความรำคาญ
          เราสงวนสิทธิ์ระงับบริการหากพบการใช้งานที่ขัดต่อนโยบาย
        </p>
      </MarketingSection>

      <MarketingSection title="ค่าบริการและการต่ออายุ">
        <p>
          แพ็กเกจและราคาอธิบายไว้ในหน้าราคา การต่ออายุเป็นรายปี
          หากไม่ต่ออายุ เว็บไซต์อาจถูกปรับสถานะเป็นอ่านอย่างเดียวตามเงื่อนไขบริการ
        </p>
      </MarketingSection>

      <MarketingSection title="ติดต่อ">
        <p>
          สอบถามข้อกำหนดเพิ่มเติมได้ที่ hello@forever.co.th
        </p>
      </MarketingSection>
    </MarketingPageShell>
  );
}
