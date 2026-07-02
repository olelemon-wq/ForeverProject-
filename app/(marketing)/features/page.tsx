import React from 'react';
import Link from 'next/link';
import { 
  Clock, 
  Palette, 
  Calendar, 
  Camera, 
  BookOpen, 
  QrCode, 
  ShieldCheck, 
  Users,
  ArrowRight
} from 'lucide-react';

export default function FeaturesPage() {
  const featureList = [
    {
      icon: <Clock className="w-6 h-6 text-emerald-600" />,
      title: "สร้างเว็บไซต์เสร็จสิ้นใน 3 นาที",
      description: "ระบบออกออกแบบสไตล์ Self-Service 100% ตอบคำถามง่ายๆ ระบบจะสร้างเว็บให้ทันที ไม่ต้องมีพื้นฐานเขียนโปรแกรมใดๆ"
    },
    {
      icon: <Palette className="w-6 h-6 text-emerald-600" />,
      title: "ปรับแต่งโทนสีและฟอนต์อักษร",
      description: "เลือกโทนสีสุภาพและฟอนต์อักษรอันประณีต เช่น LINE Seed Sans TH, Charm, Sarabun เพื่อแสดงความเคารพอย่างสูง"
    },
    {
      icon: <Calendar className="w-6 h-6 text-emerald-600" />,
      title: "กำหนดการพิธีการ์ดออนไลน์",
      description: "สร้างการ์ดแจ้งกำหนดการฌาปนกิจและพิธีสวดที่แชร์ได้ง่ายผ่านโซเชียล พร้อมลิงก์แผนที่นำทางไปยังวัดปลายทาง"
    },
    {
      icon: <Camera className="w-6 h-6 text-emerald-600" />,
      title: "แกลเลอรีรูปถ่ายความทรงจำ",
      description: "จัดเก็บและแสดงภาพบรรยากาศวันวานในดีไซน์ Masonry สวยงามและโหลดรวดเร็ว คัดกรองภาพส่วนตัวได้อย่างมีระเบียบ"
    },
    {
      icon: <BookOpen className="w-6 h-6 text-emerald-600" />,
      title: "หนังสือที่ระลึก Web Reader",
      description: "ผู้เข้ามาร่วมงานสามารถสแกนเปิดอ่านหนังสือธรรมทานหรือบันทึกคำขอบคุณออนไลน์ผ่านสมาร์ทโฟนได้ทันที"
    },
    {
      icon: <QrCode className="w-6 h-6 text-emerald-600" />,
      title: "ดาวน์โหลดคิวอาร์โค้ดถาวร",
      description: "รับ QR Code ประจำหน้าเว็บสำหรับจัดพิมพ์ลงในการ์ดกระดาษ ของชำร่วย หรือบอร์ดหน้างานฌาปนสถานอย่างสวยงาม"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: "ระบบคัดกรองคำไว้อาลัยความปลอดภัยสูง",
      description: "ทุกข้อความคำรำลึกและภาพบนกระดานแชร์ความทรงจำร่วม จะแสดงผลหลังได้รับการอนุมัติจากญาติผู้ดูแลระบบเท่านั้น"
    },
    {
      icon: <Users className="w-6 h-6 text-emerald-600" />,
      title: "แผนผังเครือญาติแสดงความกตัญญู",
      description: "จัดเรียงสมาชิกในครอบครัวและทายาทอย่างเป็นสัดส่วนเพื่อรำลึกถึงรากเหง้าครอบครัวและส่งต่อประวัติศาสตร์อย่างงดงาม"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
          Platform Features
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-stone-900 mt-4 leading-tight">
          ฟังก์ชันพรีเมียมเพื่อบันทึก <br />
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
            ความทรงจำอันทรงคุณค่า
          </span>
        </h1>
        <p className="text-stone-600 mt-6 text-sm sm:text-base leading-relaxed">
          เราออกแบบทุกฟีเจอร์อย่างพิถีพิถันเพื่อมอบหน้าเว็บอันทรงเกียรติและเรียบหรู 
          ช่วยอำนวยความสะดวกในการจัดงานและเก็บบันทึกประวัติศาสตร์ชีวิตของคนที่รักให้คงอยู่อย่างอบอุ่น
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featureList.map((feat, idx) => (
          <div 
            key={idx}
            className="p-8 rounded-3xl border border-stone-200 bg-white hover:border-stone-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.015)] transition duration-300 flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                {feat.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-stone-950">{feat.title}</h3>
                <p className="text-stone-600 text-xs leading-relaxed">{feat.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action Footer */}
      <div className="mt-20 p-10 sm:p-12 rounded-3xl bg-gradient-to-br from-stone-900 to-stone-950 text-white text-center relative overflow-hidden shadow-xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
            เริ่มต้นดูแลเว็บไซต์รำลึกออนไลน์ตั้งแต่วันนี้
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
            ทดลองสร้างหน้าเว็บรำลึกได้ฟรี ปรับแต่งกำหนดการและแกลเลอรีภาพได้ทันที 
            มอบสิ่งที่ดีที่สุดแด่ผู้วายชนม์ที่อยู่ในความทรงจำของคุณ
          </p>
          <div className="pt-4 flex flex-wrap gap-4 justify-center">
            <Link href="/login" className="px-6 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:brightness-105 transition font-bold text-sm shadow-md active:scale-95 flex items-center gap-1.5">
              <span>เริ่มสร้างเว็บไซต์ความทรงจำฟรี</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
