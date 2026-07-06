import os

manage_file = "/Users/ole/ForeverProject/app/manage/page.tsx"

with open(manage_file, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update imports to include Minus
content = content.replace(
    "Settings, Plus, Trash2",
    "Settings, Plus, Minus, Trash2"
)

# 2. Update Profile Crop Modal scale buttons
old_profile_scale = """              <div className="flex items-center gap-3">
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
              </div>"""

new_profile_scale = """              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeceasedAvatarScale(Math.max(1, deceasedAvatarScale - 0.05))}
                  className="p-1 rounded-lg text-stone-400 hover:text-white transition active:scale-90 cursor-pointer hover:bg-stone-800"
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
                  className="flex-1 accent-emerald-555 cursor-pointer h-1 bg-stone-850 rounded-lg appearance-none"
                />
                <button
                  type="button"
                  onClick={() => setDeceasedAvatarScale(Math.min(4, deceasedAvatarScale + 0.05))}
                  className="p-1 rounded-lg text-stone-400 hover:text-white transition active:scale-90 cursor-pointer hover:bg-stone-800"
                  title="เพิ่มขนาด"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>"""

content = content.replace(old_profile_scale, new_profile_scale)

# 3. Update Cover Crop Modal scale buttons
old_cover_scale = """              <div className="flex items-center gap-3">
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
              </div>"""

new_cover_scale = """              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeceasedCoverScale(Math.max(1, deceasedCoverScale - 0.05))}
                  className="p-1 rounded-lg text-stone-400 hover:text-white transition active:scale-90 cursor-pointer hover:bg-stone-800"
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
                  className="flex-1 accent-emerald-555 cursor-pointer h-1 bg-stone-850 rounded-lg appearance-none"
                />
                <button
                  type="button"
                  onClick={() => setDeceasedCoverScale(Math.min(4, deceasedCoverScale + 0.05))}
                  className="p-1 rounded-lg text-stone-400 hover:text-white transition active:scale-90 cursor-pointer hover:bg-stone-800"
                  title="เพิ่มขนาด"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>"""

content = content.replace(old_cover_scale, new_cover_scale)

with open(manage_file, "w", encoding="utf-8") as f:
    f.write(content)

print("Scale controls successfully updated with Lucide Minus/Plus vectors!")
