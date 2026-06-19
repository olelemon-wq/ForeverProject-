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

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  birthYear: string | null;
  deathYear: string | null;
  isDeceased: boolean;
}

interface Ebook {
  id: string;
  title: string;
  author: string;
  pdfUrl: string;
  totalPages: number;
  pages: string[];
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
  
  // Family Tree states
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [familyId, setFamilyId] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [familyRelationship, setFamilyRelationship] = useState('CHILD');
  const [familyBirthYear, setFamilyBirthYear] = useState('');
  const [familyDeathYear, setFamilyDeathYear] = useState('');
  const [familyIsDeceased, setFamilyIsDeceased] = useState(false);
  const [familyFormOpen, setFamilyFormOpen] = useState(false);

  // E-Book states
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [ebookId, setEbookId] = useState('');
  const [ebookTitle, setEbookTitle] = useState('');
  const [ebookAuthor, setEbookAuthor] = useState('');
  const [ebookTotalPages, setEbookTotalPages] = useState('4');
  const [ebookPagesText, setEbookPagesText] = useState('');
  const [ebookFile, setEbookFile] = useState<File | null>(null);
  const [ebookFormOpen, setEbookFormOpen] = useState(false);

  // Renewal states (Phase 2 Expiration Banner alignment)
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [renewRefId, setRenewRefId] = useState('');
  const [renewAmount, setRenewAmount] = useState(2000);
  const [renewLoading, setRenewLoading] = useState(false);

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

    // Fetch Family Members
    try {
      const res = await fetch(`/api/family/list?websiteId=${site.id}`);
      const data = await res.json();
      if (res.ok) {
        setFamilyMembers(data.members || []);
      }
    } catch (err) {
      console.error('Error fetching family members:', err);
    }

    // Fetch E-Books
    try {
      const res = await fetch(`/api/ebook/list?websiteId=${site.id}`);
      const data = await res.json();
      if (res.ok) {
        setEbooks(data.ebooks || []);
      }
    } catch (err) {
      console.error('Error fetching ebooks:', err);
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

  // 7. Family Tree Handlers
  const handleSaveFamilyMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSite) return;

    setSaveLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/family/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: familyId || undefined,
          websiteId: activeSite.id,
          name: familyName,
          relationship: familyRelationship,
          birthYear: familyBirthYear || null,
          deathYear: familyDeathYear || null,
          isDeceased: familyIsDeceased,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('บันทึกข้อมูลสมาชิกเครือญาติสำเร็จ');
      
      // Reload family members
      const listRes = await fetch(`/api/family/list?websiteId=${activeSite.id}`);
      const listData = await listRes.json();
      if (listRes.ok) setFamilyMembers(listData.members || []);

