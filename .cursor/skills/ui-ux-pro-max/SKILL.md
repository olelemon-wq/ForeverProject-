---
name: ui-ux-pro-max
description: >-
  Premium UI/UX design system for building beautiful, accessible, responsive interfaces.
  Covers layout, color, typography, animation, micro-interactions, and accessibility.
  Use when creating or improving UI components, pages, layouts, forms, modals, galleries,
  or any user-facing interface. Also use when the user says "ทำให้สวย", "ปรับ UI",
  "UX ดีขึ้น", "premium", "modern", or asks about design decisions.
---

# UI/UX Pro Max

ระบบออกแบบพรีเมียมสำหรับ ForeverProject — ใช้เป็นแนวทางทุกครั้งที่สร้างหรือปรับปรุง UI

## Design Principles

1. **ลดมากกว่าเพิ่ม** — ทุก element ต้องมีเหตุผล ถ้าเอาออกแล้วยังใช้ได้ ให้เอาออก
2. **พื้นที่ว่างคือดีไซน์** — ใช้ padding/margin เยอะกว่าที่คิดไว้ อย่ายัดของจนแน่น
3. **สม่ำเสมอ** — ใช้ spacing scale เดียวกัน, border-radius เดียวกัน, font weight เดียวกัน
4. **Accessible ก่อน** — ทุก interactive element ต้องใช้ keyboard ได้, contrast ratio ผ่าน
5. **Mobile-first** — ออกแบบมือถือก่อน แล้วค่อยขยายไป tablet/desktop

## Tech Stack & Constraints

- **Tailwind CSS v4** — utility-first, ใช้ design tokens ของ Tailwind
- **shadcn/ui** — ใช้ `@/components/ui/*` สำหรับ controls (Button, Dialog, Select, Input ฯลฯ)
- **lucide-react** — ไอคอนเท่านั้น ห้ามใช้ emoji เป็นไอคอน
- **No emoji icons** — ใช้ SVG icons จาก lucide-react เสมอ

## Layout

### Spacing Scale
```
gap/padding ใช้ตัวเลขคู่เป็นหลัก:
- Tight:   gap-1 / p-1 (4px)   — ระหว่าง icon กับ text
- Compact: gap-2 / p-2 (8px)   — ภายใน badge, chip
- Normal:  gap-4 / p-4 (16px)  — ภายใน card
- Relaxed: gap-6 / p-6 (24px)  — ระหว่าง sections
- Spacious: gap-8 / p-8 (32px) — page padding
```

### Border Radius
```
- Chip/Badge:   rounded-full
- Button:       rounded-xl
- Card:         rounded-2xl หรือ rounded-3xl
- Modal/Dialog: rounded-2xl
- Input:        rounded-xl
```

### Responsive Grid
```
- 1 col:  grid-cols-1                    (< 640px)
- 2 col:  sm:grid-cols-2                 (≥ 640px)
- 3 col:  lg:grid-cols-3                 (≥ 1024px)
- 4 col:  xl:grid-cols-4 (ถ้าจำเป็น)    (≥ 1280px)
```

### Container Widths
```
- Form/Card:     max-w-xl
- Content:       max-w-2xl หรือ max-w-3xl
- Wide content:  max-w-4xl
- Full page:     max-w-6xl
```

## Color Palette

### Brand Colors
```
- Primary action:  bg-[#0071e3] (Apple blue)
- Success/Save:    bg-emerald-600
- Danger/Delete:   bg-rose-600
- Warning:         bg-amber-500
```

### Neutral Scale (stone)
```
- Background:     bg-white / bg-stone-50
- Card bg:        bg-white border border-stone-200
- Subtle bg:      bg-stone-50/30 หรือ bg-stone-100
- Border:         border-stone-200
- Muted text:     text-stone-400 หรือ text-stone-500
- Body text:      text-stone-700 หรือ text-stone-800
- Heading:        text-stone-900
```

### Dark Overlays (สำหรับ lightbox, modal backdrop)
```
- Scrim:     bg-black/50
- Overlay:   bg-black/70 backdrop-blur-sm
- Badge:     bg-black/60 text-white
```

## Typography

### Font Sizes
```
- Caption/Badge:  text-[10px] หรือ text-[11px] font-bold
- Small text:     text-xs (12px)
- Body:           text-sm (14px)
- Subheading:     text-base font-bold (16px)
- Heading:        text-lg หรือ text-xl font-black (18–20px)
- Page title:     text-2xl font-black (24px)
```

### Font Weights
```
- Label/Caption:  font-bold (700) + uppercase tracking-wider
- Body:           font-medium (500)
- Heading:        font-bold (700) หรือ font-black (900)
```

