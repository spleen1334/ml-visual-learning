# Chapter 04 review

Current review incorporates the user’s simplification and source-wording requests. Chapter 04 remains uncommitted for review.

## Lesson structure

- 4.1 Variable types: prominent definitions, illustrated examples for all ten type labels, field selector and ZIP-code example.
- 4.2 Empty values: five ages, one confirmed unknown recorded as zero. The reversible switch leaves five people in the table, changes the denominator from 5 to 4, and changes the average from 28.6 to 35.75. A hover bubble preserves the original average. Three treatment cards follow the example.
- 4.3 Range & count calculations: separate six-record examples. Click MIN/MAX for ages or dates; source cells highlight. Date MAX changes from Apr 28 to May 30 after parsing. Category selection highlights matching observations and displays COUNTIF. Distinct count is a separate operation: four labels become three after trimming a confirmed trailing space; all category counts sum to six throughout.
- 4.4 Left- and right-censored data: age histogram and repeat-purchase cohort chart adapted from PDF p28. The under-18 comparison is illustrative, not recovered survey data; exclusion is correctly described as selection/left truncation. A measurement-floor inset shows true left censoring. The newest cohort’s observed rate changes from 50% to 80% after completing the observation window; both chart and summary agree.
- 4.5 Table structures: six product-month values, total 69; pivot/unpivot preserves selected values, with a prominent illustrated pivot callout.
- 4.6 Case study: the original 100-record inventory remains separate from the small teaching examples. Six compact stats and an intended-category ledger (96 before, 100 after label correction) replace duplicate profiles. Reversible corrections jump to affected rows. Stable colors and multiple dots identify contributing fixes. Changed values retain originals in hover bubbles. No history/reset panel.

## Source review

Read Chapter 04 subtitles; inspected PDF pages 22, 24, 26–32, including fresh p27 count and p28 censoring review. The small examples follow the definitions rather than repeating the inventory. See `docs/CHAPTER_04_WORDING_REVIEW.md` for the wording audit and `docs/QA_DATA.md` for the read-only case-study data extract.

A faster implementation agent built the small examples, another built the censoring graphs, and a separate agent audited source wording. Root integrated and corrected the implementations, including a chart/summary discrepancy in the completed follow-up state.

## Verification

- 24 existing tests pass; strict TypeScript and production build pass.
- Desktop browser checked five-age arithmetic, preserved rows, all date extrema, category matching, distinct labels and record totals.
- Browser checked both censoring toggles: nine illustrative under-18 bars; repeat-purchase chart and summary both reach 80% after waiting.
- No horizontal overflow in the replacement lessons at desktop size.
- Automated WCAG A/AA checks report zero violations on 4.2, 4.3 and 4.4; incomplete checks still require visual judgment.
- Updated desktop previews for the three replacement lessons. Other preview images reflect earlier review states and may lag later small styling changes.

Review Chapter 04 before starting Chapter 05.
