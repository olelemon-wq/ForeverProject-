'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Website {
  id: string;
  slug: string;
  name: string;
  category: string;
  status: string;
  expiredAt: string;
  donationPromptPay: string | null;
  donationAccountName: string | null;
  donationActive: boolean;
  role: string;
}

interface Condolence {
  id: string;
  senderName: string;
  relationship: string;
  message: string;
  createdAt: string;
}

interface MemoryPost {
  id: string;
  title: string | null;
  content: string | null;
  mediaUrl: string | null;
  senderName: string;
  createdAt: string;
}

export default function WebmasterDashboard() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [activeSite, setActiveSite] = useState<Website | null>(null);
  const [condolences, setCondolences] = useState<Condolence[]>([]);
  const [pendingPosts, setPendingPosts] = useState<MemoryPost[]>([]);
  
  // Active site editable configs
  const [siteName, setSiteName] = useState('');
  const [siteCategory, setSiteCategory] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#0d9488');
  const [secondaryColor, setSecondaryColor] = useState('#f59e0b');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [visibility, setVisibility] = useState('PUBLIC');
  
  // Donation states
  const [donationPromptPay, setDonationPromptPay] = useState('');
  const [donationAccountName, setDonationAccountName] = useState('');
  const [donationActive, setDonationActive] = useState(false);

  // Storage states
  const [storageUsedBytes, setStorageUsedBytes] = useState(256 * 1024 * 1024); // mock start 256MB
  const [storageQuotaBytes, setStorageQuotaBytes] = useState(1073741824); // 1GB
  
  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userPhone, setUserPhone] = useState('');

  // 1. Initial Load: Fetch User Managed Websites and Phone Identity
  useEffect(() => {
    async function loadWebsites() {
      try {
        const meRes = await fetch('/api/auth/me');
        const meData = await meRes.json();
        if (meData.authenticated) {
          setUserPhone(meData.phone);
        }

        const res = await fetch('/api/tenant/list-mine');
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error);
        
        setWebsites(data.websites || []);
        if (data.websites && data.websites.length > 0) {
          selectWebsite(data.websites[0]);
        }
      } catch (err: any) {
        setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลเว็บไซต์');
      } finally {
        setIsLoading(false);
      }
    }
    loadWebsites();
  }, []);

  // 2. Select Website & Load related details
  const selectWebsite = async (site: Website) => {
    setActiveSite(site);
    setSiteName(site.name);
    setSiteCategory(site.category);
    
    // Set donation fields from DB
    setDonationPromptPay(site.donationPromptPay || '');
    setDonationAccountName(site.donationAccountName || '');
    setDonationActive(site.donationActive || false);

    // Reset status flags
    setError('');
    setSuccess('');
    
    // Fetch pending condolences for this site
    try {
      const res = await fetch(`/api/condolence/pending?websiteId=${site.id}`);
      const data = await res.json();
      if (res.ok) {
        setCondolences(data.condolences || []);
      }
    } catch (err) {
      console.error('Error fetching condolences:', err);
    }

    // Fetch pending memory posts for this site (Memory Wall)
    try {
      const res = await fetch(`/api/memory/pending?websiteId=${site.id}`);
      const data = await res.json();
      if (res.ok) {
        setPendingPosts(data.posts || []);
      }
    } catch (err) {
      console.error('Error fetching memory posts:', err);
    }
  };

  // 3. Save Website Configuration (BR025, BR026, Step 7 Theme Save, Donation fields update)
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSite) return;

    setSaveLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/tenant/update-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: activeSite.id,
          name: siteName,
          category: siteCategory,
          visibility,
          donationPromptPay,
          donationAccountName,
          donationActive,
          themeConfig: {
            primaryColor,
            secondaryColor,
            fontFamily,
            heroStyle: 'Classic',
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('บันทึกการปรับแต่งเว็บไซต์ความทรงจำสำเร็จ');
      
      // Update local websites list state
      setWebsites(websites.map(w => w.id === activeSite.id ? { 
        ...w, 
        name: siteName, 
        category: siteCategory,
        donationPromptPay,
        donationAccountName,
        donationActive
      } : w));
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSaveLoading(false);
    }
  };

  // 4. Moderate Condolence (Approve / Delete - BR027)
  const handleModerateCondolence = async (id: string, action: 'APPROVE' | 'DELETE') => {
    if (!activeSite) return;
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/condolence/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          condolenceId: id,
          action,
          websiteId: activeSite.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(action === 'APPROVE' ? 'อนุมัติคำไว้อาลัยออกเผยแพร่สำเร็จ' : 'ลบคำไว้อาลัยสำเร็จ');
      setCondolences(condolences.filter(c => c.id !== id));
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการคัดกรองข้อมูล');
    }
  };

  // 5. Moderate Memory Post (Approve / Delete)
  const handleModerateMemoryPost = async (id: string, action: 'APPROVE' | 'DELETE') => {
    if (!activeSite) return;
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/memory/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: id,
          action,
          websiteId: activeSite.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(action === 'APPROVE' ? 'อนุมัติโพสต์ขึ้นบอร์ดความทรงจำสำเร็จ' : 'ลบโพสต์สำเร็จ');
      setPendingPosts(pendingPosts.filter(p => p.id !== id));
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการคัดกรองเรื่องราว');
    }
  };

  // 6. Mock Media Upload with Quota Checks (BR014, BR016, Step 8 uploader)
  const handleMockUpload = async (sizeMB: number) => {
    if (!activeSite) return;
    setUploadLoading(true);
    setError('');
    setSuccess('');

    const sizeBytes = sizeMB * 1024 * 1024;
    const fileName = `memory-photo-${Date.now()}.png`;

    try {
      const res = await fetch('/api/media/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: activeSite.id,
          fileName,
          fileType: 'image/png',
          fileSize: sizeBytes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(`อัปโหลดไฟล์ "${fileName}" (${sizeMB} MB) สำเร็จ! บันทึกในคลังภาพ R2 สำเร็จ`);
      setStorageUsedBytes(prev => prev + sizeBytes);
    } catch (err: any) {
      setError(err.message || 'การอัปโหลดไฟล์ขัดข้อง');
    } finally {
      setUploadLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-955 flex items-center justify-center text-white">
        <p className="text-sm font-semibold tracking-wider animate-pulse">กำลังโหลดแผงควบคุมหลังบ้าน...</p>
      </div>
    );
  }

  if (websites.length === 0) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-3xl">🕯️</div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white">ยินดีต้อนรับสู่ FOREVER</h1>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            คุณยังไม่มีเว็บไซต์ความทรงจำในระบบบัญชีของคุณในขณะนี้ มาสร้างหน้ารำลึกแด่ผู้ล่วงลับคนแรกของคุณกันเถอะ
          </p>
        </div>
        <Link href="/manage/create" className="px-6 py-3.5 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-sm hover:brightness-110 active:scale-95 transition">
          สร้างเว็บไซต์แรกของคุณ
        </Link>
      </main>
    );
  }

  const selectedSite = activeSite || websites[0];
  const storagePercentage = Math.min((storageUsedBytes / storageQuotaBytes) * 100, 100);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-955 border-r border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              FOREVER MANAGE
            </span>
          </div>
          <nav className="space-y-2">
            <button className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-800 text-emerald-400 font-semibold text-sm transition">
              <span>📊</span> แผงควบคุม (Dashboard)
            </button>
            <Link href="/manage/create" className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 text-sm transition">
              <span>➕</span> สร้างเว็บไซต์เพิ่ม
            </Link>
          </nav>

          <div className="mt-8 space-y-2">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">เลือกเว็บไซต์จัดการ</label>
            <select 
              value={selectedSite.id} 
              onChange={(e) => {
                const site = websites.find(w => w.id === e.target.value);
                if (site) selectWebsite(site);
              }}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
            >
              {websites.map(w => (
                <option key={w.id} value={w.id}>/{w.slug} ({w.name.substring(0, 10)})</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-8 border-t border-slate-850 pt-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm">👤</div>
            <div>
              <p className="text-xs font-semibold text-white">ผู้ใช้งานบัญชี</p>
              <p className="text-[10px] text-slate-500">{userPhone}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main dashboard content */}
      <main className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full overflow-y-auto">
        
        {success && <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 rounded-2xl font-semibold">✓ {success}</div>}
        {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-xs text-red-400 rounded-2xl font-semibold">⚠️ {error}</div>}

        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-extrabold text-white">{selectedSite.name}</h1>
            <p className="text-sm text-slate-400">ลิงก์ความทรงจำ: <a href={`/${selectedSite.slug}`} target="_blank" className="text-emerald-400 underline">forever.co.th/{selectedSite.slug}</a></p>
          </div>
          <div>
            <span className="px-3.5 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              สถานะบริการ: {selectedSite.status}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Customizer */}
          <form onSubmit={handleSaveConfig} className="lg:col-span-2 p-6 rounded-3xl border border-slate-800 bg-slate-950/40 space-y-6">
            <h3 className="text-lg font-bold text-white mb-2">🎨 ปรับแต่งธีมและข้อมูลทั่วไป</h3>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">ชื่อหน้ารำลึก</label>
              <input 
                type="text" 
                value={siteName} 
                onChange={(e) => setSiteName(e.target.value)} 
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
              />
            </div>

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
                <option value="Inter">Inter (เรียบหรูสากล)</option>
                <option value="Sarabun">Sarabun (ไทยทางการ)</option>
                <option value="Niramit">Niramit (ไทยร่วมสมัย)</option>
              </select>
            </div>

            {/* Donation Settings (Phase 2 integration) */}
            <div className="border-t border-slate-850 pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-white">🌸 เปิดใช้บริการรับเงินทำบุญ (Donation QR Settings)</h4>
                <input 
                  type="checkbox" 
                  checked={donationActive}
                  onChange={() => setDonationActive(!donationActive)}
                  className="w-5 h-5 accent-emerald-500 cursor-pointer"
                />
              </div>

              {donationActive && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">หมายเลขพร้อมเพย์ (PromptPay)</label>
                    <input 
                      type="text" 
                      value={donationPromptPay} 
                      onChange={(e) => setDonationPromptPay(e.target.value)} 
                      placeholder="เช่น 0812345678 หรือ 1234567890123"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">ชื่อบัญชีรับเงินทำบุญ</label>
                    <input 
                      type="text" 
                      value={donationAccountName} 
                      onChange={(e) => setDonationAccountName(e.target.value)} 
                      placeholder="เช่น นายสมชาย รักดี"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={saveLoading}
              className="px-6 py-3 bg-emerald-500 hover:brightness-110 active:scale-95 text-slate-950 font-bold text-xs rounded-xl transition"
            >
              {saveLoading ? 'กำลังบันทึกข้อมูล...' : '💾 บันทึกการตั้งค่าเว็บไซต์'}
            </button>
          </form>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Storage Quota */}
            <section className="p-6 rounded-3xl border border-slate-800 bg-slate-950/40 space-y-4">
              <h3 className="text-base font-bold text-white">💾 พื้นที่จัดเก็บมีเดีย S3 / R2</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                  <span>ใช้งาน: {(storageUsedBytes / (1024 * 1024)).toFixed(1)} MB</span>
                  <span>จาก: {(storageQuotaBytes / (1024 * 1024 * 1024)).toFixed(1)} GB</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${storagePercentage}%` }} />
                </div>
              </div>
              
              <div className="border-t border-slate-850 pt-4 space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">จำลองอัปโหลดไฟล์จริงเพื่อเช็ก Quota</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleMockUpload(10)} 
                    disabled={uploadLoading}
                    className="flex-1 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 rounded-xl text-[10px] text-white font-bold transition"
                  >
                    รูปภาพ (10MB)
                  </button>
                  <button 
                    onClick={() => handleMockUpload(250)} 
                    disabled={uploadLoading}
                    className="flex-1 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 rounded-xl text-[10px] text-amber-500 font-bold transition"
                  >
                    วิดีโอใหญ่ (250MB)
                  </button>
                </div>
              </div>
            </section>

            {/* Privacy settings */}
            <section className="p-6 rounded-3xl border border-slate-800 bg-slate-950/40 space-y-4">
              <h3 className="text-base font-bold text-white">🔒 ความเป็นส่วนตัว</h3>
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
                    <p className="text-xs font-bold text-white">เปิดสาธารณะ (Public)</p>
                    <p className="text-[10px] text-slate-500">ทุกคนเข้าชมและส่งคำไว้อาลัยได้</p>
                  </div>
                </label>
              </div>
            </section>
          </div>
        </div>

        {/* Condolence moderation */}
        <section className="p-6 rounded-3xl border border-slate-800 bg-slate-950/40 space-y-6">
          <h3 className="text-lg font-bold text-white">🕯️ คำไว้อาลัยรออนุมัติ ({condolences.length})</h3>

          {condolences.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-850 rounded-2xl text-slate-500 text-xs">
              ไม่มีข้อความไว้อาลัยค้างอนุมัติในเวลานี้
            </div>
          ) : (
            <div className="space-y-4">
              {condolences.map(c => (
                <div key={c.id} className="p-5 rounded-2xl border border-slate-850 bg-slate-900/10 flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{c.senderName}</span>
                      <span className="px-2 py-0.5 text-[9px] font-semibold bg-slate-850 text-slate-400 rounded">
                        ความสัมพันธ์: {c.relationship}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">"{c.message}"</p>
                  </div>
                  <div className="flex gap-2 self-end sm:self-auto flex-shrink-0">
                    <button 
                      onClick={() => handleModerateCondolence(c.id, 'APPROVE')}
                      className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold transition"
                    >
                      อนุมัติ
                    </button>
                    <button 
                      onClick={() => handleModerateCondolence(c.id, 'DELETE')}
                      className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition"
                    >
                      ลบออก
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Memory Wall Moderation Section (Phase 2 integration) */}
        <section className="p-6 rounded-3xl border border-slate-800 bg-slate-950/40 space-y-6">
          <h3 className="text-lg font-bold text-white">📸 เรื่องราวรออนุมัติบน Memory Wall ({pendingPosts.length})</h3>

          {pendingPosts.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-850 rounded-2xl text-slate-500 text-xs">
              ไม่มีเรื่องราวหรือรูปถ่ายค้างอนุมัติในเวลานี้
            </div>
          ) : (
            <div className="space-y-4">
              {pendingPosts.map(p => (
                <div key={p.id} className="p-5 rounded-2xl border border-slate-850 bg-slate-900/10 flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">ส่งโดย: {p.senderName}</span>
                      {p.title && <span className="text-xs font-semibold text-slate-300">| หัวข้อ: {p.title}</span>}
                    </div>
                    {p.mediaUrl && <p className="text-[10px] text-slate-500 font-mono">แนบไฟล์รูป: {p.mediaUrl}</p>}
                    {p.content && <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">"{p.content}"</p>}
                  </div>
                  <div className="flex gap-2 self-end sm:self-auto flex-shrink-0">
                    <button 
                      onClick={() => handleModerateMemoryPost(p.id, 'APPROVE')}
                      className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold transition"
                    >
                      อนุมัติลงบอร์ด
                    </button>
                    <button 
                      onClick={() => handleModerateMemoryPost(p.id, 'DELETE')}
                      className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition"
                    >
                      ลบออก
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
