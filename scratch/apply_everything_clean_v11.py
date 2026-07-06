import os

manage_file = "/Users/ole/ForeverProject/app/manage/page.tsx"

with open(manage_file, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update lucide-react imports
content = content.replace(
    "} from 'lucide-react';",
    ", X, Lock, Database, Search, Save, Palette, ChevronUp, ChevronDown, LayoutDashboard, AlertTriangle, MapPin, Clock, Phone, Info, Droplets, Image as ImageIcon, Video, Menu as MenuIcon, Copy, ExternalLink } from 'lucide-react';"
)

# 2. Add categories helper imports next to Link import
content = content.replace(
    "import Link from 'next/link';",
    "import Link from 'next/link';\nimport FeatureToggleList from '@/components/FeatureToggleList';\nimport { getVisibleKeys, getFeatureLabel, MANDATORY_FEATURES } from '@/lib/categories';"
)

# 3. Add states after avatarUploading state
content = content.replace(
    "  const [avatarUploading, setAvatarUploading] = useState(false);",
    """  const [avatarUploading, setAvatarUploading] = useState(false);
  const [biography, setBiography] = useState('');
  const [activeTab, setActiveTab] = useState<'settings' | 'card' | 'gallery' | 'videos' | 'family' | 'ebooks' | 'condolences' | 'billing'>('settings');
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'media' | 'theme' | 'features' | 'billing'>('general');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeSaving, setYoutubeSaving] = useState(false);
  const [galleryMedias, setGalleryMedias] = useState<any[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryDragActive, setGalleryDragActive] = useState(false);
  
  const [deceasedAvatarUrl, setDeceasedAvatarUrl] = useState('');
  const [deceasedAvatarScale, setDeceasedAvatarScale] = useState(1);
  const [deceasedAvatarX, setDeceasedAvatarX] = useState(0);
  const [deceasedAvatarY, setDeceasedAvatarY] = useState(0);
  const [deceasedAvatarRotate, setDeceasedAvatarRotate] = useState(0);
  const [deceasedCoverUrl, setDeceasedCoverUrl] = useState('');
  const [deceasedCoverScale, setDeceasedCoverScale] = useState(1);
  const [deceasedCoverX, setDeceasedCoverX] = useState(0);
  const [deceasedCoverY, setDeceasedCoverY] = useState(0);
  const [deceasedCoverRotate, setDeceasedCoverRotate] = useState(0);
  const [coverUploading, setCoverUploading] = useState(false);
  const [isCoverCropModalOpen, setIsCoverCropModalOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [isCoverMenuOpen, setIsCoverMenuOpen] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  
  const [features, setFeatures] = useState<any>({
    family: true,
    gallery: true,
    videos: true,
    announcement: true,
    ebooks: true,
    condolence: true,
    donation: true,
    memory: true,
    feed: true,
  });"""
)

# 4. Add uploader functions right before selectWebsite
content = content.replace(
    "  // 2. Select Website & Load related details",
    """  const uploadDeceasedAvatar = async (file: File) => {
    if (!activeSite) return;
    setAvatarUploading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/media/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: activeSite.id,
          fileName: `deceased-avatar-${Date.now()}-${file.name}`,
          fileType: file.type,
          fileSize: file.size,
          album: 'PROFILE',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.uploadUrl) {
        await fetch(data.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
      }

      setDeceasedAvatarUrl(data.filePath);
      setDeceasedAvatarScale(1);
      setDeceasedAvatarX(0);
      setDeceasedAvatarY(0);
      setDeceasedAvatarRotate(0);
      setIsCropModalOpen(true);
      setSuccess('อัปโหลดรูปโปรไฟล์สำเร็จ');
    } catch (err: any) {
      setError(err.message || 'การอัปโหลดรูปโปรไฟล์ล้มเหลว');
    } finally {
      setAvatarUploading(false);
    }
  };

  const uploadDeceasedCover = async (file: File) => {
    if (!activeSite) return;
    setCoverUploading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/media/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: activeSite.id,
          fileName: `deceased-cover-${Date.now()}-${file.name}`,
          fileType: file.type,
          fileSize: file.size,
          album: 'PROFILE',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.uploadUrl) {
        await fetch(data.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
      }

      setDeceasedCoverUrl(data.filePath);
      setDeceasedCoverScale(1);
      setDeceasedCoverX(0);
      setDeceasedCoverY(0);
      setDeceasedCoverRotate(0);
      setIsCoverCropModalOpen(true);
      setSuccess('อัปโหลดรูปภาพหน้าปกสำเร็จ');
    } catch (err: any) {
      setError(err.message || 'การอัปโหลดรูปภาพหน้าปกล้มเหลว');
    } finally {
      setCoverUploading(false);
    }
  };

  const uploadGalleryMedia = async (file: File) => {
    if (!activeSite) return;
    setGalleryUploading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/media/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: activeSite.id,
          fileName: `gallery-${Date.now()}-${file.name}`,
          fileType: file.type,
          fileSize: file.size,
          album: file.type.startsWith('video/') ? 'VIDEO' : 'GALLERY',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.uploadUrl) {
        await fetch(data.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
      }

      setSuccess('อัปโหลดไฟล์สำเร็จ');

      // Refresh list
      const listRes = await fetch(`/api/media/list?websiteId=${activeSite.id}`);
      const listData = await listRes.json();
      if (listRes.ok) {
        setGalleryMedias(listData.mediaList || []);
      }
    } catch (err: any) {
      setError(err.message || 'การอัปโหลดไฟล์ขัดข้อง');
    } finally {
      setGalleryUploading(false);
    }
  };

  const deleteGalleryMedia = async (mediaId: string) => {
    if (!activeSite) return;
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสื่อนี้?')) return;
    try {
      const res = await fetch(`/api/media/delete?mediaId=${mediaId}&websiteId=${activeSite.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('ลบสื่อเสร็จสิ้น');

      // Refresh list
      const listRes = await fetch(`/api/media/list?websiteId=${activeSite.id}`);
      const listData = await listRes.json();
      if (listRes.ok) {
        setGalleryMedias(listData.mediaList || []);
      }
    } catch (err: any) {
      setError(err.message || 'การลบไฟล์ล้มเหลว');
    }
  };

  // 2. Select Website & Load related details"""
)

# 5. Load settings config in selectWebsite
select_website_old = """    // Fetch E-Books
    try {
      const res = await fetch(`/api/ebook/list?websiteId=${site.id}`);
      const data = await res.json();
      if (res.ok) {
        setEbooks(data.ebooks || []);
      }
    } catch (err) {
      console.error('Error fetching ebooks:', err);
    }
  };"""

select_website_repl = """    // Fetch E-Books
    try {
      const res = await fetch(`/api/ebook/list?websiteId=${site.id}`);
      const data = await res.json();
      if (res.ok) {
        setEbooks(data.ebooks || []);
      }
    } catch (err) {
      console.error('Error fetching ebooks:', err);
    }

    // Fetch Media List
    try {
      setGalleryLoading(true);
      const res = await fetch(`/api/media/list?websiteId=${site.id}`);
      const data = await res.json();
      if (res.ok) {
        setGalleryMedias(data.mediaList || []);
      }
    } catch (err) {
      console.error('Error fetching gallery media:', err);
    } finally {
      setGalleryLoading(false);
    }

    // Initialize theme variables from config
    const config = (site as any).themeConfig as any;
    if (config) {
      setPrimaryColor(config.primaryColor || '#0d9488');
      const scriptFonts = ['Charm', 'Srisakdi', 'Charmonman', 'Thasadith'];
      const loadedFont = config.fontFamily || 'Inter';
      setFontFamily(scriptFonts.includes(loadedFont) ? 'LINE Seed Sans TH' : loadedFont);
      setBiography(config.biography || '');
      setDeceasedAvatarUrl(config.avatarUrl || '');
      setDeceasedAvatarScale(config.avatarScale || 1);
      setDeceasedAvatarX(config.avatarX || 0);
      setDeceasedAvatarY(config.avatarY || 0);
      setDeceasedAvatarRotate(config.avatarRotate || 0);
      setDeceasedCoverUrl(config.coverUrl || '');
      setDeceasedCoverScale(config.coverScale || 1);
      setDeceasedCoverX(config.coverX || 0);
      setDeceasedCoverY(config.coverY || 0);
      setDeceasedCoverRotate(config.coverRotate || 0);
      if (config.features) {
        setFeatures({
          family: config.features.family !== false,
          gallery: config.features.gallery !== false,
          videos: config.features.videos !== false,
          announcement: config.features.announcement !== false,
          ebooks: config.features.ebooks !== false,
          condolence: config.features.condolence !== false,
          donation: config.features.donation !== false,
          memory: config.features.memory !== false,
          feed: config.features.feed !== false,
        });
      }
    } else {
      setPrimaryColor('#0d9488');
      setSecondaryColor('#f59e0b');
      setFontFamily('Inter');
      setBiography('');
      setDeceasedAvatarUrl('');
      setDeceasedAvatarScale(1);
      setDeceasedAvatarX(0);
      setDeceasedAvatarY(0);
      setDeceasedAvatarRotate(0);
      setDeceasedCoverUrl('');
      setDeceasedCoverScale(1);
      setDeceasedCoverX(0);
      setDeceasedCoverY(0);
      setDeceasedCoverRotate(0);
    }
  };"""

content = content.replace(select_website_old, select_website_repl)

# 6. Save config updates
config_save_old = """          themeConfig: {
            primaryColor,
            secondaryColor,
            fontFamily,
            heroStyle: 'Classic',
          },"""

config_save_repl = """          themeConfig: {
            primaryColor,
            secondaryColor,
            fontFamily,
            heroStyle: 'Classic',
            avatarUrl: deceasedAvatarUrl,
            avatarScale: deceasedAvatarScale,
            avatarX: deceasedAvatarX,
            avatarY: deceasedAvatarY,
            avatarRotate: deceasedAvatarRotate,
            coverUrl: deceasedCoverUrl,
            coverScale: deceasedCoverScale,
            coverX: deceasedCoverX,
            coverY: deceasedCoverY,
            coverRotate: deceasedCoverRotate,
            biography,
            features,
          },"""

content = content.replace(config_save_old, config_save_repl)

# 7. Add tab handler functions before return (WITHOUT duplicating storagePercentage)
return_target = "  return ("
handlers_repl = """  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleSaveYoutubeLink = async () => {
    if (!activeSite || !youtubeUrl) return;
    setYoutubeSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/media/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: activeSite.id,
          youtubeUrl,
          title: 'วิดีโอ YouTube',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('แนบลิงก์วิดีโอ YouTube สำเร็จ');
      setYoutubeUrl('');

      // Refresh list
      const listRes = await fetch(`/api/media/list?websiteId=${activeSite.id}`);
      const listData = await listRes.json();
      if (listRes.ok) {
        setGalleryMedias(listData.mediaList || []);
      }
    } catch (err: any) {
      setError(err.message || 'การบันทึกลิงก์ YouTube ล้มเหลว');
    } finally {
      setYoutubeSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const photoMedias = galleryMedias.filter(m => !m.mimeType?.startsWith('video/') && m.mimeType !== 'video/youtube');
  const videoMedias = galleryMedias.filter(m => m.mimeType?.startsWith('video/') || m.mimeType === 'video/youtube');

  return ("""

content = content.replace(return_target, handlers_repl)

# 8. Apply mobile bar layout & backdrop to return statement
target_return_start = """  return (
    <div className="min-h-screen bg-stone-50 text-stone-850 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-stone-100/60 border-r border-stone-200/80 p-6 flex flex-col justify-between">"""

replacement_return_start = """  return (
    <div className="min-h-screen bg-stone-50 text-stone-850 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Bar */}
      <header className="md:hidden w-full bg-stone-100/90 backdrop-blur-md border-b border-stone-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <span className="text-lg font-black tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          FOREVER MANAGE
        </span>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 rounded-xl border border-stone-200 text-stone-650 hover:bg-stone-50 transition cursor-pointer active:scale-95"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>
      </header>

      {/* Backdrop overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 md:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-stone-100 border-r border-stone-200/80 p-6 flex flex-col justify-between overflow-y-auto shrink-0 transition-transform duration-300 transform
        md:relative md:translate-x-0 md:h-screen md:sticky md:top-0 md:bg-stone-100/60
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>"""

content = content.replace(target_return_start, replacement_return_start)

# 9. Sidebar navigation links update (Pattaya City inspired!)
nav_start = content.find('          <nav className="space-y-2">')
if nav_start != -1:
    nav_end = content.find('          </nav>', nav_start) + len('          </nav>')
    replacement_nav = """          <nav className="space-y-1">
            <button 
              type="button"
              onClick={() => handleTabClick('gallery')}
              className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs transition font-semibold cursor-pointer ${
                activeTab === 'gallery' 
                  ? 'bg-emerald-600 shadow-sm border border-emerald-700 text-white font-bold' 
                  : 'text-stone-600 hover:text-stone-955 hover:bg-stone-200/30'
              }`}
            >
              <Camera className={`w-3.5 h-3.5 ${activeTab === 'gallery' ? 'text-white' : 'text-stone-500'}`} />
              <span>คลังภาพรำลึก ({photoMedias.length})</span>
            </button>
            <button 
              type="button"
              onClick={() => handleTabClick('videos')}
              className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs transition font-semibold cursor-pointer ${
                activeTab === 'videos' 
                  ? 'bg-emerald-600 shadow-sm border border-emerald-700 text-white font-bold' 
                  : 'text-stone-600 hover:text-stone-955 hover:bg-stone-200/30'
              }`}
            >
              <Video className={`w-3.5 h-3.5 ${activeTab === 'videos' ? 'text-white' : 'text-stone-500'}`} />
              <span>คลังวิดีโอ ({videoMedias.length})</span>
            </button>
            <button 
              type="button"
              onClick={() => handleTabClick('family')}
              className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs transition font-semibold cursor-pointer ${
                activeTab === 'family' 
                  ? 'bg-emerald-600 shadow-sm border border-emerald-700 text-white font-bold' 
                  : 'text-stone-600 hover:text-stone-955 hover:bg-stone-200/30'
              }`}
            >
              <GitBranch className={`w-3.5 h-3.5 ${activeTab === 'family' ? 'text-white' : 'text-stone-500'}`} />
              <span>ผังครอบครัว ({familyMembers.length})</span>
            </button>
            <button 
              type="button"
              onClick={() => handleTabClick('ebooks')}
              className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs transition font-semibold cursor-pointer ${
                activeTab === 'ebooks' 
                  ? 'bg-emerald-600 shadow-sm border border-emerald-700 text-white font-bold' 
                  : 'text-stone-600 hover:text-stone-955 hover:bg-stone-200/30'
              }`}
            >
              <BookOpen className={`w-3.5 h-3.5 ${activeTab === 'ebooks' ? 'text-white' : 'text-stone-500'}`} />
              <span>หนังสือของชำร่วย ({ebooks.length})</span>
            </button>
            <button 
              type="button"
              onClick={() => handleTabClick('condolences')}
              className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs transition font-semibold cursor-pointer ${
                activeTab === 'condolences' 
                  ? 'bg-emerald-600 shadow-sm border border-emerald-700 text-white font-bold' 
                  : 'text-stone-600 hover:text-stone-955 hover:bg-stone-200/30'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${activeTab === 'condolences' ? 'text-white' : 'text-stone-500'}`} />
              <span>กลั่นกรองเนื้อหา ({condolences.length + pendingPosts.length})</span>
            </button>

            <div className="pt-4 mt-4 border-t border-stone-200/60">
              <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block mb-2 px-4">SYSTEM CONFIG</label>
              <button 
                type="button"
                onClick={() => handleTabClick('settings')}
                className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs transition font-semibold cursor-pointer ${
                  activeTab === 'settings' 
                    ? 'bg-emerald-600 shadow-sm border border-emerald-700 text-white font-bold' 
                    : 'text-stone-600 hover:text-stone-955 hover:bg-stone-200/30'
                }`}
              >
                <Settings className={`w-3.5 h-3.5 ${activeTab === 'settings' ? 'text-white' : 'text-stone-500'}`} />
                <span>ตั้งค่าเว็บไซต์</span>
              </button>
              <Link href="/manage/create" className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl text-stone-600 hover:text-stone-955 hover:bg-stone-200/30 text-xs transition font-semibold mt-1">
                <Plus className="w-3.5 h-3.5 text-stone-400" />
                <span>สร้างเว็บไซต์เพิ่ม</span>
              </Link>
            </div>
          </nav>"""
    content = content[:nav_start] + replacement_nav + content[nav_end:]

# 10. Remove selector dropdown from sidebar
select_old = '          <div className="mt-8 space-y-2">'
select_start = content.find(select_old)
if select_start != -1:
    select_end = content.find('          </div>', select_start) + len('          </div>')
    content = content[:select_start] + content[select_end:]

# 11. Replace User account profile footer with Logout button footer
profile_target = """        <div className="mt-8 border-t border-stone-200 pt-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-sm text-stone-600">👤</div>
            <div>
              <p className="text-xs font-bold text-stone-900">ผู้ใช้งานบัญชี</p>
              <p className="text-[10px] text-stone-550 font-medium">{userPhone}</p>
            </div>
          </div>
        </div>"""

profile_repl = """        <div className="mt-8 border-t border-stone-200 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-250 flex items-center justify-center text-sm text-stone-650">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">ผู้ใช้งานบัญชี</p>
              <p className="text-[10px] text-stone-555 font-mono font-medium">{userPhone}</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-stone-400 hover:text-red-655 hover:bg-stone-200/50 transition cursor-pointer active:scale-95 border-0"
            title="ออกจากระบบ"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>"""

content = content.replace(profile_target, profile_repl)

# 12. Move select website dropdown to the top-right header and addSettings/view buttons
header_target = """        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <h1 className="text-2xl font-black text-stone-900">{selectedSite.name}</h1>
            <p className="text-sm text-stone-500">ลิงก์ความทรงจำ: <a href={`/${selectedSite.slug}`} target="_blank" className="text-emerald-700 font-semibold hover:text-emerald-800 underline">forever.co.th/{selectedSite.slug}</a></p>
          </div>
          <div>
            <span className="px-3.5 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              สถานะบริการ: {selectedSite.status}
            </span>
          </div>
        </header>"""

header_repl = """        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900">{selectedSite.name}</h1>
            <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-1">
              <span>ลิงก์ความทรงจำ:</span>
              <a 
                href={`/${selectedSite.slug}`} 
                target="_blank" 
                className="text-emerald-700 font-semibold hover:text-emerald-855 underline"
              >
                forever.co.th/{selectedSite.slug}
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`forever.co.th/${selectedSite.slug}`);
                  setSuccess('คัดลอกลิงก์สำเร็จ!');
                }}
                className="p-1 hover:bg-stone-100 rounded-md text-stone-400 hover:text-stone-750 transition cursor-pointer border-0"
                title="คัดลอกลิงก์"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Website Selector Dropdown */}
            <select 
              value={selectedSite.id} 
              onChange={(e) => {
                const site = websites.find(w => w.id === e.target.value);
                if (site) selectWebsite(site);
              }}
              className="px-3 py-1.5 bg-white border border-stone-250 rounded-xl text-xs text-stone-850 focus:outline-none focus:border-emerald-500 font-bold cursor-pointer shadow-xs"
            >
              {websites.map(w => (
                <option key={w.id} value={w.id}>/{w.slug} ({w.name.substring(0, 10)})</option>
              ))}
            </select>

            {/* Quick settings button */}
            <button
              type="button"
              onClick={() => handleTabClick('settings')}
              className="px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-700 font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
            >
              <Settings className="w-3.5 h-3.5 text-stone-500" />
              <span>ตั้งค่า</span>
            </button>

            {/* Live website link */}
            <a
              href={`/${selectedSite.slug}`}
              target="_blank"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>ดูหน้าเว็บ</span>
            </a>
          </div>
        </header>"""

content = content.replace(header_target, header_repl)

# 13. Extract the clean layout Announcement block from the file
ann_target = '          {/* Digital Announcement Card settings (Phase 2 compact overlay toggle) *}/'
# Let's search exact announcement settings target
ann_target = '          {/* Digital Announcement Card settings (Phase 2 compact overlay toggle) */}'
ann_start = content.find(ann_target)
color_target = '<div className="space-y-4 border-t border-stone-200 pt-6">'
ann_end = content.find(color_target, ann_start)
ann_block = content[ann_start:ann_end].strip()

# 14. Replace the old settings grid block completely with the horizontal sub-tabbed settings form
grid_start = content.find('        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">')
grid_end = content.find('        {/* Family Tree Manager Section */}', grid_start)

settings_repl = """        {activeTab === 'settings' && (
          <div className="w-full">
            {/* Settings Customizer */}
            <form onSubmit={handleSaveConfig} className="w-full p-6 rounded-3xl border border-stone-200 bg-white shadow-sm space-y-6">
              
              {/* Settings Sub-Tabs Header (Horizontal Scrollable) */}
              <div className="flex border-b border-stone-150 overflow-x-auto scrollbar-none -mx-6 px-6 mb-6 gap-6 text-xs font-bold text-stone-500 select-none">
                {[
                  { id: 'general', label: 'ข้อมูลทั่วไป & ประกาศ' },
                  { id: 'media', label: 'รูปโปรไฟล์ & หน้าปก' },
                  { id: 'theme', label: 'ธีม & สี & ฟอนต์' },
                  { id: 'features', label: 'ฟีเจอร์ที่เปิดใช้งาน' },
                  { id: 'billing', label: 'พื้นที่จัดเก็บ & การชำระเงิน' },
                ].map(sub => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setActiveSubTab(sub.id as any)}
                    className={`pb-2.5 relative transition-all duration-200 cursor-pointer whitespace-nowrap ${
                      activeSubTab === sub.id ? 'text-emerald-700 font-extrabold border-b-2 border-emerald-600' : 'hover:text-stone-850'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              {/* 1. ข้อมูลทั่วไป & ประกาศ Tab */}
              {activeSubTab === 'general' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-stone-600 tracking-wide">ชื่อหน้ารำลึก</label>
                    <input 
                      type="text" 
                      value={siteName} 
                      onChange={(e) => setSiteName(e.target.value)} 
                      className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 text-sm sm:text-base focus:bg-white focus:outline-none focus:border-emerald-500/80 transition"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">คำอาลัยและคำรำลึก (ประวัติโดยย่อ)</label>
                    <textarea 
                      value={biography} 
                      onChange={(e) => setBiography(e.target.value)} 
                      rows={4}
                      placeholder="เช่น คุณพ่อสมศักดิ์เป็นคนดี มีความเสียสละ..."
                      className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-500/80 transition"
                    />
                  </div>

                  {/* Announcement settings cards */}
                  """ + ann_block + """

                  {/* Donation Settings Section */}
                  <div className="border-t border-stone-150 pt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-emerald-700" />
                        <span>เปิดใช้บริการรับเงินทำบุญ (Donation QR Settings)</span>
                      </h4>
                      <input 
                        type="checkbox" 
                        checked={donationActive}
                        onChange={() => setDonationActive(!donationActive)}
                        className="w-5 h-5 accent-emerald-650 cursor-pointer"
                      />
                    </div>

                    {donationActive && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                        <div className="space-y-1">
                          <label className="text-sm font-bold text-stone-600 tracking-wide">หมายเลขพร้อมเพย์ (PromptPay)</label>
                          <input 
                            type="text" 
                            value={donationPromptPay} 
                            onChange={(e) => setDonationPromptPay(e.target.value)} 
                            placeholder="เบอร์โทรศัพท์ หรือ เลขบัตรประชาชน"
                            className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-500/80 transition"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-bold text-stone-600 tracking-wide">ชื่อบัญชีผู้รับเงิน</label>
                          <input 
                            type="text" 
                            value={donationAccountName} 
                            onChange={(e) => setDonationAccountName(e.target.value)} 
                            placeholder="ชื่อ-นามสกุล เจ้าของบัญชี"
                            className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-500/80 transition"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. รูปโปรไฟล์ & รูปปกเด่น Tab */}
              {activeSubTab === 'media' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-stone-900">อัปโหลดและจัดตำแหน่งภาพ</h4>
                    <p className="text-xs text-stone-500">จัดการรูปโปรไฟล์หลักและภาพหน้าปกด้านหลัง โดยการกดที่รูปกล้องเพื่ออัปโหลด ปรับเลื่อน หรือลบรูปภาพ</p>
                  </div>

                  {/* Hidden input file fields */}
                  <input
                    type="file"
                    id="deceased-avatar-file-input"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadDeceasedAvatar(file);
                    }}
                    disabled={avatarUploading}
                    className="hidden"
                  />

                  <input
                    type="file"
                    id="deceased-cover-file-input"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadDeceasedCover(file);
                    }}
                    disabled={coverUploading}
                    className="hidden"
                  />

                  {/* Unified LINE-style Live Preview Simulator Card */}
                  <div className="relative w-full max-w-xl mx-auto h-48 sm:h-56 rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm flex items-center justify-center group select-none">
                    {/* Cover Photo Background */}
                    {deceasedCoverUrl ? (
                      <div className="absolute inset-0 w-full h-full">
                        <img 
                          src={deceasedCoverUrl.replace('https://storage.forever.co.th', '')} 
                          alt="Cover Preview" 
                          className="w-full h-full object-cover" 
                          style={{
                            transform: `translate(${((deceasedCoverX || 0) / 320) * 100}%, ${((deceasedCoverY || 0) / 160) * 100}%) rotate(${deceasedCoverRotate || 0}deg) scale(${deceasedCoverScale || 1})`,
                            transformOrigin: 'center center',
                          }}
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors" />
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-stone-55/40 flex flex-col items-center justify-center gap-1.5 text-stone-400">
                        <ImageIcon className="w-8 h-8 text-stone-300" />
                        <span className="text-[10px] font-bold">ยังไม่ได้อัปโหลดรูปภาพหน้าปกหลัก</span>
                      </div>
                    )}

                    {/* Circular Avatar (Overlapping in the center) */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white bg-stone-50 shadow-md flex items-center justify-center overflow-hidden z-10">
                      {deceasedAvatarUrl ? (
                        <div className="w-full h-full relative">
                          <img 
                            src={deceasedAvatarUrl.replace('https://storage.forever.co.th', '')} 
                            alt="Avatar Preview" 
                            className="pointer-events-none w-full h-full object-cover" 
                            style={{
                              transform: `translate(${((deceasedAvatarX || 0) / 224) * 100}%, ${((deceasedAvatarY || 0) / 224) * 100}%) rotate(${deceasedAvatarRotate}deg) scale(${(deceasedAvatarScale || 1) * (300 / 224)})`,
                              transformOrigin: 'center center',
                            }}
                          />
                        </div>
                      ) : (
                        <div className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-0.5 rounded-full p-2 text-center bg-stone-150 text-stone-400">
                          <User className="w-8 h-8 opacity-70" />
                        </div>
                      )}
                    </div>

                    {/* LINE-Style camera icon trigger overlay on Circular Avatar */}
                    <div className="absolute bottom-6 left-[calc(50%+26px)] sm:left-[calc(50%+32px)] z-20">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAvatarMenuOpen(!isAvatarMenuOpen);
                          setIsCoverMenuOpen(false);
                        }}
                        className="w-8 h-8 rounded-full bg-stone-850 hover:bg-stone-900 text-white flex items-center justify-center cursor-pointer shadow-md transition active:scale-90 border border-white/20"
                        title="จัดการรูปโปรไฟล์"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>

                      {/* Avatar Menu Popover */}
                      {isAvatarMenuOpen && (
                        <>
                          <div className="fixed inset-0 z-10 cursor-default" onClick={() => setIsAvatarMenuOpen(false)} />
                          <div className="absolute left-[calc(50%-88px)] bottom-full mb-2 bg-white border border-stone-200 rounded-2xl shadow-xl py-2 w-44 text-stone-850 text-xs font-bold z-30 animate-fade-in text-left">
                            <button
                              type="button"
                              onClick={() => {
                                setIsAvatarMenuOpen(false);
                                document.getElementById('deceased-avatar-file-input')?.click();
                              }}
                              className="w-full px-4 py-2 hover:bg-stone-50 cursor-pointer block text-left"
                            >
                              📸 อัปโหลดรูปภาพใหม่
                            </button>
                            {deceasedAvatarUrl && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsAvatarMenuOpen(false);
                                    setIsCropModalOpen(true);
                                  }}
                                  className="w-full px-4 py-2 hover:bg-stone-50 cursor-pointer block text-left border-t border-stone-100"
                                >
                                  ⚙️ ปรับแต่งรูปโปรไฟล์
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsAvatarMenuOpen(false);
                                    setDeceasedAvatarUrl('');
                                    setDeceasedAvatarScale(1);
                                    setDeceasedAvatarX(0);
                                    setDeceasedAvatarY(0);
                                    setDeceasedAvatarRotate(0);
                                  }}
                                  className="w-full px-4 py-2 hover:bg-red-50 text-red-650 cursor-pointer block text-left border-t border-stone-100 font-bold"
                                >
                                  🗑️ ลบรูปโปรไฟล์
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {/* LINE-Style camera icon trigger overlay on Cover Banner */}
                    <div className="absolute bottom-3 right-3 z-20">
                      <button 
                        type="button" 
                        onClick={() => {
                          setIsCoverMenuOpen(!isCoverMenuOpen);
                          setIsAvatarMenuOpen(false);
                        }}
                        className="w-8 h-8 rounded-full bg-stone-850 hover:bg-stone-900 text-white flex items-center justify-center cursor-pointer shadow-md transition active:scale-90 border border-white/20"
                        title="จัดการรูปหน้าปก"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>

                      {/* Cover Menu Popover */}
                      {isCoverMenuOpen && (
                        <>
                          <div className="fixed inset-0 z-10 cursor-default" onClick={() => setIsCoverMenuOpen(false)} />
                          <div className="absolute right-0 bottom-full mb-2 bg-white border border-stone-200 rounded-2xl shadow-xl py-2 w-44 text-stone-850 text-xs font-bold z-30 animate-fade-in text-left">
                            <button
                              type="button"
                              onClick={() => {
                                setIsCoverMenuOpen(false);
                                document.getElementById('deceased-cover-file-input')?.click();
                              }}
                              className="w-full px-4 py-2 hover:bg-stone-50 cursor-pointer block text-left"
                            >
                              📸 อัปโหลดรูปปกใหม่
                            </button>
                            {deceasedCoverUrl && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsCoverMenuOpen(false);
                                    setIsCoverCropModalOpen(true);
                                  }}
                                  className="w-full px-4 py-2 hover:bg-stone-50 cursor-pointer block text-left border-t border-stone-100"
                                >
                                  ⚙️ ปรับแต่งหน้าปก
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsCoverMenuOpen(false);
                                    setDeceasedCoverUrl('');
                                    setDeceasedCoverScale(1);
                                    setDeceasedCoverX(0);
                                    setDeceasedCoverY(0);
                                    setDeceasedCoverRotate(0);
                                  }}
                                  className="w-full px-4 py-2 hover:bg-red-50 text-red-650 cursor-pointer block text-left border-t border-stone-100 font-bold"
                                >
                                  🗑️ ลบรูปหน้าปก
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Image crop adjustment buttons under the preview card */}
                  <div className="flex justify-center mt-3 gap-3">
                    {deceasedAvatarUrl && (
                      <button
                        type="button"
                        onClick={() => setIsCropModalOpen(true)}
                        className="px-4 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-250 text-stone-700 font-bold text-xs rounded-xl transition shadow-xs active:scale-95 flex items-center gap-1.5 justify-center w-full max-w-[200px] cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>ปรับรูปโปรไฟล์</span>
                      </button>
                    )}
                    {deceasedCoverUrl && (
                      <button
                        type="button"
                        onClick={() => setIsCoverCropModalOpen(true)}
                        className="px-4 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-250 text-stone-700 font-bold text-xs rounded-xl transition shadow-xs active:scale-95 flex items-center gap-1.5 justify-center w-full max-w-[200px] cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>ปรับรูปหน้าปก</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 3. ธีม & สี & ฟอนต์ Tab */}
              {activeSubTab === 'theme' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">Primary Color</label>
                      <div className="flex gap-3 items-center">
                        <input 
                          type="color" 
                          value={primaryColor} 
                          onChange={(e) => setPrimaryColor(e.target.value)} 
                          className="w-10 h-10 rounded-xl border border-stone-200 cursor-pointer"
                        />
                        <input 
                          type="text" 
                          value={primaryColor} 
                          onChange={(e) => setPrimaryColor(e.target.value)} 
                          className="flex-1 px-4 py-2 text-sm bg-stone-50/50 border border-stone-200 rounded-xl text-stone-905 font-mono focus:bg-white focus:outline-none focus:border-emerald-500/80 transition"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">Secondary Color</label>
                      <div className="flex gap-3 items-center">
                        <input 
                          type="color" 
                          value={secondaryColor} 
                          onChange={(e) => setSecondaryColor(e.target.value)} 
                          className="w-10 h-10 rounded-xl border border-stone-200 cursor-pointer"
                        />
                        <input 
                          type="text" 
                          value={secondaryColor} 
                          onChange={(e) => setSecondaryColor(e.target.value)} 
                          className="flex-1 px-4 py-2 text-sm bg-stone-50/50 border border-stone-200 rounded-xl text-stone-905 font-mono focus:bg-white focus:outline-none focus:border-emerald-500/80 transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">Font Style (Family)</label>
                    <select 
                      value={fontFamily} 
                      onChange={(e) => setFontFamily(e.target.value)} 
                      className="w-full px-4 py-2.5 text-sm bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-emerald-500/80 transition"
                    >
                      <option value="Inter">Inter (เรียบหรูสากล)</option>
                      <option value="Sarabun">Sarabun (ไทยทางการ)</option>
                      <option value="Niramit">Niramit (ไทยร่วมสมัย)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* 4. ฟีเจอร์ที่เปิดใช้งาน Tab */}
              {activeSubTab === 'features' && (
                <div className="pt-2 space-y-4 text-left animate-fade-in">
                  <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>ฟีเจอร์ที่เปิดใช้งาน (Features checklist)</span>
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    เลือกส่วนที่คุณต้องการแสดงบนหน้าเว็บไซต์อนุสรณ์ (สามารถเปิด-ปิดได้ทุกเมื่อ)
                  </p>
                  <FeatureToggleList 
                    value={features}
                    onChange={setFeatures}
                    disabled={saveLoading}
                    mandatoryKeys={MANDATORY_FEATURES}
                    visibleKeys={getVisibleKeys(selectedSite.category)}
                    labelFor={(k) => getFeatureLabel(selectedSite.category, k)}
                  />
                </div>
              )}

              {/* 5. พื้นที่จัดเก็บ & การชำระเงิน Tab */}
              {activeSubTab === 'billing' && (
                <div className="space-y-6 text-left animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Storage Quota Card */}
                    <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50/20 space-y-4">
                      <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-emerald-700" />
                        <span>พื้นที่จัดเก็บมีเดีย S3 / R2</span>
                      </h4>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-stone-550 font-semibold font-mono">
                          <span>{(storageUsedBytes / (1024 * 1024)).toFixed(1)}MB</span>
                          <span>/ {(storageQuotaBytes / (1024 * 1024 * 1024)).toFixed(1)}GB</span>
                        </div>
                        <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-600 rounded-full transition-all" style={{ width: `${storagePercentage}%` }} />
                        </div>
                      </div>
                      
                      <div className="border-t border-stone-100 pt-3 space-y-1.5">
                        <p className="text-[9px] font-bold text-stone-500 uppercase tracking-wide">จำลองอัปโหลดไฟล์ทดสอบ</p>
                        <div className="flex gap-1.5">
                          <button 
                            type="button"
                            onClick={() => handleMockUpload(10)} 
                            disabled={uploadLoading}
                            className="flex-1 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-250 rounded-xl text-[9px] text-stone-700 font-bold transition cursor-pointer"
                          >
                            รูป (10MB)
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleMockUpload(250)} 
                            disabled={uploadLoading}
                            className="flex-1 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-250 rounded-xl text-[9px] text-amber-850 font-bold transition cursor-pointer"
                          >
                            วิดีโอ (250MB)
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Export backups Card */}
                    <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50/20 space-y-3">
                      <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5 text-emerald-700" />
                        <span>ส่งออกข้อมูลสำรอง (ZIP Export)</span>
                      </h4>
                      <p className="text-[10px] text-stone-550 leading-normal">
                        ดาวน์โหลดข้อมูลทั้งหมด ประวัติคำไว้อาลัย ผังครอบครัว และหนังสือที่ระลึกในเว็บเป็นไฟล์ ZIP สำรองเก็บไว้แบบออฟไลน์
                      </p>
                      <button 
                        type="button"
                        onClick={handleExportZip}
                        disabled={exportLoading}
                        className="w-full py-2 bg-stone-50 hover:bg-stone-100 border border-stone-250 rounded-xl text-xs text-emerald-800 font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                      >
                        {exportLoading ? 'กำลังส่งออก...' : 'ดาวน์โหลด ZIP สำรองข้อมูล'}
                      </button>
                    </div>
                  </div>

                  {/* Billing invoice logs list */}
                  <div className="p-5 rounded-2xl border border-stone-200 bg-white space-y-4">
                    <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5 border-b border-stone-100 pb-2">
                      <CreditCard className="w-4 h-4 text-emerald-755" />
                      <span>ประวัติการชำระเงินค่าบริการ (Payment History)</span>
                    </h4>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                            <th className="pb-3 pl-2">เลขที่ใบเสร็จ</th>
                            <th className="pb-3">วันที่ชำระเงิน</th>
                            <th className="pb-3">รายละเอียดสินค้า</th>
                            <th className="pb-3">ยอดชำระ</th>
                            <th className="pb-3 font-semibold">สถานะ</th>
                            <th className="pb-3 pr-2 text-right">ดาวน์โหลด</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {invoiceLogs.map(log => (
                            <tr key={log.id} className="hover:bg-stone-50/80 transition">
                              <td className="py-4 pl-2 font-mono font-bold text-stone-700">{log.id}</td>
                              <td className="py-4 text-stone-500">{log.date}</td>
                              <td className="py-4 text-stone-650 max-w-[280px] truncate">{log.desc}</td>
                              <td className="py-4 text-stone-900 font-bold">{log.amount}</td>
                              <td className="py-4">
                                <span className="px-2.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-250">
                                  {log.status}
                                </span>
                              </td>
                              <td className="py-4 pr-2 text-right">
                                <a 
                                  href={`/api/payment/invoice?refId=${log.refId}`}
                                  download
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-250 text-[10px] font-bold transition active:scale-95 shadow-sm"
                                >
                                  <span>📥</span> PDF
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Conditionally display Save Button only on configuration sub-tabs */}
              {activeSubTab !== 'billing' && (
                <button 
                  type="submit" 
                  disabled={saveLoading}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5 justify-center"
                >
                  {saveLoading ? (
                    'กำลังบันทึกข้อมูล...'
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>บันทึกการตั้งค่าเว็บไซต์</span>
                    </>
                  )}
                </button>
              )}
            </form>
          </div>
        )}"""

content = content.replace(content[grid_start:grid_end], settings_repl)

# Delete billing section
billing_comment = '        {/* Billing & Invoice History Section */}'
billing_start = content.find(billing_comment)
billing_end = content.find('        {/* Condolence moderation */}', billing_start)
content = content.replace(content[billing_start:billing_end], '')

# 15. Wrap Family Tree Manager
family_comment = '        {/* Family Tree Manager Section */}'
family_start = content.find(family_comment)
section_start = content.find('<section', family_start)
family_end = content.find('        {/* E-Books Manager Section */}', family_start)
family_repl = family_comment + "\n        {activeTab === 'family' && (\n          " + content[section_start:family_end].strip() + "\n        )}"
content = content.replace(content[family_start:family_end], family_repl)

# 16. Wrap E-Book Manager
ebook_comment = '        {/* E-Books Manager Section */}'
ebook_start = content.find(ebook_comment)
ebook_section_start = content.find('<section', ebook_start)
ebook_end = content.find('        {/* Condolence moderation */}', ebook_start)
ebook_repl = ebook_comment + "\n        {activeTab === 'ebooks' && (\n          " + content[ebook_section_start:ebook_end].strip() + "\n        )}"
content = content.replace(content[ebook_start:ebook_end], ebook_repl)

# 17. Wrap Condolences Manager
condo_comment = '        {/* Condolence moderation */}'
condo_start = content.find(condo_comment)
condo_section_start = content.find('<section', condo_start)
condo_end = content.find('      </main>', condo_start)
condo_repl = condo_comment + "\n        {activeTab === 'condolences' && (\n          <>\n            " + content[condo_section_start:condo_end].strip() + "\n          </>\n        )}"
content = content.replace(content[condo_start:condo_end], condo_repl)

# 18. Append Crop Modals before main tag closing
main_close_idx = content.find("      </main>", condo_start)

modals_markup = """      {/* Cover Crop Modal */}
      {isCoverCropModalOpen && (
        <div className="fixed inset-0 z-55 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in select-none">
          <div className="w-full max-w-lg bg-stone-900 rounded-3xl border border-stone-850 p-6 flex flex-col gap-6 text-white text-left">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <h3 className="text-sm font-bold flex items-center gap-1.5 text-emerald-450">
                <Settings className="w-4 h-4 animate-spin-slow" />
                <span>ปรับแต่งรูปภาพหน้าปก (Cover Editor)</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setIsCoverCropModalOpen(false)}
                className="text-stone-400 hover:text-white transition p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Repositioning viewport Container */}
            <div 
              className="relative w-full aspect-video sm:h-52 bg-stone-955 border border-stone-800 rounded-2xl overflow-hidden cursor-move flex items-center justify-center"
              onMouseDown={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const viewportWidth = rect.width;
                const viewportHeight = rect.height;
                const startX = e.clientX - deceasedCoverX;
                const startY = e.clientY - deceasedCoverY;
                
                const handleMouseMove = (ev: MouseEvent) => {
                  let newX = ev.clientX - startX;
                  let newY = ev.clientY - startY;
                  
                  // Calculate dynamic viewport limits
                  const limitX = Math.max(0, (viewportWidth * deceasedCoverScale - viewportWidth) / 2);
                  const limitY = Math.max(0, (viewportHeight * deceasedCoverScale - viewportHeight) / 2);
                  
                  newX = Math.min(limitX, Math.max(-limitX, newX));
                  newY = Math.min(limitY, Math.max(-limitY, newY));
                  
                  setDeceasedCoverX(newX);
                  setDeceasedCoverY(newY);
                };
                const handleMouseUp = () => {
                  window.removeEventListener('mousemove', handleMouseMove);
                  window.removeEventListener('mouseup', handleMouseUp);
                };
                window.addEventListener('mousemove', handleMouseMove);
                window.addEventListener('mouseup', handleMouseUp);
              }}
              onTouchStart={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const viewportWidth = rect.width;
                const viewportHeight = rect.height;
                const touch = e.touches[0];
                const startX = touch.clientX - deceasedCoverX;
                const startY = touch.clientY - deceasedCoverY;
                
                const handleTouchMove = (ev: TouchEvent) => {
                  const t = ev.touches[0];
                  let newX = t.clientX - startX;
                  let newY = t.clientY - startY;
                  
                  // Calculate dynamic viewport limits
                  const limitX = Math.max(0, (viewportWidth * deceasedCoverScale - viewportWidth) / 2);
                  const limitY = Math.max(0, (viewportHeight * deceasedCoverScale - viewportHeight) / 2);
                  
                  newX = Math.min(limitX, Math.max(-limitX, newX));
                  newY = Math.min(limitY, Math.max(-limitY, newY));
                  
                  setDeceasedCoverX(newX);
                  setDeceasedCoverY(newY);
                };
                const handleTouchEnd = () => {
                  window.removeEventListener('touchmove', handleTouchMove);
                  window.removeEventListener('touchend', handleTouchEnd);
                };
                window.addEventListener('touchmove', handleTouchMove, { passive: true });
                window.addEventListener('touchend', handleTouchEnd);
              }}
            >
              <img
                src={deceasedCoverUrl.replace('https://storage.forever.co.th', '')}
                alt="Cover Repositioning"
                className="pointer-events-none max-w-none origin-center"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: `translate(${deceasedCoverX}px, ${deceasedCoverY}px) rotate(${deceasedCoverRotate}deg) scale(${deceasedCoverScale})`,
                }}
              />
              {/* Center crosshair reference indicator lines */}
              <div className="absolute inset-0 border border-white/10 pointer-events-none flex items-center justify-center">
                <div className="w-6 h-0.5 bg-white/30 absolute" />
                <div className="w-0.5 h-6 bg-white/30 absolute" />
              </div>
            </div>

            {/* Scale controls */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 flex justify-between">
                <span>ขนาด (Zoom)</span>
                <span className="font-mono">{deceasedCoverScale.toFixed(2)}x</span>
              </label>
              <div className="flex items-center gap-3">
                <span className="text-[10px]">➖</span>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="0.05"
                  value={deceasedCoverScale}
                  onChange={(e) => setDeceasedCoverScale(parseFloat(e.target.value))}
                  className="flex-1 accent-emerald-500 cursor-pointer h-1 bg-stone-850 rounded-lg appearance-none"
                />
                <span className="text-[10px]">➕</span>
              </div>
            </div>

            {/* Rotator controls */}
            <div className="flex justify-between items-center gap-4">
              <button
                type="button"
                onClick={() => setDeceasedCoverRotate((deceasedCoverRotate + 90) % 360)}
                className="px-4 py-2 bg-stone-850 hover:bg-stone-800 border border-stone-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>หมุนภาพ 90°</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDeceasedCoverScale(1);
                  setDeceasedCoverX(0);
                  setDeceasedCoverY(0);
                  setDeceasedCoverRotate(0);
                }}
                className="text-xs text-stone-400 hover:text-white transition cursor-pointer"
              >
                รีเซ็ตค่าเริ่มต้น
              </button>
            </div>

            {/* Save Crop button */}
            <button
              type="button"
              onClick={() => setIsCoverCropModalOpen(false)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>เสร็จสิ้นและนำไปใช้</span>
            </button>
          </div>
        </div>
      )}

      {/* Profile Photo Crop Modal */}
      {isCropModalOpen && (
        <div className="fixed inset-0 z-55 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in select-none">
          <div className="w-full max-w-sm bg-stone-900 rounded-3xl border border-stone-850 p-6 flex flex-col gap-6 text-white text-left">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <h3 className="text-sm font-bold flex items-center gap-1.5 text-emerald-450">
                <Settings className="w-4 h-4 animate-spin-slow" />
                <span>ปรับแต่งรูปโปรไฟล์ (Profile Editor)</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setIsCropModalOpen(false)}
                className="text-stone-400 hover:text-white transition p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Viewport Container with Circular Overlay mask */}
            <div className="flex items-center justify-center bg-stone-955 p-6 rounded-2xl border border-stone-800">
              <div 
                className="relative w-48 h-48 rounded-full border-2 border-white overflow-hidden cursor-move flex items-center justify-center bg-stone-900 shadow-inner"
                onMouseDown={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const viewportWidth = rect.width;
                  const startX = e.clientX - deceasedAvatarX;
                  const startY = e.clientY - deceasedAvatarY;
                  
                  const handleMouseMove = (ev: MouseEvent) => {
                    let newX = ev.clientX - startX;
                    let newY = ev.clientY - startY;
                    
                    // Boundary constraint for circular mask (192px size)
                    const limit = Math.max(0, (viewportWidth * deceasedAvatarScale - viewportWidth) / 2);
                    newX = Math.min(limit, Math.max(-limit, newX));
                    newY = Math.min(limit, Math.max(-limit, newY));
                    
                    setDeceasedAvatarX(newX);
                    setDeceasedAvatarY(newY);
                  };
                  const handleMouseUp = () => {
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mouseup', handleMouseUp);
                  };
                  window.addEventListener('mousemove', handleMouseMove);
                  window.addEventListener('mouseup', handleMouseUp);
                }}
                onTouchStart={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const viewportWidth = rect.width;
                  const touch = e.touches[0];
                  const startX = touch.clientX - deceasedAvatarX;
                  const startY = touch.clientY - deceasedAvatarY;
                  
                  const handleTouchMove = (ev: TouchEvent) => {
                    const t = ev.touches[0];
                    let newX = t.clientX - startX;
                    let newY = t.clientY - startY;
                    
                    // Boundary constraint for circular mask (192px size)
                    const limit = Math.max(0, (viewportWidth * deceasedAvatarScale - viewportWidth) / 2);
                    newX = Math.min(limit, Math.max(-limit, newX));
                    newY = Math.min(limit, Math.max(-limit, newY));
                    
                    setDeceasedAvatarX(newX);
                    setDeceasedAvatarY(newY);
                  };
                  const handleTouchEnd = () => {
                    window.removeEventListener('touchmove', handleTouchMove);
                    window.removeEventListener('touchend', handleTouchEnd);
                  };
                  window.addEventListener('touchmove', handleTouchMove, { passive: true });
                  window.addEventListener('touchend', handleTouchEnd);
                }}
              >
                <img
                  src={deceasedAvatarUrl.replace('https://storage.forever.co.th', '')}
                  alt="Avatar Repositioning"
                  className="pointer-events-none max-w-none origin-center"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `translate(${deceasedAvatarX}px, ${deceasedAvatarY}px) rotate(${deceasedAvatarRotate}deg) scale(${deceasedAvatarScale})`,
                  }}
                />
              </div>
            </div>

            {/* Scale controls */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 flex justify-between">
                <span>ขนาด (Zoom)</span>
                <span className="font-mono">{deceasedAvatarScale.toFixed(2)}x</span>
              </label>
              <div className="flex items-center gap-3">
                <span className="text-[10px]">➖</span>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="0.05"
                  value={deceasedAvatarScale}
                  onChange={(e) => setDeceasedAvatarScale(parseFloat(e.target.value))}
                  className="flex-1 accent-emerald-500 cursor-pointer h-1 bg-stone-850 rounded-lg appearance-none"
                />
                <span className="text-[10px]">➕</span>
              </div>
            </div>

            {/* Rotator controls */}
            <div className="flex justify-between items-center gap-4">
              <button
                type="button"
                onClick={() => setDeceasedAvatarRotate((deceasedAvatarRotate + 90) % 360)}
                className="px-4 py-2 bg-stone-850 hover:bg-stone-800 border border-stone-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>หมุนภาพ 90°</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDeceasedAvatarScale(1);
                  setDeceasedAvatarX(0);
                  setDeceasedAvatarY(0);
                  setDeceasedAvatarRotate(0);
                }}
                className="text-xs text-stone-400 hover:text-white transition cursor-pointer"
              >
                รีเซ็ตค่าเริ่มต้น
              </button>
            </div>

            {/* Save Crop button */}
            <button
              type="button"
              onClick={() => setIsCropModalOpen(false)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>เสร็จสิ้นและนำไปใช้</span>
            </button>
          </div>
        </div>
      )}

      </main>"""

if main_close_idx != -1:
    new_content = content[:main_close_idx] + modals_markup + content[main_close_idx + len("      </main>"):]
    with open(manage_file, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Everything applied successfully on top of clean base!")
else:
    print("Error: Close main tag not found.")