## Components

### Card Pattern
```tsx
<div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm
  transition hover:shadow-lg hover:-translate-y-1 duration-300">
  {/* content */}
</div>
```

### Button Variants
```
Primary:   bg-[#0071e3] text-white hover:bg-[#0071e3]/90 rounded-full px-6 py-2.5
Secondary: bg-stone-100 text-stone-700 hover:bg-stone-200 rounded-xl px-4 py-2
Ghost:     text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-xl
Danger:    bg-rose-600 text-white hover:bg-rose-700 rounded-xl
```

### Badge/Chip
```tsx
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full
  text-[10px] font-bold bg-emerald-500 text-white">
  <Icon className="w-3 h-3" />
  Label
</span>
```

### Empty State
```tsx
<div className="text-center py-16 text-stone-500 text-sm
  border border-dashed border-stone-200 rounded-2xl space-y-2">
  <SomeIcon className="w-10 h-10 text-stone-300 mx-auto" />
  <p>ข้อความอธิบาย</p>
</div>
```

## Animation & Transitions

### Hover Effects
```
- Card lift:       hover:-translate-y-1 hover:shadow-lg duration-300
- Scale subtle:    hover:scale-[1.01] หรือ hover:scale-[1.02] duration-300
- Image zoom:      group-hover:scale-105 duration-500
- Color fade:      hover:bg-stone-100 transition-colors
```

### Enter Animations
```
- Fade in:         animate-fade-in (ต้อง define ใน tailwind config)
- Content appear:  opacity transition ผ่าน Dialog/Popover ของ shadcn
```

### Micro-interactions
```
- Button press:    active:scale-95
- Focus ring:      focus-visible:ring-4 focus-visible:ring-blue-500/20
- Loading:         animate-pulse บน skeleton
- Drag active:     scale-[1.01] border-emerald-500 bg-emerald-50/50
```

## Accessibility Checklist

ทุก UI ที่สร้างต้องผ่านเช็คลิสต์นี้:

- [ ] **Keyboard** — ทุก interactive element กดด้วย Tab/Enter/Space/Esc ได้
- [ ] **Focus visible** — มี focus ring ชัดเจน (focus-visible:ring-4)
- [ ] **ARIA labels** — ปุ่มที่ไม่มี text ต้องมี aria-label
- [ ] **Color contrast** — text กับ background contrast ratio ≥ 4.5:1
- [ ] **Touch target** — ปุ่มบนมือถือ ≥ 44x44px (min-h-11)
- [ ] **Dialog** — ปิดด้วย Esc ได้, trap focus ภายใน (shadcn Dialog ทำให้แล้ว)
- [ ] **Alt text** — ทุก img ที่ไม่ใช่ decorative ต้องมี alt

## Responsive Patterns

### Mobile-first Rules
```
1. ซ่อน sidebar บนมือถือ → ใช้ hamburger/sheet
2. Stack layout (flex-col) default → flex-row บน sm+
3. Font ขนาดเท่ากันหรือเล็กลงนิดบนมือถือ
4. Touch-friendly: ปุ่ม/ลิงก์ต้องกดง่าย (padding เยอะพอ)
5. Image: object-cover + aspect-ratio บังคับ ไม่ให้เลย์เอาต์กระโดด
```

### Breakpoint Strategy
```
Default (< 640px):  1 column, stacked, compact spacing
sm (≥ 640px):       2 columns, side-by-side where appropriate
md (≥ 768px):       adjust spacing, show more content
lg (≥ 1024px):      3 columns, full sidebar
xl (≥ 1280px):      wider containers, optional 4th column
```

## Common Pitfalls to Avoid

1. **อย่าใช้ emoji เป็นไอคอน** — ใช้ lucide-react เสมอ
2. **อย่า hardcode สี** — ใช้ Tailwind classes หรือ CSS variables
3. **อย่าลืม hover state** — ทุกปุ่ม/ลิงก์ต้องมี hover feedback
4. **อย่าทำ modal ที่ปิดไม่ได้** — ต้องมีปุ่มปิดที่เห็นชัด + Esc + click outside
5. **อย่า crop วิดีโอแนวตั้ง** ในที่ที่ user คาดหวังจะเห็นเต็ม — ใช้ lightbox
6. **อย่า nest scroll** — หลีกเลี่ยง iframe ที่ scroll ซ้อน scroll ของหน้า
7. **อย่าลืม loading state** — ปุ่มที่ทำ async ต้องแสดง loading
8. **อย่าใช้ alert()** — ใช้ toast หรือ inline message แทน
