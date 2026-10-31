# Chapter 15 implementation review

Date: 2026-10-23. Scope: the 15 non-quiz lessons in Time-Series Forecasting, including all six workbook cases. Original course files remain read-only. Prepared for a local commit after user review.

## Source and implementation review

- Checked the chapter order against numbered subtitles and PDF pages 245–274. Kept the original case assignments and separate conceptual examples. Source mapping and adaptation boundaries are in `CHAPTER_15_SOURCE_NOTES.md` and `CHAPTER_15_WORKBOOK_NOTES.md`.
- Conceptual lessons use selectable explanations with the original meaningful graphs/tables. Retained the ACF sequence, one-hot reference category, month/time-step matrix, smoothing plot, raw nonlinear sales plus candidate curve stages, and intervention baseline sequence.
- Six case studies retain complete data, indicators, lag columns, forecasts, coefficients, intermediate calculations and saved defaults. Full worksheet output is available below the main view. Wide tables scroll inside their own regions.
- Tests independently reconstruct all 36 lag correlations, monthly predictions, trend predictions, Gompertz model values/SSE, centered moving averages and intervention conversion totals. They verify the observed/forecast boundaries and pre/post split.
- Preserved source quirks: monthly temperature and revenue observations stop in October 2019; the gym table includes all 14 forecast months while its saved main chart stops at October 2020; nonlinear defaults are trial parameters with eight observed weeks and a large SSE. Centered averages use future-side observations and are described as historical smoothers.

## Findings applied

1. Corrected conceptual lesson numbers to account for interleaved case studies.
2. Removed inaccurate graph descriptions and duplicated prose screenshots. Restored the small seasonality graph and raw nonlinear setup graph.
3. Re-cropped graphs to preserve axes and labels. Stacked nonlinear stages at readable desktop width. The intervention source's truncated final date label is restored as 31-Mar.
4. Matched source chart colors, main gym forecast extent, residual-versus-fitted plots, and all five intervention charts, including cumulative shaded area.
5. Clarified lag zero, omitted dummy categories, centered windows, manual curve parameters, residual direction and session-based conversion impact.
6. Fixed a search bug exposed by the new Part 4 title: a standalone chapter number now restricts results to that chapter; multiword queries retain numeric tokens.

## Verification

- `rtk npm run check`: 21 suites / 119 tests, TypeScript and production build pass.
- `rtk git diff --check`: pass.
- Browser: all 15 direct routes loaded at 1600 × 1000 with no document overflow or broken images. Screenshots are under `previews/chapter-15-*`; route checks are in `docs/reviews/CHAPTER_15_BROWSER_CHECK.json`.
- Exercised forecast visibility, both trend choices, moving-average window selection, manual Gompertz A changes, intervention forecast visibility and full worksheet disclosure. Verified chart legends, SSE changes, all five intervention charts, and complete output rows.
- Inspected desktop screenshots for the source figures, case layouts, residual plots and impact charts. Static source sequences require no animation and remain visible with reduced motion.

## Boundaries

This is a desktop-focused local review. It does not claim a mobile or screen-reader audit. Workbook outputs are extracted saved values, not a live Excel recalculation; the manually adjustable nonlinear model recalculates in the app. SVG case charts preserve data and encoding while adapting Excel's raster rendering, typography and tick density. The existing Vite large-bundle warning remains; this change does not introduce lazy loading. The user approved the revised illustration and requested a local commit. No publication was requested.

Historical review note: screenshot paths under `previews/` refer to temporary evidence removed during repository cleanup. The written findings remain available here.
