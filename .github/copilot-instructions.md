# Copilot Instructions for ArchCalculatorWeb-Engineering-Toolkit

## Project Overview
- This is a Vite + React + TypeScript web toolkit for architects and civil engineers, focused on calculators (e.g., RCC Column & Foundation) with interactive 3D/2D visualization.
- UI/UX is mobile-first, professional, and highly accessible (keyboard, ARIA, screen reader).
- Major features: sticky dashboard panels, glassmorphism, theme/unit/language toggles, guided tours, analytics, and export/share options.

## Architecture & Key Files
- Main UI: `src/RccColumnAndFoundationCalculator.tsx` (dashboard, layout, controls)
- 3D Viewer: `src/components/Viewer3D.tsx` (visualization, view controls, state management)
- Visualization Logic: `src/components/3DVisualization.tsx` (canvas drawing, props-driven)
- Data: `src/data/calculators.ts` (calculator definitions)
- Hooks: `src/hooks/useTheme.ts` (theme logic)
- Navigation: `src/components/Sidebar.tsx`, `src/components/BottomNavMobile.tsx`

## Developer Workflows
- **Install dependencies:** `npm install` (use `--legacy-peer-deps` if you hit peer conflicts)
- **Start dev server:** `npm run dev` (Vite, hot reload)
- **Lint:** `npm run lint` (ESLint, config in `eslint.config.js`)
- **Build:** `npm run build`
- **Preview:** `npm run preview`
- **3D dependencies:** Uses `@react-three/fiber`, `@react-three/drei`, and `three`. Ensure versions are compatible (see `package.json`).

## Patterns & Conventions
- **Props-driven state:** UI controls (rotate, pan, zoom, view) update state via props; pass settings from parent to child (e.g., dashboard → Viewer3D → 3DVisualization).
- **Sticky panels:** Use CSS grid/flex and Tailwind for sticky, responsive layouts.
- **Accessibility:** All interactive elements must have ARIA labels, keyboard navigation, and focus management.
- **Minimal steps:** All calculators/tools should be accessible in max two clicks/taps.
- **Glassmorphism:** Use Tailwind for blur, transparency, and shadow effects.
- **Export/share:** Results panels support CSV/PDF/print via UI buttons.

## Integration Points
- **3D/2D Visualization:** Viewer3D passes view/zoom/pan state to 3DVisualization for rendering.
- **Theme/Unit/Language:** Managed via context/hooks (`useTheme.ts`), toggled in header/sidebar.
- **Search Overlay:** Global fuzzy search for instant tool access.
- **Analytics:** Usage stats and tips in sidebar (future: expand for smart suggestions).

## Examples
- To add a new calculator: create a new component in `src/components/`, add its definition to `src/data/calculators.ts`, and link it in the sidebar/nav.
- To add a new view control: update `Viewer3D.tsx` to handle the control, pass state to `3DVisualization.tsx`, and ensure UI feedback.

## External References
- See `README.md` for vision, UI/UX principles, and advanced feature suggestions.
- For accessibility, follow WCAG 2.2 and use ARIA roles/labels throughout.

---

**If unclear about a workflow, UI pattern, or integration, check the referenced files and README.md for examples.**
