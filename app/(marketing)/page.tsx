import Link from 'next/link';

export default function MarketingHome() {
  return (
    <>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.15] text-stone-900">
          บันทึกเรื่องราวและ{' '}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
            ความทรงจำอันเป็นนิรันดร์
          </span>
        </h1>
        <p className="mt-8 text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
          สร้างเว็บไซต์รำลึกถึงผู้ล่วงลับ ครอบครัว สัตว์เลี้ยง หรือเรื่องราวความรัก 
          แบบบริการตนเอง 100% เสร็จสิ้นได้ภายใน 3 นาที เพื่อให้เกียรติประวัติและมรดกชีวิตอยู่คู่กับครอบครัวตลอดไป
        </p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link href="/login" className="px-8 py-4 text-base font-bold rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white hover:brightness-105 transition shadow-[0_6px_20px_rgba(16,185,129,0.3)] active:scale-[0.98]">
            เริ่มสร้างเว็บไซต์ความทรงจำ
          </Link>
          <Link href="/boonkrua-family" className="px-8 py-4 text-base font-semibold rounded-full border border-stone-300 bg-white text-stone-700 hover:text-stone-900 hover:bg-stone-50 transition active:scale-[0.98]">
            ดูตัวอย่างเว็บไซต์
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-stone-200/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl border border-stone-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold text-xl mb-6">
              1
            </div>
            <h3 className="text-xl font-bold mb-3 text-stone-950">สร้างง่ายใน 3 นาที</h3>
            <p className="text-stone-600 leading-relaxed text-sm">
              ออกแบบระบบแบบ Self-Service 100% ใช้งานง่ายด้วยมือถือ เหมาะกับผู้ใช้ทุกช่วงวัย 
              ไม่ต้องเขียนโค้ดหรือมีความรู้ไอทีก็สร้างเว็บได้ทันที
            </p>
          </div>
          <div className="p-8 rounded-3xl border border-stone-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold text-xl mb-6">
              2
            </div>
            <h3 className="text-xl font-bold mb-3 text-stone-950">คลังมีเดียและคำไว้อาลัย</h3>
            <p className="text-stone-600 leading-relaxed text-sm">
              อัปโหลดภาพประทับใจ วิดีโอ เพลง และบันทึกคำไว้อาลัยจากคนสนิท โดยมีการเรียงลำดับสมาชิกครอบครัวเป็นพิเศษ
            </p>
          </div>
          <div className="p-8 rounded-3xl border border-stone-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold text-xl mb-6">
              3
            </div>
            <h3 className="text-xl font-bold mb-3 text-stone-950">QR Code ถาวรสำหรับพิมพ์</h3>
            <p className="text-stone-600 leading-relaxed text-sm">
              รับคิวอาร์โค้ดประจำเว็บไซต์แบบถาวร เพื่อดาวน์โหลดไปจัดพิมพ์ลงในการ์ด ของชำร่วย หรือหนังสืองานรำลึกได้อย่างสวยงาม
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

