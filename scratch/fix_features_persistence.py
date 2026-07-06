import os

manage_file = "/Users/ole/ForeverProject/app/manage/page.tsx"

with open(manage_file, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update features state initialization
old_features_init = """  const [features, setFeatures] = useState<any>({
    family: true,
    gallery: true,
    videos: true,
    announcement: true,
    ebooks: true,
    condolence: true,
    donation: true,
  });"""

new_features_init = """  const [features, setFeatures] = useState<any>({
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

content = content.replace(old_features_init, new_features_init)

# 2. Update selectWebsite setFeatures config loader
old_select_features = """      if (config.features) {
        setFeatures({
          family: config.features.family !== false,
          gallery: config.features.gallery !== false,
          videos: config.features.videos !== false,
          announcement: config.features.announcement !== false,
          ebooks: config.features.ebooks !== false,
          condolence: config.features.condolence !== false,
          donation: config.features.donation !== false,
        });
      }"""

new_select_features = """      if (config.features) {
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
      }"""

content = content.replace(old_select_features, new_select_features)

# 3. Update handleSaveConfig state updates
old_save_state = """      // Update local websites list state
      setWebsites(websites.map(w => w.id === activeSite.id ? { 
        ...w, 
        name: siteName, 
        category: siteCategory,
        donationPromptPay,
        donationAccountName,
        donationActive
      } : w));"""

new_save_state = """      // Update local websites list state and selectedSite
      const updatedSite = { 
        ...activeSite, 
        name: siteName, 
        category: siteCategory,
        donationPromptPay,
        donationAccountName,
        donationActive,
        themeConfig: {
          ...(activeSite.themeConfig as any || {}),
          primaryColor,
          secondaryColor,
          fontFamily,
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
        }
      };
      setSelectedSite(updatedSite);
      setWebsites(websites.map(w => w.id === activeSite.id ? updatedSite : w));"""

content = content.replace(old_save_state, new_save_state)

# 4. Update sidebar "กลั่นกรองเนื้อหา" to check condolence OR memory
old_condo_nav = """            {features.condolence && (
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

new_condo_nav = """            {(features.condolence || features.memory) && (
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

content = content.replace(old_condo_nav, new_condo_nav)

with open(manage_file, "w", encoding="utf-8") as f:
    f.write(content)

print("Features persistence fixes successfully applied!")
