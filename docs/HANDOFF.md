# HAND-OFF — FOREVER : ปรับ flow ซื้อ + auth ใหม่

> เอกสารส่งต่องาน สำหรับ AI/นักพัฒนาที่รับไปทำต่อ อ่านจบเข้าใจงานได้ทันที

## 0. เป้าหมายของงาน
ปรับ flow ของแพลตฟอร์ม "FOREVER" (เว็บสร้างอนุสรณ์/บันทึกความทรงจำ แบบ multi-tenant)
ให้เป็น: **เข้า Home → เลือก 1 ใน 6 หัวข้อ → ยืนยันเบอร์ด้วย OTP → จ่ายเงิน → เข้าไปตั้งค่า/ใช้งานหลังบ้าน**
โดยหลังบ้านถูกล็อกจนกว่าจะจ่ายเงินสำเร็จ พร้อมทำหน้า Home แบบ apple.com (แต่ละหัวข้อมี hero + รายละเอียด)

## 1. Product summary
Self-service SaaS ภาษาไทย ลูกค้าซื้อแล้วสร้างเว็บอนุสรณ์ได้เองใน ~3 นาที มี 6 ประเภท:
รำลึกผู้จากไป (Memorial), มรดกตระกูล (Family Legacy), คู่รัก (Couple), งานแต่งงาน (Wedding),
กลุ่มเพื่อน (Friends), สัตว์เลี้ยง (Pet Memorial). ราคา 2,000 บาท/ปี, พื้นที่ 1GB, มี QR ถาวร.

## 2. Codebase ปัจจุบัน (stack + ไฟล์สำคัญ + สิ่งที่มีอยู่แล้ว)
- **Stack:** Next.js (App Router) + TypeScript, Prisma + PostgreSQL, Tailwind. Auth = JWT
  cookie ด้วย `jose`. Media = S3 presigned. Payment = PromptPay (callback แบบ mock).
- **กติกาโปรเจกต์:** ห้ามใช้ emoji เป็นไอคอน → ใช้ `lucide-react` เท่านั้น (ดู AGENTS.md).
- **ไฟล์สำคัญที่มีอยู่:**
  - Home marketing: `app/(marketing)/page.tsx` (ตอนนี้ยังไม่มี category picker)
  - Login (เบอร์+OTP): `app/(auth)/login/page.tsx`
  - OTP API: `app/api/auth/otp/request/route.ts`, `app/api/auth/otp/verify/route.ts`
    (ยังไม่ส่ง SMS จริง — dev mode คืนรหัสใน response; TODO: ThaiBulkSMS)
  - Session/JWT: `lib/auth/jwt.ts` (payload `{ phone }`, cookie `session`, อายุ 30 วัน)
  - Wizard สร้างเว็บ: `app/manage/create/page.tsx` (มี category picker + กรอกข้อมูล + slug + theme + payment)
  - สร้าง tenant: `app/api/tenant/create/route.ts` (ตอนนี้ตั้ง status='ACTIVE' ตั้งแต่ก่อนจ่าย)
  - ตรวจ slug: `app/api/tenant/validate/route.ts` (ยาว 3–50, a-z0-9-, คำสงวน, ซ้ำ)
  - Payment callback: `app/api/payment/callback/route.ts` (success → สร้าง Subscription + set ACTIVE)
  - Setup features: `app/manage/setup-features/page.tsx`
  - Dashboard: `app/manage/page.tsx` (tabs: settings/card/gallery/videos/family/ebooks/condolences/billing)
  - Editor: `app/manage/editor/page.tsx`
  - Category config (source of truth): `lib/categories.ts`, `lib/features.ts`
  - เว็บสาธารณะ: `app/(public)/[slug]/…` (page, layout, CondolenceForm ฯลฯ)
  - Schema: `prisma/schema.prisma`
- **มีอยู่แล้ว/ยังไม่มี:** per-category features ครบใน `lib/categories.ts` แล้ว •
  ยังไม่มี: hard-gate ก่อนจ่าย, category picker บน Home, social/email login (และจะไม่ทำ), เบอร์สำรอง.

