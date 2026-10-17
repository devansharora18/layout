---
name: frontend
description: Use when building or modifying any frontend code — components, pages, routing, state, styling. Default stack is Vite or Next.js with TypeScript and Tailwind.
---

# Frontend

## Stack defaults (unless the project already dictates otherwise)

- **Framework**: Next.js if the app needs routing, SSR/SSG, or API routes. Plain Vite + React if it's a pure SPA/tool with no server needs. Don't reach for Next.js just for a static single-page app.
- **Language**: TypeScript always. No `any` unless truly unavoidable — prefer `unknown` + narrowing.
- **Styling**: Tailwind. No CSS-in-JS, no separate stylesheet per component, unless the project already uses one of those.
- Follow the `ui-ux` skill for visual/interaction decisions — this skill covers implementation.

## Component rules

- Function components only. No class components.
- One component per file, file named after the component (`OrderCard.tsx`, not `card.tsx`).
- Props typed with an explicit `interface`/`type`, not inferred inline for anything non-trivial.
- Keep components under ~200 lines (see architecture skill) — extract subcomponents or hooks when a component starts doing layout + data-fetching + business logic all at once.
- Presentational components (pure UI) kept separate from container components (data-fetching, state). Don't fetch data three levels deep in the tree.

## State

- Local state (`useState`) by default. Reach for a global store (Zustand, Context, etc.) only when state is genuinely shared across distant parts of the tree — don't add a state library on day one "just in case."
- Server state (data from an API) is not the same as client state — use a fetching/cache library (e.g. TanStack Query) rather than shoving server data into `useState` + manual `useEffect` fetches.
- Derive state where possible instead of syncing two pieces of state with `useEffect`.

## Tailwind conventions

- Use the design tokens from `ui-ux` (spacing scale, semantic color names) via `tailwind.config` theme extension — not raw hex/px values in `className`.
- Extract repeated class combos into a component, not into `@apply` soup.
- Keep `className` strings readable — if a single element's classes are unwieldy, that's a signal to split the element.

## Data fetching & forms

- Validate all external input (API responses, form data) at the boundary with a schema library (e.g. Zod) — don't trust `any` shaped data from `fetch`.
- Forms: controlled inputs, validation on blur/submit (not on every keystroke unless there's a real reason), clear inline error messages tied to the specific field.

## Performance basics

- Code-split routes/heavy components (`next/dynamic` or `React.lazy`) — don't ship one giant bundle.
- Images: `next/image` in Next.js projects, explicit width/height elsewhere to avoid layout shift.
- Avoid unnecessary re-renders from inline object/array literals passed as props in hot paths — but don't pre-optimize with `useMemo`/`useCallback` everywhere; only when a real re-render problem is observed.

## Testing

- Component tests with React Testing Library, testing behavior (what the user sees/does), not implementation details (internal state, private methods).