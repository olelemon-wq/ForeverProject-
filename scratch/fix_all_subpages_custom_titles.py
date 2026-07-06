import os

# 1. Gallery page
gallery_file = "/Users/ole/ForeverProject/app/(public)/[slug]/gallery/page.tsx"
if os.path.exists(gallery_file):
    with open(gallery_file, "r", encoding="utf-8") as f:
        c = f.read()
    c = c.replace(
        "import GalleryClient from './GalleryClient';",
        "import GalleryClient from './GalleryClient';\nimport { getFeatureLabel } from '@/lib/categories';"
    )
    old_card = """      <div className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2"
            style={{ color: 'var(--theme-primary, #0d9488)' }}>
          <Camera className="w-5 h-5 text-emerald-700" style={{ color: 'var(--theme-primary)' }} /> คลังภาพรำลึกแด่ผู้ล่วงลับ
        </h2>
        <p className="text-stone-500 text-xs leading-normal">
          คลังรูปภาพถ่ายเหตุการณ์สำคัญทางประวัติศาสตร์ของครอบครัว เพื่อระลึกถึงรอยยิ้ม ความอบอุ่น และช่วงเวลาที่มีคุณค่าร่วมกัน
        </p>
      </div>"""
    new_card = """      {(() => {
        const { label: fLabel, description: fDesc } = getFeatureLabel(tenant.category, 'gallery');
        return (
          <div className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2"
                style={{ color: 'var(--theme-primary, #0d9488)' }}>
              <Camera className="w-5 h-5 text-emerald-700" style={{ color: 'var(--theme-primary)' }} /> {fLabel}
            </h2>
            <p className="text-stone-500 text-xs leading-normal">
              {fDesc}
            </p>
          </div>
        );
      })()}"""
    c = c.replace(old_card, new_card)
    with open(gallery_file, "w", encoding="utf-8") as f:
        f.write(c)
    print("Gallery custom labels applied!")

# 2. Condolence page
condo_file = "/Users/ole/ForeverProject/app/(public)/[slug]/condolence/page.tsx"
if os.path.exists(condo_file):
    with open(condo_file, "r", encoding="utf-8") as f:
        c = f.read()
    c = c.replace(
        "import CondolenceForm from '../CondolenceForm';",
        "import CondolenceForm from '../CondolenceForm';\nimport { getFeatureLabel } from '@/lib/categories';"
    )
    old_card = """      <div className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2"
            style={{ color: 'var(--theme-primary, #0d9488)' }}>
          <Flame className="w-5 h-5 animate-pulse" /> สมุดลงนามแสดงความไว้อาลัย
        </h2>
        <p className="text-stone-500 text-xs leading-normal">
          ร่วมลงนาม เขียนคำไว้อาลัย และแสดงความระลึกถึงผู้ล่วงลับ เพื่อเกียรติประวัติและความรักความผูกพันที่จะคงอยู่ตลอดไป
        </p>
      </div>"""
    new_card = """      {(() => {
        const { label: fLabel, description: fDesc } = getFeatureLabel(tenant.category, 'condolence');
        return (
          <div className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2"
                style={{ color: 'var(--theme-primary, #0d9488)' }}>
              <Flame className="w-5 h-5 animate-pulse" /> {fLabel}
            </h2>
            <p className="text-stone-500 text-xs leading-normal">
              {fDesc}
            </p>
          </div>
        );
      })()}"""
    c = c.replace(old_card, new_card)
    with open(condo_file, "w", encoding="utf-8") as f:
        f.write(c)
    print("Condolence custom labels applied!")

# 3. Videos page
videos_file = "/Users/ole/ForeverProject/app/(public)/[slug]/videos/page.tsx"
if os.path.exists(videos_file):
    with open(videos_file, "r", encoding="utf-8") as f:
        c = f.read()
    c = c.replace(
        "import VideosClient from './VideosClient';",
        "import VideosClient from './VideosClient';\nimport { getFeatureLabel } from '@/lib/categories';"
    )
    old_card = """      <div className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2"
            style={{ color: 'var(--theme-primary, #0d9488)' }}>
          <Video className="w-5 h-5 text-emerald-700" style={{ color: 'var(--theme-primary)' }} /> คลังวิดีโอรำลึกแด่ผู้ล่วงลับ
        </h2>
        <p className="text-stone-500 text-xs leading-normal">
          วิดีโอบันทึกความทรงจำ ภาพยนตร์สั้น หรือกำหนดการชีวประวัติเพื่อระลึกถึงรอยยิ้ม ความอบอุ่น และช่วงเวลาที่มีคุณค่าร่วมกัน
        </p>
      </div>"""
    new_card = """      {(() => {
        const { label: fLabel, description: fDesc } = getFeatureLabel(tenant.category, 'videos');
        return (
          <div className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2"
                style={{ color: 'var(--theme-primary, #0d9488)' }}>
              <Video className="w-5 h-5 text-emerald-700" style={{ color: 'var(--theme-primary)' }} /> {fLabel}
            </h2>
            <p className="text-stone-500 text-xs leading-normal">
              {fDesc}
            </p>
          </div>
        );
      })()}"""
    c = c.replace(old_card, new_card)
    with open(videos_file, "w", encoding="utf-8") as f:
        f.write(c)
    print("Videos custom labels applied!")

