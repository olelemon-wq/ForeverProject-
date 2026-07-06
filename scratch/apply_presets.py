import os

manage_file = "/Users/ole/ForeverProject/app/manage/page.tsx"

with open(manage_file, "r", encoding="utf-8") as f:
    content = f.read()

theme_start = content.find("              {/* 3. ธีม & สี & ฟอนต์ Tab */}")
theme_end = content.find("              {/* 4. ฟีเจอร์ที่เปิดใช้งาน Tab */}", theme_start)

if theme_start != -1 and theme_end != -1:
    old_theme_block = content[theme_start:theme_end]
    new_theme_block = """              {/* 3. ธีม & สี & ฟอนต์ Tab */}
              {activeSubTab === 'theme' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">โทนสีหลักยอดนิยม (Theme Presets)</label>
                    <div className="flex flex-wrap gap-2.5 bg-stone-50/50 p-4 border border-stone-200 rounded-2xl">
                      {[
                        { name: 'Classic', color: '#0d9488', desc: 'Classic Teal' },
                        { name: 'Warm', color: '#b45309', desc: 'Warm Amber' },
                        { name: 'Peaceful', color: '#0369a1', desc: 'Peaceful Blue' },
                        { name: 'Dark', color: '#1e293b', desc: 'Elegant Slate' },
                        { name: 'Gold', color: '#d97706', desc: 'Luxurious Gold' },
                        { name: 'Rose', color: '#be185d', desc: 'Sweet Rose' },
                        { name: 'Sky', color: '#0284c7', desc: 'Sky Blue' },
                        { name: 'Forest', color: '#15803d', desc: 'Forest Green' },
                        { name: 'Royal', color: '#6d28d9', desc: 'Royal Purple' },
                        { name: 'Lavender', color: '#701a75', desc: 'Lavender' },
                      ].map(t => (
                        <button
                          key={t.name}
                          type="button"
                          onClick={() => {
                            setPrimaryColor(t.color);
                            setSecondaryColor('#f59e0b');
                          }}
                          className={`w-9 h-9 rounded-full border-2 transition active:scale-90 flex items-center justify-center cursor-pointer shadow-xs ${
                            primaryColor.toLowerCase() === t.color.toLowerCase() ? 'border-stone-900 ring-4 ring-emerald-500/20 scale-105' : 'border-white hover:scale-105'
                          }`}
                          style={{ backgroundColor: t.color }}
                          title={`${t.name} (${t.desc})`}
                        >
                          {primaryColor.toLowerCase() === t.color.toLowerCase() && (
                            <span className="text-xs text-white font-bold">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">Primary Color (กำหนดสีเอง)</label>
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
                      <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">Secondary Color (กำหนดสีเอง)</label>
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
                      className="w-full px-4 py-2.5 text-sm bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-emerald-500/80 transition font-bold"
                    >
                      <option value="LINE Seed Sans TH" style={{ fontFamily: 'LINE Seed Sans TH' }}>LINE Seed Sans TH (แนะนำ)</option>
                      <option value="Inter">Inter (เรียบหรูสากล)</option>
                      <option value="Sarabun">Sarabun (ไทยทางการ)</option>
                      <option value="Niramit">Niramit (ไทยร่วมสมัย)</option>
                    </select>
                  </div>
                </div>
              )}
"""
    content = content.replace(old_theme_block, new_theme_block)
    with open(manage_file, "w", encoding="utf-8") as f:
        f.write(content)
    print("Theme presets and LINE Seed Sans TH font added successfully!")
else:
    print("Error: Theme block not found in page.tsx")
