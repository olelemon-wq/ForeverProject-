# งาน: ทำ User Journey แยกตาม Category ให้แพลตฟอร์มอนุสรณ์ (Next.js 16 + Prisma)

## บริบท
โปรเจกต์นี้เป็นแพลตฟอร์มสร้างเว็บอนุสรณ์แบบ multi-tenant มีระบบ feature-toggle อยู่แล้ว
(source of truth = `themeConfig.features` ใน `lib/features.ts`, helper `getEnabledFeatures()`,
component `components/FeatureToggleList.tsx`, หน้า checklist หลังจ่ายเงิน `app/manage/setup-features/page.tsx`,
API `app/api/tenant/update-features/route.ts`, และ Features section ในแท็บ settings ที่ `app/manage/page.tsx`)

Catalog ปัจจุบันมี 9 features: `announcement, gallery, videos, condolence, memory, feed, family, ebooks, donation`
โดย `biography` เป็น always-on (แสดงบนหน้าแรกเสมอ ไม่ใช่ toggle)

**อ่านก่อนเริ่ม:** `AGENTS.md` (ห้ามใช้ emoji เป็นไอคอน ใช้ lucide-react; อ่าน docs Next.js ใน node_modules ก่อนเขียน API/route)
และดูโค้ด Phase 1 ใน `lib/features.ts`, `components/FeatureToggleList.tsx`, `app/manage/setup-features/page.tsx`

## เป้าหมาย
category (Memorial / Family Legacy / Couple / Wedding / Friends / Pet Memorial) ถูกเลือกก่อนจ่ายเงิน
ใน `app/manage/create/page.tsx` อยู่แล้ว แต่ยังไม่มีผล ให้ทำให้ category เป็น "User Journey" จริง:
กำหนดฟีเจอร์บังคับ/ให้เลือก + ค่า default + ถ้อยคำ (label เมนู/checklist + หัวข้อหน้าแรก) ตามบริบท

## กติกา
- **Mandatory เหมือนกันทุก category** (ล็อกติ๊ก เอาออกไม่ได้): ประวัติโดยย่อ (always-on) + `gallery` + `videos`
- **ปรับถ้อยคำฟีเจอร์ตาม category**
- **ครอบคลุมหน้าแรกด้วย** (ไม่ใช่แค่ checklist)
- **Memorial ต้องไม่เปลี่ยนพฤติกรรมเดิม** (ค่า default = ข้อความ Memorial เดิมทั้งหมด — regression-safe)
- **ห้ามแตะ Prisma schema** — journey/label/copy เป็น config ในโค้ด, visibility ยังเก็บใน `themeConfig.features`

## เมทริกซ์ Journey (● บังคับ · ✓ default-on · ○ optional-off · — ไม่เสนอ)
| ฟีเจอร์ | Memorial | Family Legacy | Couple | Wedding | Friends | Pet |
|---|:--:|:--:|:--:|:--:|:--:|:--:|
| ประวัติ/gallery/videos | ● | ● | ● | ● | ● | ● |
| announcement | ○ | — | — | ✓ | ○ | — |
| condolence | ✓ | — | — | ○ | ○ | ✓ |
| memory | ✓ | ✓ | ✓ | ○ | ✓ | ✓ |
| feed | ○ | ○ | ✓ | ✓ | ✓ | ○ |
| family | ○ | ✓ | — | ○ | — | — |
| ebooks | ○ | ✓ | ○ | ○ | ○ | ○ |
| donation | ○ | — | — | ○ | ○ | ○ |

**Label overrides ต่อ category:**
- Family Legacy: ebooks→"หนังสือประวัติตระกูล", memory→"เรื่องเล่าของตระกูล"
- Couple: memory→"ความทรงจำร่วมกัน", feed→"ไทม์ไลน์ความรัก", ebooks→"เรื่องราวความรัก"
- Wedding: announcement→"กำหนดการงานแต่ง", condolence→"สมุดอวยพร", feed→"คำอวยพรจากแขก", donation→"มอบของขวัญ", family→"ครอบครัวบ่าวสาว"
- Friends: memory→"ความทรงจำของแก๊ง", feed→"ฟีดเพื่อนพ้อง", donation→"ร่วมสมทบทุน"
- Pet: condolence→"ข้อความถึงเจ้าตัวน้อย", memory→"ความทรงจำแสนอบอุ่น", donation→"ร่วมทำบุญมูลนิธิสัตว์"

**Home copy overrides (biographyHeading / condolenceHeading / condolenceCta):**
- Memorial (default): "อาลัยและคำรำลึก" / "ข้อความไว้อาลัยล่าสุด" / "เขียนข้อความ/ร่วมจุดเทียนออนไลน์"
- Family Legacy: "ประวัติและความเป็นมาของตระกูล" / – / –
- Couple: "เรื่องราวความรักของเรา" / – / –
- Wedding: "เรื่องราวของเรา" / "คำอวยพรล่าสุด" / "ร่วมเขียนคำอวยพร"
- Friends: "เรื่องราวของพวกเรา" / – / –
- Pet: "เรื่องราวของเจ้าตัวน้อย" / "ข้อความรำลึกล่าสุด" / –

