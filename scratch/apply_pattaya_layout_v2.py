import os

manage_file = "/Users/ole/ForeverProject/app/manage/page.tsx"

with open(manage_file, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update lucide-react imports to include Copy, ExternalLink, Video, MenuIcon
lucide_import_target = """import { 
  Flame, BookOpen, Camera, GitBranch, Settings, Plus, Trash2, Edit3, 
  CreditCard, Smartphone, Check, AlertCircle, ArrowLeft, ArrowRight, 
  LogOut, Upload, User, Calendar, Heart, Sparkles, DollarSign, Download, RotateCw, X,
  Lock, Database, Search, Save, Palette, ChevronUp, ChevronDown, LayoutDashboard, AlertTriangle,
  MapPin, Clock, Phone, Info, Droplets, Image as ImageIcon
} from 'lucide-react';"""

lucide_import_repl = """import { 
  Flame, BookOpen, Camera, GitBranch, Settings, Plus, Trash2, Edit3, 
  CreditCard, Smartphone, Check, AlertCircle, ArrowLeft, ArrowRight, 
  LogOut, Upload, User, Calendar, Heart, Sparkles, DollarSign, Download, RotateCw, X,
  Lock, Database, Search, Save, Palette, ChevronUp, ChevronDown, LayoutDashboard, AlertTriangle,
  MapPin, Clock, Phone, Info, Droplets, Image as ImageIcon, Video, Menu as MenuIcon, Copy, ExternalLink
} from 'lucide-react';"""

content = content.replace(lucide_import_target, lucide_import_repl)

# 2. Add states for mobile menu and youtube url (if not present)
state_target = "  const [features, setFeatures] = useState<FeatureMap>({ ...DEFAULT_FEATURES_ON_CREATE });"
state_repl = """  const [features, setFeatures] = useState<FeatureMap>({ ...DEFAULT_FEATURES_ON_CREATE });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeSaving, setYoutubeSaving] = useState(false);"""
if "isMobileMenuOpen" not in content:
    content = content.replace(state_target, state_repl)

# 3. Add activeTab 'videos' type
target_active_tab = "const [activeTab, setActiveTab] = useState<'settings' | 'card' | 'gallery' | 'family' | 'ebooks' | 'condolences' | 'billing'>('settings');"
replacement_active_tab = "const [activeTab, setActiveTab] = useState<'settings' | 'card' | 'gallery' | 'videos' | 'family' | 'ebooks' | 'condolences' | 'billing'>('settings');"
content = content.replace(target_active_tab, replacement_active_tab)

# 4. Add handleTabClick and handleSaveYoutubeLink handlers next to selectWebsite (if not present)
target_select = "  // 2. Select Website & Load related details\n  const selectWebsite = async (site: Website) => {"
replacement_select = """  const handleTabClick = (tab: any) => {
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

  // 2. Select Website & Load related details
  const selectWebsite = async (site: Website) => {"""
if "const handleTabClick = " not in content:
    content = content.replace(target_select, replacement_select)

# 5. Define photoMedias and videoMedias variables
target_storage = "  const storagePercentage = Math.min((storageUsedBytes / storageQuotaBytes) * 100, 100);"
replacement_storage = """  const storagePercentage = Math.min((storageUsedBytes / storageQuotaBytes) * 100, 100);
  const photoMedias = galleryMedias.filter(m => !m.mimeType?.startsWith('video/') && m.mimeType !== 'video/youtube');
  const videoMedias = galleryMedias.filter(m => m.mimeType?.startsWith('video/') || m.mimeType === 'video/youtube');"""
if "const photoMedias =" not in content:
    content = content.replace(target_storage, replacement_storage)

# 6. Apply mobile bar layout & backdrop to return statement
target_return_start = """  return (
    <div className="min-h-screen bg-stone-50 text-stone-850 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 md:h-screen md:sticky md:top-0 bg-stone-100/60 border-r border-stone-200/80 p-6 flex flex-col justify-between overflow-y-auto shrink-0">"""

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
          className="p-1.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition cursor-pointer active:scale-95"
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
if "Mobile Top Bar" not in content:
    content = content.replace(target_return_start, replacement_return_start)

# 7. Replace the sidebar navigation items block (Pattaya City inspired layout!)
nav_start = content.find('          <nav className="space-y-1">')
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

# 8. Completely remove select website dropdown, S3 quota card, Privacy settings, and Export backup cards from sidebar
sidebar_lower_start = content.find('<div className="mt-8 space-y-2">')
sidebar_lower_end = content.find('            <div className="w-8 h-8 rounded-full bg-stone-200')
if sidebar_lower_start != -1 and sidebar_lower_end != -1:
    # Back up until the start of the user profile block
    profile_block_start = content.rfind('<div className="mt-8 border-t border-stone-200 pt-6">', sidebar_lower_start, sidebar_lower_end)
    if profile_block_start != -1:
        # Note the "        </div>\n\n" closing the div!
        content = content[:sidebar_lower_start] + "        </div>\n\n" + content[profile_block_start:]

# 9. Replace old gallery view block with split Photos/Videos tab blocks (if not already split)
gallery_block_start = content.find("        {activeTab === 'gallery' && (")
if gallery_block_start != -1:
    # Find the next conditional block start to avoid matching late
    gallery_block_end = content.find("        {activeTab === 'family' && (")
    
    replacement_gallery_tabs = """        {activeTab === 'gallery' && (
          <section className="p-6 rounded-3xl border border-stone-200 bg-white shadow-sm space-y-6 animate-fade-in text-left">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-stone-900 font-sans flex items-center gap-1.5">
                  <Camera className="w-5 h-5 text-emerald-700" />
                  <span>จัดการคลังภาพรำลึก ({photoMedias.length})</span>
                </h3>
                <p className="text-xs text-stone-500">อัปโหลดรูปภาพประวัติศาสตร์ครอบครัวเพื่อแสดงในหน้าคลังภาพสาธารณะ</p>
              </div>
              <div>
                <input
                  type="file"
                  id="gallery-file-input"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      Array.from(files).forEach(file => uploadGalleryMedia(file));
                    }
                  }}
                  disabled={galleryUploading}
                  className="hidden"
                />
                <label
                  htmlFor="gallery-file-input"
                  className={`px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    galleryUploading ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>อัปโหลดรูปภาพ</span>
                </label>
              </div>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onDragEnter={(e) => { e.preventDefault(); setGalleryDragActive(true); }}
              onDragOver={(e) => { e.preventDefault(); setGalleryDragActive(true); }}
              onDragLeave={(e) => { e.preventDefault(); setGalleryDragActive(false); }}
              onDrop={(e) => {
                e.preventDefault();
                setGalleryDragActive(false);
                const files = e.dataTransfer.files;
                if (files && files.length > 0) {
                  Array.from(files).forEach(file => {
                    if (file.type.startsWith('image/')) {
                      uploadGalleryMedia(file);
                    }
                  });
                }
              }}
              className={`
                border-2 border-dashed rounded-2xl p-6 text-center transition duration-300 flex flex-col items-center justify-center min-h-[120px] select-none
                ${galleryDragActive 
                  ? 'border-emerald-500 bg-emerald-50/40 scale-[1.01]' 
                  : 'border-stone-200 hover:border-emerald-400 bg-stone-50/20'
                }
              `}
            >
              {galleryUploading ? (
                <div className="space-y-2">
                  <RotateCw className="w-8 h-8 text-emerald-700 animate-spin mx-auto" />
                  <p className="text-xs font-bold text-stone-600">กำลังอัปโหลดและบันทึกข้อมูลลงระบบ...</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload className="w-8 h-8 text-stone-400 mx-auto mb-1" />
                  <p className="text-xs font-bold text-stone-700">ลากและวางรูปภาพที่นี่</p>
                  <p className="text-[10px] text-stone-400">หรือคลิกปุ่มอัปโหลดด้านบน</p>
                </div>
              )}
            </div>

            {/* Media Grid */}
            {galleryLoading ? (
              <div className="text-center py-12 text-stone-500 text-xs">
                <RotateCw className="w-6 h-6 animate-spin mx-auto mb-2 text-stone-400" />
                <span>กำลังโหลดรายการคลังภาพ...</span>
              </div>
            ) : photoMedias.length === 0 ? (
              <div className="text-center py-12 text-stone-500 text-xs border border-dashed border-stone-200 rounded-2xl">
                ยังไม่มีรูปภาพอัปโหลดลงในคลังภาพรำลึก
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {photoMedias.map((m, index) => {
                  const displayUrl = m.filePath.startsWith('https://storage.forever.co.th') 
                    ? 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=300&auto=format&fit=crop&q=80'
                    : m.filePath.replace('https://storage.forever.co.th', '');

                  return (
                    <div 
                      key={m.id} 
                      className={`
                        relative group aspect-square rounded-2xl overflow-hidden border bg-stone-50 shadow-sm transition duration-200 hover:scale-[1.02] border-stone-200
                      `}
                    >
                      <img
                        src={displayUrl}
                        alt={m.fileName}
                        className="w-full h-full object-cover pointer-events-none"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=300&auto=format&fit=crop&q=80';
                        }}
                      />

                      {/* Delete overlay */}
                      <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-3">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteGalleryMedia(m.id);
                            }}
                            className="w-8 h-8 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition active:scale-90 cursor-pointer shadow-sm border-0"
                            title="ลบสื่อนี้"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-white text-[9px] truncate w-full font-medium space-y-0.5 pointer-events-none">
                          <p className="truncate font-bold">{m.fileName}</p>
                          <p className="opacity-80">ขนาด: {(parseInt(m.fileSize, 10) / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {activeTab === 'videos' && (
          <section className="p-6 rounded-3xl border border-stone-200 bg-white shadow-sm space-y-6 animate-fade-in text-left">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-stone-900 font-sans flex items-center gap-1.5">
                  <Video className="w-5 h-5 text-emerald-700" />
                  <span>จัดการคลังวิดีโอ ({videoMedias.length})</span>
                </h3>
                <p className="text-xs text-stone-500">อัปโหลดไฟล์วิดีโอ (MP4) หรือ แนบลิงก์วิดีโอจาก YouTube เพื่อแสดงในหน้าเว็บไซต์ความทรงจำ</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="file"
                  id="video-file-input"
                  accept="video/*"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      uploadGalleryMedia(files[0]);
                    }
                  }}
                  disabled={galleryUploading}
                  className="hidden"
                />
                <label
                  htmlFor="video-file-input"
                  className={`px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    galleryUploading ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>อัปโหลดวิดีโอ (MP4)</span>
                </label>
              </div>
            </div>

            {/* YouTube Link Integration Panel */}
            <div className="bg-emerald-50/30 border border-emerald-100 p-5 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-stone-850 flex items-center gap-1.5">
                <span>🎥</span> แนบลิงก์วิดีโอจาก YouTube
              </h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="วาง URL วิดีโอ YouTube เช่น https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="flex-1 px-4 py-2 text-xs bg-white border border-stone-250 rounded-xl focus:outline-none focus:border-emerald-500/80 transition"
                />
                <button
                  type="button"
                  onClick={handleSaveYoutubeLink}
                  disabled={youtubeSaving || !youtubeUrl}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition active:scale-95 shadow-sm shrink-0 disabled:opacity-50"
                >
                  {youtubeSaving ? 'กำลังบันทึก...' : 'แนบลิงก์ YouTube'}
                </button>
              </div>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDragEnter={(e) => { e.preventDefault(); setGalleryDragActive(true); }}
              onDragOver={(e) => { e.preventDefault(); setGalleryDragActive(true); }}
              onDragLeave={(e) => { e.preventDefault(); setGalleryDragActive(false); }}
              onDrop={(e) => {
                e.preventDefault();
                setGalleryDragActive(false);
                const files = e.dataTransfer.files;
                if (files && files.length > 0) {
                  if (files[0].type.startsWith('video/')) {
                    uploadGalleryMedia(files[0]);
                  }
                }
              }}
              className={`
                border-2 border-dashed rounded-2xl p-6 text-center transition duration-300 flex flex-col items-center justify-center min-h-[120px] select-none
                ${galleryDragActive 
                  ? 'border-emerald-500 bg-emerald-50/40 scale-[1.01]' 
                  : 'border-stone-200 hover:border-emerald-400 bg-stone-50/20'
                }
              `}
            >
              {galleryUploading ? (
                <div className="space-y-2">
                  <RotateCw className="w-8 h-8 text-emerald-700 animate-spin mx-auto" />
                  <p className="text-xs font-bold text-stone-600">กำลังอัปโหลดวิดีโอลงระบบ...</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload className="w-8 h-8 text-stone-400 mx-auto mb-1" />
                  <p className="text-xs font-bold text-stone-700">ลากและวางไฟล์วิดีโอ (MP4) ที่นี่</p>
                </div>
              )}
            </div>

            {/* Videos Grid */}
            {galleryLoading ? (
              <div className="text-center py-12 text-stone-500 text-xs">
                <RotateCw className="w-6 h-6 animate-spin mx-auto mb-2 text-stone-400" />
                <span>กำลังโหลดรายการคลังวิดีโอ...</span>
              </div>
            ) : videoMedias.length === 0 ? (
              <div className="text-center py-12 text-stone-500 text-xs border border-dashed border-stone-200 rounded-2xl">
                ยังไม่มีไฟล์วิดีโอ หรือลิงก์ YouTube ในระบบ
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {videoMedias.map((m) => {
                  const displayUrl = m.filePath.startsWith('https://storage.forever.co.th') 
                    ? 'https://assets.mixkit.co/videos/preview/mixkit-sunset-seen-through-the-branches-of-a-tree-42751-large.mp4'
                    : m.filePath.replace('https://storage.forever.co.th', '');

                  const isYoutube = m.filePath.includes('youtube.com') || m.filePath.includes('youtu.be') || m.mimeType === 'video/youtube';

                  return (
                    <div 
                      key={m.id} 
                      className="relative aspect-video rounded-2xl overflow-hidden border border-stone-200 bg-stone-950 flex flex-col justify-between group shadow-sm transition hover:scale-[1.01]"
                    >
                      {isYoutube ? (
                        <div className="w-full h-full relative pointer-events-none">
                          <iframe
                            className="w-full h-full absolute inset-0"
                            src={displayUrl.replace('watch?v=', 'embed/')}
                            frameBorder="0"
                            allowFullScreen
                          />
                          <div className="absolute inset-0 bg-stone-900/10" />
                        </div>
                      ) : (
                        <video
                          src={displayUrl}
                          controls
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* Hover header for delete action */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition z-10">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteGalleryMedia(m.id);
                          }}
                          className="w-8 h-8 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition active:scale-90 cursor-pointer shadow-sm border-0"
                          title="ลบวิดีโอนี้"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Bottom info strip */}
                      <div className="absolute bottom-0 inset-x-0 bg-stone-900/60 p-3 text-white text-[9px] truncate font-medium space-y-0.5 pointer-events-none">
                        <p className="truncate font-bold">{m.fileName}</p>
                        <p className="opacity-80">
                          {isYoutube ? 'ประเภท: YouTube Link' : `ขนาด: ${(parseInt(m.fileSize, 10) / (1024 * 1024)).toFixed(2)} MB`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
"""
    content = content[:gallery_block_start] + replacement_gallery_tabs + content[gallery_block_end:]


# 10. Replace the main content header to move selector, add settings/view website button, and add copy link button
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
                className="text-emerald-700 font-semibold hover:text-emerald-850 underline"
              >
                forever.co.th/{selectedSite.slug}
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`forever.co.th/${selectedSite.slug}`);
                  setSuccess('คัดลอกลิงก์สำเร็จ!');
                }}
                className="p-1 hover:bg-stone-100 rounded-md text-stone-400 hover:text-stone-750 transition cursor-pointer"
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

with open(manage_file, "w", encoding="utf-8") as f:
    f.write(content)

print("Pattaya layout successfully applied to manage/page.tsx!")