## 3. Decisions ที่ล็อกแล้ว (สำคัญมาก)
1. **Login เบอร์โทร + OTP อย่างเดียว** — ตัด social (Google/Microsoft) และ email login ออกทั้งหมด.
2. **flow ก่อนจ่ายสั้นสุด:** กดเลือกหัวข้อบน Home → หน้า OTP → จ่ายเงินทันที (ไม่มีกรอกข้อมูลก่อนจ่าย).
3. **Hard-gate:** ก่อนจ่าย tenant = `PENDING_PAYMENT` (ใช้ slug ชั่วคราว `draft-<uuid>`), เข้าหลังบ้าน/แก้ไขไม่ได้จริง.
4. **หลังจ่ายค่อย onboarding ในหลังบ้าน ตามลำดับ:** เลือก URL → กรอกข้อมูล+ธีม → ตั้งค่าฟีเจอร์ → /manage.
5. **Session อยู่ยาว 90 วัน + ต่ออายุอัตโนมัติ (sliding)** — ไม่มี step-up OTP (ทำรายการสำคัญได้เลย).
6. **กู้บัญชี:** ไม่เก็บอีเมล. มีปุ่ม "เข้าสู่ระบบจัดการ (OTP)" ชัดเจน; dashboard โชว์เว็บทั้งหมดของเบอร์
   (ลืม URL ไม่เป็นไร); Settings เพิ่ม **เบอร์สำรอง** (ยืนยันด้วย OTP) ใช้ login แทนเบอร์หลักได้.
7. **Home สไตล์ apple.com:** แต่ละหัวข้อ = hero ภาพ + รายละเอียด/ฟีเจอร์ต่อท้าย (mini product page) จบในหน้าเดียว.

## 4. Target flow (end-to-end)
```
Home (6 หัวข้อ + รายละเอียด) → กดเลือกหัวข้อ
  → OTP ยืนยันเบอร์ (เบอร์อย่างเดียว)  → สร้าง draft PENDING_PAYMENT (slug ชั่วคราว)
  → จ่ายเงิน PromptPay → callback success → ACTIVE + Subscription
  → เลือก & ตรวจสอบ URL (slug จริง)
  → กรอกข้อมูลเว็บ + ธีม
  → ตั้งค่าฟีเจอร์ (setup-features)
  → /manage ใช้งาน
เข้าครั้งต่อไป: /manage → มี session = เข้าเลย | ไม่มี = เบอร์+OTP ครั้งเดียว → "เว็บของฉัน"
```

## 5. หน้าจอ (inventory + สถานะ)
| หน้า | สถานะ | หมายเหตุ |
|---|---|---|
| Home (6 หัวข้อ + รายละเอียด) | ต้องทำใหม่ | apple.com-style, category CTA → OTP `?category=` |
| OTP ตอนซื้อ (เบอร์อย่างเดียว) | ปรับจากของเดิม | มี context หัวข้อ + 3-step indicator |
| Payment (PromptPay) | มีบางส่วน | success → onboarding |
| Choose URL (slug) | ใหม่ | reuse `/api/tenant/validate` |
| กรอกข้อมูล + ธีม | ย้ายจาก wizard เดิม | หลังจ่าย |
| Setup features | มีแล้ว | ต่อจากกรอกข้อมูล |
| Dashboard /manage | มีแล้ว | เพิ่ม hard-gate + "เว็บของฉัน" |
| "เว็บของฉัน" (list เว็บของเบอร์) | ใหม่ | แก้ปัญหาลืม URL |
| Settings เบอร์หลัก/สำรอง | ใหม่ | จัดการ WebmasterPhone |
| เข้าสู่ระบบจัดการ (returning OTP) | ปรับ | ปุ่มชัดบน marketing + footer public |
| เว็บสาธารณะ /<slug> | มีแล้ว | เคารพ features รายหัวข้อ + moderation |

## 6. Data model changes (Prisma)
- `Tenant.status`: เพิ่มค่า `'PENDING_PAYMENT'` (String เดิม, อัปเดต comment).
- **ตารางใหม่ `WebmasterPhone`**: `id, webmasterId, phone @unique, isPrimary Boolean, createdAt`
  → รองรับเบอร์หลัก + เบอร์สำรอง; migrate `Webmaster.phone` เดิมเข้ามาเป็น isPrimary; แก้
  `app/api/auth/otp/verify/route.ts` ให้ resolve webmaster ผ่านตารางนี้ (เบอร์หลักหรือสำรอง).
- Draft ตอนสร้าง: ใช้ slug ชั่วคราวไม่ซ้ำ (`draft-<uuid>`) แล้วแทนที่ตอน Choose URL.

