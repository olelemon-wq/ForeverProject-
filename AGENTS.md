<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Icon Guidelines
- Do NOT use Emojis (e.g., 🕯️, 📖, 📸, 🌳, 📊, 👥) for icons in UI layouts.
- Use vector SVG icons from the `lucide-react` package instead to maintain a premium, clean, and consistent visual appearance.

# UI Components
- Prefer **shadcn/ui** (`@/components/ui/*`) for app controls (Select, Button, Dialog, Input, etc.).
- If a component is missing, add it with `npx shadcn@latest add <name>` before inventing a custom control.
- Marketing page layouts may stay custom; form/app chrome should use shadcn.

