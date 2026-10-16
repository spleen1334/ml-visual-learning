# Chapter 01 review

Verified 2026-10-16. Milestone: Getting Started. Chapters 02–05 are visibly marked as future work.

Open http://127.0.0.1:4173/#chapter-01 while the production preview server is running, or run `npm run dev` and open http://127.0.0.1:5173/#chapter-01. Use the review steps in [README.md](../README.md).

## Output

- [Desktop preview](chapter-01-desktop.png), 1440px viewport.
- [Mobile preview](chapter-01-mobile.png), 390px viewport.
- Both final screenshots show Day 5 set to 22, mean 10 and delta +2.

## Checks performed

- `npm run check`: 12 tests passed; TypeScript and production build passed.
- Real Chromium browser: workflow descriptions, mandatory exploration before exit completion, separate workflow/quiz state, editable number input, slider arrow-key input, reset, correct exit answers and completion persistence after reload.
- Observed Day 5 = 22 → mean = 10, delta = +2; one slider arrow step → mean = 10.2; reset → mean = 8.
- Production preview: direct chapter URL, numeric interaction and correct chart/metric updates; no page errors reported.
- Responsive checks: 390px and 320px viewport widths with no page-level horizontal overflow. The chart switches to a compact coordinate layout on phones rather than shrinking its desktop text.
- Desktop and mobile screenshots visually reviewed for layout, labels and readable controls.
- axe-core WCAG A/AA scan: zero automatic violations. Contrast checks on SVG labels remained incomplete in the tool; labels were visually reviewed. This is not a full accessibility certification.
- Git whitespace validation passed. Repository root is this app folder.

## Implementation notes

React/TypeScript/Vite static app; no backend or external runtime calls. The illustrative sales data and lesson prose are original. Source course media/workbooks are not bundled or modified. Progress persists in local storage; experiment data intentionally restarts on reload. If browser storage is blocked, the current lesson still works and completion is retained for the visit.

Browser verification used the agent-browser skill and an isolated session. The environment had two CLI versions; explicit use of the installed 0.39.1 executable resolved an older daemon's inconsistent click behavior. Final checks and captures used the current tool.

## Review decision

Chapter 01 is ready for user feedback before Chapter 02. Review the learning flow, amount of explanation, chart interaction and overall visual style. The next chapter will cover ML question types and selecting a sensible first analysis.
