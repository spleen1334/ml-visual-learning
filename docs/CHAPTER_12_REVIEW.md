# Chapter 12 review — Intro to Regression

## Source-fidelity revision, 2026-10-22

Compared implementation with visual renders of pages 191–202 and all five lesson subtitles. The previous implementation substituted invented session and marketing records and omitted source diagrams. Replaced those examples with the complete source tables and restored the landscape, workflow, training/test grouping, and overfit/well-fit/underfit visuals. Preserved five lesson routes and order. Text and tables use accessible HTML; complex source diagrams use cropped raster images without mastheads.

Applied correctness fixes: preserve the separate page-199 month-3 value, correct the narration’s Boolean row-4 claim, consistently round natural logs of dollar spend, reserve test data for evaluation, and qualify causal conclusions. Removed the hand-supplied revenue reveal and unnecessary goal/category toggles. Prediction remains unknown for month 11, as in the source.

Validation: 105 tests passed, TypeScript and production build passed, diff whitespace check passed. Vite reports its existing large-bundle warning. Browser opened Regression 101 and Feature Engineering; inspected the rendered feature lesson’s accessibility tree and full desktop screenshot. The first screenshot captured an unloaded page; a later screenshot confirmed the complete feature lesson. Five engineered rows and ten split rows render, with source colors and the fit image. The engineered table retains all columns in contained horizontal scrolling, with a visible scroll cue.

Review boundary: this was a self-review. Full desktop screenshot inspection covered 12.4; the other lessons were source/code-reviewed, but do not yet have complete screenshot verification. No independent reviewer was invoked. No commit or publication performed.

12.5 follow-up: added paired prediction-flow and possible-confounder diagrams at the user’s request. Desktop screenshot checked for readability and alignment; corrected the shared SVG path so both confounder branches have arrowheads. 105 tests, TypeScript, production build, and diff check passed before this SVG-only correction.
