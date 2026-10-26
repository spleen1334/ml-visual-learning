# To-do

## End-of-project navigation ideas

- [ ] Add a simple table of contents after the learning chapters are complete; consider a pop-up/dialog or another lightweight presentation.
- [ ] Organize the table of contents by overall course flow: chapters and optional subchapters.
- [ ] Provide an alternate topic grouping, such as data preparation/QA, univariate analysis, multivariate analysis, classification, regression/forecasting, and learning methods (for example supervised/unsupervised).
- [ ] Allow topics to appear under more than one relevant group where useful; keep links pointing to the same lesson rather than duplicating lesson content.

Requested by the user on 2026-10-16. Deferred until the end of the project; do not implement this navigation feature during the current chapter build. Topic labels can be refined when the final content is known; they do not expand the current chapters 01–05 scope.

## Deferred course-wide improvements

Requested on 2026-10-23. Record these for later; do not implement them now.

- [ ] Add raster illustrations to chapters and subchapters where they help text-heavy lessons feel more inviting. Use the approved Chapter 14.6 illustration as the style reference: soft painted texture, warm ivory background, teal/sage palette, and a simple scene tied to the lesson. Keep illustrations secondary to source graphs and data.
- [ ] Add brief hover/click/focus definitions for technical terms in earlier chapters where appropriate, following the Chapter 14 reminders. Use simple language and a tiny example when useful. Consider linking the first occurrence of a term to its definition.
- [ ] Review earlier chapters against the approved teaching approach in Chapters 9–14: reproduce PDF/course graphs, datasets, tables, labels, and calculation sequences closely; keep source explanations first, with short, clear supporting explanations and examples. Preserve working, approved content and revise only where the comparison reveals a useful improvement.

## Case-study conclusions across the course

Requested on 2026-10-26.

- [ ] Audit every case study outside Chapter 15 and add any missing small **Case study conclusion** section, using Chapter 15’s highlighted style. Keep it to one or two simple sentences, with the main finding in bold. Check the PDF, workbook and matching video walkthrough; preserve source findings and values, and do not invent results or imply causation or future accuracy. Keep conclusions valid when interactive controls change. Preserve existing conclusions that already meet this standard and record coverage by chapter as the audit proceeds.
- [x] Chapter 15: all six case studies (15.4, 15.6, 15.8, 15.10, 15.12, 15.14) have labeled conclusion sections.

## Chapter-end quizzes

Requested on 2026-10-23: implement Chapter 04 as the first trial; defer the remaining quizzes until its interaction is reviewed.

- [x] Adapt Chapter 04’s HTML quiz to the teal/cream style as the final optional lesson, with explanations and retries.
- [x] Add optional final quizzes to published chapters with source HTML quizzes; preserve source topics/order, correct ambiguous wording, and keep navigation ungated.

Progress: Chapter 17's five-question source quiz and Chapter 18's twelve-question source quiz are implemented as optional final lessons. Chapter 17's source issue (feedback stored under a property the source UI does not read) is corrected with course-based explanations; its final question no longer claims that clustering is required. Chapter 18 retains source order and answers with source-based explanations. Chapters 19–21 now also have source-based optional quizzes as their final lessons.

Chapters 05, 06, 08–10, and 12–15 now also have optional final quizzes adapted from their local HTML quiz files. The quiz controls follow Chapter 04 (question map, check/retry, explanation, score, reset); ambiguous source questions are clarified and each correct answer has an explanation. Chapter 17–18 quizzes were already present.
