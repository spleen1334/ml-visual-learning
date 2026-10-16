# Chapter 03 review

Preview: http://127.0.0.1:4173/#chapter-03

One-page orientation based on the single Part 1 VTT and PDF page 18 (visually inspected), with page 19 extracted for the Chapter 04 boundary. A faster implementation agent built the lesson; the root agent reviewed source, corrected typing, equal-width bin edges, chart ticks and diagram sequence, then verified the output.

## Checks

- All 17 existing tests pass; strict TypeScript and production build pass; diff whitespace checks pass.
- Desktop 1440 × 1000: no horizontal overflow; definition, table and charts inspected.
- QA, One variable and Relationships buttons update their pressed state and corresponding view. All six table records remain unchanged across selections.
- Five observed prices: 4, 7.5, 3, 12, 6 dollars. One unknown remains missing. Range $3–$12; coverage 5/6.
- Equal-width price bins [0,5), [5,10), [10,15) have counts 2, 2, 1.
- Scatterplot shows five complete price/weekly-units pairs, with units, numerical ticks and product identifiers. No causal claim.
- Synthetic data is explicitly labeled; no source workbook records were altered or bundled. No cleaning controls, quizzes or completion gates.

The full workbook QA workbench is reserved for Chapter 04. This chapter is ready for user review and remains uncommitted.
