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

## Chapter-end quizzes

Requested on 2026-10-23: implement Chapter 04 as the first trial; defer the remaining quizzes until its interaction is reviewed.

- [x] Adapt Chapter 04’s HTML quiz to the teal/cream style as the final optional lesson, with explanations and retries.
- [ ] After feedback on Chapter 04, add an optional final quiz to each chapter with a source quiz HTML file. Inspect chapters 05, 06, 08, 09, 10, 12–15, and 17–21; some quiz files omit QUIZ in their filenames. Preserve source topics/order, correct ambiguous wording, and document changes. Do not invent quizzes for chapters without sources or gate navigation.

Progress: Chapter 17's five-question source quiz is implemented as the optional final lesson. Its source issue (feedback stored under a property the source UI does not read) is corrected with course-based explanations; the final question no longer claims that clustering is required.
