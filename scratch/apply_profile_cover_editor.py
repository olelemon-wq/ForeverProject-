file_path = "/Users/ole/ForeverProject/app/manage/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Inject cover and menu states
state_target = "  const [activeSubTab, setActiveSubTab] = useState<'general' | 'media' | 'theme' | 'features' | 'billing'>('general');"
state_repl = """  const [activeSubTab, setActiveSubTab] = useState<'general' | 'media' | 'theme' | 'features' | 'billing'>('general');
  const [deceasedCoverUrl, setDeceasedCoverUrl] = useState('');
  const [deceasedCoverScale, setDeceasedCoverScale] = useState(1);
  const [deceasedCoverX, setDeceasedCoverX] = useState(0);
  const [deceasedCoverY, setDeceasedCoverY] = useState(0);
  const [deceasedCoverRotate, setDeceasedCoverRotate] = useState(0);
  const [coverUploading, setCoverUploading] = useState(false);
  const [isCoverCropModalOpen, setIsCoverCropModalOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [isCoverMenuOpen, setIsCoverMenuOpen] = useState(false);"""

if state_target in content:
    content = content.replace(state_target, state_repl)
    print("Injected cover/menu states successfully.")

# 2. Inject config loading for cover
load_target = """      setDeceasedAvatarScale(config.avatarScale || 1);
      setDeceasedAvatarX(config.avatarX || 0);
      setDeceasedAvatarY(config.avatarY || 0);
      setDeceasedAvatarRotate(config.avatarRotate || 0);"""
load_repl = """      setDeceasedAvatarScale(config.avatarScale || 1);
      setDeceasedAvatarX(config.avatarX || 0);
      setDeceasedAvatarY(config.avatarY || 0);
      setDeceasedAvatarRotate(config.avatarRotate || 0);
      setDeceasedCoverUrl(config.coverUrl || '');
      setDeceasedCoverScale(config.coverScale || 1);
      setDeceasedCoverX(config.coverX || 0);
      setDeceasedCoverY(config.coverY || 0);
      setDeceasedCoverRotate(config.coverRotate || 0);"""

if load_target in content:
    content = content.replace(load_target, load_repl)
    print("Injected cover config loading successfully.")

# 3. Inject config reset for cover
reset_target = """      setDeceasedAvatarScale(1);
      setDeceasedAvatarX(0);
      setDeceasedAvatarY(0);
      setDeceasedAvatarRotate(0);"""
reset_repl = """      setDeceasedAvatarScale(1);
      setDeceasedAvatarX(0);
      setDeceasedAvatarY(0);
      setDeceasedAvatarRotate(0);
      setDeceasedCoverUrl('');
      setDeceasedCoverScale(1);
      setDeceasedCoverX(0);
      setDeceasedCoverY(0);
      setDeceasedCoverRotate(0);"""

if reset_target in content:
    content = content.replace(reset_target, reset_repl)
    print("Injected cover config reset successfully.")

# 4. Inject config save for cover
save_target = """        avatarUrl: deceasedAvatarUrl,
        avatarScale: deceasedAvatarScale,
        avatarX: deceasedAvatarX,
        avatarY: deceasedAvatarY,
        avatarRotate: deceasedAvatarRotate,"""
save_repl = """        avatarUrl: deceasedAvatarUrl,
        avatarScale: deceasedAvatarScale,
        avatarX: deceasedAvatarX,
        avatarY: deceasedAvatarY,
        avatarRotate: deceasedAvatarRotate,
        coverUrl: deceasedCoverUrl,
        coverScale: deceasedCoverScale,
        coverX: deceasedCoverX,
        coverY: deceasedCoverY,
        coverRotate: deceasedCoverRotate,"""

if save_target in content:
    content = content.replace(save_target, save_repl)
    print("Injected cover save properties successfully.")

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
          album: 'COVER',
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

if upload_avatar_start in content:
    content = content.replace(upload_avatar_start, upload_cover_fn)
    print("Added uploadDeceasedCover function successfully.")

