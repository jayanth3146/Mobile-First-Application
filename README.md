# FocusBoard

A single-user task dashboard built as a 24-hour frontend trainee assignment. React + Vite, no backend — task data lives in the browser via `localStorage`.

## Table of contents

- [Overview](#overview)
- [Assignment objectives](#assignment-objectives)
- [Tech stack](#tech-stack)
- [Features](#features)
- [Screenshots](#screenshots)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [State management](#state-management)
- [localStorage persistence](#localstorage-persistence)
- [Responsive design](#responsive-design)
- [Accessibility](#accessibility)
- [Testing](#testing)
- [Deployment](#deployment)
- [Known limitations](#known-limitations)

## Overview

FocusBoard is a productivity dashboard: a sidebar, a header, four stat cards, a "Focus Notes" tips carousel, and a searchable/filterable task list with full create/edit/delete/status-change support. Everything runs client-side; there is no account system, API or database.

## Assignment objectives

This was built against a trainee assessment brief whose scope was:

- A functional (not static) task dashboard matching a Figma reference, in React or Next.js, within 24 hours.
- Full task CRUD, status updates, search, status/priority filtering, and dynamically calculated statistics.
- A three-slide "Focus Notes" carousel with working navigation.
- `localStorage` persistence that survives a refresh without re-seeding sample data.
- Responsive layouts at 390px / 768px / 1440px, plus basic accessibility.
- A public GitHub repo, a live hosted URL, this README, and an `AI_USAGE.md` disclosure.

**On the Figma file specifically:** the assignment PDF referenced specific Figma frames (by numeric node IDs like `1:2`, `15:30`) but the extracted brief did not carry an actual clickable file URL, and no Figma access tool was available in the environment this was built in. So the visual design below is an original, professional interpretation of the *written* brief (layout sections, dimensions, and described elements) — not a verified pixel match to the real file. This is called out again in [Known limitations](#known-limitations) and in `AI_USAGE.md`; please don't present it as pixel-verified against the actual Figma in an interview.

## Tech stack

- React 19 + Vite
- Plain JavaScript (no TypeScript)
- CSS Modules (no Tailwind, no component library)
- [lucide-react](https://lucide.dev/) for icons
- `localStorage` for persistence (no backend)
- Vitest + React Testing Library for automated tests

## Features

- **Dashboard layout** — sidebar, header, stats, Focus Notes, toolbar, task list. Sidebar items other than "Dashboard" are intentionally shown as disabled with a "Soon" badge rather than pretending to navigate anywhere real.
- **6+ sample tasks** (8 provided) across all statuses, priorities and categories, in `src/data/sampleTasks.js`.
- **Create / Edit task** — one reusable modal form (`TaskForm`) for both. Required: title, status, priority, due date. Title is trimmed and whitespace-only titles are rejected with an inline error.
- **Delete task** — requires a confirmation dialog naming the task; Cancel preserves it.
- **Status updates** — a per-task dropdown (To do / In progress / Completed), reflected immediately in the task list and the stats.
- **Search** — case-insensitive, partial match on title, live as you type, with a clear (×) button.
- **Status filter tabs** and **priority filter**, combinable with search and with each other; a "Reset" control appears once any filter is active.
- **Statistics** — total, in progress, completed, completion % — all derived from task state with `useMemo`, never hardcoded, safe on an empty list (no divide-by-zero).
- **Focus Notes carousel** — 3 slides, Previous/Next buttons, clickable dot indicators, circular navigation (Next from the last slide wraps to the first).
- **Empty states** — no tasks at all, no search/filter matches, and a distinct "all caught up" message when a status-only filter (To do / In progress) matches nothing.
- **Accessibility basics** — semantic landmarks, labelled form controls, a skip link, visible focus rings, an accessible modal (focus trap, Escape-to-close, returns focus on close), and status/priority always shown with an icon + text label (not colour alone).

## Screenshots

`/screenshots` is in this repo as a placeholder. **I was not able to generate real screenshots** — there's no browser available in the sandbox this was built in, only a Node/Vite build environment. Before submitting:

1. `npm run dev`, open the app.
2. Resize to ~1440px wide, screenshot → save as `screenshots/desktop.png`.
3. Use your browser's device toolbar (or an actual phone) at ~390px wide, screenshot → save as `screenshots/mobile.png`.

## Project structure

```
focusboard/
  public/
  src/
    assets/            (empty — no static images used)
    components/        UI components (one .jsx + one .module.css each)
    data/               sampleTasks.js, focusNotesData.js
    hooks/              useLocalStorage.js, useTasks.js
    utils/              taskHelpers.js (stats, filtering, ids, dates)
    test/               setup.js (Vitest + jest-dom)
    App.jsx, App.module.css, main.jsx, index.css
    App.test.jsx                      (integration tests)
    components/FocusNotes.test.jsx    (carousel tests)
    utils/taskHelpers.test.js         (unit tests)
  screenshots/
  README.md
  AI_USAGE.md
  package.json
  vite.config.js
  .gitignore
```

## Getting started

Requires Node.js 18+.

```bash
npm install
npm run dev        # starts the dev server (prints the local URL)
npm run build      # production build -> dist/
npm run preview    # serve the dist/ build locally
npm run test       # run the automated test suite once
npm run test:watch # run tests in watch mode
npm run lint       # oxlint
```

## State management

Plain React hooks — no Redux, no Context API, no external state library.

- **`useLocalStorage(key, initialValue)`** (`src/hooks/useLocalStorage.js`) — a small generic hook: lazily reads a key on mount, writes on every change, and falls back safely on missing/corrupt data.
- **`useTasks()`** (`src/hooks/useTasks.js`) — the single source of truth for task data. Wraps `useLocalStorage('focusboard_tasks', sampleTasks)` and exposes `addTask`, `editTask`, `removeTask`, `changeStatus`, all updating state immutably (new arrays/objects, never mutating in place).
- **`App.jsx`** owns UI state (search term, active filters, which modal is open, which task is being edited) and derives `stats` and `filteredTasks` with `useMemo`, recomputed only when their actual inputs change. These are passed down as props to `Dashboard` and its children.

**Why not Context?** The component tree here is shallow — `App → Dashboard → {StatsOverview, FocusNotes, Toolbar, TaskList}` plus two modals — so prop drilling never goes more than two levels deep. Context would add indirection without solving a real problem at this scale; plain props keep the data flow easy to trace. If the app grew (more routes, more deeply nested state consumers), Context or a small store would become worth it.

One more concrete decision: `TaskForm` is given a `key` that changes every time it's opened (for create, or for a specific task's id) instead of resetting its internal state in a `useEffect`. This lets the form's initial state be computed once, synchronously, when it mounts — no synchronization effect needed, and it avoids the extra render an effect-based reset would cause.

## localStorage persistence

- Storage key: `focusboard_tasks`.
- On first load (key absent), the 8 sample tasks are used and immediately written to storage.
- Every create, edit, delete and status change updates the same `tasks` array in state, which `useLocalStorage`'s internal effect-free setter persists on every change.
- A **missing** key means "nothing saved yet" → sample data loads. A **present but empty** array (e.g. after deleting every task) is respected as real, intentional data — sample tasks do not reappear.
- Corrupted/invalid JSON in the key is caught and logged to the console; the app falls back to sample data rather than crashing.
- The full task list is always what's persisted — never a filtered/searched subset.

## Responsive design

Breakpoints used throughout the CSS Modules:

- **≥1024px (desktop):** sidebar is persistently visible as part of the layout; stats grid shows up to 4 columns (`auto-fit, minmax(160px, 1fr)`); task rows lay out horizontally (content left, status + actions right).
- **768–1023px (tablet):** sidebar collapses behind a hamburger-triggered overlay drawer (same as mobile) to give content more width; stats grid reflows to 2 columns; toolbar wraps.
- **≤767px (mobile, incl. 390px):** sidebar is an off-canvas drawer with a backdrop; task cards stack their content above status/actions; the form's two-field rows collapse to one column; status filter tabs scroll horizontally instead of wrapping awkwardly; the header's subtitle and the Add Task button's label hide below 480px to avoid crowding, while the icon + accessible label remain.

No fixed pixel widths are used for layout containers — flexbox/grid with relative units and `min-width: 0` on flex children, so content reflows rather than overflowing horizontally.

## Accessibility

- Semantic landmarks: `<nav>` (sidebar), `<header>`, `<main>`, labelled `<section>`s.
- A "Skip to main content" link, visible on keyboard focus.
- A visible `:focus-visible` ring applied globally, not just on a few elements.
- All inputs/selects/textareas have associated `<label>`s; required fields are marked both visually (`*`) and with `aria-required`; validation errors use `role="alert"` and `aria-describedby`/`aria-invalid`.
- The create/edit modal and the delete-confirmation dialog share one `Modal` component: `role="dialog"`, `aria-modal`, a focus trap, Escape-to-close, click-outside-to-close, and focus returns to the triggering element on close.
- The carousel's Previous/Next buttons and each dot indicator have descriptive `aria-label`s; the active indicator uses `aria-current` (a plain button group, not the `tab`/`tablist` roles — those imply roving-tabindex keyboard support and a linked tabpanel that this simple carousel doesn't provide, so using them without that support would have been a worse, half-finished pattern); slide content updates inside an `aria-live="polite"` region.
- Status and priority are always shown as an icon **plus** a text label — never colour alone.
- Disabled sidebar items use `aria-disabled` (rather than the native `disabled` attribute) so they stay keyboard-discoverable and get a tooltip, instead of silently vanishing from the tab order.

## Testing

Automated, not just manual — see `AI_USAGE.md` for how these were used during development. Run with `npm run test`.

- `src/utils/taskHelpers.test.js` — stats calculation (including the empty-list case), search/status/priority filtering alone and combined, id uniqueness.
- `src/components/FocusNotes.test.jsx` — initial slide, Next/Previous with wraparound, jumping via an indicator.
- `src/App.test.jsx` — full-app integration tests: rendering sample data, search, create (incl. empty-title and whitespace-only-title validation), cancel, edit (with an explicit check that the task's `id` is preserved, not replaced), delete (confirm/cancel), status changes updating stats, `localStorage` persistence across a simulated remount, falling back safely when `localStorage` holds invalid JSON, *not* reseeding sample data over a validly-saved empty list, and combined status+priority filtering.

26 tests, all passing at the time of writing. What this suite does **not** cover: visual/pixel regression, true cross-browser testing, or a real end-to-end run in an actual browser (there is no browser automation tool in the environment this was built in) — see Known limitations.

## Deployment

- **GitHub:** `https://github.com/_____________________` *(push this project, then fill in)*
- **Live URL:** `https://_____________________` *(deploy, then fill in)*

To deploy on Vercel or Netlify:

- Build command: `npm run build`
- Output directory: `dist`
- No environment variables are required.

## Known limitations

- **Figma fidelity is unverified.** The design below is an original interpretation of the written brief, not a checked-against-the-real-file pixel match (see [Assignment objectives](#assignment-objectives)). Treat spacing/typography/colour choices as "a consistent, professional design system," not "confirmed identical to the Figma."
- **No real browser/visual testing was performed** — only `npm run build`, linting, and automated DOM-level tests (Vitest + jsdom + Testing Library) were run, in a sandboxed environment with no screenshot or browser-automation tool. Please verify the 390px / 768px / 1440px layouts, and take the screenshots this README references, in an actual browser before submitting.
- **Dark mode is not implemented** — a light theme only, to keep scope manageable in 24 hours.
- **No drag-and-drop reordering, no undo for delete, no bulk actions** — out of scope for the brief.
- **Not deployed and not pushed to GitHub by this assistant** — both placeholders above are left for you to fill in once you've done so yourself; see `AI_USAGE.md`.
