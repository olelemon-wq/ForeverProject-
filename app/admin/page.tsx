'use client';

import React, { useState } from 'react';

export default function AdminDashboard() {
  // Mock data for Admin insights
  const [stats] = useState({
    revenueToday: '24,000 บาท',
    revenueMonth: '382,000 บาท',
    activeWebsites: '1,421',
    pendingCallbackVerify: '3',
    suspendedWebsites: '12',
  });

  // Mock table of transaction logs (showing verification callback matching F004)
  const [transactions, setTransactions] = useState([
    { id: 'TX9081', slug: 'grandfather-dee', amount: '2,000', status: 'SUCCESS', method: 'PromptPay QR', time: '10:45 น.', callbackVerify: 'VERIFIED' },
    { id: 'TX9080', slug: 'somying-love', amount: '1,500', status: 'SUCCESS', method: 'PromptPay QR', time: '09:20 น.', callbackVerify: 'VERIFIED' },
    { id: 'TX9079', slug: 'little-catty', amount: '500', status: 'PENDING', method: 'PromptPay QR', time: '08:05 น.', callbackVerify: 'AWAITING' },
  ]);

  const forceApproveTransaction = (id: string) => {
    setTransactions(transactions.map(tx => tx.id === id ? { ...tx, status: 'SUCCESS', callbackVerify: 'VERIFIED' } : tx));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold tracking-wider bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent">
            FOREVER ADMIN PLATFORM
          </span>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-800 text-slate-400 border border-slate-700">
            SYSTEM CONTROL
          </span>
        </div>
        <div className="text-xs text-slate-400">
          ผู้ดูแลระบบสูงสุด (Super Admin)
        </div>
      </nav>

      {/* Main content grid */}
      <div className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
        {/* Top summary cards widgets */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/40">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">รายได้วันนี้</span>
            <p className="text-2xl font-black text-white mt-1">{stats.revenueToday}</p>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-2">
              <span>↑</span> +12% เทียบกับเมื่อวาน
            </span>
          </div>
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/40">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">รายได้เดือนนี้</span>
            <p className="text-2xl font-black text-white mt-1">{stats.revenueMonth}</p>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-2">
              <span>↑</span> +8% เทียบกับเป้าหมาย
            </span>
          </div>
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/40">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">เว็บไซต์ทั้งหมด (Active)</span>
            <p className="text-2xl font-black text-white mt-1">{stats.activeWebsites}</p>
            <span className="text-[10px] text-slate-500 font-semibold mt-2 block">
              เป้าหมายปีนี้: 1,000 เว็บ (สเปก BR043)
            </span>
          </div>
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/40">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">รายการชำระรอตรวจสอบ</span>
            <p className="text-2xl font-black text-amber-500 mt-1">{stats.pendingCallbackVerify}</p>
            <span className="text-[10px] text-slate-500 font-semibold mt-2 block">
              ต้องการการตรวจสอบจากแอดมินด่วน
            </span>
          </div>
        </section>

        {/* Action center and transactions list */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main transaction verification section */}
          <section className="lg:col-span-2 p-6 rounded-3xl border border-slate-800 bg-slate-950/40 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-850 pb-4">
              <h3 className="text-lg font-bold text-white">💰 รายการชำระเงินและ Callback Verification (F004)</h3>
              <button className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-xs font-bold text-slate-200 hover:bg-slate-700 transition">
                ส่งออกรายการ Excel/CSV (BR024)
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">รหัสธุรกรรม</th>
                    <th className="pb-3">URL Slug</th>
                    <th className="pb-3">ยอดชำระ</th>
                    <th className="pb-3">สถานะ API Webhook</th>
                    <th className="pb-3">การตรวจสอบ</th>
                    <th className="pb-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-900/10">
                      <td className="py-4 font-mono font-bold text-slate-300">{tx.id}</td>
                      <td className="py-4 font-mono text-slate-400">/{tx.slug}</td>
                      <td className="py-4 text-white font-semibold">{tx.amount} บาท</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          tx.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          tx.callbackVerify === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {tx.callbackVerify}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        {tx.callbackVerify === 'AWAITING' && (
                          <button 
                            onClick={() => forceApproveTransaction(tx.id)}
                            className="px-3 py-1 rounded bg-amber-500 text-slate-950 font-bold hover:brightness-110 active:scale-95 transition"
                          >
                            อนุมัติแทน (Override)
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Quick administrative tools */}
          <div className="space-y-8">
            {/* System Override / Disputes Resolver widget (BR037) */}
            <section className="p-6 rounded-3xl border border-slate-800 bg-slate-950/40 space-y-4">
              <h3 className="text-base font-bold text-white">⚖️ เครื่องมือแอดมิน (Admin Override)</h3>
              <p className="text-xs text-slate-400 leading-normal">
                กรณีเกิดข้อพิพาทสิทธิ์ความเป็นเจ้าของหน้าเว็บ (Ownership Dispute - BR037) 
                หรือต้องการย้ายเบอร์โทรศัพท์เจ้าของหลัก
              </p>
              
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="ค้นหา Slug เว็บไซต์ เช่น somsakt" 
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200"
                />
                <input 
                  type="text" 
                  placeholder="เบอร์โทรศัพท์ใหม่ที่ต้องการโอนสิทธิ์" 
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200"
                />
                <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-bold hover:brightness-110 transition active:scale-[0.98]">
                  โอนสิทธิ์ความเป็นเจ้าของ (Transfer Ownership)
                </button>
              </div>
            </section>

            {/* Audit log snapshot widget */}
            <section className="p-6 rounded-3xl border border-slate-800 bg-slate-950/40 space-y-4">
              <h3 className="text-base font-bold text-white">🛡️ ประวัติกิจกรรมระบบ (Audit Log)</h3>
              <div className="space-y-3 text-[11px]">
                <div className="flex justify-between items-start gap-2 border-b border-slate-850 pb-2">
                  <span className="text-slate-400">โอนสิทธิ์การดูแล /somying-love</span>
                  <span className="text-slate-500 font-mono">15 นาทีที่แล้ว</span>
                </div>
                <div className="flex justify-between items-start gap-2 border-b border-slate-850 pb-2">
                  <span className="text-slate-400">ล็อกอินเบอร์ 081-332-xxxx</span>
                  <span className="text-slate-500 font-mono">40 นาทีที่แล้ว</span>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-slate-400">ต่ออายุเว็บ /grandfather-dee</span>
                  <span className="text-slate-500 font-mono">1 ชั่วโมงที่แล้ว</span>
                </div>
              </div>
              <button className="w-full py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-[11px] font-bold text-slate-300 border border-slate-800 transition">
                ดูบันทึกเหตุการณ์ทั้งหมด (2 ปี)
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