# 6. Restructure the activeSubTab === 'media' view block
media_start = content.find("                {activeSubTab === 'media' && (")
if media_start != -1:
    media_end_marker = "                {activeSubTab === 'theme' && ("
    media_end = content.find(media_end_marker, media_start)
    if media_end != -1:
        # Find the last closing tag '                )}' before the next block
        sub_media = content[media_start:media_end]
        last_close = sub_media.rfind("                )}")
        if last_close != -1:
            full_media_end = media_start + last_close + len("                )}")
            
            # Define replacement media block
            repl_media = """                {activeSubTab === 'media' && (
                  <div className="space-y-6 animate-fade-in text-left">
                    <h3 className="text-base font-black text-stone-900 flex items-center gap-1.5 border-b border-stone-100 pb-3">
                      <Camera className="w-4 h-4 text-emerald-755" />
                      <span>รูปโปรไฟล์ & รูปปกเด่น (Profile & Cover Banner)</span>
                    </h3>
                    
                    <p className="text-xs text-stone-500">
                      จัดการอัปโหลดรูปภาพโปรไฟล์หลักและภาพหน้าปกหลักของหน้าความทรงจำ พร้อมกดปุ่มรูปกล้องเพื่อเปลี่ยนรูป ปรับแต่งการจัดวาง หรือลบรูปภาพได้โดยตรง
                    </p>

                    {/* Unified LINE-style Live Header Preview Container */}
                    <div className="w-full max-w-2xl mx-auto rounded-3xl border border-stone-200 overflow-hidden bg-stone-100/60 relative select-none">
                      {/* 1. Cover Photo Area */}
                      <div className="w-full h-48 sm:h-56 bg-stone-200 relative flex items-center justify-center overflow-hidden">
                        {deceasedCoverUrl ? (
                          <img 
                            src={deceasedCoverUrl.replace('https://storage.forever.co.th', '')} 
                            alt="Cover Preview" 
                            className="w-full h-full object-cover pointer-events-none"
                            style={{
                              transform: `translate(${((deceasedCoverX || 0) / 320) * 100}%, ${((deceasedCoverY || 0) / 160) * 100}%) rotate(${deceasedCoverRotate || 0}deg) scale(${deceasedCoverScale || 1})`,
                              transformOrigin: 'center center',
                            }}
                          />
                        ) : (
                          <div className="text-center text-stone-400 space-y-1.5">
                            <ImageIcon className="w-8 h-8 mx-auto opacity-70" />
                            <p className="text-[10px] font-bold uppercase tracking-wider">ยังไม่มีภาพหน้าปก (Cover Banner)</p>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/15 pointer-events-none" />

                        {/* Cover Camera Button Trigger Overlay */}
                        <div className="absolute bottom-3 right-3 z-20">
                          <button
                            type="button"
                            onClick={() => {
                              setIsCoverMenuOpen(!isCoverMenuOpen);
                              setIsAvatarMenuOpen(false);
                            }}
                            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/75 text-white flex items-center justify-center cursor-pointer shadow-md transition active:scale-90 border border-white/20"
                            title="จัดการรูปภาพหน้าปก"
                          >
                            <Camera className="w-4 h-4" />
                          </button>

                          {/* Cover Actions Dropdown */}
                          {isCoverMenuOpen && (
                            <>
                              <div className="fixed inset-0 z-10 cursor-default" onClick={() => setIsCoverMenuOpen(false)} />
                              <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-stone-200 rounded-xl shadow-lg z-20 p-1.5 text-xs font-bold text-stone-700 animate-fade-in">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsCoverMenuOpen(false);
                                    document.getElementById('deceased-cover-file-input')?.click();
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-stone-50 rounded-lg cursor-pointer flex items-center gap-1.5"
                                >
                                  <span>📷</span> อัปโหลดรูปปกใหม่
                                </button>
                                {deceasedCoverUrl && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setIsCoverMenuOpen(false);
                                        setIsCoverCropModalOpen(true);
                                      }}
                                      className="w-full text-left px-3 py-2 hover:bg-stone-50 rounded-lg cursor-pointer flex items-center gap-1.5"
                                    >
                                      <span>⚙️</span> ปรับแต่งหน้าปก
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
                                      className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-650 rounded-lg cursor-pointer flex items-center gap-1.5"
                                    >
                                      <span>🗑️</span> ลบรูปหน้าปก
                                    </button>
                                  </>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Hidden File Inputs */}
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

                      {/* 2. Avatar Area (Overlapping in the middle) */}
                      <div className="absolute left-1/2 bottom-4 -translate-x-1/2 flex flex-col items-center z-10">
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center overflow-visible">
                          {deceasedAvatarUrl ? (
                            <div className="w-full h-full rounded-full overflow-hidden relative">
                              <img 
                                src={deceasedAvatarUrl.replace('https://storage.forever.co.th', '')} 
                                alt="Deceased Avatar Preview" 
                                className="w-full h-full object-cover pointer-events-none"
                                style={{
                                  transform: `translate(${((deceasedAvatarX || 0) / 224) * 100}%, ${((deceasedAvatarY || 0) / 224) * 100}%) rotate(${deceasedAvatarRotate}deg) scale(${(deceasedAvatarScale || 1) * (300 / 224)})`,
                                  transformOrigin: 'center center',
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-full h-full rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                              <User className="w-10 h-10 opacity-70" />
                            </div>
                          )}

                          {/* Avatar Camera Button Trigger Overlay */}
                          <div className="absolute bottom-0 right-0 z-20">
                            <button
                              type="button"
                              onClick={() => {
                                setIsAvatarMenuOpen(!isAvatarMenuOpen);
                                setIsCoverMenuOpen(false);
                              }}
                              className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/75 text-white flex items-center justify-center cursor-pointer shadow-md transition active:scale-90 border border-white/20"
                              title="จัดการรูปโปรไฟล์"
                            >
                              <Camera className="w-3.5 h-3.5" />
                            </button>

                            {/* Avatar Actions Dropdown */}
                            {isAvatarMenuOpen && (
                              <>
                                <div className="fixed inset-0 z-10 cursor-default" onClick={() => setIsAvatarMenuOpen(false)} />
                                <div className="absolute left-0 top-full mt-1.5 w-44 bg-white border border-stone-200 rounded-xl shadow-lg z-20 p-1.5 text-xs font-bold text-stone-700 animate-fade-in">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIsAvatarMenuOpen(false);
                                      document.getElementById('deceased-avatar-file-input')?.click();
                                    }}
                                    className="w-full text-left px-3 py-2 hover:bg-stone-50 rounded-lg cursor-pointer flex items-center gap-1.5"
                                  >
                                    <span>📷</span> อัปโหลดรูปใหม่
                                  </button>
                                  {deceasedAvatarUrl && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setIsAvatarMenuOpen(false);
                                          setIsCropModalOpen(true);
                                        }}
                                        className="w-full text-left px-3 py-2 hover:bg-stone-50 rounded-lg cursor-pointer flex items-center gap-1.5"
                                      >
                                        <span>⚙️</span> ปรับแต่งโปรไฟล์
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
                                        className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-650 rounded-lg cursor-pointer flex items-center gap-1.5"
                                      >
                                        <span>🗑️</span> ลบรูปโปรไฟล์
                                      </button>
                                    </>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-[10px] text-stone-450 text-center font-medium mt-2">
                      แนะนำรูปภาพสัดส่วน 1:1 สำหรับรูปโปรไฟล์ และสัดส่วนแนวนอนสำหรับรูปหน้าปกหลัก
                    </div>
                  </div>
                )"""
            content = content[:media_start] + repl_media + content[full_media_end:]
            print("Restructured activeSubTab === 'media' layout successfully.")

