import os

manage_file = "/Users/ole/ForeverProject/app/manage/page.tsx"
layout_file = "/Users/ole/ForeverProject/app/(public)/[slug]/PublicLayoutClient.tsx"

with open(manage_file, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add states
state_target = "  const [deceasedAvatarUrl, setDeceasedAvatarUrl] = useState('');"
state_repl = """  const [deceasedAvatarUrl, setDeceasedAvatarUrl] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'media' | 'theme' | 'features' | 'billing'>('general');
  const [deceasedCoverUrl, setDeceasedCoverUrl] = useState('');
  const [deceasedCoverScale, setDeceasedCoverScale] = useState(1);
  const [deceasedCoverX, setDeceasedCoverX] = useState(0);
  const [deceasedCoverY, setDeceasedCoverY] = useState(0);
  const [deceasedCoverRotate, setDeceasedCoverRotate] = useState(0);
  const [coverUploading, setCoverUploading] = useState(false);
  const [isCoverCropModalOpen, setIsCoverCropModalOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [isCoverMenuOpen, setIsCoverMenuOpen] = useState(false);"""

content = content.replace(state_target, state_repl)

# 2. Load config
load_target = """      setDeceasedAvatarUrl(config.avatarUrl || '');
      setDeceasedAvatarScale(config.avatarScale || 1);
      setDeceasedAvatarX(config.avatarX || 0);
      setDeceasedAvatarY(config.avatarY || 0);
      setDeceasedAvatarRotate(config.avatarRotate || 0);"""
load_repl = """      setDeceasedAvatarUrl(config.avatarUrl || '');
      setDeceasedAvatarScale(config.avatarScale || 1);
      setDeceasedAvatarX(config.avatarX || 0);
      setDeceasedAvatarY(config.avatarY || 0);
      setDeceasedAvatarRotate(config.avatarRotate || 0);
      setDeceasedCoverUrl(config.coverUrl || '');
      setDeceasedCoverScale(config.coverScale || 1);
      setDeceasedCoverX(config.coverX || 0);
      setDeceasedCoverY(config.coverY || 0);
      setDeceasedCoverRotate(config.coverRotate || 0);"""

content = content.replace(load_target, load_repl)

# 3. Reset config
reset_target = """      setDeceasedAvatarUrl('');
      setDeceasedAvatarScale(1);
      setDeceasedAvatarX(0);
      setDeceasedAvatarY(0);
      setDeceasedAvatarRotate(0);"""
reset_repl = """      setDeceasedAvatarUrl('');
      setDeceasedAvatarScale(1);
      setDeceasedAvatarX(0);
      setDeceasedAvatarY(0);
      setDeceasedAvatarRotate(0);
      setDeceasedCoverUrl('');
      setDeceasedCoverScale(1);
      setDeceasedCoverX(0);
      setDeceasedCoverY(0);
      setDeceasedCoverRotate(0);"""

content = content.replace(reset_target, reset_repl)

# 4. Save config
save_target = """        avatarUrl: deceasedAvatarUrl,
        avatarScale: deceasedAvatarScale,
        avatarX: deceasedAvatarX,
        avatarY: deceasedAvatarY,
        avatarRotate: deceasedAvatarRotate,
        biography,
        features,"""
save_repl = """        avatarUrl: deceasedAvatarUrl,
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
        features,"""

content = content.replace(save_target, save_repl)

# 5. Add uploadDeceasedCover next to uploadDeceasedAvatar
upload_avatar_start = "  const uploadDeceasedAvatar = async (file: File) => {"
upload_cover_fn = """  const uploadDeceasedCover = async (file: File) => {
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

  const uploadDeceasedAvatar = async (file: File) => {"""

content = content.replace(upload_avatar_start, upload_cover_fn)

# 6. Remove sidebar billing nav button
billing_nav_target = """            <button 
              type="button"
              onClick={() => handleTabClick('billing')}
              className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs transition font-semibold cursor-pointer ${
                activeTab === 'billing' 
                  ? 'bg-white shadow-xs border border-stone-200 text-emerald-700 font-bold' 
                  : 'text-stone-600 hover:text-stone-955 hover:bg-stone-200/30'
              }`}
            >
              <CreditCard className={`w-3.5 h-3.5 ${activeTab === 'billing' ? 'text-emerald-700' : 'text-stone-500'}`} />
              <span>ประวัติการชำเนียม</span>
            </button>"""

content = content.replace(billing_nav_target, "")

# 7. Remove Privacy settings card from sidebar
privacy_card_target = """              {/* Privacy settings */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-white shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>ความเป็นส่วนตัว</span>
                </h4>
                <div className="space-y-3">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="sidebar-visibility" 
                      value="PUBLIC" 
                      checked={visibility === 'PUBLIC'}
                      onChange={() => setVisibility('PUBLIC')}
                      className="accent-emerald-600 w-3.5 h-3.5 mt-0.5 cursor-pointer"
                    />
                    <div>
                      <p className="text-[11px] font-bold text-stone-900">เปิดสาธารณะ (Public)</p>
                      <p className="text-[9px] text-stone-500 leading-tight">ทุกคนเข้าชมและเขียนคำไว้อาลัยได้</p>
                    </div>
                  </label>
                </div>
              </div>"""

content = content.replace(privacy_card_target, "")

# 8. Extract original blocks from page.tsx to prevent breaking any layouts
# Theme settings block extraction
theme_start_str = '<div className="space-y-2 border-t border-stone-100 pt-6">'
theme_end_str = '<div className="space-y-2">\n              <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">คำอาลัยและคำรำลึก'
theme_start_idx = content.find(theme_start_str)
theme_end_idx = content.find(theme_end_str)
theme_block_str = content[theme_start_idx:theme_end_idx].strip()

# Announcement settings block extraction
ann_start_str = '{/* Announcement Card Settings */}'
ann_end_str = '            <button \n              type="submit" \n              disabled={saveLoading}'
ann_start_idx = content.find(ann_start_str)
ann_end_idx = content.find(ann_end_str)
ann_block_str = content[ann_start_idx:ann_end_idx].strip()

# 9. Reconstruct settings form body
form_block_start = content.find('        {activeTab === \'settings\' && (')
form_block_end = content.find('        {activeTab === \'family\' && (')

# Rebuilt form children structure
settings_form_repl = """        {activeTab === 'settings' && (
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
                  """ + ann_block_str + """
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
                    disabled={deceasedAvatarUploading}
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
                          className="w-full h-full object-cover pointer-events-none" 
                          style={{
                            transform: `translate(${((deceasedCoverX || 0) / 320) * 100}%, ${((deceasedCoverY || 0) / 160) * 100}%) rotate(${deceasedCoverRotate || 0}deg) scale(${deceasedCoverScale || 1})`,
                            transformOrigin: 'center center',
                          }}
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors" />
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-stone-50 flex flex-col items-center justify-center gap-1.5 text-stone-400">
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
                          <div className="absolute left-[calc(50%-88px)] bottom-full mb-2 bg-white border border-stone-200 rounded-2xl shadow-xl py-2 w-44 text-stone-800 text-xs font-bold z-30 animate-fade-in text-left">
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
                          <div className="absolute right-0 bottom-full mb-2 bg-white border border-stone-200 rounded-2xl shadow-xl py-2 w-44 text-stone-800 text-xs font-bold z-30 animate-fade-in text-left">
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
              </div>
            )}

            {/* 3. ธีม & สี & ฟอนต์ Tab */}
            {activeSubTab === 'theme' && (
              <div className="space-y-6 animate-fade-in text-left">
                """ + theme_block_str + """
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
                <FeatureToggleList value={features} onChange={setFeatures} />
              </div>
            )}

            {/* 5. พื้นที่จัดเก็บ & การชำระเงิน Tab */}
            {activeSubTab === 'billing' && (
              <div className="space-y-6 text-left animate-fade-in">
                {/* Storage & Export Backups grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Storage Quota Card */}
                  <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50/20 space-y-4">
                    <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-emerald-700" />
                      <span>พื้นที่จัดเก็บมีเดีย S3 / R2</span>
                    </h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-stone-500 font-semibold font-mono">
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
                    <p className="text-[10px] text-stone-500 leading-normal">
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

content = content[:form_block_start] + settings_form_repl + content[form_block_end:]

# 11. Remove duplicate billing tabs if any
billing_tab_pattern = """        {activeTab === 'billing' && (
          <section className="p-6 rounded-3xl border border-stone-200 bg-white shadow-sm space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h3 className="text-lg font-black text-stone-900 flex items-center gap-1.5">
              <CreditCard className="w-5 h-5 text-emerald-700" />
              <span>ประวัติการชำระเงินและดาวน์โหลดใบกำกับภาษี</span>
            </h3>
            <p className="text-xs text-stone-500">ตรวจสอบประวัติการทำรายการชำระค่าบริการ และดาวน์โหลดใบเสร็จ/ใบกำกับภาษีเต็มรูปแบบ (ตามกฎหมายไทย)</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                  <th className="pb-3 pl-2">เลขที่ใบกำกับภาษี</th>
                  <th className="pb-3">วันที่ชำระเงิน</th>
                  <th className="pb-3">รายละเอียดสินค้า</th>
                  <th className="pb-3">ยอดชำระ</th>
                  <th className="pb-3">สถานะ</th>
                  <th className="pb-3 pr-2 text-right">ใบกำกับภาษี</th>
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
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-850 border border-emerald-200 text-[10px] font-bold transition active:scale-95 shadow-sm"
                      >
                        <span>📥</span> ใบกำกับภาษี
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        )}"""

content = content.replace(billing_tab_pattern, "")

# 12. Add circular & cover repositioning crop overlays using last-index find to prevent block corruption
main_close_idx = content.rfind("      </main>")

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
              className="relative w-full aspect-video sm:h-52 bg-stone-950 border border-stone-800 rounded-2xl overflow-hidden cursor-move flex items-center justify-center"
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
                  className="flex-1 accent-emerald-500 cursor-pointer h-1 bg-stone-800 rounded-lg appearance-none"
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
            <div className="flex items-center justify-center bg-stone-950 p-6 rounded-2xl border border-stone-800">
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
                  className="flex-1 accent-emerald-500 cursor-pointer h-1 bg-stone-800 rounded-lg appearance-none"
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
    print("Settings tabs and modals successfully applied!")
else:
    print("Error: Could not locate </main> target.")


# Edit PublicLayoutClient.tsx
with open(layout_file, "r", encoding="utf-8") as f:
    layout_content = f.read()

layout_header_target = """      {/* Header */}
      <header className="relative py-16 text-center bg-white border-b border-stone-200/60 overflow-hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-[100px] pointer-events-none opacity-10"
          style={{ backgroundColor: 'var(--theme-primary)' }}
        />
        <div className="max-w-4xl mx-auto px-4 relative z-10">"""

layout_header_repl = """      {/* Header */}
      <header className={`relative py-16 text-center border-b border-stone-200/60 overflow-hidden transition-all duration-500 ${
        coverUrl ? 'bg-stone-950 text-white py-20 sm:py-24' : 'bg-white'
      }`}>
        {coverUrl ? (
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <img 
              src={coverUrl.startsWith('http') || coverUrl.startsWith('/') ? coverUrl : `/${coverUrl}`} 
              alt="Cover Image" 
              className="w-full h-full object-cover" 
              style={{
                transform: `translate(${((coverX || 0) / 320) * 100}%, ${((coverY || 0) / 160) * 100}%) rotate(${coverRotate || 0}deg) scale(${coverScale || 1})`,
                transformOrigin: 'center center',
              }}
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px]" />
          </div>
        ) : (
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-[100px] pointer-events-none opacity-10"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          />
        )}
        <div className="max-w-4xl mx-auto px-4 relative z-10">"""

layout_content = layout_content.replace(layout_header_target, layout_header_repl)

layout_title_target = """          <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight mb-2 ${
            coverUrl ? 'text-white drop-shadow-md' : 'text-stone-900'
          }`}>
            {tenant.name}
          </h1>"""

layout_title_repl = """          <h1 className={`text-2xl sm:text-3xl font-black tracking-tight mb-2 ${
            coverUrl ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : 'text-stone-900'
          }`}>
            {tenant.name}
          </h1>"""

layout_content = layout_content.replace(layout_title_target, layout_title_repl)

with open(layout_file, "w", encoding="utf-8") as f:
    f.write(layout_content)

print("PublicLayoutClient.tsx updated successfully!")
