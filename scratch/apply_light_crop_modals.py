import os

manage_file = "/Users/ole/ForeverProject/app/manage/page.tsx"

with open(manage_file, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Locate Cover Crop Modal
cover_start = content.find("      {/* Cover Crop Modal */}")
cover_end = content.find("      {/* Profile Photo Crop Modal */}")

# 2. Locate Profile Crop Modal
profile_end = content.find("      </main>", cover_end)

if cover_start != -1 and cover_end != -1 and profile_end != -1:
    new_cover_block = """      {/* Cover Crop Modal */}
      {isCoverCropModalOpen && (
        <div className="fixed inset-0 z-55 flex flex-col items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4 animate-fade-in select-none">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-stone-200 p-6 flex flex-col gap-6 text-stone-800 text-left shadow-2xl">
            <div className="flex justify-between items-center border-b border-stone-150 pb-3">
              <h3 className="text-sm font-black flex items-center gap-1.5 text-emerald-800">
                <Settings className="w-4 h-4 text-emerald-650" />
                <span>ปรับแต่งรูปภาพหน้าปก (Cover Editor)</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setIsCoverCropModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 transition p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Repositioning viewport Container */}
            <div 
              className="relative w-full aspect-video sm:h-52 bg-stone-100 border border-stone-200 rounded-2xl overflow-hidden cursor-move flex items-center justify-center"
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
              <div className="absolute inset-0 border border-stone-200/20 pointer-events-none flex items-center justify-center">
                <div className="w-6 h-0.5 bg-stone-400/40 absolute" />
                <div className="w-0.5 h-6 bg-stone-400/40 absolute" />
              </div>
            </div>

            {/* Scale controls */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 flex justify-between">
                <span>ขนาด (Zoom)</span>
                <span className="font-mono">{deceasedCoverScale.toFixed(2)}x</span>
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeceasedCoverScale(Math.max(1, deceasedCoverScale - 0.05))}
                  className="p-1 rounded-lg text-stone-500 hover:text-stone-900 transition active:scale-90 cursor-pointer hover:bg-stone-100"
                  title="ลดขนาด"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="0.05"
                  value={deceasedCoverScale}
                  onChange={(e) => setDeceasedCoverScale(parseFloat(e.target.value))}
                  className="flex-1 accent-emerald-600 cursor-pointer h-1.5 bg-stone-250 rounded-lg appearance-none"
                />
                <button
                  type="button"
                  onClick={() => setDeceasedCoverScale(Math.min(4, deceasedCoverScale + 0.05))}
                  className="p-1 rounded-lg text-stone-500 hover:text-stone-900 transition active:scale-90 cursor-pointer hover:bg-stone-100"
                  title="เพิ่มขนาด"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Rotator controls */}
            <div className="flex justify-between items-center gap-4">
              <button
                type="button"
                onClick={() => setDeceasedCoverRotate((deceasedCoverRotate + 90) % 360)}
                className="px-4 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-250 rounded-xl text-xs font-bold text-stone-700 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
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
                className="text-xs text-stone-505 hover:text-stone-900 transition cursor-pointer font-semibold"
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
"""
    
    new_profile_block = """      {/* Profile Photo Crop Modal */}
      {isCropModalOpen && (
        <div className="fixed inset-0 z-55 flex flex-col items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4 animate-fade-in select-none">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-stone-200 p-6 flex flex-col gap-6 text-stone-800 text-left shadow-2xl">
            <div className="flex justify-between items-center border-b border-stone-150 pb-3">
              <h3 className="text-sm font-black flex items-center gap-1.5 text-emerald-800">
                <Settings className="w-4 h-4 text-emerald-650" />
                <span>ปรับแต่งรูปโปรไฟล์ (Profile Editor)</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setIsCropModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 transition p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Viewport Container with Circular Overlay mask */}
            <div className="flex items-center justify-center bg-stone-50 border border-stone-200/60 p-6 rounded-2xl">
              <div 
                className="relative w-48 h-48 rounded-full border-2 border-emerald-600/80 overflow-hidden cursor-move flex items-center justify-center bg-stone-100 shadow-inner"
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
              <label className="text-xs font-bold text-stone-505 flex justify-between">
                <span>ขนาด (Zoom)</span>
                <span className="font-mono">{deceasedAvatarScale.toFixed(2)}x</span>
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeceasedAvatarScale(Math.max(1, deceasedAvatarScale - 0.05))}
                  className="p-1 rounded-lg text-stone-500 hover:text-stone-900 transition active:scale-90 cursor-pointer hover:bg-stone-100"
                  title="ลดขนาด"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="0.05"
                  value={deceasedAvatarScale}
                  onChange={(e) => setDeceasedAvatarScale(parseFloat(e.target.value))}
                  className="flex-1 accent-emerald-600 cursor-pointer h-1.5 bg-stone-250 rounded-lg appearance-none"
                />
                <button
                  type="button"
                  onClick={() => setDeceasedAvatarScale(Math.min(4, deceasedAvatarScale + 0.05))}
                  className="p-1 rounded-lg text-stone-500 hover:text-stone-900 transition active:scale-90 cursor-pointer hover:bg-stone-100"
                  title="เพิ่มขนาด"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Rotator controls */}
            <div className="flex justify-between items-center gap-4">
              <button
                type="button"
                onClick={() => setDeceasedAvatarRotate((deceasedAvatarRotate + 90) % 360)}
                className="px-4 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-250 rounded-xl text-xs font-bold text-stone-700 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
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
                className="text-xs text-stone-505 hover:text-stone-900 transition cursor-pointer font-semibold"
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
\n"""

    new_content = content[:cover_start] + new_cover_block + new_profile_block + content[profile_end:]
    with open(manage_file, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Crop modals successfully converted to warm-light mode!")
else:
    print("Error: Could not locate cover or profile modal delimiters.")
