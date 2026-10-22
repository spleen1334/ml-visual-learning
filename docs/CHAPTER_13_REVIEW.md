# Chapter 13 source-fidelity review — 2026-10-22

Revised to follow the user-approved Chapters 9, 10 and 12 approach. Reviewed lesson order, source data and calculation assumptions, and the desktop learning experience. Sources: PDF pages 204–225, matching VTTs, and both regression worksheets.

## Findings and repairs

- **High — incomplete workbook reproduction:** the nonlinear case previously plotted six selected records in place of 1,000 and omitted the regression-output tables. Restored all dated records, transformed values, both prediction columns, full scatter and model output.
- **High — wrong worksheet defaults:** restored Cone Zone’s manual candidate 2 + 0.78x, SSE 773.25, separate fitted trend and 35°C forecast; restored saved chart-series visibility in both cases.
- **High — replaced source explanations:** restored original relationship plots, annotated equation, plane views, Airbnb tables and both transformation examples. Kept prose/formulas selectable where practical.
- **Medium — invalid record selection:** least-squares slider could select x values absent from the dataset. Replaced with the exact ten-record selector; both candidates still show the full calculation table and source SSE totals 862.5 and 722.
- **Medium — tiny table labels:** Airbnb crops now show tables only at a readable width inside horizontal scrolling frames.
- **Low — repetition:** removed routine definition and summary blocks from revised active lessons; headers state a short definition or concrete assignment.

## Boundaries

Airbnb images preserve all source-visible rows; the slide excerpts do not contain the entire underlying dataset. Its four SSE values are supplied results, not recomputed from these excerpts. Marketing scores describe training fit only. Source log-axis/base inconsistencies and narration errors are recorded in CHAPTER_13_SOURCE_NOTES.md.

## Validation

- `rtk npm run check`: 20 test files, 110 tests passed; TypeScript and production build passed. Existing bundle-size warning remains.
- `rtk git diff --check`: passed.
- Browser reviewed all eight lessons at desktop width, with screenshots for source graph/table readability. No document-wide horizontal overflow; wide source tables scroll within their panels.
- Exercised least-squares candidate/record selection (second candidate SSE 722; x=50 residual −17 and square 289), Cone candidate visibility and forecast change to 40°C (38.70 cones; manual SSE stays 773.25), and raw marketing overlay. Verified 1,000 rendered records and 1,000 plotted observations, with source overlay defaults.
- Added four short explanations under the 13.2 pattern plots in response to live user feedback, preserving the liked visual.
- Expanded marketing chart upper bound to 650 so the maximum observed revenue 602.17 remains within the plot. Broke regression output into full-width tables to keep values visible.
- Added five meaningful calculation/data tests: source counts/dates, natural logs, cached predictions/SSE, Cone candidate SSE and fitted forecast.

## 13.3 user-directed correction

Replaced the residual inspector with the five source graph stages (210–214), full progressively built table, residual/error definition, worked signed residual and square, and explicit squaring/SSE explanations. The supplied graphs retain the faint first line when showing the second. Autoplay, pause, replay and Previous/Next are the only playback controls; manual steps pause playback. Both totals checked in browser (862.5 and 722), replay restarts, and the desktop screenshot has no horizontal document overflow. Reduced-motion logic opens step five and disables autoplay. Full check remains green: 110 tests, TypeScript/build; diff check clean.

### 13.5 worksheet layout revision

Rebuilt the previously scattered sections into the source’s left data/right chart arrangement. Full ten-row data/prediction table, candidate controls/SSE, forecast, and four chart toggles share one worksheet surface; auxiliary calculations remain expandable. Restored candidate error lines with source saved default on. Desktop screenshot reviewed at 1280px; all ten rows and no horizontal document overflow checked. Validation: 110 tests, TypeScript and Vite build passed. Existing bundle-size warning remains.

### 13.5 line clarification verification

Manual fit enabled at initial load. Browser verified fitted first-row prediction 14.346 and 35°C forecast 35.22; manual selection gives 5.900 and 29.30. Changing intercept to 4 gives 7.900, 31.30 and manual SSE 551.25. Restored defaults after checks. TypeScript/build and 110 tests passed; desktop has no horizontal document overflow. Explicit model selection avoids ambiguous prediction behavior when both chart lines are visible.

### 13.5 fitted coefficient toggle

Replaced the prediction radio selector with a compact “Use fitted α and β” toggle beside the parameter inputs. Starts manual; enabling applies 10.867 and 0.6958 to inputs, line, SSE, table and forecast; disabling restores prior manual edits. Inputs are disabled while fitted values are applied. Added the requested smallest-squared-error explanation beside the fitted equation. Browser checked application (14.346 / 35.22) and manual restoration after intercept edit to 4 (7.900 / 31.30). All 110 tests and build passed before the final copy-only sentence.
