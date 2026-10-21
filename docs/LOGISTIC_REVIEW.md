# Logistic regression 9.15–9.21 review

Reviewed 2026-10-21 against the approved source-first Bayes/tree approach.

## Source and implementation review

- 9.15–9.20 preserve the PDF figures and explanation sequence, including the three unobserved probability examples, both threshold scenarios, coefficient comparisons, all four likelihood substitutions, annotated likelihood curve, two-input surface, and general equation. Page 135 is rendered as selectable HTML text following the user’s revision; the remaining crops omit the duplicate PDF masthead/sidebar. Routes and manifest IDs remain intact.
- 9.21 reproduces all 624 customer rows and five worksheet columns, the coefficient controls, saved Optimize state, query default 9, 66.4% result, dark chart with three source series, optional jitter and Show Model. The full chart calculation table remains available in a collapsed section.
- The source total 594.43112022596176 is a sum of observed-outcome probabilities. Its statistical mismatch is stated beside the score and in 9.19; the app does not claim that this score is joint likelihood. The supplied coefficients are restored rather than fitted live.
- Preserved Excel's separate calculation paths: customer predictions and query use saved coefficients; the chart and worksheet sum use selected coefficients. Notes explain this when manual controls are used. Jitter preserves original-order observations, uses the source ±0.1 amplitude, and replaces volatile random draws with a repeatable spread.

## Learner/desktop review

Must-fix findings resolved:

1. The intercept caption said the curve crosses the input axis. Changed it to the 50% probability crossing.
2. Coefficient fields and the fifth customer-table column were clipped at desktop size. Widened fields and table area, and stacked the worksheet at narrower desktop widths. Verified no page overflow at 1280px and 1600px.
3. Explicit replay in reduced-motion mode could enter a non-advancing state. Initial reduced-motion view still shows the completed source sequence; explicit playback now works, and manual steps pause it.
4. Increased the source sequence dwell time from 2.6 to 6 seconds to make the source text easier to read. Previous/Next remain available.

The short headers and original figures retain the course's terminology and scenarios. Observations, probabilities, and predictions remain distinct. The customer-number control traces one record's score through the sigmoid and observed-outcome probability. No quizzes, routine definition panels, or closing summaries were added.

## Validation

- `rtk npm run check`: 18 suites, 102 tests; TypeScript and production build passed. Added checks for every saved customer prediction/contribution, record/class totals, the worksheet score, query result, and 50% crossing.
- `rtk git diff --check`: passed.
- Browser: opened all seven canonical routes; inspected source figures at 1600×1000 and worksheet layout at 1280×900. Exercised Previous/Next and pause, completed autoplay, reduced-motion completion, manual coefficients, Optimize restore, model hiding, jitter, query editing and keyboard clearing, customer tracing, and the complete chart-source table.
- Visual evidence: `previews/chapter9-18-logistic-source.png`, `previews/chapter9-19-logistic-source.png`, `previews/chapter9-21-logistic-workbook.png`.

Boundaries: this reproduction reads supplied course values and does not run Excel Solver or establish a causal email-frequency policy. The source raster figures retain their original text/colors; the production build still reports its existing large-bundle advisory. No unresolved must-fix findings remain in this scope.
