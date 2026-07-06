import os

manage_file = "/Users/ole/ForeverProject/app/manage/page.tsx"

with open(manage_file, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Replace state initialization
old_init = """  const [features, setFeatures] = useState<any>({
    familyTree: true,
    gallery: true,
    announcement: true,
    ebook: true,
    condolence: true,
    donations: true,
  });"""

new_init = """  const [features, setFeatures] = useState<any>({
    family: true,
    gallery: true,
    videos: true,
    announcement: true,
    ebooks: true,
    condolence: true,
    donation: true,
  });"""

content = content.replace(old_init, new_init)

# 2. Replace feature loader inside selectWebsite
old_loader = """      if (config.features) {
        setFeatures(config.features);
      }"""

new_loader = """      if (config.features) {
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

content = content.replace(old_loader, new_loader)

# 3. Replace the checklist checkboxes mapping
old_checklist = """                    {[
                      { key: 'familyTree', label: '🌳 ผังครอบครัว' },
                      { key: 'gallery', label: '📸 คลังภาพและสื่อความรัก' },
                      { key: 'announcement', label: '🕯️ การ์ดแจ้งข่าวและกำหนดการ' },
                      { key: 'ebook', label: '📖 สมุดธรรมทานของชำร่วย' },
                      { key: 'condolence', label: '✍️ สมุดลงนามและคำไว้อาลัย' },
                      { key: 'donations', label: '💝 ร่วมทำบุญเพื่อสาธารณกุศล' },
                    ].map(feat => (
                      <label key={feat.key} className="flex items-center gap-3 p-4 rounded-2xl border border-stone-200 bg-stone-50/30 hover:bg-stone-50 transition cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={features[feat.key]}
                          onChange={(e) => setFeatures({ ...features, [feat.key]: e.target.checked })}
                          className="accent-emerald-600 w-4 h-4 rounded-md cursor-pointer"
                        />
                        <span className="text-xs font-bold text-stone-855">{feat.label}</span>
                      </label>
                    ))}"""

# Note: Check if key matches precisely (some might have text-stone-850 or text-stone-855)
# Let's search if text-stone-850 or text-stone-855 is used
if "text-stone-850" in content:
    old_checklist = old_checklist.replace("text-stone-855", "text-stone-850")

new_checklist = """                    {[
                      { key: 'family', label: '🌳 ผังครอบครัว' },
                      { key: 'gallery', label: '📸 คลังภาพและสื่อความรัก' },
                      { key: 'announcement', label: '🕯️ การ์ดแจ้งข่าวและกำหนดการ' },
                      { key: 'ebooks', label: '📖 สมุดธรรมทานของชำร่วย' },
                      { key: 'condolence', label: '✍️ สมุดลงนามและคำไว้อาลัย' },
                      { key: 'donation', label: '💝 ร่วมทำบุญเพื่อสาธารณกุศล' },
                    ].map(feat => (
                      <label key={feat.key} className="flex items-center gap-3 p-4 rounded-2xl border border-stone-200 bg-stone-50/30 hover:bg-stone-50 transition cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={features[feat.key]}
                          onChange={(e) => {
                            const val = e.target.checked;
                            if (feat.key === 'gallery') {
                              setFeatures({ ...features, gallery: val, videos: val });
                            } else {
                              setFeatures({ ...features, [feat.key]: val });
                            }
                          }}
                          className="accent-emerald-600 w-4 h-4 rounded-md cursor-pointer"
                        />
                        <span className="text-xs font-bold text-stone-850">{feat.label}</span>
                      </label>
                    ))}"""

content = content.replace(old_checklist, new_checklist)

with open(manage_file, "w", encoding="utf-8") as f:
    f.write(content)

print("Feature keys successfully updated in manage/page.tsx!")