# 4. Memory page
memory_file = "/Users/ole/ForeverProject/app/(public)/[slug]/memory/page.tsx"
if os.path.exists(memory_file):
    with open(memory_file, "r", encoding="utf-8") as f:
        c = f.read()
    c = c.replace(
        "import MemoryWallClient from './MemoryWallClient';",
        "import MemoryWallClient from './MemoryWallClient';\nimport { getFeatureLabel } from '@/lib/categories';"
    )
    old_card = """      <div className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.015)] text-left">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2"
            style={{ color: 'var(--theme-primary, #0d9488)' }}>
          <Camera className="w-5 h-5 text-emerald-700" style={{ color: 'var(--theme-primary)' }} /> กระดานแชร์ความทรงจำร่วม
        </h2>
        <p className="text-stone-500 text-xs leading-normal">
          ร่วมลงบันทึกภาพถ่ายโบราณ เรื่องเล่าประทับใจ หรือความทรงจำอันทรงคุณค่าที่ได้สัมผัสร่วมกัน แผงความทรงจำนี้รวบรวมเรื่องราวดีๆ ให้อยู่คู่ตรานานเท่านาน
        </p>
      </div>"""
    if old_card not in c:
        # Check subtle differences in typo (ตรานานเท่านาน / ตราบนานเท่านาน)
        old_card = """      <div className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.015)] text-left">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2"
            style={{ color: 'var(--theme-primary, #0d9488)' }}>
          <Camera className="w-5 h-5 text-emerald-700" style={{ color: 'var(--theme-primary)' }} /> กระดานแชร์ความทรงจำร่วม
        </h2>
        <p className="text-stone-500 text-xs leading-normal">
          ร่วมลงบันทึกภาพถ่ายโบราณ เรื่องเล่าประทับใจ หรือความทรงจำอันทรงคุณค่าที่ได้สัมผัสร่วมกัน แผงความทรงจำนี้รวบรวมเรื่องราวดีๆ ให้อยู่คู่ตราบนานเท่านาน
        </p>
      </div>"""
    new_card = """      {(() => {
        const { label: fLabel, description: fDesc } = getFeatureLabel(tenant.category, 'memory');
        return (
          <div className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.015)] text-left">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2"
                style={{ color: 'var(--theme-primary, #0d9488)' }}>
              <Camera className="w-5 h-5 text-emerald-700" style={{ color: 'var(--theme-primary)' }} /> {fLabel}
            </h2>
            <p className="text-stone-500 text-xs leading-normal">
              {fDesc}
            </p>
          </div>
        );
      })()}"""
    c = c.replace(old_card, new_card)
    with open(memory_file, "w", encoding="utf-8") as f:
        f.write(c)
    print("Memory custom labels applied!")

# 5. Ebooks page
ebooks_file = "/Users/ole/ForeverProject/app/(public)/[slug]/ebooks/page.tsx"
if os.path.exists(ebooks_file):
    with open(ebooks_file, "r", encoding="utf-8") as f:
        c = f.read()
    c = c.replace(
        "import EbookReaderClient from './EbookReaderClient';",
        "import EbookReaderClient from './EbookReaderClient';\nimport { getFeatureLabel } from '@/lib/categories';"
    )
    old_card = """      <div className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
        <h2 className="text-xl font-bold mb-2 flex items-center justify-center gap-2"
            style={{ color: 'var(--theme-primary, #0d9488)' }}>
          <BookOpen className="w-5 h-5 text-emerald-700" style={{ color: 'var(--theme-primary)' }} /> หนังสือของชำร่วยและธรรมทานรำลึก
        </h2>
        <p className="text-stone-500 text-xs leading-normal max-w-md mx-auto">
          อ่านหนังสืองานศพ ของชำร่วย หรือหนังสือบทสวดมนต์แผ่เมตตาอุทิศส่วนกุศลออนไลน์ได้ทันทีผ่าน Web Reader
        </p>
      </div>"""
    new_card = """      {(() => {
        const { label: fLabel, description: fDesc } = getFeatureLabel(tenant.category, 'ebooks');
        return (
          <div className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
            <h2 className="text-xl font-bold mb-2 flex items-center justify-center gap-2"
                style={{ color: 'var(--theme-primary, #0d9488)' }}>
              <BookOpen className="w-5 h-5 text-emerald-700" style={{ color: 'var(--theme-primary)' }} /> {fLabel}
            </h2>
            <p className="text-stone-500 text-xs leading-normal max-w-md mx-auto">
              {fDesc}
            </p>
          </div>
        );
      })()}"""
    c = c.replace(old_card, new_card)
    with open(ebooks_file, "w", encoding="utf-8") as f:
        f.write(c)
    print("Ebooks custom labels applied!")

