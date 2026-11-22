# AI Usage Disclosure

## Tools used

- **Claude** (Anthropic) — used for the large majority of this project: architecture, component code, CSS, hooks, the test suite, and this documentation.

## How it was used

The build started from a single detailed specification (tech stack constraints, the full feature list from the assignment brief, folder structure, and explicit requirements like "no Redux," "React + Vite + JavaScript," "reuse the form for create and edit," "don't hardcode statistics," etc.), and Claude was directed to implement, build, and test the whole thing end-to-end rather than produce isolated snippets to be assembled by hand.

Representative prompts (condensed from the actual session):

1. "Build a complete FocusBoard task dashboard — React + Vite + JavaScript, lucide-react icons, localStorage persistence, no Redux/backend/auth — implementing [the full feature list: CRUD, search, status/priority filters, stats, a 3-slide Focus Notes carousel, responsive layouts at 390/768/1440px, accessibility basics]."
2. "Use plain React hooks for state, not Context or a state library, and explain that choice in the README."
3. "After implementing, actually run the build and the tests — don't just claim they pass."
4. "Act as a strict evaluator against the assignment's 100-mark rubric, find real issues, fix what you can, and give an honest score."

## Areas where AI assistance was heaviest

- All component code (`src/components/*`), the two custom hooks, `taskHelpers.js`, and all CSS Modules.
- The automated test suite (`*.test.js(x)` — 24 tests across stats/filtering logic, the carousel, and full-app integration).
- This README and this disclosure file.

## How the generated code was reviewed and verified

This was not a one-shot "generate and submit" — code was run, checked, and iterated on in the same session:

- `npm run build` was executed and passed (no errors) before this was considered done.
- `npx oxlint src` was run; one real warning was found and fixed (see below) — the final run is 0 warnings, 0 errors.
- `npx vitest run` was executed; all 24 tests pass. The tests themselves exercise real app behaviour (typing into the search box, submitting the form, confirming a delete, etc.) via React Testing Library + jsdom, not hand-written assertions about code that was never run.
- Every component was read through manually for logic correctness (e.g., tracing that `calculateStats` and `filterTasks` always run against the full task array, never a previously-filtered one, as the brief required).
- **What was *not* verified:** actual pixel-fidelity against the real Figma file (no Figma URL/access was available — see README's "Known limitations"), and real-browser/visual testing (no browser automation tool was available in the build environment — only Node + a jsdom-based test runner).

## A suggestion that was checked and corrected

The linter (`oxlint`'s `react(set-state-in-effect)` rule) flagged `TaskForm.jsx`: it originally reset the form's fields inside a `useEffect` that ran whenever the modal opened or the task being edited changed. That pattern works, but it's the kind of "sync state via an effect" code the React team now recommends avoiding, since it causes an extra render every time the form opens.

Instead of just suppressing the lint rule, the fix applied was to give `<TaskForm>` a `key` in `App.jsx` that changes every time it's opened for a different purpose (`'form-create'`, or `` `form-edit-${task.id}` ``). That makes React remount the component fresh each time, so the form's initial state can be computed once, directly in `useState`'s lazy initializer, with no effect needed at all. This was re-tested afterward (`oxlint` → 0 warnings, `vitest run` → still 24/24 passing, `npm run build` → still succeeds) rather than assumed to be correct.

## Honesty note

This project was not written entirely by hand — it was generated and iterated on with Claude, under direct human-specified requirements, and genuinely built/linted/tested (not just described) before being handed off. The remaining manual steps — deploying it, pushing it to GitHub, taking the two required screenshots in a real browser, and being able to explain and modify the code live in an interview — are called out explicitly in the README and are the candidate's own responsibility to complete.
