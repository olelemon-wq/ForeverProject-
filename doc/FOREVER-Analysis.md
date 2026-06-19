# FOREVER Platform — เอกสารสรุปวิเคราะห์โปรเจกต์

> เอกสารนี้สรุปวิเคราะห์จาก spec ทั้ง 8 ไฟล์ (Context, Requirements, Features, Sitemap, Screens, Business Rules, User Flow, MVP-Scope)
> วัตถุประสงค์: ใช้เป็น context/knowledge สำหรับการพัฒนาใน Antigravity และเป็นจุดอ้างอิงร่วมของทีม
> Version: 1.0

---

## 1. ภาพรวมโปรเจกต์

**FOREVER** คือ SaaS Platform แบบ Multi-Tenant สำหรับสร้างเว็บไซต์ความทรงจำ (Digital Memorial & Legacy Website)

หลักการสำคัญที่สุดของระบบ คือ **Self-Service 100%** — ลูกค้าทำได้เองทั้งหมดโดยไม่ต้องติดต่อเจ้าหน้าที่:
สมัคร → จ่ายเงิน → สร้างเว็บ → แก้ไข → ต่ออายุ → ซื้อพื้นที่เพิ่ม → เพิ่มผู้ดูแลร่วม

- **กลุ่มเป้าหมายหลัก**: ครอบครัวที่มีผู้เสียชีวิต อายุผู้ซื้อ 40-70 ปี → ดังนั้น UX ต้องง่ายมาก, Mobile First
- **เป้าหมายธุรกิจ**: ปี 1 = 100 เว็บ, ปี 2 = 500 เว็บ, ปี 3 = 1,000 เว็บ
- **โมเดลรายได้**: สร้างใหม่ 2,000 บาท/ปีแรก, ต่ออายุ 1,500 บาท/ปี, Storage upgrade 500–1,500 บาท/ปี

### แกนกลางของระบบ (Critical Cores)
ทั้งระบบหมุนรอบ 3 สิ่งนี้ ถ้าออกแบบผิดตั้งแต่แรกจะแก้ยาก:

1. **Multi-Tenant ผ่าน URL Path** — `forever.co.th/{slug}` เป็นหลัก, subdomain `{slug}.forever.co.th` เป็น optional ชี้มาที่เว็บเดียวกัน
2. **Auth ด้วย OTP มือถืออย่างเดียว** — ไม่มี email/password เลยใน V1 (เหมาะกับกลุ่มผู้สูงอายุ)
3. **Payment ผ่าน PromptPay QR + Callback** — ระบบเปิดบริการอัตโนมัติหลังได้ bank callback เท่านั้น (BR018)

---

## Tech Stack Decision (Frontend)

> หมายเหตุ: เอกสาร spec ต้นฉบับทั้ง 8 ไฟล์ **ไม่ได้ระบุ tech stack** — ส่วนนี้คือการตัดสินใจของทีม ไม่ขัดกับ spec

