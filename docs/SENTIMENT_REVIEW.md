# Lessons 9.21–9.25 cleanup review

Reviewed 2026-10-21 against the established Chapter 9 source-first examples.

## Changes and source review

- 9.21 retains the full customer worksheet and controls, with a shorter assignment and a visible 50% guide that follows the selected chart coefficients.
- 9.22–9.24 replace the invented sample and repeated definition/summary panels with the course sentiment overview, bitcoin cleaning example, binary word-feature table, and language-context examples.
- 9.25 preserves all 47 training reviews, seven test reviews, 25 source features, supplied cleaning, saved coefficients and probabilities. Full training data is visible by default in a contained scroll area. Coefficients and individual prediction traces are expandable.
- Resolved incorrect claims that the test class column is human labeled: AG57–AG58 threshold the model probability, and remaining cached classes match the rule. Training annotations, predicted probabilities and test class outputs are distinct. No measured test accuracy is claimed.
- The worksheet score is explicitly a sum of observed-label probabilities, distinct from joint likelihood. The page applies supplied coefficients and does not claim to fit a model live.

## Learner and desktop review

Must-fix findings resolved: missing heading IDs; invalid paragraph/blockquote nesting; stop-word versus word-form reduction conflation; incorrect independent-test-label claims; oversized case title; keyboard access to wide source tables; and incomplete explanation of the saved-model calculation.

Desktop screenshots inspected for 9.21–9.25. Text-cleaning changes and bag-of-words rows are readable; source tables preserve all records and columns. At 1600px and 1280px, the worksheet pages have no horizontal page overflow. Review 7 selects worksheet row 63 and activates only the `great` feature, producing the supplied positive probability and class. Manual logistic mode moves the guide to 5.75 emails/week while the saved query remains 66.4%; the saved curve crosses at 8.73.

## Validation and limits

`rtk npm run check`: 19 suites / 105 tests, TypeScript and production build passed. Tests compare all 54 sentiment probabilities and the training objective with saved workbook values. `rtk git diff --check` passed.

The workbook was inspected through XML and cached values, not recalculated in Excel. Browser checks used the local app; there is no live Solver fitting or independent test-label dataset. The existing bundle-size advisory remains. No commit or push was made.
