import os

manage_file = "/Users/ole/ForeverProject/app/manage/page.tsx"

with open(manage_file, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update lucide-react imports to include Copy, ExternalLink, Video, MenuIcon, X, Lock, Database, etc.
lucide_import_target = """import { 
  Flame, BookOpen, Camera, GitBranch, Settings, Plus, Trash2, Edit3, 
  CreditCard, Smartphone, Check, AlertCircle, ArrowLeft, ArrowRight, 
  LogOut, Upload, User, Calendar, Heart, Sparkles, DollarSign, Download, RotateCw
} from 'lucide-react';"""

lucide_import_repl = """import { 
  Flame, BookOpen, Camera, GitBranch, Settings, Plus, Trash2, Edit3, 
  CreditCard, Smartphone, Check, AlertCircle, ArrowLeft, ArrowRight, 
  LogOut, Upload, User, Calendar, Heart, Sparkles, DollarSign, Download, RotateCw, X,
  Lock, Database, Search, Save, Palette, ChevronUp, ChevronDown, LayoutDashboard, AlertTriangle,
  MapPin, Clock, Phone, Info, Droplets, Image as ImageIcon, Video, Menu as MenuIcon, Copy, ExternalLink
} from 'lucide-react';"""

content = content.replace(lucide_import_target, lucide_import_repl)

# 2. Add states for mobile menu, youtubeUrl, features, activeSubTab, and deceased states
state_target = "  const [avatarUploading, setAvatarUploading] = useState(false);"
state_repl = """  const [avatarUploading, setAvatarUploading] = useState(false);
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
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);"""

content = content.replace(state_target, state_repl)

# 3. Add features state and setFeatures loader if they are not in the clean file
features_state_target = "  const [userPhone, setUserPhone] = useState('');"
features_state_repl = """  const [userPhone, setUserPhone] = useState('');
  const [features, setFeatures] = useState<FeatureMap>({
    familyTree: true,
    gallery: true,
    announcement: true,
    ebook: true,
    condolence: true,
    donations: true,
  });"""

content = content.replace(features_state_target, features_state_repl)

# 4. Add handleTabClick and handleSaveYoutubeLink handlers right before "return ("
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

  const photoMedias = galleryMedias.filter(m => !m.mimeType?.startsWith('video/') && m.mimeType !== 'video/youtube');
  const videoMedias = galleryMedias.filter(m => m.mimeType?.startsWith('video/') || m.mimeType === 'video/youtube');
  const storagePercentage = Math.min((storageUsedBytes / storageQuotaBytes) * 100, 100);

  return ("""

content = content.replace(return_target, handlers_repl)

# 5. Apply mobile bar layout & backdrop to return statement
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

content = content.replace(target_return_start, replacement_return_start)

# 6. Replace the sidebar navigation items block (Pattaya City inspired layout!)
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

# 7. Completely remove select website dropdown from sidebar
sidebar_lower_start = content.find('          <div className="mt-8 space-y-2">')
if sidebar_lower_start != -1:
    sidebar_lower_end = content.find('          </div>', sidebar_lower_start) + len('          </div>')
    # Remove the dropdown completely
    content = content[:sidebar_lower_start] + content[sidebar_lower_end:]

# 8. Replace the main content header to move selector, add settings/view website button, and add copy link button
header_target = """      {/* Main dashboard content */}
      <main className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full overflow-y-auto">
        
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-stone-200">
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

header_repl = """      {/* Main dashboard content */}
      <main className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full overflow-y-auto">
        
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-stone-200">
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

print("Pattaya layout v3 successfully applied!")