# 7. Add Crop Modals at the bottom of JSX
# Let's find the closing footer block of manage/page.tsx
old_footer = """        {/* Shadcn-style delete confirmation dialog */}
        {deleteConfirmOpen && deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs animate-fade-in">"""

# Let's define the crop modal markup to prepend before delete dialog or at the bottom
crop_modals = """        {/* Crop / Adjust Image Modal */}
        {isCropModalOpen && deceasedAvatarUrl && (
          <div className="fixed inset-0 bg-black/95 z-55 flex flex-col items-center justify-between p-6 animate-fade-in select-none">
            {/* Top Bar */}
            <div className="w-full flex justify-between items-center max-w-md">
              <button
                type="button"
                onClick={() => setDeceasedAvatarRotate(prev => (prev + 90) % 360)}
                className="p-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl transition flex items-center justify-center cursor-pointer border border-zinc-850 active:scale-90"
                title="หมุนรูปภาพ 90 องศา"
              >
                <RotateCw className="w-5 h-5" />
              </button>
              
              <h3 className="text-sm font-bold text-white font-sans tracking-wide">ปรับแต่งจัดวางตำแหน่งรูปโปรไฟล์</h3>
              
              <button
                type="button"
                onClick={() => setIsCropModalOpen(false)}
                className="p-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl transition flex items-center justify-center cursor-pointer border border-zinc-850 active:scale-90"
                title="ปิด"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Viewport Canvas (Circle Crop Overlay) */}
            <div className="relative my-auto flex items-center justify-center">
              <div 
                className="w-[280px] h-[280px] bg-zinc-900 rounded-full overflow-hidden relative flex items-center justify-center cursor-move"
                onMouseDown={(e) => {
                  e.preventDefault();
                  const coords = { x: e.clientX, y: e.clientY };
                  setIsDragging(true);
                  setDragStart({ x: coords.x - deceasedAvatarX, y: coords.y - deceasedAvatarY });
                }}
                onMouseMove={(e) => {
                  if (!isDragging) return;
                  const coords = { x: e.clientX, y: e.clientY };
                  setDeceasedAvatarX(coords.x - dragStart.x);
                  setDeceasedAvatarY(coords.y - dragStart.y);
                }}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onTouchStart={(e) => {
                  const touch = e.touches[0];
                  const coords = { x: touch.clientX, y: touch.clientY };
                  setIsDragging(true);
                  setDragStart({ x: coords.x - deceasedAvatarX, y: coords.y - deceasedAvatarY });
                }}
                onTouchMove={(e) => {
                  if (!isDragging) return;
                  const touch = e.touches[0];
                  const coords = { x: touch.clientX, y: touch.clientY };
                  setDeceasedAvatarX(coords.x - dragStart.x);
                  setDeceasedAvatarY(coords.y - dragStart.y);
                }}
                onTouchEnd={() => setIsDragging(false)}
              >
                <img 
                  src={deceasedAvatarUrl.replace('https://storage.forever.co.th', '')} 
                  alt="Deceased Avatar Crop Preview" 
                  className="max-w-none pointer-events-none"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `translate(${deceasedAvatarX}px, ${deceasedAvatarY}px) rotate(${deceasedAvatarRotate}deg) scale(${deceasedAvatarScale})`,
                    transformOrigin: 'center center',
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`;
                  }}
                />

                {/* Circular Cutout Mask Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div 
                    className="w-[260px] h-[260px] rounded-full border border-white/60"
                    style={{ boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)' }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Sliders & Confirm Controls */}
            <div className="w-full max-w-md space-y-5 bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                  <span>ซูมขยายภาพ (Zoom Scale)</span>
                  <span className="font-mono text-zinc-200">{Math.round(deceasedAvatarScale * 100)}%</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="4"
                  step="0.05"
                  value={deceasedAvatarScale}
                  onChange={(e) => setDeceasedAvatarScale(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 bg-zinc-850 h-1 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsCropModalOpen(false)}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition active:scale-95 cursor-pointer"
              >
                ยืนยันการจัดวางรูปโปรไฟล์
              </button>
            </div>
          </div>
        )}

        {/* Crop / Adjust Cover Image Modal */}
        {isCoverCropModalOpen && deceasedCoverUrl && (
          <div className="fixed inset-0 bg-black/95 z-55 flex flex-col items-center justify-between p-6 animate-fade-in select-none">
            {/* Top Bar */}
            <div className="w-full flex justify-between items-center max-w-md">
              <button
                type="button"
                onClick={() => setDeceasedCoverRotate(prev => (prev + 90) % 360)}
                className="p-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl transition flex items-center justify-center cursor-pointer border border-zinc-850 active:scale-90"
                title="หมุนรูปภาพ 90 องศา"
              >
                <RotateCw className="w-5 h-5" />
              </button>
              
              <h3 className="text-sm font-bold text-white font-sans tracking-wide">ปรับแต่งจัดวางตำแหน่งรูปหน้าปก</h3>
              
              <button
                type="button"
                onClick={() => setIsCoverCropModalOpen(false)}
                className="p-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl transition flex items-center justify-center cursor-pointer border border-zinc-850 active:scale-90"
                title="ปิด"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Viewport Canvas (Rectangle Crop Overlay) */}
            <div className="relative my-auto flex items-center justify-center">
              <div 
                className="w-[320px] h-[160px] bg-zinc-900 rounded-2xl overflow-hidden relative flex items-center justify-center cursor-move"
                onMouseDown={(e) => {
                  e.preventDefault();
                  const coords = { x: e.clientX, y: e.clientY };
                  setIsDragging(true);
                  setDragStart({ x: coords.x - deceasedCoverX, y: coords.y - deceasedCoverY });
                }}
                onMouseMove={(e) => {
                  if (!isDragging) return;
                  const coords = { x: e.clientX, y: e.clientY };
                  setDeceasedCoverX(coords.x - dragStart.x);
                  setDeceasedCoverY(coords.y - dragStart.y);
                }}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onTouchStart={(e) => {
                  const touch = e.touches[0];
                  const coords = { x: touch.clientX, y: touch.clientY };
                  setIsDragging(true);
                  setDragStart({ x: coords.x - deceasedCoverX, y: coords.y - deceasedCoverY });
                }}
                onTouchMove={(e) => {
                  if (!isDragging) return;
                  const touch = e.touches[0];
                  const coords = { x: touch.clientX, y: touch.clientY };
                  setDeceasedCoverX(coords.x - dragStart.x);
                  setDeceasedCoverY(coords.y - dragStart.y);
                }}
                onTouchEnd={() => setIsDragging(false)}
              >
                <img 
                  src={deceasedCoverUrl.replace('https://storage.forever.co.th', '')} 
                  alt="Deceased Cover Crop Preview" 
                  className="max-w-none pointer-events-none"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `translate(${deceasedCoverX}px, ${deceasedCoverY}px) rotate(${deceasedCoverRotate}deg) scale(${deceasedCoverScale})`,
                    transformOrigin: 'center center',
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=300`;
                  }}
                />

                {/* Rectangular Cutout Mask Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div 
                    className="w-[300px] h-[140px] rounded-xl border border-white/60"
                    style={{ boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)' }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Sliders & Confirm Controls */}
            <div className="w-full max-w-md space-y-5 bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                  <span>ซูมขยายภาพ (Zoom Scale)</span>
                  <span className="font-mono text-zinc-200">{Math.round(deceasedCoverScale * 100)}%</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="4"
                  step="0.05"
                  value={deceasedCoverScale}
                  onChange={(e) => setDeceasedCoverScale(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 bg-zinc-850 h-1 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsCoverCropModalOpen(false)}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition active:scale-95 cursor-pointer"
              >
                ยืนยันการจัดวางรูปหน้าปก
              </button>
            </div>
          </div>
        )}

        {/* Shadcn-style delete confirmation dialog */}
        {deleteConfirmOpen && deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs animate-fade-in">"""

if old_footer in content:
    content = content.replace(old_footer, crop_modals)
    print("Injected Crop Modals successfully.")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
