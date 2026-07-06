import os

manage_file = "/Users/ole/ForeverProject/app/manage/page.tsx"

with open(manage_file, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update the header block in page.tsx (it uses selectedSite on HEAD)
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

# 2. Add adjust crop buttons under the preview card in the "รูปโปรไฟล์ & หน้าปก" tab
preview_card_end = """                    </div>
                  </div>
                </div>"""

preview_card_end_repl = """                    </div>
                  </div>

                  {/* Adjust buttons */}
                  <div className="flex justify-center mt-3 gap-3">
                    {deceasedAvatarUrl && (
                      <button
                        type="button"
                        onClick={() => setIsCropModalOpen(true)}
                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-250 text-stone-700 font-bold text-xs rounded-xl transition shadow-xs active:scale-95 flex items-center gap-1.5 justify-center w-full max-w-[200px] cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>ปรับรูปโปรไฟล์</span>
                      </button>
                    )}
                    {deceasedCoverUrl && (
                      <button
                        type="button"
                        onClick={() => setIsCoverCropModalOpen(true)}
                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-250 text-stone-700 font-bold text-xs rounded-xl transition shadow-xs active:scale-95 flex items-center gap-1.5 justify-center w-full max-w-[200px] cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>ปรับรูปหน้าปก</span>
                      </button>
                    )}
                  </div>
                </div>"""

content = content.replace(preview_card_end, preview_card_end_repl)

with open(manage_file, "w", encoding="utf-8") as f:
    f.write(content)

print("Header controls and adjust buttons successfully restored!")
