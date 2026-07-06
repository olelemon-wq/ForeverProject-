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

if old_features_init in content:
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

if old_select_features in content:
    content = content.replace(old_select_features, new_select_features)

# 3. Update handleSaveConfig state updates with activeSite cast and setActiveSite call
old_save_state = """      // Update local websites list state and selectedSite
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

new_save_state = """      // Update local websites list state and activeSite
      const updatedSite = { 
        ...activeSite, 
        name: siteName, 
        category: siteCategory,
        donationPromptPay,
        donationAccountName,
        donationActive,
        themeConfig: {
          ...((activeSite as any).themeConfig as any || {}),
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
      setActiveSite(updatedSite);
      setWebsites(websites.map(w => w.id === activeSite.id ? updatedSite : w));"""

if old_save_state in content:
    content = content.replace(old_save_state, new_save_state)

with open(manage_file, "w", encoding="utf-8") as f:
    f.write(content)

print("Features persistence fixes successfully applied!")