### ที่ตัดสินใจแล้ว
- **Framework**: Next.js (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS

### เหตุผลที่เข้ากับโปรเจกต์
- **Mobile First + กลุ่มผู้สูงอายุ (40-70 ปี)** — Tailwind คุม responsive / touch target / ขนาด font ได้ดี; shadcn ใช้ Radix เป็นฐานจึงมี accessibility ติดมาให้
- **79 screens + 4 surfaces** — shadcn ช่วยให้ component ทั่วทั้งระบบ consistent โดยไม่ต้องสร้างเองทุกตัว
- **Next.js** เหมาะกับ SEO ของ public memorial website (BR034: auto title/description/OG) และ multi-tenant routing `forever.co.th/{slug}` ทำผ่าน dynamic route ได้ตรง ๆ

### ⚠️ จุดที่ต้องแยกให้ชัด: UI System ≠ Customer Theme Engine
นี่คือจุดที่ผิดบ่อยที่สุด ต้องแยก 2 ระบบนี้ออกจากกัน:

| | UI System ของทีม | Theme Engine ของลูกค้า (F006) |
|---|---|---|
| ใช้กับ | Backoffice / Admin / Marketing | Public memorial website |
| ใครคุม | ทีมพัฒนา | ลูกค้าเลือก/ปรับเอง (no-code) |
| เทคนิค | shadcn + Tailwind ปกติ | runtime theming — เปลี่ยนสี/font แล้ว render ทันที **ไม่ rebuild** |

- Theme Engine ลูกค้าปรับได้: Primary/Secondary color, Font, Layout style, Cover style (10 themes) — แต่ Custom CSS/HTML ถูก exclude ออกจาก V1
- **แนวทางแนะนำ**: เก็บค่า theme ของลูกค้าใน DB → inject เป็น **CSS variables** ตอน render หน้า public → ซึ่งเข้ากับ Tailwind v4 (CSS-first config) ได้พอดี
- Rule สำคัญ (Sitemap): Theme มีผลเฉพาะ Layout/Color/Font/Spacing/Animation เท่านั้น — **ไม่กระทบ** URL / SEO / Content / Media / Analytics

### หมายเหตุการใช้งาน
- shadcn เป็น component ที่ **copy เข้า repo** (ไม่ใช่ dependency) → ปรับแต่งได้อิสระ แต่ต้องวาง structure ให้ชัดว่า component ใช้ร่วมกันยังไงข้าม 4 surface (แนะนำ shared UI package / โฟลเดอร์กลาง)
- ยืนยัน Tailwind version ที่จะใช้ (v3 vs v4) ตั้งแต่ต้น เพราะ config ต่างกันและกระทบ theming approach ข้างบน

---

## 2. สถาปัตยกรรม 4 ส่วน (Application Surfaces)

ระบบประกอบด้วย 4 surface ที่แชร์ backend + database เดียวกัน:

| ส่วน | URL | ผู้ใช้ | บทบาท |
|------|-----|--------|-------|
| Marketing Website | `www.forever.co.th` | Visitor ทั่วไป | หน้าขาย, pricing, สมัครสร้างเว็บ |
| Public Memorial Website | `forever.co.th/{slug}` | Visitor | หน้าเว็บความทรงจำที่เผยแพร่จริง |
| Webmaster Backoffice | `forever.co.th/manage` | Main/Co Webmaster | จัดการเนื้อหา เว็บ subscription |
| Forever Admin | `forever.co.th/admin` | Forever Admin | จัดการทั้งระบบ, รายได้, ข้อพิพาท |

---

## 3. User Roles & Permissions

| Role | จำนวน | สิทธิ์ |
|------|--------|--------|
| **Forever Admin** | — | สิทธิ์สูงสุดของระบบ, ตัดสินข้อพิพาท, override payment |
| **Main Webmaster** | 1 คน/เว็บ | เจ้าของเว็บ — แก้ไข, จ่ายเงิน, ต่ออายุ, เพิ่ม/ลบ webmaster |
| **Co Webmaster** | สูงสุด 10 คน | **สิทธิ์เทียบเท่า Main 100%** (BR003, BR004) ไม่มีลำดับชั้น ไม่มี Read-Only ใน V1 |
| **Visitor** | — | เข้าชม + ส่งคำไว้อาลัย |

**เหตุผลของ Webmaster Equality (BR004)**: ลดปัญหาเรื่องการเสียชีวิต/เปลี่ยนผู้ดูแล/เปลี่ยนเบอร์ — 1 เบอร์ดูแลได้หลายเว็บ (BR005)

> ⚠️ **ต้องนิยามให้ชัดก่อน build**: เพราะ Co มีสิทธิ์เท่า Main 100% — Co สามารถลบ Main ออกได้หรือไม่? ต้องมี rule ป้องกันเว็บไม่มีเจ้าของ (BR001 ระบุว่าทุกเว็บต้องมีเจ้าของเสมอ)

---

## Project Structure (Next.js + shadcn — 4 Surfaces)

> Decision: **Single Next.js app (App Router) + route groups** สำหรับ MVP — ตั้งง่าย แชร์ component ง่าย
> Styling: **Tailwind v4** (CSS-first, เข้ากับ Theme Engine แบบ CSS variables)
> หากต้องการ scale แยกทีมในอนาคต ค่อย migrate เป็น monorepo (Turborepo) ได้

### Surface → Routing
| Surface | URL | Route |
|---|---|---|
| Marketing | `www.forever.co.th` | `(marketing)` |
| Public Memorial | `forever.co.th/{slug}` | `(public)/[slug]` |
| Webmaster Backoffice | `forever.co.th/manage` | `manage/` |
| Forever Admin | `forever.co.th/admin` | `admin/` |

- subdomain alias `{slug}.forever.co.th` → **middleware rewrite** ไปที่ `(public)/[slug]` (ไม่ทำหน้าซ้ำ)
- middleware ตัวเดียวกัน = จุด **resolve tenant + บังคับ isolation** (กันข้อมูลข้ามเว็บ)

### Directory Tree
```
forever/
├── AGENTS.md                  # rules/guardrails สำหรับ Antigravity
├── middleware.ts              # subdomain rewrite + tenant resolution
├── app/
│   ├── (marketing)/           # Surface 1 — www
│   │   ├── page.tsx           # /
│   │   ├── pricing/ features/ examples/ faq/ contact/
│   ├── (public)/[slug]/       # Surface 2 — memorial site
│   │   ├── page.tsx           # home
│   │   ├── biography/ timeline/ gallery/ videos/
│   │   ├── condolence/ activities/ ebooks/ downloads/ donation/
│   ├── manage/                # Surface 3 — backoffice
│   │   ├── dashboard/ website/ pages/ gallery/ videos/
│   │   ├── condolence/ qr/ theme/ menu/ webmasters/
│   │   ├── storage/ subscription/ analytics/ export/ settings/
│   ├── admin/                 # Surface 4 — Forever Admin
│   │   ├── dashboard/ revenue/ websites/ customers/ payments/
│   │   ├── subscriptions/ storage/ categories/ themes/
│   │   ├── urls/ support/ reports/ logs/ system/ settings/
│   ├── (auth)/                # SYS — OTP login/verify
│   ├── api/                   # route handlers
│   │   ├── payment/callback/  # ⚠️ verify signature + idempotency
│   │   ├── otp/ webhooks/
│   └── layout.tsx
├── components/
│   ├── ui/                    # shadcn primitives (copy-in, ใช้ร่วมทุก surface)
│   ├── marketing/ public/ manage/ admin/   # component เฉพาะ surface
│   └── shared/                # component ที่ใช้ข้าม surface
├── lib/
│   ├── tenant/                # tenant resolve + isolation guard
│   ├── theme/                 # Customer Theme Engine: DB → CSS variables
│   ├── auth/  payment/  storage/  db/
│   └── validation/            # slug, reserved words, media type/size
└── styles/
    └── globals.css            # Tailwind v4 + base design tokens (CSS vars)
```

### กฎสำคัญของโครงสร้างนี้
- `components/ui/` = shadcn สำหรับ **UI ทีม** (manage/admin/marketing) — **อย่าใช้คุม theme ของ public memorial site**
- `lib/theme/` = **Customer Theme Engine** แยกต่างหาก: อ่านค่าจาก DB → inject เป็น CSS variables ตอน render หน้า `(public)` → ลูกค้าเปลี่ยนสี/font แล้วเห็นผลทันทีโดยไม่ rebuild
- ทุก query ในฝั่ง `manage` / `(public)` / `admin` ต้องผ่าน tenant guard ใน `lib/tenant/` — ห้าม query ตรงโดยไม่มี tenant scope

---

## 4. ลำดับความสำคัญในการ Build (MVP — Phase 1)

เรียงตาม dependency จริง ไม่ใช่แค่ตามเลข Feature ID:

```
1. Auth (F001)                  ← รากของทุกอย่าง
   └─ OTP login, SMS, remember device, trusted devices

2. Website Creation Wizard (F002)
   └─ URL validation, duplicate check, reserved words, category, theme

3. Payment System (F004)        ← ต้องเสร็จก่อนเปิดขาย
   └─ Dynamic QR, callback, verify, receipt, tax invoice

4. Subscription (F003)
   └─ สร้างหลัง payment success (BR010), lifecycle, renewal, grace, suspend, archive

5. Website Builder + Theme + Menu (F005, F006, F007)
   └─ No-code editor, 10 themes, drag & drop menu, auto-hide empty menu

6. Content Modules (F008, F011-F015)
   └─ Homepage, Gallery, Video, Music, Slideshow

7. Condolence System (F016)
   └─ General + Family + Approval workflow

8. Dashboards + Admin + Reporting (F025, F026, F027)
   └─ Customer dashboard, Admin dashboard, Excel/CSV/PDF export
```

### Scope ที่ "ไม่ทำ" ใน V1 (จาก MVP-Scope)
- Login ด้วย Email / Google / Facebook
- Credit Card / Bank Transfer / Installment
- AI Website Builder, Face Recognition
- Custom CSS / HTML, Custom Domain
- Category: Museum, Foundation, Public Figure (advanced)
- Family Tree, Memory Wall, Donation (→ Phase 2)
- Social Network, Chat, Marketplace, Live Streaming, **Mobile App** (ใช้ Responsive web ก่อน)

---

## 5. Data Model หลัก (ที่ต้องออกแบบก่อน)

Multi-tenant — ต้องตัดสินใจ tenancy strategy ตั้งแต่แรก (shared DB + tenant_id column แนะนำสำหรับ scale นี้)

หน่วยข้อมูลหลักที่เห็นชัดจาก spec:

- **Tenant / Website** — slug, alias, category, theme config, visibility, SEO, created_date, owner
- **User / Webmaster** — phone (เป็น identity หลัก), trusted devices, role per website
- **Subscription** — plan, expiry_date, status (active/suspended/archived), storage_quota
- **Payment** — type (new/renew/storage), QR ref, callback status, receipt, tax_invoice
- **Media** — type (image/video/audio/pdf/ebook), size, thumbnail, album, duplicate_hash
- **Condolence** — name, relationship, message, type (general/family), approval_status
- **Menu** — page type, visibility, sort_order, parent (สำหรับ submenu)
- **QR Code** — type (website/condolence/donation/event), permanent ตราบที่ URL ไม่เปลี่ยน (BR032)
- **Audit Log** — login/payment/publish/delete/storage (retention 2 ปี, BR036)

---

## 6. Business Rules ที่ต้องระวังเป็นพิเศษตอน Implement

| Rule | สาระสำคัญ | ผลต่อการ build |
|------|-----------|----------------|
| BR010 | Subscription สร้างหลัง payment success **เท่านั้น** | ห้ามสร้าง subscription ก่อน verify callback |
| BR014 | Storage นับ original ไม่นับ thumbnail | ต้องมี storage accounting service แยก |
| BR016 | Storage เต็ม 100% → upload ไม่ได้ แต่เว็บยังเปิดดูได้ | block เฉพาะ write ไม่ block read |
| BR018 | ต้องมี callback ก่อนเปิดบริการ (Admin override ได้) | ไม่มี manual approval เป็นหลัก |
| BR021 | Lifecycle: 0-30 read-only, 31-60 suspend, 61-180 archive, >180 admin review | ต้องมี scheduled job ตรวจสถานะ |
| BR023 | ไม่มีการลบข้อมูลอัตโนมัติใน V1 (ข้อมูลมีคุณค่าทางจิตใจ) | ลบได้เฉพาะ Forever Admin |
| BR027 | คำไว้อาลัยต้องผ่าน approval (Webmaster ปิด approval ได้) | toggle setting per website |
| BR028 | Family Condolence แสดงก่อน General เสมอ | priority sort ใน query |
| BR032 | QR permanent ตราบที่ URL ไม่เปลี่ยน | QR ผูกกับ slug ไม่ใช่ generate ใหม่ทุกครั้ง |
| BR044 | ลำดับการตัดสินเมื่อขัดแย้ง: Business Rules > Requirements > User Flow > UI > Implementation | ใช้เป็น tie-breaker ตลอดโปรเจกต์ |

---

## 7. จุดที่ Spec ยังไม่ชัด — ต้องตัดสินใจก่อนเริ่ม

เอกสารดีมากแล้ว แต่จุดเหล่านี้จะ block การ implement ถ้าไม่กำหนดก่อน:

1. **Payment Gateway ตัวจริง** — spec บอกแค่ "PromptPay QR + Callback" แต่ไม่ระบุผู้ให้บริการ (เช่น 2C2P, Omise, GB Prime Pay, SCB API) ซึ่งกำหนด flow ทั้งหมดของ F004 → **ต้องเลือกก่อน**
2. **SMS / OTP Provider** — กระทบ F001 ทั้งหมด (เช่น Twilio, ThaiBulkSMS) และเรื่อง cost ต่อ OTP
3. **Co ลบ Main ได้หรือไม่** — ตามมาด้านบน (BR004 vs BR001)
4. **Duplicate Detection แบบไหน** — file hash ตรงตัว หรือ perceptual hash (รูปคล้าย)? V1 แค่แจ้งเตือนไม่ลบ
5. **Storage backend** — S3-compatible? เก็บที่ไหน? กระทบ thumbnail generation + ZIP export
6. **Video processing** — F013 มี streaming + thumbnail + processing แต่ไม่ระบุว่า transcode เองหรือใช้ service
7. **OTP rate limiting / fraud** — BR041 พูดถึง abnormal login แต่ไม่มีรายละเอียด ควรมี throttling ตั้งแต่ V1
8. **Receipt / Tax Invoice** — รูปแบบเอกสารภาษีไทยที่ถูกต้อง (เลขผู้เสียภาษี ฯลฯ)

---

## 8. ขนาดงาน (Scope Indicators)

- **Screens ทั้งหมด: 79 หน้า** — Public 20, Webmaster 32, Admin 17, System 10
- **Features: 28 กลุ่ม (F001-F028)** — P1 (MVP) ส่วนใหญ่อยู่ใน F001-F008, F011, F013-F016, F023-F027
- **Business Rules: 44 ข้อ (BR001-BR044)**
- **User Flows: 25 flow (UF001-UF025)**
- **Target MVP duration: 3-4 เดือน**

---

## 9. คำแนะนำสำหรับการพัฒนาใน Antigravity

Antigravity ทำงานได้ดีกับ spec ที่ชัดและงานที่แตกเป็น task ย่อย — เอกสารชุดนี้เหมาะมาก:

1. **ใส่เอกสารทั้ง 8 ไฟล์เป็น knowledge/context** ให้ agent อ้างอิงได้ และกำชับให้ยึดลำดับตาม BR044
2. **เริ่มจาก data model / schema ก่อนเขียน feature** — multi-tenant ออกแบบผิดแก้ยากมาก
3. **แตก task ตาม Feature ID** (F001, F002...) เพื่อให้ track ตรงกับเอกสาร และ review ได้เป็นชิ้น
4. **แยกงานตาม surface** (Public / Manage / Admin / Marketing) เพื่อลด context ที่ agent ต้องถือพร้อมกัน
5. **เขียน acceptance criteria จาก User Flow (UF)** — แต่ละ UF คือ test scenario สำเร็จรูป เช่น UF001 = "สร้างเว็บใน 3 นาที" เป็น integration test ได้เลย
6. **กันเรื่อง security ตั้งแต่ต้น** — tenant isolation (ห้าม leak ข้อมูลข้ามเว็บ), OTP throttling, payment callback verification (อย่าเชื่อ callback ที่ไม่ verify signature)

### ลำดับ task แนะนำสำหรับ sprint แรก
```
Sprint 0: Schema + tenant isolation + project skeleton (4 surfaces)
Sprint 1: Auth (OTP) + trusted device
Sprint 2: Creation Wizard + URL/reserved validation
Sprint 3: Payment (QR + callback + verify) + Subscription creation
Sprint 4: Website Builder + Theme + Menu
```

---

## 10. ข้อควรระวังเชิงผลิตภัณฑ์ (จาก Product Philosophy)

ทุก feature ใหม่ต้องผ่านเกณฑ์ (BR044 / Product Principle):
1. ลด Support
2. Self-Service
3. ใช้งานง่ายสำหรับผู้สูงอายุ
4. Mobile First
5. ไม่เพิ่มภาระ Admin โดยไม่จำเป็น

> และข้อกำชับสำคัญจาก MVP-Scope: **ห้ามเพิ่ม Feature ใหม่ระหว่างพัฒนา V1 หากไม่กระทบต่อการเปิดขายจริง** (กัน scope creep)
