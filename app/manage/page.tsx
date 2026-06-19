'use client';

import React, { useState } from 'react';

export default function WebmasterDashboard() {
  // Mock states for Webmaster options
  const [primaryColor, setPrimaryColor] = useState('#0d9488');
  const [secondaryColor, setSecondaryColor] = useState('#f59e0b');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [visibility, setVisibility] = useState('PUBLIC');
  const [commentsApproval, setCommentsApproval] = useState(true);

  // Mock list of condolences awaiting approval
  const [condolences, setCondolences] = useState([
    { id: 1, name: 'สมบัติ พูนพูน', relation: 'เพื่อนร่วมงาน', message: 'เสียใจอย่างยิ่งกับการจากไปของพี่สมศักดิ์ครับ ท่านเป็นหัวหน้าที่ดีเสมอมา', date: '10 นาทีที่แล้ว' },
    { id: 2, name: 'ชลิดา รักสงบ', relation: 'หลาน', message: 'ขอให้คุณตาพักผ่อนให้สบายนะคะ หลานๆ จะระลึกถึงคุณตาเสมอค่ะ', date: '1 ชั่วโมงที่แล้ว' },
  ]);

  const approveCondolence = (id: number) => {
    setCondolences(condolences.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              FOREVER MANAGE
            </span>
          </div>
          <nav className="space-y-2">
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-800 text-emerald-400 font-semibold text-sm transition">
              <span>📊</span> แผงควบคุม (Dashboard)
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 text-sm transition">
              <span>🎨</span> ปรับแต่งธีมเว็บ
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 text-sm transition">
              <span>📸</span> อัปโหลดรูปภาพ/วิดีโอ
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 text-sm transition">
              <span>🕯️</span> จัดการคำไว้อาลัย
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 text-sm transition">
              <span>💳</span> แพ็กเกจและสมาชิก
            </a>
          </nav>
        </div>
        <div className="mt-8 border-t border-slate-800 pt-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm">👤</div>
            <div>
              <p className="text-xs font-semibold text-white">081-xxx-xxxx</p>
              <p className="text-[10px] text-slate-500">สถานะ: Webmaster</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main dashboard content */}
      <main className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {/* Header Widget */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-extrabold text-white">การจัดการเว็บไซต์</h1>
            <p className="text-sm text-slate-400">ชื่อโดเมน: <a href="/somsakt" target="_blank" className="text-emerald-400 underline">forever.co.th/somsakt</a></p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              สถานะ: สมาชิกปกติ (Active)
            </span>
          </div>
        </header>

        {/* Dashboard Grid widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Theme Customizer widget */}
          <section className="lg:col-span-2 p-6 rounded-3xl border border-slate-800 bg-slate-950/40 space-y-6">
            <h3 className="text-lg font-bold text-white mb-2">🎨 Theme Settings & Colors</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Primary Color</label>
                <div className="flex gap-3 items-center">
                  <input 
                    type="color" 
                    value={primaryColor} 
                    onChange={(e) => setPrimaryColor(e.target.value)} 
                    className="w-10 h-10 rounded-xl border border-slate-800 cursor-pointer"
                  />
                  <input 
                    type="text" 
                    value={primaryColor} 
                    onChange={(e) => setPrimaryColor(e.target.value)} 
                    className="flex-1 px-4 py-2 text-sm bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Secondary Color</label>
                <div className="flex gap-3 items-center">
                  <input 
                    type="color" 
                    value={secondaryColor} 
                    onChange={(e) => setSecondaryColor(e.target.value)} 
                    className="w-10 h-10 rounded-xl border border-slate-800 cursor-pointer"
                  />
                  <input 
                    type="text" 
                    value={secondaryColor} 
                    onChange={(e) => setSecondaryColor(e.target.value)} 
                    className="flex-1 px-4 py-2 text-sm bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Font Style (Family)</label>
              <select 
                value={fontFamily} 
                onChange={(e) => setFontFamily(e.target.value)} 
                className="w-full px-4 py-2.5 text-sm bg-slate-900 border border-slate-800 rounded-xl text-white"
              >
                <option value="Inter">Inter (เรียบหรู ทันสมัย)</option>
                <option value="Sarabun">Sarabun (ไทยทางการ สุภาพ)</option>
                <option value="Niramit">Niramit (ไทยวิจิตร งดงาม)</option>
              </select>
            </div>

            {/* Live Theme Preview Box */}
            <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/50 space-y-4">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">ตัวอย่างการแสดงผลฝั่งผู้ใช้</span>
              <div className="text-center p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="w-12 h-12 rounded-full border-2 mx-auto flex items-center justify-center text-sm" style={{ borderColor: primaryColor }}>🕯️</div>
                <h4 className="text-sm font-bold text-white">คุณพ่อ สมศักดิ์ เจริญยิ่ง</h4>
                <p className="text-xs text-slate-400" style={{ fontFamily }}>ตัวอย่างรูปแบบตัวอักษรของระบบความทรงจำ</p>
                <button className="px-4 py-1.5 text-xs font-semibold rounded-full text-slate-950" style={{ backgroundColor: primaryColor }}>
                  เขียนคำไว้อาลัย
                </button>
              </div>
            </div>
          </section>

          {/* Sidebar Widgets */}
          <div className="space-y-8">
            
            {/* Storage Usage Widget */}
            <section className="p-6 rounded-3xl border border-slate-800 bg-slate-950/40 space-y-4">
              <h3 className="text-base font-bold text-white">💾 พื้นที่จัดเก็บมีเดีย</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                  <span>ใช้งานไป 245 MB</span>
                  <span>จากทั้งหมด 1.0 GB</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-850 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '24.5%' }} />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                * ขนาดนับเฉพาะไฟล์ออริจินัล (รูปถ่าย วิดีโอ เสียง เอกสาร PDF) ไม่นับรูปย่อ Thumbnail (BR014)
              </p>
              <button className="w-full py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-xs font-bold text-emerald-400 border border-slate-800 hover:border-slate-700 transition">
                ⚡ อัปเกรดความจุเพิ่ม
              </button>
            </section>

            {/* Visibility Settings Widget */}
            <section className="p-6 rounded-3xl border border-slate-800 bg-slate-950/40 space-y-4">
              <h3 className="text-base font-bold text-white">🔒 ความเป็นส่วนตัวของเว็บ</h3>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="visibility" 
                    value="PUBLIC" 
                    checked={visibility === 'PUBLIC'}
                    onChange={() => setVisibility('PUBLIC')}
                    className="accent-emerald-500 w-4 h-4"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">สาธารณะ (Public)</p>
                    <p className="text-[10px] text-slate-500">ทุกคนเข้าชมและร่วมพิมพ์คำไว้อาลัยได้</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="visibility" 
                    value="PRIVATE" 
                    checked={visibility === 'PRIVATE'}
                    onChange={() => setVisibility('PRIVATE')}
                    className="accent-emerald-500 w-4 h-4"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">ส่วนตัวเฉพาะครอบครัว (Private)</p>
                    <p className="text-[10px] text-slate-500">เฉพาะผู้ที่มีลิงก์เข้าดูเท่านั้นที่เข้าถึงหน้าได้</p>
                  </div>
                </label>
              </div>

              <div className="border-t border-slate-850 pt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">กลั่นกรองคำไว้อาลัยก่อนลงเว็บ</p>
                  <p className="text-[10px] text-slate-500">คำไว้อาลัยใหม่ต้องกดยืนยันก่อนเสมอ</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={commentsApproval} 
                  onChange={() => setCommentsApproval(!commentsApproval)}
                  className="accent-emerald-500 w-5 h-5 cursor-pointer"
                />
              </div>
            </section>
          </div>
        </div>

        {/* Condolence Moderation Section */}
        <section className="p-6 rounded-3xl border border-slate-800 bg-slate-950/40 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">🕯️ คำไว้อาลัยรอการอนุมัติ ({condolences.length})</h3>
            <span className="text-xs text-slate-400">ระบบคัดกรองคำหยาบคายเบื้องต้นเปิดทำงานอยู่</span>
          </div>

          {condolences.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-850 rounded-2xl text-slate-500 text-sm">
              ไม่มีข้อความรออนุมัติในขณะนี้
            </div>
          ) : (
            <div className="space-y-4">
              {condolences.map(item => (
                <div key={item.id} className="p-5 rounded-2xl border border-slate-850 bg-slate-900/30 flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-bold text-white">{item.name}</span>
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-400 rounded">
                        ความสัมพันธ์: {item.relation}
                      </span>
                      <span className="text-[10px] text-slate-500">{item.date}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">"{item.message}"</p>
                  </div>
                  <div className="flex gap-2 self-end sm:self-auto">
                    <button 
                      onClick={() => approveCondolence(item.id)}
                      className="px-4 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/30 text-xs font-bold transition"
                    >
                      อนุมัติ
                    </button>
                    <button 
                      onClick={() => approveCondolence(item.id)}
                      className="px-4 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 text-xs font-bold transition"
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
