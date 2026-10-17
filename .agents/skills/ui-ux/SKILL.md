---
name: ui-ux
description: Use when designing or reviewing any UI — new screens, components, layouts, or visual polish passes. Default aesthetic direction is Vercel-style minimalism.
---

# UI/UX

## Default aesthetic: minimal, Vercel-style

- Neutral base (black/white/gray), one accent color used sparingly, not everywhere.
- Generous whitespace over dense layouts. When in doubt, remove an element rather than add one.
- Sharp, confident typography does the work most decoration would — don't reach for gradients, shadows, or icons to fill empty space.
- Borders over shadows for separation; use shadow only for true elevation (modals, popovers, dropdowns).
- Motion is subtle and fast (150–250ms), used to clarify state change, never as decoration.
- **Never use emojis in UI.** Use proper vector icons (SVG / icon library like Lucide `lucide-react`) with consistent stroke width, size, and optical alignment. Emojis are not a substitute for icons — they break visual consistency, accessibility, and cross-platform rendering.

## Typography

- One typeface family for everything (a system font stack or a single well-chosen font) — a second family only for a real distinction (e.g. monospace for code).
- Type scale: pick ~5-6 sizes, reuse them everywhere (e.g. 12/14/16/20/28/40). Don't invent one-off sizes per component.
- Line height ~1.4-1.6 for body text, tighter (1.1-1.3) for large headings.
- Font weight does more work than color for hierarchy — prefer 400/500/600 over introducing new colors to show emphasis.

## Spacing & layout

- Use a spacing scale (4px or 8px base unit), never arbitrary pixel values.
- Align to a grid; consistent gutters and margins across breakpoints.
- Max content width for readable text (~65-75 characters per line for body copy).

## Color

- Define semantic tokens (background, foreground, muted, border, accent, destructive) rather than hardcoding hex values in components.
- Ensure WCAG AA contrast (4.5:1 body text, 3:1 large text/UI components) — check this, don't eyeball it.
- Dark mode is a token remap, not a separate design.

## Interaction & state

- Every interactive element needs visible hover, focus, active, and disabled states.
- Focus states must be visible for keyboard users — never `outline: none` without a replacement.
- Loading, empty, and error states are designed up front, not left as an afterthought — a screen isn't "done" until all four states (default/loading/empty/error) exist.
- Optimistic UI where latency is noticeable; skeletons over spinners for content-shaped loading.

## Copy (UX writing)

- Buttons/CTAs: verb + object ("Create project", not "Submit" or "OK").
- Error messages say what happened and what to do next, not just "Something went wrong."
- No exclamation-mark marketing tone in system/utility copy. Be direct.

## Accessibility (non-negotiable, not a nice-to-have)

- Semantic HTML first (`button`, `nav`, `label`) before reaching for ARIA.
- Every form input has a real `<label>`.
- All interactive elements reachable and operable by keyboard alone, in a logical tab order.
- Images have meaningful `alt` text (or `alt=""` if purely decorative).

## Iconography

- Use a single icon set (e.g. Lucide) for the entire product — do not mix emoji, custom hand-drawn, and icon-library styles.
- Icons are outline (stroke-based), 1.5–2px stroke, 16–20px default size. Fill only for active/selected states.
- Every icon has an accessible name (`aria-label` or `aria-hidden` + adjacent text). Decorative icons are `aria-hidden="true"`.
- Do not use emojis for status, decoration, or illustration. If an emoji appears in a design, replace it with the nearest semantic vector icon.

## Review checklist before calling a screen done

- Does it work at the smallest supported viewport?
- Do all 4 states exist (default/loading/empty/error)?
- Is every interactive element keyboard-accessible with a visible focus state?
- Could any element be removed without losing meaning? If yes, remove it.
- Are there zero emojis in the UI? Are all icons proper SVGs from a single set?