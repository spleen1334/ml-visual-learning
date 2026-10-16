# ML Visual Interactive

A personal, interactive learning companion for the first five chapters of the visual ML course. The app and this Git repository live entirely in this folder. Original videos, subtitles and workbooks remain outside the app and are read-only sources.

## Current milestone

**Chapter 01 — Getting Started** is available for review. It introduces the learning workflow and lets you change one day's sales to see how the average responds. Chapters 02–05 are marked as a roadmap, not available lessons.

The custom static app follows the user's implementation choice after the alternatives review. It needs a controlled lesson sequence, prediction prompts and feedback; CODAP remains a useful companion rather than an embedded dependency.

## Run locally

Use Node 22.12 or later (developed with Node 26.1) and npm.

```sh
npm ci
npm run dev
```

Open **http://127.0.0.1:5173/#chapter-01**. All dependencies, npm cache and build output stay in this folder. No account or backend is required, and the app makes no third-party runtime requests. Completion is saved in this browser's local storage; experiment values reset on reload.

```sh
npm run check       # focused tests, strict typecheck, production build
npm run preview     # serve the production build on http://127.0.0.1:4173
```

## Review Chapter 01

1. Click each course-map step and read its explanation.
2. Predict what will happen when Day 5 rises.
3. Set Day 5 to **22**. The mean should move from **8 to 10** units; the change is **+2**.
4. Open **Show the calculation** to inspect the arithmetic.
5. Use **Reset to 12 units**. The starting mean should return to **8**.
6. Answer both quick-check questions and press **Check my answers**. Completion should appear and persist after reload.
7. Try the slider with arrow keys, the number field, and a phone-sized window. Later chapters should look unavailable and should not open empty pages.

## Structure

- `src/App.tsx`: course shell and current chapter.
- `src/chapters/ChapterOne.tsx`: first interactive lesson.
- `src/math/`: calculations and numerical tests.
- `src/app/`: local progress persistence.
- `src/styles.css`: shared visual styles and responsive layout.
- `previews/`: chapter screenshots and review evidence.
- [BUILD_PLAN.md](BUILD_PLAN.md): full chapter plan and mathematical conventions.
- [ALTERNATIVES.md](ALTERNATIVES.md): existing tools and reuse options.

Chapter 01 uses a clearly illustrative five-day sales dataset `[4, 6, 8, 10, 12]`. It is an original teaching example, not an extract of the workbook. Source context is the course outline and expectations subtitles, identified inside the lesson. Course transcripts, videos and workbooks are not bundled or publicly deployed.

## Next milestone

Review Chapter 01 first, then implement Chapter 02: ML question types, workflow, and when a simpler analysis is sufficient. Each chapter gets a usable preview and verification before moving on.
