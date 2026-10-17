# Chapter 12 review — Intro to Regression

Reviewed after implementation on 2026-10-17. This is a process and learner-experience review; source details are recorded separately in [CHAPTER_12_SOURCE_NOTES.md](CHAPTER_12_SOURCE_NOTES.md).

## Process review

| Check | Result |
| --- | --- |
| Source coverage | Complete: five non-quiz lessons, PDF pages 191–202, and key assumptions/corrections documented. |
| Lesson order and routing | Complete: Chapter 12 publishes five direct-linkable lessons in the course manifest and sequence tests. |
| Calculation/data assumptions | Checked: `ln(18) = 2.89` when spend is measured in €k; the Boolean flag is true for 12 promotions and 28 social posts; the revenue estimate is visibly described as hand-supplied rather than trained. |
| Interaction behavior | Checked in code: controls use React state, pressed states, live-result regions where content changes, and visible keyboard focus styles. |
| Automated validation | `rtk npm run check` passed: 63 tests, TypeScript check, and production build. `rtk git diff --check` passed. |

## Independent pedagogical review

An independent reviewer assessed wording, visual explanation, examples, terminology, cognitive load, interaction guidance, and readability without rechecking source material.

### Applied findings

1. **Must fix — clarify target type in the recap.** The original web-session example showed a categorical purchase target immediately after the regression framing. It now labels that as classification and contrasts it with a numerical purchase-value regression target.
2. **High value — complete the regression path.** The marketing flow now explicitly shows past records → fitting → new planned inputs → estimated revenue.
3. **High value — define prediction-time availability.** Marketing inputs are now framed as planned or already-known at the start of the predicted month.
4. **Optional refinement — focus feature engineering.** One-hot indicator values are grouped and trace the active category; Boolean and log examples have their own meaning and units.
5. **Optional refinement — make confounding concrete.** The causal lesson now shows holiday demand potentially increasing both marketing spend and revenue.

### Remaining review boundary

Desktop browser inspection remains unavailable in the current environment. The normal-width readability of the non-wrapping marketing table and feature labels therefore still needs live visual verification. The project’s automated checks do not establish that layout boundary.
