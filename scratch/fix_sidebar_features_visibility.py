import os

manage_file = "/Users/ole/ForeverProject/app/manage/page.tsx"

with open(manage_file, "r", encoding="utf-8") as f:
    content = f.read()

# Locate the sidebar nav block
nav_target = """          <nav className="space-y-1">
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
            </button>"""

nav_repl = """          <nav className="space-y-1">
            {features.gallery && (
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
            )}
            {features.videos && (
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
            )}
            {features.family && (
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
            )}
            {features.ebooks && (
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
            )}
            {features.condolence && (
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
            )}"""

if nav_target in content:
    content = content.replace(nav_target, nav_repl)
    with open(manage_file, "w", encoding="utf-8") as f:
        f.write(content)
    print("Sidebar feature visibility fixed successfully!")
else:
    print("Error: nav_target not found in page.tsx")
