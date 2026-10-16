# Chapter 05 review

Open http://127.0.0.1:4173/#chapter-05. All 19 video-aligned lessons are published; chapters 06–10 remain outlines. No quizzes.

## Things to try

- **5.3 Discretization:** move the low cutoff to 200. A price of 100 becomes Low; the high boundary remains inclusive for High.
- **5.5 Categorical distributions:** add one Camping record. Counts become 15 / 6, total 21; rounded proportions become 71% / 29%. Frequency and proportion scales are explicitly labeled.
- **5.7 Histograms:** choose 25-year bins. Counts become 9 and 12, totaling 21. Change bandwidth separately from bin width and compare count/density views.
- **5.8 Dice case:** increase to 360 rolls or generate a new reproducible sample. All observations remain sums 2–12; the theoretical expected frequencies sum to the number of rolls.
- **5.9 Normal distribution:** move mean and standard deviation separately. Fixed chart axes make location and spread changes visible.
- **5.10 Heights:** change bin width and smooth-line bandwidth; hide/show the KDE. Use the Reference sample and Athlete sample buttons to display either distribution, both, or neither; each button controls its bars and smoothing line. Data stays fixed at 5,000 reference and 4,967 athlete records.
- **5.12 Mode:** add one A to break the initial A/B tie; A then occurs three times.
- **5.13 Mean:** increase the last delivery to 80. The seven-value mean becomes 23.3 minutes.
- **5.14 Median:** increase the longest queue to 80. Median stays 10.5.
- **5.15 Percentile:** choose 62. Excel PERCENTILE.INC gives 79.6 points; percentile-rank tie conventions are explained separately.
- **5.16 Variance:** switch between delivery services A [29,30,31] and B [10,30,50]. Both average 30 minutes; sample variance changes from 1 to 400 minutes².
- **5.17 Standard deviation:** switch services; SD changes from 1 to 20 minutes. Read the 45-minute delivery interpretation; the empirical rule remains limited to a separate normal model.
- **5.18 Skewness:** select left / symmetric / right; the example statistics are approximately −1.55 / 0 / 1.42, with corresponding schematic tails.

## Verification

- `rtk npm run check`: **38 tests**, strict TypeScript, production build pass.
- `rtk git diff --check`: pass.
- Browser: all 19 lessons render with summaries, valid displayed numbers and no horizontal document overflow at 1440 × 1000. Key controls above were exercised. Introduction, histograms, heights, standard deviation, skewness and summary screenshots were visually inspected.
- Source fixture: every height value independently reconciled with workbook XML; exact ranges/hash recorded in `docs/PDF_REFERENCES.md`.
- Automated accessibility checks on heights and skewness: zero detected violations; SVG/background contrast checks remain incomplete, so this is not a full accessibility certification.
- Vite reports a bundle-size advisory (about 587 kB JS / 184 kB gzip), largely after adding the height fixture and lessons. No runtime network dependency or new package was added.

Implementation used three `gpt-6-luna` agents with high reasoning for separate lesson groups; the primary agent integrated, reviewed source fidelity and verified calculations and desktop behavior. Await user review before implementing Chapter 06.


## Normal / variance / SD follow-up review

- Delivery comparison: both services average 30 minutes; A has squared-deviation total 2 and sample variance 1, while B has total 800 and sample variance 400.
- SD returns the comparison to minutes: √1 = 1 minute for A and √400 = 20 minutes for B. The abstract slider and sample/population toggle were removed from these beginner examples.
- In the normal model, changing μ from 0 to 2 leaves variance 1 and SD 1 unchanged. Setting SD 2.4 gives variance 5.76; the ±3σ band spans −5.2 to 9.2 within the fixed −10..10 axes.
- All three updated lessons were inspected at 1440 × 1000 without horizontal document overflow. The paired bag-weight curves share axes and show the same 530 g observation at +3 SD and +1 SD.
- Final verification: 38 tests, strict TypeScript and production build pass; existing Vite chunk-size advisory remains.

- **5.19 cheat sheet:** categorical, distribution-shape, and summary-statistic reference tables include what each tool answers, when to use it, a limitation, and a link to its lesson.

Latest desktop check (1440 × 1000): service selection updates variance 1→400 and SD 1→20 with no horizontal overflow. The 5.19 reference contains 13 linked tool entries at 15 px table text; categorical and summary tables were visually inspected.

- **5.19 project workflow:** click the six numbered steps below the reference tables. Each updates its task, tools, and expected output. All six selections were exercised in the desktop browser, with one active step and no horizontal overflow; the workflow layout was visually inspected.
