# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Prisma + PostgreSQL, deployed on Vercel (`forever.co.th`). Media storage via bundled static demo assets and S3-compatible upload paths.

## Users

**Primary audiences (equal priority across categories):**

- Families and individuals creating **Memorial** sites for loved ones who have passed
- Couples maintaining a shared **Couple** memory space (milestones, diary, gallery)
- Couples and families preparing **Wedding** sites (invitation, schedule, guestbook, digital envelope)
- Extended families preserving **Family Legacy** (genealogy, history books, archives)
- Friend groups documenting **Friends** trips and shared memories
- Pet owners creating **Pet Memorial** spaces for companions (living or passed)

**Operators:** Main and Co Webmasters (phone OTP auth) who self-manage content via `/manage` without staff assistance.

**Visitors:** Guests who view public sites, leave condolences/messages, and browse galleries without accounts.

**Language:** Thai-primary interface and copy; English supported in parts of the marketing and UI layer.

## Product Purpose

FOREVER is a multi-tenant SaaS for creating permanent, dignified online spaces to remember people, relationships, families, friends, and pets. Success means a webmaster can register, pay, publish, and maintain a beautiful memorial or legacy site entirely on their own—and visitors experience a calm, respectful, ad-free space worth returning to.

## Positioning

FOREVER combines two claims competitors rarely hold together:

1. **Self-service 100%** — register, pay (PromptPay), create, edit, renew, add co-webmasters, and upgrade storage without contacting support.
2. **Premium, calm, dignified experience** — category-aware journeys (Memorial, Couple, Wedding, Family Legacy, Friends, Pet Memorial) with thoughtful defaults, not a generic page builder.

Public sites live at `forever.co.th/{slug}` with optional subdomain alias. Each tenant chooses a category, enables features, and applies theme settings without code.

## Operating Context

- **Surfaces:** Marketing (`www.forever.co.th`), public tenant sites (`/{slug}`), webmaster backoffice (`/manage`), platform admin (`/admin`)
- **Workflow:** Owner signs up with phone OTP → pays annual subscription → creates site with category + slug → configures theme, content, media, and optional features → shares QR/link with guests
- **Demo sites:** Six showcase tenants (`/examples`) exportable and seedable for production demos
- **Pricing (documented):** ~฿2,000/year first year, ~฿1,500/year renewal; storage upgrades available
- **Business targets (from internal analysis):** Year 1 = 100 sites, Year 2 = 500, Year 3 = 1,000

## Capabilities and Constraints

**Core capabilities:**

- Multi-tenant sites with per-site theme (colors, fonts, hero, avatar/cover positioning)
- Category-specific feature sets: gallery (masonry), videos, condolence/guestbook, memory board, family tree, ebooks, announcements, donations (category-dependent)
- Media upload, albums, compression; demo media bundled for production static serving
- Co-webmaster model (up to 10, equal permissions to main)
- Moderation for guest-submitted content

**Technical constraints:**

- Phone OTP authentication only in V1 (no email/password)
- Payment via PromptPay QR + bank callback
- Theme engine affects layout/color/font only—not URL, SEO structure, or content isolation
- Prefer shadcn/ui for app controls; lucide-react icons only (no emoji icons in UI)
- Mobile-first UX remains important even with multi-category expansion

**Terminology:** “Webmaster” = site owner/editor; “Visitor” = unauthenticated guest; categories use English keys with Thai labels in UI.

## Brand Commitments

- Product name: **FOREVER** (forever.co.th)
- Voice: respectful, warm, premium—not playful or salesy on memorial surfaces
- Public memorial/legacy pages should feel **ad-free and undisturbed**
- Thai-primary copy; honor cultural sensitivity around death, family, and remembrance
- Icons: lucide-react vector icons; no emoji as UI icons

## Evidence on Hand

- Live production: `https://www.forever.co.th`
- Demo showcase: `/examples` with six category demos (boonkrua-family, pluemploy, kukimiyafamily, bts-family/Jitjaidee-Family, friendforever, kittiemeaw)
- Internal analysis: `doc/FOREVER-Analysis.md`, `docs/HANDOFF.md`
- Do **not** fabricate customer testimonials, revenue figures beyond documented targets, or licensing claims not in repo

## Product Principles

1. **Category truth first** — each journey (Memorial, Couple, Wedding, Family, Friends, Pet) gets labels, defaults, and features that match real user intent, not one-size-fits-all copy.
2. **Self-service or it fails** — if a webmaster needs staff to publish or renew, the product has failed for V1.
3. **Dignity over engagement hacks** — no dark patterns, no ad slots on guest-facing memorial content; calm beats viral.
4. **Mobile-ready for real families** — touch targets, readable type, and simple flows for users who may be grieving or non-technical.
5. **Permanent by promise** — URLs, QR codes, and renewals should reinforce that memories are meant to last.

## Accessibility & Inclusion

- Target users include older adults (40–70+); forms and manage flows must stay simple and legible
- shadcn/Radix primitives preferred for accessible app chrome
- No product-specific WCAG certification claimed; design work should not regress keyboard/focus/contrast on core flows
