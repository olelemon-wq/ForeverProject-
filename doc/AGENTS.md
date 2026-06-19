# AGENTS.md — FOREVER Platform

กฎและข้อกำหนดสำหรับ AI agent (Antigravity) เมื่อทำงานในโปรเจกต์นี้
ลำดับการตัดสินเมื่อขัดแย้ง (BR044): **Business Rules > Requirements > User Flow > UI > Implementation**

---

## UI Stack
- ใช้ shadcn/ui เป็น component library หลัก
- อย่า build component จากศูนย์ถ้า shadcn มีอยู่แล้ว
- หลีกเลี่ยงการใช้ Inline CSS โดยให้ใช้ Tailwind CSS Utility Classes เป็นหลักเว้นแต่จำเป็นจริงๆ (เช่น การคำนวณตำแหน่ง/สีแบบไดนามิกแบบ inline)

---

## Framework & Structure
- Next.js (App Router) + Tailwind v4 + shadcn/ui
- Single app, แยก 4 surface ด้วย route groups: `(marketing)`, `(public)/[slug]`, `manage/`, `admin/`
- subdomain `{slug}.forever.co.th` → rewrite ผ่าน `middleware.ts` ไปที่ `(public)/[slug]` ไม่สร้างหน้าซ้ำ

## Critical Guardrails (ห้ามพลาด — ต้องให้คน review)
1. **Tenant isolation** — ทุก query ที่เกี่ยวกับเว็บลูกค้าต้องผ่าน tenant scope ใน `lib/tenant/` ห้าม query โดยไม่มี `tenant_id` เด็ดขาด (ข้อมูลข้ามเว็บ = ภัยร้ายแรง)
2. **Payment** — subscription สร้างได้หลัง payment callback verify สำเร็จเท่านั้น (BR010, BR018); callback ต้อง verify signature + เป็น idempotent (กัน callback ซ้ำ)
3. **Auth/OTP** — login ด้วย OTP มือถืออย่างเดียวใน V1 (ไม่มี email/password); ต้องมี rate limiting / throttling กัน brute force

## Theme Engine (อย่าสับสนกับ UI Stack)
- shadcn + Tailwind = UI ของ **manage / admin / marketing** (ทีมคุม)
- **Customer Theme Engine** (F006) สำหรับ public memorial site เป็นคนละระบบ: อ่านค่าจาก DB → inject เป็น **CSS variables** ตอน render → ลูกค้าเปลี่ยนสี/font เห็นผลทันที **ห้าม rebuild**, **ห้าม hardcode สีธีมลง Tailwind config**
- Theme มีผลเฉพาะ Layout/Color/Font/Spacing/Animation — ไม่กระทบ URL/SEO/Content/Media/Analytics
- Custom CSS/HTML = exclude จาก V1

## Scope Discipline
- ทำเฉพาะ Phase 1 (MVP) — ห้ามเพิ่ม feature ใหม่ที่ไม่กระทบการเปิดขายจริง
- Out of scope V1: Email/Google/Facebook login, Credit card/Bank transfer, AI features, Custom domain, Museum/Foundation/Public Figure category, Family Tree, Memory Wall, Donation, Mobile app

## Product Principles (BR044)
ทุกอย่างต้องเข้าเกณฑ์: (1) ลด Support (2) Self-Service (3) ใช้งานง่ายสำหรับผู้สูงอายุ 40-70 ปี (4) Mobile First (5) ไม่เพิ่มภาระ Admin
