# Chapter 06 review

Open http://127.0.0.1:4173/#chapter-06 and reload if already open.

## Implemented

All 15 non-quiz lessons follow the existing source-aligned sidebar sequence. Chapters 07–10 remain outlines. Faster implementation agents reviewed the PDF diagrams and subtitles and saved concise notes in `docs/CHAPTER_06_*_SOURCES.md`; the primary agent reviewed and integrated their work.

## Suggested review path

- **6.2:** switch Counts, Share of all, and Heat map on the 638-product size/design table.
- **6.3:** compare NYC accident counts by hour and weekday. The full seven-day width fits the page. Share mode changes totals consistently to percentages. Counts describe recorded accidents, not exposure-adjusted risk.
- **6.5–6.6:** vary smoothing bandwidth and compare the grouped KDE and mirrored violins. Observations stay fixed.
- **6.7:** compare quartiles, median, observed whisker endpoints and flagged values. The table rounds display values; the plot uses interpolated quartiles.
- **6.8:** change class/variable counts and see possible combinations multiply.
- **6.10:** switch Positive, Negative, Curved. The 15-point scatter and Pearson r update together. The separate, fixed three-week worked calculation remains visible.
- **6.12:** turn group color off and on to expose the New/Returning customer patterns.
- **6.13:** compare digital media spend with traffic (+0.901), offline spend (−0.901), sales (+0.964), and site load time (−0.016). All 1,000 rows are plotted. The source does not specify measurement units.
- **6.14:** click each of four workflow steps. One task/tools/output panel changes while all steps remain visible.

## Verification

- `rtk npm run check`: 47 tests across 10 files; strict TypeScript and production build pass.
- Primary read-only XML comparison: all 6,000 extracted marketing values and 168 accident counts exactly match the course workbook.
- Desktop browser review at 1440×1000: all 15 routes rendered without page overflow; display modes, bandwidth controls, combination controls, correlation examples, group color, all four case comparisons, and workflow steps were exercised.
- Screenshots visually inspected for heat map, violin, box plot, correlation example, marketing scatter, and workflow. Workflow explanatory text is 17px.
- Existing Vite bundle-size advisory remains: main JS about 735 kB before gzip. No backend, new dependencies, or publication.

## Review refinements

- 6.3: percentage labels and color-coded hour/day totals with separate scales; fixed teal grand total.
- 6.7: removed horizontal outlier jitter so dots align with box/whisker centerlines.
- 6.9–6.10: denser 15-observation patterns; worked three-row calculation stays separate.
- 6.11: 18 paired days plus gold sales/teal drownings time series with independent toggles; relative scales explicitly labeled. Both toggles checked in the desktop browser.