# 6. Family client component
family_client_file = "/Users/ole/ForeverProject/app/(public)/[slug]/family/FamilyTreeClient.tsx"
if os.path.exists(family_client_file):
    with open(family_client_file, "r", encoding="utf-8") as f:
        c = f.read()
    c = c.replace(
        "import Link from 'next/link';",
        "import Link from 'next/link';\nimport { getFeatureLabel } from '@/lib/categories';"
    )
    c = c.replace(
        "themeConfig?: any;",
        "themeConfig?: any;\n  category?: string;"
    )
    old_card = """      {/* Title block - Hidden in fullscreen mode */}
      {!isFullscreen && (
        <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.012)]">
          <h2 className="text-xl font-bold mb-2 flex items-center justify-center gap-2"
              style={{ color: 'var(--theme-primary, #0d9488)' }}>
            <GitBranch className="w-5 h-5" />
            <span>แผนผังครอบครัวและเครือญาติ (Family Tree)</span>
          </h2>
          <p className="text-stone-400 text-xs leading-normal max-w-md mx-auto font-medium">
            ผังลำดับเครือญาติ 4 รุ่นแบบอินเตอร์แอคทีฟ ย่อ-ขยาย ลากเลื่อน และขยายเต็มจอได้อย่างอิสระผ่าน Canvas
          </p>
        </div>
      )}"""
    new_card = """      {/* Title block - Hidden in fullscreen mode */}
      {!isFullscreen && (() => {
        const { label: fLabel, description: fDesc } = getFeatureLabel(tenant.category, 'family');
        return (
          <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.012)]">
            <h2 className="text-xl font-bold mb-2 flex items-center justify-center gap-2"
                style={{ color: 'var(--theme-primary, #0d9488)' }}>
              <GitBranch className="w-5 h-5" />
              <span>{fLabel}</span>
            </h2>
            <p className="text-stone-400 text-xs leading-normal max-w-md mx-auto font-medium">
              {fDesc}
            </p>
          </div>
        );
      })()}"""
    c = c.replace(old_card, new_card)
    
    # Also pass category in family/page.tsx
    family_page = "/Users/ole/ForeverProject/app/(public)/[slug]/family/page.tsx"
    with open(family_page, "r", encoding="utf-8") as f_p:
        c_p = f_p.read()
    c_p = c_p.replace(
        "return <FamilyTreeClient tenant={tenant} members={members} />;",
        "return <FamilyTreeClient tenant={{ ...tenant, category: tenant.category }} members={members} />;"
    )
    with open(family_page, "w", encoding="utf-8") as f_p:
        f_p.write(c_p)

    with open(family_client_file, "w", encoding="utf-8") as f:
        f.write(c)
    print("Family custom labels applied!")

# 7. Donation page and form
donation_page = "/Users/ole/ForeverProject/app/(public)/[slug]/donation/page.tsx"
if os.path.exists(donation_page):
    with open(donation_page, "r", encoding="utf-8") as f:
        c = f.read()
    c = c.replace(
        "donationAccountName={tenant.donationAccountName || 'ครอบครัวผู้ล่วงลับ'}",
        "donationAccountName={tenant.donationAccountName || 'ครอบครัวผู้ล่วงลับ'}\n        category={tenant.category}"
    )
    with open(donation_page, "w", encoding="utf-8") as f:
        f.write(c)

donation_form = "/Users/ole/ForeverProject/app/(public)/[slug]/donation/DonationClientForm.tsx"
if os.path.exists(donation_form):
    with open(donation_form, "r", encoding="utf-8") as f:
        c = f.read()
    c = c.replace(
        "import React, { useState, useEffect } from 'react';",
        "import React, { useState, useEffect } from 'react';\nimport { getFeatureLabel } from '@/lib/categories';"
    )
    c = c.replace(
        "  donationPromptPay,\n  donationAccountName\n}: {\n  websiteId: string;\n  donationPromptPay: string;\n  donationAccountName: string;\n}) {",
        "  donationPromptPay,\n  donationAccountName,\n  category\n}: {\n  websiteId: string;\n  donationPromptPay: string;\n  donationAccountName: string;\n  category?: string;\n}) {"
    )
    old_card = """          <h2 className="text-xl font-bold text-stone-900">ร่วมทำบุญอุทิศส่วนกุศล</h2>
          <p className="text-xs text-stone-500 mt-2 leading-relaxed">
            เงินร่วมทำบุญจะโอนเข้าสู่บัญชีพร้อมเพย์หลักของครอบครัวผู้ล่วงลับโดยตรง 100% ปราศจากค่าบริการแพลตฟอร์ม
          </p>"""
    new_card = """          {(() => {
            const { label: fLabel, description: fDesc } = getFeatureLabel(category, 'donation');
            return (
              <>
                <h2 className="text-xl font-bold text-stone-900">{fLabel}</h2>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  {fDesc}
                </p>
              </>
            );
          })()}"""
    c = c.replace(old_card, new_card)
    with open(donation_form, "w", encoding="utf-8") as f:
        f.write(c)
    print("Donation custom labels applied!")
