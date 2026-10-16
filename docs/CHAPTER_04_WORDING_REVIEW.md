# Chapter 04 source-wording audit

Read-only comparison of the app copy with *3. Visual Guide to Machine Learning*, PDF pages 19–32. These are the few places where the source has concise wording worth reusing; keep the surrounding explanations and examples intact.

## Recommended exact reuse

- **4.2 Empty values — add the course’s reason for checking empties (PDF p. 24).** In `src/chapters/QASmallExamples.tsx`, the current header ends: `Empty-value checks help keep missing data from distorting analysis.` Replace just that sentence with: `Investigating empty values, and how they are recorded in your data, is a prerequisite for every single analysis.` Keep the preceding zero-versus-unknown explanation and the three treatments: they add useful detail beyond the slide.

- **4.3 Ranges — reuse the course’s range purpose (PDF p. 26).** In `src/chapters/QASmallExamples.tsx`, the definition paragraph currently reads: `A range can signal a value to investigate. It does not prove an error: the field definition and how the data was prepared matter.` The source sentence is: `Range calculation is a helpful tool to understand your variables, confirm that ranges are realistic, and identify potential outliers.` It is good compact concept copy. Retain the current caution that a range alone does not prove an error, either as a following sentence or in the adjacent lesson text. The slide’s income 0–100 and height −10 to 10 examples are prompts to ask about scale or normalization, not evidence that either transformation occurred.

- **4.3 Counts — root is already applying the strongest match (PDF p. 27).** The course says: `Count calculations help you understand the number of records or observations that fall within specific categories.` This is a precise definition for the count lesson. Keep the distinct-count explanation separate: the PDF treats distinct counts as a useful additional QA check, not as the same operation. Also keep the lesson’s six-row arithmetic explicit; the source’s page-27 count and distinct-count discussion is conceptual and does not define this example’s expected total.

## Keep current wording

- **4.1 Variable types (PDF pp. 22–23):** Keep `Storage tells us how a value is encoded; meaning tells us what it represents.` and the digits-as-identifier/quantity/category explanation. They state the distinction more clearly than the slide’s generic “Variable types give us information about our variables.” The glossary’s teaching definitions also explain overlap and meaningful operations more carefully than the PDF’s list of labels.

- **4.2 Empty versus zero (PDF pp. 24–25):** Keep `An empty value means the data was not recorded or is unavailable` and `Zero is a real value, so check what it means before treating it as missing.` These accurately simplify the source and lead into the confirmed-zero example. The source’s `keep, remove, or impute` language is already reflected in the three options.

- **4.4 Observation limits (PDF p. 28):** Keep the device’s “below 5” left-censoring example and the separate under-18 selection note. The slide calls the excluded-under-18 survey left-censored, but no under-18 observations with unknown ages were recorded; describing that as sample selection/left truncation preserves the important technical distinction. Do not adopt the slide example as the definition of true left censoring. The current right-censoring explanation that a customer “may return later” is also clear and accurate.

- **4.5 Long and wide tables (PDF pp. 29–30):** The PDF wording is solid: `Long tables typically contain a single, distinct column for each field` and `Wide tables typically split the same metric into multiple columns or categories.` The app’s `Long format keeps the measured field in one column` and `Wide format spreads values across columns, often one column per period` are already concise, faithful versions; leave them. Keep the explicit row-grain and unchanged-value explanation, which makes the synthetic pivot understandable.

- **4.6 Case study / best practices (PDF pp. 31–32):** No source sentence merits replacing the current careful instructions. In particular, retain the reminders that zero and missing differ, an outlier needs evidence before correction, and the supplied soup correction is gated by manager confirmation.

No wording change is recommended solely to match a slide’s example or vocabulary. No source labels or badges are needed in the lesson UI.

## Applied after review

Root reused the p24 prerequisite sentence, the p26 range-purpose sentence, and the p27 count definition in the replacement lessons. Section 4.4 now follows the PDF’s two graph scenarios with the selection/censoring distinction retained. The definition-first, example-next structure is recorded in `docs/LEARNING_STYLE.md`.
