import os

manage_file = "/Users/ole/ForeverProject/app/manage/page.tsx"

with open(manage_file, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add imports for FeatureToggleList and categories helper functions
import_target = "import React, { useState, useEffect } from 'react';"
import_replacement = """import React, { useState, useEffect } from 'react';
import FeatureToggleList from '@/components/FeatureToggleList';
import { getVisibleKeys, getFeatureLabel, MANDATORY_FEATURES } from '@/lib/categories';"""

content = content.replace(import_target, import_replacement)

# 2. Locate the hardcoded checkboxes list and replace it with the dynamic FeatureToggleList component
old_checklist_block = """              {/* 4. ฟีเจอร์ที่เปิดใช้งาน Tab */}
              {activeSubTab === 'features' && (
                <div className="pt-2 space-y-4 text-left animate-fade-in">
                  <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>ฟีเจอร์ที่เปิดใช้งาน (Features checklist)</span>
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    เลือกส่วนที่คุณต้องการแสดงบนหน้าเว็บไซต์อนุสรณ์ (สามารถเปิด-ปิดได้ทุกเมื่อ)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
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
                    ))}
                  </div>
                </div>
              )}"""

new_checklist_block = """              {/* 4. ฟีเจอร์ที่เปิดใช้งาน Tab */}
              {activeSubTab === 'features' && (
                <div className="pt-2 space-y-4 text-left animate-fade-in">
                  <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>ฟีเจอร์ที่เปิดใช้งาน (Features checklist)</span>
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    เลือกส่วนที่คุณต้องการแสดงบนหน้าเว็บไซต์อนุสรณ์ (สามารถเปิด-ปิดได้ทุกเมื่อ)
                  </p>
                  <FeatureToggleList 
                    value={features}
                    onChange={setFeatures}
                    mandatoryKeys={MANDATORY_FEATURES}
                    visibleKeys={getVisibleKeys(selectedSite.category)}
                    labelFor={(k) => getFeatureLabel(selectedSite.category, k)}
                  />
                </div>
              )}"""

content = content.replace(old_checklist_block, new_checklist_block)

with open(manage_file, "w", encoding="utf-8") as f:
    f.write(content)

print("FeatureToggleList restored successfully!")