## 7. Auth & session rules
เบอร์ + OTP เท่านั้น. JWT cookie `session` อายุ **90 วัน sliding** (re-issue ทุกครั้งที่เข้าใช้
เช่นใน `app/api/auth/me/route.ts` หรือ `proxy.ts`). ไม่มี social/email/password/step-up.
OTP: 6 หลัก, หมดอายุ 5 นาที, ผิดได้ 5 ครั้ง, resend cooldown 60 วิ. (ส่ง SMS จริง = TODO).

## 8. Design system
apple.com-clean: พื้นขาว #FFFFFF (สลับ #F5F5F7), text #1D1D1F/#6E6E73, accent เดียว emerald
#0F6E56, หัวข้อใหญ่น้ำหนักเบา, ปุ่ม pill, การ์ด rounded 20px เงานุ่ม, ภาพมุมโค้งใหญ่,
lucide icons เท่านั้น (ห้าม emoji), ภาษาไทยทั้งหมด, responsive mobile-first.

## 9. แผน implementation (phased) — ดูรายละเอียดเต็มใน plan file (`~/.claude/plans/flow-cosmic-snail.md`)
เฟส A (หลัก): (A1) Home category picker + รายละเอียด → (A2) OTP redirect ไป payment →
(A3) ยุบ wizard ก่อนจ่าย เหลือ category→draft→payment → (A4) tenant สร้างเป็น PENDING_PAYMENT
+ slug ชั่วคราว → (A5) hard-gate (`app/manage/layout.tsx` guard + block editor/APIs +
`lib/auth/guard.ts`) → (A5.5) Choose URL → (A5.6) กรอกข้อมูล+ธีม → (A6) schema WebmasterPhone
+ PENDING_PAYMENT → (A7) session 90d sliding, ไม่ step-up → (A8) เบอร์สำรอง + "เข้าสู่ระบบจัดการ".
> เฟส B (email OTP) และ C (social) = ตัด/พักไว้ ตามมติผู้ใช้.

## 10. Verification / acceptance
- Home โชว์ 6 บล็อก (hero+รายละเอียด), responsive
- เลือกหัวข้อ → OTP (ไม่มี social/email) → payment (พา category ไปด้วย)
- จ่ายสำเร็จ → PENDING_PAYMENT → ACTIVE + มี Subscription
- ก่อนจ่าย: editor/APIs ถูกล็อก (403), draft ขึ้น "รอชำระเงิน"
- ลำดับหลังจ่าย: URL → ข้อมูล+ธีม → features → /manage
- returning: มี session เข้าเลย; ไม่มี = เบอร์+OTP → "เว็บของฉัน" (โชว์ทุกเว็บของเบอร์)
- Settings เพิ่ม/ลบเบอร์สำรอง (OTP), ต้องเหลือ ≥1 เบอร์เสมอ
- session ~90 วัน ต่ออายุอัตโนมัติ, ไม่ OTP ซ้ำระหว่างใช้งานปกติ
- เว็บสาธารณะเคารพ features รายหัวข้อ + moderation กันโพสต์ที่ยังไม่อนุมัติ
- UI ไทยทั้งหมด, apple-clean, emerald, lucide, ไม่มี emoji

## 11. Open items / ยังไม่ได้ตัดสิน
- ผู้ดูแลร่วม (CO): schema พร้อม (WebsiteWebmaster role) แต่ยังไม่ออกแบบ flow เชิญ/จัดการ
- การต่ออายุเมื่อหมดปี + สถานะ READ_ONLY/ARCHIVED grace period (มี model แต่ยังไม่ทำ UI)
- ส่ง SMS OTP จริง (เลือก provider: ThaiBulkSMS/Twilio) + ส่ง SMS/ใบเสร็จหลังซื้อ
- ราคาตายตัว 2,000 (ยังไม่มี tiered pricing / storage upgrade UI)

## 12. Artifacts ที่ทำไว้แล้ว (อยู่ในโปรเจกต์)
- ผัง flow (ล่าสุด มีขั้นเลือก URL): `docs/forever-flow-v2.svg`, `.png`, `.jpg`
- ผัง flow เวอร์ชันแรก: `docs/forever-flow-combined.svg`, `.png`
- Plan file ละเอียด: `~/.claude/plans/flow-cosmic-snail.md`
- Stitch prompts (Home, OTP, Payment, Choose URL, Dashboard, เว็บของฉัน, Settings เบอร์) — อยู่ในประวัติแชต