## ไฟล์ที่ต้องทำ

1. **สร้าง `lib/categories.ts`** — config ศูนย์กลาง import จาก `lib/features.ts`
   - `export type CategoryKey` (6 ค่า ตรงกับ `tenant.category`)
   - `export const MANDATORY_FEATURES: FeatureKey[] = ['gallery','videos']`
   - `CATEGORY_JOURNEYS: Record<CategoryKey, CategoryJourney>` โดย
     `CategoryJourney = { label; tagline; optional: FeatureKey[]; defaultOn: FeatureKey[]; featureLabels?: Partial<Record<FeatureKey,{label?:string;description?:string}>>; home?: { biographyHeading?; condolenceHeading?; condolenceCta?; galleryHeading? } }`
   - helpers: `getCategoryJourney(category?)` (fallback Memorial), `getInitialFeatureMapForCategory(category)` (mandatory+defaultOn=true, ที่เหลือ false), `getFeatureLabel(category,key)` (merge FEATURE_CATALOG label กับ override), `getVisibleKeys(category)` (`[...MANDATORY_FEATURES, ...optional]`)

2. **`components/FeatureToggleList.tsx`** — เพิ่ม props: `mandatoryKeys?: FeatureKey[]` (render ล็อก: ติ๊ก+disabled+badge "จำเป็น"), `visibleKeys?: FeatureKey[]` (จำกัดรายการ, default = ทั้ง catalog), `labelFor?: (key)=>{label;description}` — render กลุ่ม mandatory ก่อนแล้ว optional; **คงสไตล์/layout เดิม (order-1/2/3) ที่มีอยู่**

3. **`app/api/tenant/create/route.ts`** — แทน `DEFAULT_FEATURES_ON_CREATE` ด้วย `getInitialFeatureMapForCategory(category)` (route รับ `category` อยู่แล้ว)

4. **`app/manage/create/page.tsx`** — redirect หลังจ่ายเงินเป็น `/manage/setup-features?site=<id>&category=<category>` (category มีใน state)

5. **`app/manage/setup-features/page.tsx`** — อ่าน `category` จาก query (fallback Memorial), ตั้ง initial state = `getInitialFeatureMapForCategory`, ส่ง `mandatoryKeys`/`visibleKeys=getVisibleKeys(category)`/`labelFor=(k)=>getFeatureLabel(category,k)` ให้ `FeatureToggleList`, แสดงบรรทัด "รวมอยู่แล้ว: ประวัติโดยย่อ"

6. **`app/api/tenant/update-features/route.ts`** — หลัง `normalizeFeatureMap` force `MANDATORY_FEATURES` = true เสมอ (กัน gallery/videos ถูกปิด)

7. **`app/(public)/[slug]/PublicLayoutClient.tsx`** — เปลี่ยน `feature.label` ในการสร้าง nav เป็น `getFeatureLabel(tenant.category, feature.key).label` (เพิ่ม `category` ใน interface `Tenant` ถ้ายังไม่มี — layout.tsx ส่ง tenant เต็มมาแล้ว)

8. **`app/(public)/[slug]/page.tsx`** — ดึง `home` copy จาก `getCategoryJourney(tenant.category)` แทนหัวข้อ hardcode: biography heading (บรรทัด ~542), condolence heading (~473) + CTA (~532), gallery heading (~375); default = ข้อความ Memorial เดิม **ห้าม relabel การ์ดพิธีศพ (รดน้ำ/อภิธรรม/ฌาปนกิจ) — คงไว้เหมือนเดิม**

9. **`app/manage/page.tsx`** — Features section ในแท็บ settings: ส่ง `mandatoryKeys`/`visibleKeys=getVisibleKeys(activeSite.category)`/`labelFor` ตาม `activeSite.category` เข้า `FeatureToggleList`

## Verification (ต้องผ่านทุกข้อ)
1. `npx tsc --noEmit` และ `npm run build` ผ่าน ไม่มี error
2. สร้างเว็บแต่ละ category → checklist แสดง mandatory (ภาพ/วิดีโอ) ล็อก + optional เฉพาะ journey นั้น + default ถูก + label ตรงบริบท (Wedding เห็น "สมุดอวยพร", "กำหนดการงานแต่ง")
3. เปิด public: เมนู + หัวข้อหน้าแรกใช้ถ้อยคำตาม category; **Memorial เหมือนเดิมทุกอย่าง**
4. ยิง API `update-features` ปิด gallery/videos ตรง ๆ → ต้องถูก force กลับเป็นเปิด
5. `/manage` settings แต่ละ category → Features section แสดง mandatory ล็อก + optional/label ตรง journey
6. tenant เก่า (category ไม่รู้จัก / ไม่มี features map) → fallback Memorial เมนูครบเหมือนเดิม
