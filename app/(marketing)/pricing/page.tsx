import React from 'react';
import Link from 'next/link';
import { Check, ArrowRight, HelpCircle } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: "ฟรี (Trial Plan)",
      price: "0",
      period: "ทดลองใช้งาน 30 วัน",
      description: "เหมาะสำหรับการเริ่มต้นสร้างเพื่อกรอกข้อมูลกำหนดการพิธีเบื้องต้นแบบรวดเร็ว",
      buttonText: "เริ่มต้นทดลองใช้ฟรี",
      href: "/login",
      featured: false,
      features: [
        "พื้นที่จัดเก็บความจำ 50 MB",
        "กรอกประวัติย่อของผู้วายชนม์",
        "กำหนดการพิธีรดน้ำ / สวดอภิธรรม",
        "สมุดลงนามไว้อาลัยผู้มีเกียรติ",
        "ลิงก์แชร์ลงโซเชียลพื้นฐาน"
      ]
    },
    {
      name: "FOREVER Plan (ปีแรก)",
      price: "2,000",
      period: "ชำระครั้งแรกใช้งาน 1 ปีเต็ม",
      description: "บริการระดับพรีเมียมครบวงจรสำหรับลงรายละเอียดกำหนดการและเก็บบันทึกประวัติศาสตร์ชีวิตถาวร",
      buttonText: "สมัครสมาชิกแบบพรีเมียม",
      href: "/login",
      featured: true,
      features: [
        "พื้นที่จัดเก็บความจำ 1 GB (เก็บภาพความคมชัดสูงได้จำนวนมาก)",
        "กำหนดการและแผนที่นำทางระบบ Google Maps",
        "การ์ดการกำหนดพิธีเลือกดีไซน์พิมพ์ลายทอง (Gold Foil)",
        "คิวอาร์โค้ดดาวน์โหลดความละเอียดสูงถาวรสำหรับแผ่นการ์ด/ของชำร่วย",
        "แกลเลอรีรูปภาพความทรงจำ Masonry สไลเดอร์",
        "บอร์ดแชร์รูปภาพและเรื่องเล่าร่วมกัน (Memory Wall)",
        "ธรรมทานหนังสืองานศพ Web Reader โหลดอ่านออนไลน์ไม่อั้น",
        "ระบบความปลอดภัยบล็อกบอทและอนุมัติข้อความก่อนขึ้นเว็บ"
      ]
    },
    {
      name: "การต่ออายุบริการรายปี (Renewal Plan)",
      price: "2,000",
      period: "ต่อบริการครั้งละ 1 ปี",
      description: "สำหรับบำรุงรักษาระบบและดูแลให้ความทรงจำและคำไว้อาลัยของคนที่คุณรักอยู่ตลอดไป",
      buttonText: "ดูข้อมูลการดูแลต่ออายุ",
      href: "/login",
      featured: false,
      features: [
        "รักษาสิทธิ์ข้อมูล 1 GB และชื่อลิงก์เดิมให้อยู่บนอินเทอร์เน็ตตลอดไป",
        "ไม่มีโฆษณาคั่นรบกวนความเงียบสงบสง่างาม",
        "ระบบสนับสนุนความเสถียรและความปลอดภัยของเซิร์ฟเวอร์",
        "แก้ไขปรับปรุงประวัติและรูปภาพได้ตลอดเวลา"
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
          Transparent Pricing
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-stone-900 mt-4 leading-tight">
          แพ็กเกจราคาและบริการ <br />
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
            ที่เรียบง่ายและโปร่งใส
          </span>
        </h1>
        <p className="text-stone-600 mt-6 text-sm sm:text-base leading-relaxed">
          ไม่มีค่าธรรมเนียมแอบแฝง ไม่มีโฆษณามารบกวนความสงบสง่างามในหน้าความทรงจำ 
          ชำระเพียงค่าบำรุงรักษาระบบรายปีปกติ เพื่อสนับสนุนการทำงานของพื้นที่รำลึกตลอดไป
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan, idx) => (
          <div 
            key={idx}
            className={`p-8 rounded-3xl border flex flex-col justify-between transition duration-300 relative ${
              plan.featured 
                ? 'border-emerald-600 bg-white shadow-[0_12px_40px_rgba(16,185,129,0.06)] scale-100 lg:scale-[1.03] z-10' 
                : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm'
            }`}
          >
            {plan.featured && (
              <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white bg-emerald-600 shadow-sm">
                ยอดนิยม & แนะนำ
              </span>
            )}
            
            <div className="space-y-8">
              {/* Header */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-stone-950">{plan.name}</h3>
                <p className="text-stone-500 text-xs min-h-[48px] leading-relaxed">{plan.description}</p>
                <div className="pt-4 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-stone-950 font-mono">{plan.price}</span>
                  <span className="text-xs text-stone-500 font-bold">บาท</span>
                  <span className="text-xs text-stone-400">/ {plan.period}</span>
                </div>
              </div>

              {/* Features List */}
              <div className="border-t border-stone-100 pt-6">
                <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-wide mb-4">บริการที่ครอบคลุม:</h4>
                <ul className="space-y-3.5">
                  {plan.features.map((feat, fidx) => (
                    <li key={fidx} className="flex items-start gap-2.5 text-xs text-stone-750">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="leading-normal">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action button */}
            <div className="pt-8 mt-auto">
              <Link 
                href={plan.href}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition duration-200 text-center block active:scale-[0.98] ${
                  plan.featured
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                    : 'bg-stone-50 border border-stone-250 text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {plan.buttonText}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Small block */}
      <div className="mt-24 max-w-3xl mx-auto space-y-8">
        <h2 className="text-xl font-bold text-center text-stone-950 flex items-center justify-center gap-1.5">
          <HelpCircle className="w-5 h-5 text-emerald-600" /> คำถามที่พบบ่อย (FAQs)
        </h2>
        <div className="space-y-6">
          <div className="space-y-2 p-6 rounded-2xl bg-white border border-stone-200 text-left">
            <h4 className="text-xs font-black text-stone-900">1. การต่ออายุบริการทำอย่างไร และถ้าไม่ต่ออายุข้อมูลจะหายหรือไม่?</h4>
            <p className="text-xs text-stone-600 leading-relaxed pl-1">
              ระบบจะทำการส่ง SMS และจัดเก็บป้ายเตือนต่ออายุบริการล่วงหน้า 30 วันก่อนครบปี 
              หากคุณไม่ได้ชำระค่าบริการต่ออายุ เว็บไซต์จะถูกปรับสถานะเป็นอ่านอย่างเดียว (Read-Only) เป็นเวลา 90 วัน 
              ก่อนจะเข้าสู่ระบบการปิดปรับปรุงชั่วคราว ข้อมูลภาพและคำไว้อาลัยจะไม่ถูกลบในทันทีเพื่อให้ครอบครัวสามารถตัดสินใจได้ค่ะ
            </p>
          </div>
          <div className="space-y-2 p-6 rounded-2xl bg-white border border-stone-200 text-left">
            <h4 className="text-xs font-black text-stone-900">2. หากมีข้อมูลเกินความจุ 1 GB สามารถขอเพิ่มความจุได้หรือไม่?</h4>
            <p className="text-xs text-stone-600 leading-relaxed pl-1">
              ในระบบจัดการเว็บไซต์ (Dashboard) ในอนาคต จะมีส่วนควบคุมการอัปเกรดพื้นที่จัดเก็บข้อมูล (Storage Upgrade) 
              เช่น การขอเพิ่มพื้นที่พิเศษตามความเหมาะสมในการจัดเก็บวิดีโอและไฟล์เสียงความระลึกถึงที่ใหญ่ขึ้น
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