      resetFamilyForm();
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูลเครือญาติ');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteFamilyMember = async (memberId: string) => {
    if (!activeSite) return;
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลญาติท่านนี้?')) return;

    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/family/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, websiteId: activeSite.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('ลบข้อมูลสมาชิกเครือญาติสำเร็จ');
      setFamilyMembers(familyMembers.filter(m => m.id !== memberId));
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการลบข้อมูลญาติ');
    }
  };

  const editFamilyMember = (m: FamilyMember) => {
    setFamilyId(m.id);
    setFamilyName(m.name);
    setFamilyRelationship(m.relationship);
    setFamilyBirthYear(m.birthYear || '');
    setFamilyDeathYear(m.deathYear || '');
    setFamilyIsDeceased(m.isDeceased);
    setFamilyFormOpen(true);
  };

  const resetFamilyForm = () => {
    setFamilyId('');
    setFamilyName('');
    setFamilyRelationship('CHILD');
    setFamilyBirthYear('');
    setFamilyDeathYear('');
    setFamilyIsDeceased(false);
    setFamilyFormOpen(false);
  };

  // 8. E-Book Handlers
  const handleSaveEbook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSite) return;

    setSaveLoading(true);
    setError('');
    setSuccess('');

    // Simulate S3 quota check and file record registration
    const fileSize = ebookFile ? ebookFile.size : 5 * 1024 * 1024; // Default mock 5MB
    const fileName = ebookFile ? ebookFile.name : `ebook-booklet-${Date.now()}.pdf`;

    try {
      // 1. Quota check API
      const quotaRes = await fetch('/api/media/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: activeSite.id,
          fileName,
          fileType: 'application/pdf',
          fileSize,
        }),
      });

      const quotaData = await quotaRes.json();
      if (!quotaRes.ok) throw new Error(quotaData.error);

      // 2. Submit Booklet metadata
      const pagesArray = ebookPagesText.split('[PAGE]').map(p => p.trim()).filter(Boolean);
      if (pagesArray.length === 0) {
        // Fallback default pages if user did not provide pages
        const pagesCount = parseInt(ebookTotalPages, 10) || 1;
        for (let i = 1; i <= pagesCount; i++) {
          pagesArray.push(`หน้า ${i}: ข้อความนำเสนอธรรมสติและคำกล่าวขอบคุณของผู้ล่วงลับ...`);
        }
      }

      const res = await fetch('/api/ebook/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ebookId || undefined,
          websiteId: activeSite.id,
          title: ebookTitle,
          author: ebookAuthor,
          pdfUrl: quotaData.filePath || `https://storage.forever.co.th/uploads/${activeSite.id}/${fileName}`,
          totalPages: pagesArray.length,
          pages: pagesArray,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('อัปโหลดหนังสือที่ระลึกธรรมทานและสร้างระบบ Web Reader สำเร็จ!');
      setStorageUsedBytes(prev => prev + fileSize);

      // Reload ebooks
      const listRes = await fetch(`/api/ebook/list?websiteId=${activeSite.id}`);
      const listData = await listRes.json();
      if (listRes.ok) setEbooks(listData.ebooks || []);

      resetEbookForm();
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการจัดการข้อมูลหนังสือ');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteEbook = async (ebId: string) => {
    if (!activeSite) return;
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบหนังสือที่ระลึกนี้?')) return;

    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/ebook/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ebookId: ebId, websiteId: activeSite.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('ลบหนังสือที่ระลึกสำเร็จ');
      setEbooks(ebooks.filter(b => b.id !== ebId));
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการลบหนังสือ');
    }
  };

  const editEbook = (b: Ebook) => {
    setEbookId(b.id);
    setEbookTitle(b.title);
    setEbookAuthor(b.author);
    setEbookTotalPages(String(b.totalPages));
    setEbookPagesText(b.pages.join(' \n[PAGE]\n '));
    setEbookFormOpen(true);
  };

  const resetEbookForm = () => {
    setEbookId('');
    setEbookTitle('');
    setEbookAuthor('');
    setEbookTotalPages('4');
    setEbookPagesText('');
    setEbookFile(null);
    setEbookFormOpen(false);
  };

  // 9. Renewal Handler (Phase 2 Expiration Banner alignment)
  const handleRequestRenewal = async () => {
    if (!selectedSite) return;
    setRenewLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/payment/create-renew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteId: selectedSite.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setRenewRefId(data.refId);
      setRenewAmount(data.amount);
      setRenewModalOpen(true);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการขอต่ออายุบริการ');
    } finally {
      setRenewLoading(false);
    }
  };

  const handleSimulateRenewSuccess = async () => {
    if (!selectedSite || !renewRefId) return;
    setRenewLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/payment/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refId: renewRefId,
          amount: renewAmount,
          status: 'SUCCESS',
          signature: 'MOCK_SIGNATURE_OK_2026',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('ต่ออายุบริการเว็บไซต์สำเร็จ! ขยายเวลาการใช้งานเรียบร้อยแล้วค่ะ');
      setRenewModalOpen(false);

      // Reload website details to refresh expiry date
      const meRes = await fetch('/api/tenant/list-mine');
      const meData = await meRes.json();
      if (meRes.ok && meData.websites) {
        setWebsites(meData.websites);
        const updated = meData.websites.find((w: any) => w.id === selectedSite.id);
        if (updated) selectWebsite(updated);
      }
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการจำลองการชำระเงินต่ออายุ');
    } finally {
      setRenewLoading(false);
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

  // Dynamic invoice lists matching expiredAt dates (Thai receipt logs)
  const invoiceLogs = [
    {
      id: `INV-2026-${Math.floor(10000 + selectedSite.slug.charCodeAt(0) * 123) % 90000}`,
      refId: `QR-${selectedSite.slug}-9011`,
      amount: '2,000.00 บาท',
      status: 'SUCCESS',
      date: selectedSite.expiredAt 
        ? new Date(new Date(selectedSite.expiredAt).getTime() - 365 * 24 * 60 * 60 * 1000).toLocaleDateString('th-TH')
        : new Date().toLocaleDateString('th-TH'),
      desc: 'ค่าธรรมเนียมจดทะเบียนและดูแลรักษาระบบรายปี (First Year + ความจุ 1GB)'
    }
  ];

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

        {/* Expiration warning banner (Phase 2 Expiration Banner alignment) */}
        {(() => {
          const getRemainingDays = (expiredAtStr: string) => {
            const expiredAt = new Date(expiredAtStr);
            const now = new Date();
            const diffTime = expiredAt.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
          };
          const remainingDays = selectedSite.expiredAt ? getRemainingDays(selectedSite.expiredAt) : 999;
          const isExpiringSoon = remainingDays <= 30;

          if (!isExpiringSoon) return null;

          return (
            <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-semibold text-amber-400">
              <div className="space-y-1">
                <p className="font-bold text-sm text-white">⚠️ บริการใกล้หมดอายุ (Expired Warning)</p>
                <p className="text-[11px] text-amber-400/80">
                  เว็บไซต์รำลึก /{selectedSite.slug} จะหมดอายุลงในอีก {remainingDays} วัน (ในวันที่ {new Date(selectedSite.expiredAt).toLocaleDateString('th-TH')}) กรุณาต่ออายุเพื่อหลีกเลี่ยงการระงับบริการชั่วคราว
                </p>
              </div>
              <button 
                type="button"
                onClick={handleRequestRenewal}
                disabled={renewLoading}
                className="px-4 py-2.5 bg-amber-500 hover:brightness-110 active:scale-95 text-slate-950 font-bold rounded-xl transition flex-shrink-0 text-[10px]"
              >
                🌸 ต่ออายุบริการ 1 ปี (2,000 บาท)
              </button>
            </div>
          );
        })()}

        {/* Renewal Checkout Modal */}
        {renewModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-6 text-center animate-fade-in">
              <header className="space-y-1 text-left border-b border-slate-850 pb-3">
                <h3 className="text-sm font-bold text-white">🌸 ต่ออายุบริการเว็บไซต์ (Subscription Renewal)</h3>
                <p className="text-[10px] text-slate-500 font-semibold">ต่ออายุหน้ารำลึก /{selectedSite.slug} เพิ่มเติม 1 ปี (365 วัน)</p>
              </header>

              <div className="p-5 rounded-2xl bg-white text-slate-900 shadow-lg space-y-4 max-w-[240px] mx-auto border border-slate-100">
                <div className="text-center font-bold text-[9px] tracking-wider border-b pb-1 text-slate-500 uppercase">PROMPTPAY QR</div>
                
                <div className="w-36 h-36 bg-slate-100 rounded-lg mx-auto flex flex-col items-center justify-center gap-1 border border-slate-200 p-2">
                  <span className="text-xl">🕯️</span>
                  <span className="text-[7px] font-black text-slate-700">RENEWAL PAYMENT</span>
                  <span className="text-[8px] font-mono text-slate-500 break-all px-1">{renewRefId}</span>
                </div>

                <div className="space-y-0.5 text-left text-[11px]">
                  <p className="font-bold text-slate-500">ยอดชำระ: {renewAmount.toLocaleString()} บาท</p>
                  <p className="text-[9px] text-slate-400">อ้างอิง: {renewRefId.substring(0, 16)}...</p>
                </div>
              </div>

              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-850 text-[10px] text-slate-400 text-left leading-normal">
                * คิวอาร์โค้ดสำหรับจ่ายเงินต่ออายุนี้มีอายุการใช้งาน 15 นาทีตามมาตรฐานความปลอดภัย (Grill Decision)
              </div>

              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={handleSimulateRenewSuccess}
                  disabled={renewLoading}
                  className="flex-1 py-2.5 bg-emerald-500 hover:brightness-110 text-slate-950 font-bold rounded-xl text-xs transition"
                >
                  {renewLoading ? 'กำลังจำลอง...' : '✓ จำลองต่ออายุสำเร็จ'}
                </button>
                <button 
                  type="button"
                  onClick={() => setRenewModalOpen(false)}
                  disabled={renewLoading}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold rounded-xl text-xs transition border border-slate-700"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        )}

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

        {/* Family Tree Manager Section */}
        <section className="p-6 rounded-3xl border border-slate-800 bg-slate-950/40 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-850 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">🌳 ผังครอบครัวและเครือญาติ 3 รุ่น ({familyMembers.length})</h3>
              <p className="text-xs text-slate-400">เพิ่มรายละเอียดของบิดา มารดา คู่สมรส พี่น้อง และบุตรธิดาของผู้ล่วงลับ</p>
            </div>
            <button 
              onClick={() => { resetFamilyForm(); setFamilyFormOpen(!familyFormOpen); }}
              className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold transition"
            >
              {familyFormOpen ? 'ปิดหน้าต่าง' : '➕ เพิ่มสมาชิกครอบครัว'}
            </button>
          </div>

          {familyFormOpen && (
            <form onSubmit={handleSaveFamilyMember} className="p-5 rounded-2xl border border-slate-850 bg-slate-900/20 space-y-4 max-w-xl">
              <h4 className="text-xs font-black uppercase text-emerald-400">{familyId ? '📝 แก้ไขสมาชิกญาติ' : '🌳 เพิ่มสมาชิกญาติใหม่'}</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">ชื่อ-นามสกุล</label>
                  <input 
                    type="text" 
                    value={familyName} 
                    onChange={(e) => setFamilyName(e.target.value)}
                    required
                    placeholder="เช่น นายสมจิตร์ รักสงบ"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">ความสัมพันธ์</label>
                  <select
                    value={familyRelationship}
                    onChange={(e) => setFamilyRelationship(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                  >
                    <option value="PARENT_1">บิดา (Father)</option>
                    <option value="PARENT_2">มารดา (Mother)</option>
                    <option value="SPOUSE">คู่สมรส (Spouse)</option>
                    <option value="SIBLING">พี่น้อง (Sibling)</option>
                    <option value="CHILD">บุตร/ธิดา (Child)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">ปีเกิด (พ.ศ.)</label>
                  <input 
                    type="text" 
                    value={familyBirthYear} 
                    onChange={(e) => setFamilyBirthYear(e.target.value)}
                    placeholder="เช่น 2490"
                    maxLength={4}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">ปีที่ล่วงลับ (พ.ศ.)</label>
                  <input 
                    type="text" 
                    value={familyDeathYear} 
                    onChange={(e) => setFamilyDeathYear(e.target.value)}
                    disabled={!familyIsDeceased}
                    placeholder="เช่น 2565"
                    maxLength={4}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono disabled:opacity-40"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input 
                    type="checkbox" 
                    id="isDeceased"
                    checked={familyIsDeceased}
                    onChange={(e) => setFamilyIsDeceased(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="isDeceased" className="text-xs text-slate-300 font-bold cursor-pointer">เสียชีวิตแล้ว (Deceased)</label>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="submit" 
                  disabled={saveLoading}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:brightness-110 transition"
                >
                  {saveLoading ? 'กำลังบันทึก...' : '💾 บันทึกข้อมูลญาติ'}
                </button>
                <button 
                  type="button" 
                  onClick={resetFamilyForm}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs transition border border-slate-700"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          )}

          {familyMembers.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-850 rounded-2xl text-slate-500 text-xs">
              ยังไม่มีการระบุข้อมูลสมาชิกครอบครัว
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {familyMembers.map(m => {
                const relLabel = 
                  m.relationship === 'PARENT_1' ? 'บิดา' : 
                  m.relationship === 'PARENT_2' ? 'มารดา' : 
                  m.relationship === 'SPOUSE' ? 'คู่สมรส' : 
                  m.relationship === 'SIBLING' ? 'พี่น้อง' : 'บุตร/ธิดา';
                return (
                  <div key={m.id} className="p-4 rounded-2xl border border-slate-850 bg-slate-900/30 flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-white">{m.name}</p>
                      <span className="inline-block px-1.5 py-0.5 text-[8px] font-bold bg-slate-800 text-slate-400 rounded mt-1">
                        ความสัมพันธ์: {relLabel}
                      </span>
                      <p className="text-[10px] text-slate-500 font-semibold mt-1">
                        อายุขัย: {m.birthYear || 'N/A'} - {m.deathYear || 'N/A'} {m.isDeceased && '🕯️'}
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => editFamilyMember(m)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition"
                        title="แก้ไข"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDeleteFamilyMember(m.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition"
                        title="ลบ"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* E-Books Manager Section */}
        <section className="p-6 rounded-3xl border border-slate-800 bg-slate-950/40 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-850 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">📖 หนังสือของชำร่วยและธรรมทาน ({ebooks.length})</h3>
              <p className="text-xs text-slate-400">อัปโหลดหนังสือธรรมะ บทสวดมนต์ หรือหนังสือชีวประวัติ (PDF) พร้อมระบบอ่านในเว็บ</p>
            </div>
            <button 
              onClick={() => { resetEbookForm(); setEbookFormOpen(!ebookFormOpen); }}
              className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold transition"
            >
              {ebookFormOpen ? 'ปิดหน้าต่าง' : '➕ อัปโหลดหนังสือใหม่'}
            </button>
          </div>

          {ebookFormOpen && (
            <form onSubmit={handleSaveEbook} className="p-5 rounded-2xl border border-slate-850 bg-slate-900/20 space-y-4 max-w-xl">
              <h4 className="text-xs font-black uppercase text-emerald-400">{ebookId ? '📝 แก้ไขข้อมูลหนังสือ' : '📖 อัปโหลดหนังสือธรรมทานใหม่'}</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">ชื่อหนังสือ</label>
                  <input 
                    type="text" 
                    value={ebookTitle} 
                    onChange={(e) => setEbookTitle(e.target.value)}
                    required
                    placeholder="เช่น หนังสือบทสวดมนต์และธรรมสติ"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">ผู้แต่ง / คณะผู้จัดทำ</label>
                  <input 
                    type="text" 
                    value={ebookAuthor} 
                    onChange={(e) => setEbookAuthor(e.target.value)}
                    required
                    placeholder="เช่น คณะครอบครัวเจริญยิ่ง"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">จำนวนหน้าทั้งหมด</label>
                  <input 
                    type="number" 
                    min={1}
                    value={ebookTotalPages} 
                    onChange={(e) => setEbookTotalPages(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">เลือกไฟล์หนังสือ PDF</label>
                  <input 
                    type="file" 
                    accept="application/pdf"
                    onChange={(e) => setEbookFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full text-slate-400 text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-750"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase block">ข้อความเนื้อหาในแต่ละหน้า (แยกหน้าโดยใช้เครื่องหมาย `[PAGE]`)</label>
                <textarea 
                  value={ebookPagesText} 
                  onChange={(e) => setEbookPagesText(e.target.value)}
                  rows={6}
                  placeholder="บทนำ...&#10;[PAGE]&#10;หน้าที่ 2...&#10;[PAGE]&#10;หน้าที่ 3..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-serif leading-relaxed"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="submit" 
                  disabled={saveLoading}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:brightness-110 transition"
                >
                  {saveLoading ? 'กำลังบันทึกและอัปโหลด...' : '💾 บันทึกและออกบริการ'}
                </button>
                <button 
                  type="button" 
                  onClick={resetEbookForm}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs transition border border-slate-700"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          )}

          {ebooks.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-850 rounded-2xl text-slate-500 text-xs">
              ยังไม่มีการอัปโหลดหนังสือที่ระลึกธรรมทาน
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {ebooks.map(b => (
                <div key={b.id} className="p-5 rounded-2xl border border-slate-850 bg-slate-900/30 flex gap-4 items-center">
                  <div className="w-16 h-20 bg-slate-900 border border-slate-800 rounded-lg shadow flex flex-col items-center justify-center p-2 relative overflow-hidden flex-shrink-0">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                    <span className="text-xl">📖</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{b.title}</p>
                    <p className="text-[10px] text-slate-500">โดย: {b.author}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[8px] font-bold">
                      {b.totalPages} หน้า
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => editEbook(b)}
                      className="p-2 rounded-xl bg-slate-850 text-slate-400 hover:text-white border border-slate-800 transition text-[10px]"
                      title="แก้ไข"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDeleteEbook(b.id)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition text-[10px]"
                      title="ลบ"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Billing & Invoice History Section */}
        <section className="p-6 rounded-3xl border border-slate-800 bg-slate-950/40 space-y-6">
          <div className="border-b border-slate-850 pb-4">
            <h3 className="text-lg font-bold text-white">💳 ประวัติการชำระเงินและดาวน์โหลดใบกำกับภาษี</h3>
            <p className="text-xs text-slate-400">ตรวจสอบประวัติการทำรายการชำระค่าบริการ และดาวน์โหลดใบเสร็จ/ใบกำกับภาษีเต็มรูปแบบ (ตามกฎหมายไทย)</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 pl-2">เลขที่ใบกำกับภาษี</th>
                  <th className="pb-3">วันที่ชำระเงิน</th>
                  <th className="pb-3">รายละเอียดสินค้า</th>
                  <th className="pb-3">ยอดชำระ</th>
                  <th className="pb-3">สถานะ</th>
                  <th className="pb-3 pr-2 text-right">ใบกำกับภาษี</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {invoiceLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-900/10">
                    <td className="py-4 pl-2 font-mono font-bold text-slate-300">{log.id}</td>
                    <td className="py-4 text-slate-400">{log.date}</td>
                    <td className="py-4 text-slate-300 max-w-[280px] truncate">{log.desc}</td>
                    <td className="py-4 text-white font-semibold">{log.amount}</td>
                    <td className="py-4">
                      <span className="px-2.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {log.status}
                      </span>
                    </td>
                    <td className="py-4 pr-2 text-right">
                      <a 
                        href={`/api/payment/invoice?refId=${log.refId}`}
                        download
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold transition active:scale-95"
                      >
                        <span>📥</span> ดาวน์โหลด PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

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
