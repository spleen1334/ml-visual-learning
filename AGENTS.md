# Project instructions

## Purpose and scope

Build a visual, interactive learning companion to the local **Visual Guide to Machine Learning** course. Follow its chapter flow and terminology closely. Favor simple, maintainable React/TypeScript over elaborate infrastructure or unnecessary dependencies. Choose raster images, SVG, or HTML/CSS visuals according to clarity and source fidelity; SVG is not a requirement.

- Keep all project edits, generated assets, and Git operations inside `ml-visual-interactive/`. The parent course folders and learning files are read-only references.
- Follow the inherited shell instruction: prefix shell commands with `rtk`; use `rtk proxy` when raw output is needed.
- Build chapter by chapter. Present a usable desktop result for the user to validate before moving to another chapter. Do not interpret a sidebar outline as authorization to implement all listed lessons.
- Chapters 1–15 have implemented content. Check the live manifest before relying on this snapshot.
- Commit when requested or already authorized for the current work. Never push or publish without authorization. Preserve unrelated edits.

## Teaching approach

Default to faithful reproduction of the course sources. Section 9 (Classification Models) is the user-approved reference for how chapters and subchapters should look, and for creating, editing, updating, and reviewing them. The approved Naive Bayes lessons 9.5–9.8 demonstrate the preferred visual style and amount of text. For quality passes on an already liked chapter, preserve its working examples, visuals, and controls; focus on concise framing and concrete clarity or correctness fixes.

1. Inspect the relevant PDF pages visually, the matching subtitles, and any Excel worksheet, including its charts and formulas. Original course files remain read-only.
2. Do not invent replacement graphs, datasets, dashboards, or worked examples when the PDF or Excel already contains a good one. Copy the existing structure, data, visual explanation, and calculation flow; do not reinvent it. Add something new only to resolve a specific teaching gap or at the user’s request. Reproduce the source explanation: its data, tables, graphs, labels, layout, visual encoding, and calculation sequence. Reuse a legible source-image crop directly when it already teaches the idea well; otherwise recreate it faithfully using raster graphics, SVG, or HTML/CSS. Do not invent a replacement example or redesign a working explanation merely to make it interactive.
3. Add only a short, plain-language definition or assignment in the header. Let the source visual do most of the teaching. Add a brief clarification beside or below a calculation only when it resolves a specific ambiguity, such as its denominator. Avoid buzzwords, repeated explanations, and routine definition/Why/key-terms/summary panels.
4. Use animation or light interaction only when it helps follow the existing explanation: highlight source records, build a table, reveal calculation steps, or trace a graph. User inputs are optional, not a requirement. For step demonstrations, provide autoplay and Previous/Next; manual stepping pauses playback, autoplay stops on the completed result, and reduced-motion mode shows the completed view.
5. Check the finished page against the source and the approved visual examples. Preserve meaningful graphs from the PDF and workbook, including axes, scales, legends, values, and important annotations. Omit duplicated slide navigation and decorative mastheads inside the app shell. Keep the app's established theme while preserving the source visual's own meaningful colors and styling.

- Start with `../Learning Files/3. Visual Guide to Machine Learning.pdf` and the matching numbered course folder. Existing source notes are in `docs/PDF_REFERENCES.md`, `docs/QA_DATA.md`, and chapter-specific source documents.
- Preserve clear, simple source wording. Correct material errors and document necessary departures. If the PDF and workbook use different datasets, preserve each example in its own lesson and record the difference; do not silently blend them. New examples or extra controls need a concrete teaching reason when the source already supplies a usable explanation.
- Chapter 14 diagnostics must preserve the source’s complete error tables and scatterplots, actual regression output, auxiliary-regression diagram, before/after VIF results, and annotated recap. Do not substitute invented coefficient values, synthetic VIF scenarios, or generic diagnostic cards.
- For Naive Bayes 9.5–9.7, preserve the PDF’s ten-customer example, short introduction, frequency-table construction (pages 107–113), and conditional-probability/prediction sequence (pages 114–118). Keep the separate approved twenty-customer workbook case study.
- Chapter-end reference sections should include a concrete project workflow: the order of checks, how findings guide tool choice, and what to do next. Do not imply every tool must be used. Where useful, make the workflow a clickable sequence with all steps visible and a selected task, tools, and expected output; keep progression ungated.
- Teach one concept at a time with a small dataset. Keep the full inventory dataset in its separate case study rather than repeating it in every lesson.
- Introduce case studies with the concrete assignment: who or what is measured, which groups are compared, and what difference the learner is investigating. Use those specific group names in controls and chart legends.
- Use the source’s concrete scenario to convey why the method is useful. Keep this to a short header sentence or visual label when the source diagram already supplies the context.
- Explain unfamiliar terms with brief inline labels tied to the source visual; avoid a separate glossary panel unless needed. Keep input features, observed targets, and predictions distinct, and do not confuse X/y data roles with chart axes.
- For beginner statistics, label observations with a concrete scenario and units. Prefer clear scenario comparisons over abstract sliders when they make the purpose easier to understand; explain what the resulting number means in practice.
- Explain what an interactive control changes, why it matters, and what the learner should notice. Use explicit prompts or callouts where helpful; never turn these into quizzes.
- Keep worked calculations visible. Prefer annotated formulas, arrows, source-cell highlights, and clear links between input values and calculation terms over hidden “show calculation” panels. Let learners trace representative records or feature values through intermediate calculations to the final result. Introduce unfamiliar notation before using an aggregate score.
- Clearly distinguish hand-chosen rules/weights, supplied fitted models, and models actually trained in the demonstration. When a workflow claims to train a model, show its labeled inputs, fitting step, resulting rules/parameters, and separate prediction inputs. Live training is not required for every lesson.
- Optional chapter-end quizzes may adapt the source HTML quizzes, with explanations and retries. Keep lessons and navigation ungated. No “About this chapter” sections. Add a short takeaway only when it contributes something the source visual does not already show; do not append a routine summary to a source reproduction.
- Emphasize data preparation, QA, and profiling as the foundation: “garbage in, garbage out.” Attribute the course’s rough 80% effort estimate rather than stating it as a universal fact.
- Preserve conceptual distinctions: record counts within a category versus distinct labels; unknown values versus genuine zero; ordered categories can be task-defined numeric buckets; truncated survey samples versus actual censoring.

## Visual design and readability

- Generated and reproduced images may be raster graphics (such as PNG or WebP); they do not have to be SVG. Prefer raster images when they give clearer, more faithful results. Choose the format for visual quality, readable labels at the displayed size, and any interaction needs, not a blanket preference for SVG.

- Desktop is the primary target. Do not spend effort on phone-specific polish unless asked.
- Preserve the established warm teal/cream theme. Do not redesign the palette without a request.
- Important definitions must stand out, typically around 24–30px or larger on desktop. Do not bury them in small gray introductory text.
- Break large text blocks into short, labeled pieces. Use selective **bold**, *italics*, and restrained underlining to create a readable hierarchy. Avoid giving everything equal emphasis.
- Copy meaningful source tables, diagrams, and graphs directly as readable raster/vector crops or faithful reproductions; favor these over decorative pictures. A visual should clarify the idea, not simply fill space. Decision trees and process diagrams need visible directional connectors between related nodes; grouped boxes alone do not show a path.
- Support optional subchapters. Display their numbering as `2.1`, `4.2`, etc., without leading zeros. Include that number in canonical lesson URLs, for example `#chapter-09/9.4-case-study-knn`. Keep manifest IDs stable and support old unnumbered URLs as aliases.
- Keep sidebar lesson lists collapsed by default except for the active chapter. Lesson navigation must reopen the active chapter and bring the highlighted current lesson into view; allow manual chapter expansion for browsing. Keep the current lesson visually distinct and provide a small icon-only target button beside Search to reopen and center it in the sidebar. Include the same control in the search dialog; it closes search and reveals the current lesson.
- Keep sidebar navigation focused on the course outline. Do not restore “The visual guide / A little curiosity…” introductory copy or “Explore at your own pace…” footer copy.
- Keep the top bar compact, with chapter/lesson context aligned left, a small chapter icon, and emphasized numbers. Omit “The foundations” and “Your personal learning lab” labels.
- Show a compact position line in the header for the active chapter only, with start/end ticks, no endpoint numbers, and one highlighted current-lesson marker positioned proportionally. Do not show a dot for every subchapter. It represents location, not completion. Omit the track for chapters without subchapters.
- Keep the header sticky and place compact arrow-icon Previous/Next controls on its right. Show destination titles on hover and keyboard focus; keep lesson navigation out of the footer. Omit footer chapter/progress details; show only a small Back to top control at the bottom of each lesson.
- Future chapters may expand to reveal their outline, but must not appear as published lessons or enter lesson pagination before they have content.

## Tables, corrections, and feedback

- Every Excel-backed case study must replicate the worksheet, not reinterpret it as a new dashboard or toy example. Preserve all relevant source tables in full: rows, columns, headers, ordering, totals, intermediate calculations, results, defaults, formatting, and controls. Reproduce its meaningful charts and graphs, including paired plots, scales, legends, colors, and annotations. Inspect formula dependencies and chart definitions, not just cached headline values. Keep all data accessible through contained scrolling when needed; do not drop records or replace tables with score cards. Direct readable source copies are acceptable for static visuals; recreate live parts faithfully when controls or animations are useful. A short header explains the assignment; do not add definition panels, worked examples, extra commentary, or a closing summary unless requested. For the KNN case, preserve both feature selectors, manual query values, K=0–100, the source table, paired charts, counts, prediction, and confidence, including workbook tie behavior. For the Naive Bayes case, preserve all 20 customer rows, three frequency tables, totals and priors, all conditional probabilities, selected likelihood highlights, three Yes/No controls, both raw products, and final purchase probability; start from the saved Yes/Yes/No inputs. Keep prediction explanations in the preceding lessons.

- Avoid duplicated “Before” and “Current” panels, noisy status bars, preparation histories, undo timelines, and workbook-reset panels.
- Show one current value. When it changes, highlight it and show the original value in a hover bubble while leaving the current value visible.
- Use reversible on/off controls for fixes and simple binary display options, rather than dropdowns or extra apply/verify stages.
- Applying a case-study fix should move attention to the affected rows in the main table and visibly highlight the changed cells or rows.
- Give each fix a consistent color shared by its control, legend, table highlights, and affected metrics. Use multiple colored dots when several fixes affect the same row or metric. Include text labels/tooltips so color is not the only cue.
- Keep the case-study statistics compact: record count; minimum, average, and maximum unit price; earliest and latest stock date. Put a small **Count by Category** table alongside, with category names, product counts, and a total.
- For the inventory case study, intended-category totals start at **96** and become **100** after fixing four label inconsistencies; total records remain **100**. Highlight entire changed category-summary rows.
- Explain that raw date calculations stop in April because May dates are stored as text; after parsing, the latest date is May 30. Distinguish this from genuinely absent data.
- Category-label corrections fix typos, spelling, punctuation, pluralization, or whitespace for consistency; do not imply that products are being reassigned to different categories.
- Briefly mention common imputation approaches such as **mean**, **median**, **mode**, or conditional methods, without silently treating every zero as missing.
- Emphasize pivoting/unpivoting visually in table structures.

## Implementation and verification

- Use `src/app/course.ts` as the course manifest; lesson components live in `src/chapters/`. Keep routing, published-lesson sequencing, and placeholder outlines consistent.
- Prefer focused changes that preserve working layouts and controls. Avoid unrelated cleanup or abstractions.
- Use `gpt-6.1-sol` with **low** reasoning as the primary/default agent for this repository. It plans chapters, integrates source notes and component work, spot-checks high-risk source claims, makes final teaching decisions, and verifies the finished result.
- Delegate bounded, repeatable work to `gpt-6-luna` with **high** reasoning: PDF/subtitle/workbook extraction, concise chapter source notes, and routine implementation with clear component ownership. Give each agent exact page/file ranges and a concrete output format; avoid overlapping edits.
- For every new chapter, have the source-reading agent create a concise source-note artifact with lesson order, PDF pages, subtitle/workbook locations, key definitions, exact data/calculation values, and source-correction or adaptation boundaries. Reuse it for normal revisions; reopen only the affected or ambiguous source passages rather than scanning the whole chapter again.
- The primary agent orchestrates the work, integrates changes, spot-checks source fidelity, and verifies the result.
- For complex implementation, difficult debugging, calculation/routing changes, or conflicting source evidence, use `gpt-6.1-sol` with **high** reasoning. Reserve this escalation for work that benefits from it rather than making it the default for routine tasks.
- For a requested detailed pedagogical review of a chapter, delegate one SOL61HI reviewer (`gpt-6.1-sol` with **high** reasoning). Have it assess the implemented lesson independently for beginner-friendly wording, visual explanation, examples, terminology, cognitive load, interaction guidance, and readability; do not ask it to compare source material unless the user explicitly requests source fidelity review. Require ranked findings with precise locations, concrete fixes, positive observations, and a must-fix versus optional recommendation. The primary agent decides whether to apply any recommendations.
- When specifying an agent model or reasoning override, use `fork_turns: "none"` and supply the relevant project context and instructions explicitly. These model choices are user-authorized preferences; use the closest available option if a named model is unavailable and disclose a material substitution.
- Escalate to `gpt-6-astra` only for unresolved mathematical or source ambiguities, repeated failed fixes, or consequential architecture decisions. Start at low reasoning; do not use it by default.
- Run `rtk npm run check` for code changes and `rtk git diff --check` before reporting completion. Use meaningful tests for calculation or routing changes; do not add tests merely to mirror trivial markup.
- Review every completed chapter before reporting it as ready. First inspect the implementation process: source-note fidelity, lesson order and routing, data/calculation assumptions, interaction behavior, and validation evidence. Then review the finished chapter as a learner: beginner-friendly wording, visual explanation, examples, terminology, cognitive load, interaction guidance, readability, and the desktop experience. Record prioritized findings, apply must-fix items, and clearly report any review boundary.
- Inspect desktop output and exercise changed interactions in a browser. A passing build alone does not establish visual quality or correct behavior. Check that visuals encode the quantity being taught: distance-based charts need faithful metric scaling, readable scales, and identifiable input values; changing counts or scores should identify the records or contributions responsible.
- Report what changed, what was verified, and any remaining verification limit. Provide a local page link when available.
- Refer to `docs/LEARNING_STYLE.md` for supporting teaching guidance, `BUILD_PLAN.md` for milestones, and `todo.md` for deferred ideas. The existing sidebar outline is separate from the deferred end-of-project alternate/grouped table of contents.

## Keep these instructions current

The user explicitly requests that this file evolve with the project.

- Update this file when the user establishes a durable preference, corrects a recurring approach, or approves a lasting project convention. Make the update as part of the relevant work without requiring a separate reminder.
- Revise obsolete guidance rather than accumulating conflicting rules. Keep related guidance in `docs/LEARNING_STYLE.md` consistent when applicable.
- Keep temporary task lists, debugging notes, and detailed progress logs out of this file. Use `todo.md`, the build plan, or focused reference documents instead.
- Treat current user instructions as higher priority than this file. If a new request changes an established convention, apply it and update the convention here.

- Heat-map lessons should explicitly show why color makes dense counts easier to scan. Include marginal totals in the color treatment using clearly explained separate scales, and label percentage views with `%` and an explicit denominator.

- Decision Trees 9.9–9.14 follow the approved Naive Bayes source-reproduction approach. Preserve the approved 9.9 graph and layout; simplify repeated prose only, and emphasize entropy and information gain beside the graph. Lessons 9.10–9.13 retain the PDF entropy curve, split diagrams, complete traced trees, and forest diagram. Lesson 9.14 reproduces the separate full Decision Trees worksheet. Flag inconsistent slide counts and distinguish individual branch entropy changes from weighted information gain.

- In binary entropy explanations, emphasize 0 = low uncertainty and 1 = high uncertainty. Explain that useful input variables X produce low-entropy target-label groups after splitting; do not describe entropy as a property of the input variable itself. Keep the last-login example and its weighted calculation in 9.11; avoid duplicating them in 9.10.

- For Decision Trees 9.14, preserve the approved customer-interactions table and initial entropy/count block. Follow Excel’s left-to-right split selectors, filtered groups, connectors, entropy cells, green/red class counts, and visible “Info Gain” labels. Keep detailed math in calculation pop-ups and source rows collapsed by default. The pivot filters must update visible class counts, subscription proportion, and entropy. Explain Excel’s branch-wise gain versus weighted split gain inside the pop-up.

- For the 9.14 pivot, follow the final course walkthrough’s Newsletter report filter and Sessions > 10 → Follow → ID row hierarchy, with expand/collapse controls and Subscribe values. The saved workbook’s ID-only pivot is an earlier state. Keep all three feature filters available and calculate results from filtered records, independently of collapsed groups.

- Keep the 9.14 Decision Tree Pivot optional and collapsed by default, described simply as an alternative table view of the same customer data. The connected decision tree is the primary exploration.

- Keep PDF mentions and source page numbers out of learner-facing captions, controls, and accessibility labels. Preserve explanatory captions; keep source/page provenance in reference documents and code metadata.

- For 10.3, preserve the original up-sampling, down-sampling and weighted-sampling row-and-arrow diagrams. Keep majority/minority definitions separate and brief, with a short warning about majority-only prediction. Use one shared row-color legend and an always-visible simple definition for the selected method; avoid repeated caveat panels, invented accuracy examples, and click-to-read explanations for these basic methods.

- Keep conceptual diagrams free of incidental result counts (10.4 uses TP/FP/FN/TN labels with the separate source numeric example beside it; 10.5 retains counts for metric calculations). Label predicted as model output and actual as the observed evaluation label. Follow the source's actual-above and predicted-at-left bracket placement. Avoid routine learner-facing statements that data is fake or illustrative; keep provenance in source notes, while preserving distinctions needed to explain what a demonstration computes.

- Chapter 12 preserves the source landscape, five-session recap table, complete ten-month marketing example plus unknown month 11, five-row engineered-feature table, training/test split, workflow, and fit diagrams. Adapt the working source visual style instead of replacing it with invented data or controls. Keep source inconsistencies and numerical corrections in the chapter source notes.

- The revised Chapter 12 is also a user-approved style reference: adapt the source’s working visual structure, preserve complete examples, use selectable text/tables, and add only brief clarification. Preserve this style in future lessons. Add a focused visual example when a conceptual comparison feels too dry, without inventing fitted results.

- For 13.3, follow the source’s five-step graph/table progression. Define residual/error and SSE visibly, explain why errors are squared and why lower SSE is better, then compare the two supplied lines. Prefer simple playback to record inspectors or extra controls when the source already supplies a clear teaching sequence.

- For worksheet case studies such as 13.5, preserve spatial grouping: source data beside the chart, parameters and forecast directly above it. Avoid turning related worksheet regions into successive full-width panels. Keep auxiliary chart-source calculations secondary.

- In 13.5, keep the manual fit line visible by default and explain that its intercept/slope are trial values. Distinguish it by color from the fitted least-squares trend line; use the small “Use fitted α and β” toggle to apply calculated coefficients, and restore manual edits when toggled off. Keep table and forecast tied to the active parameters.

- Each diagnostic method needs a compact “Why and when to use it” section beside its example. Treat MSE, MAE and MAPE separately. Pair conceptual explanations with a meaningful source visual or a small diagram tied to the existing example.

- Put the original course explanation, diagrams and complete worked calculations first. Place added visual reference points, simple examples, and why/when guidance together at the bottom of the lesson. Do not interleave added teaching panels with the source calculation sequence.

- Chapter 14’s approved added explanation uses a small concrete scenario, a labelled table or diagram distinguishing observed values from our model’s predictions, visible arithmetic, and a plain interpretation. Preserve approved delivery examples where they already work; when a source lesson uses Airbnb, explain that same Airbnb example rather than switching scenarios. Keep illustrative numbers explicit and source content first.

- Use bold, underline and italics confidently in definitions and headers to highlight the key action and concept. In Chapter 14, emphasize “predicts” for error metrics and “explains variance” for R². Keep surrounding text plain so the distinction is easy to scan.

- Chapter 14 formulas use the approved PDF-style presentation: stacked fractions, clear mathematical typography, and smaller interpretation captions below. In the MSE/MAE/MAPE captions, bold only “squared,” “absolute,” and “percentage” respectively. Preserve the larger practical explanation separately and retain original source visuals. Apply this formula style consistently across diagnostic lessons.

- For Chapter 14 why/when guidance, prefer the PDF’s short, direct wording and practical method-selection advice. Keep only necessary accuracy corrections; do not replace simple course language with denser statistical commentary.

- In Chapter 14, give unfamiliar recurring statistical terms a short inline reminder on hover, keyboard focus, or click. Use plain definitions (for example, residuals are actual minus predicted values: prediction errors), with a tiny concrete example where helpful.

- Text-only conceptual lessons may include a compact raster illustration to make the page more inviting. Keep it secondary to the explanation and source material; it need not represent data. Chapter 14.6 uses this treatment.

- When a lesson already has a concrete source example (such as Airbnb), keep added explanations and simple references in that same scenario. Avoid introducing a second scenario merely to explain the same method.

## Chapter 14 refinements to reuse

- **Formula reference:** use `Fraction` and `Formula` in `src/chapters/RegressionDiagnostics.tsx` with `.rd-fraction`, `.rd-formula` and `.rd-formula-caption` in its CSS. Follow 14.4’s stacked numerator/denominator, superscripts/subscripts and readable mathematical typography. Put a small interpretation caption below the equation, then a separate plain-language takeaway. Define symbols next to their first use (including α = intercept and ε = error term) and show where totals, means, counts and reported output numbers come from.
- **Definitions in place:** use short hover/click/focus reminders on technical terms, formula labels and table headings. Dotted underlining signals help. Explain the term using the current example; distinguish inputs (Xs), target (Y), coefficient multipliers, coefficient uncertainty and prediction errors. A compact visible reminder at the beginning is appropriate when several terms are needed together, as in 14.8. Support keyboard focus and Escape; verify actual pointer and click behavior in the browser.
- **Interactive source images:** 14.11’s `RecapGraphic` is the reference for responsive overlays on an unchanged source image. Use percentage-positioned, labelled keyboard-accessible buttons over meaningful regions, with simple explanations in viewport-contained pop-ups. Include the formula, output labels and abbreviations; preserve the original data and annotations.
- **Plain interpretation and action:** retain formal labels such as “reject H₀,” but pair them with everyday meaning (“the data points to a relationship”) and the next step (“a promising sign—check prediction errors next”). Prefer short concrete explanations over unexplained “evidence against a zero coefficient.” Explain what a finding suggests we keep, review, remove or check; do not turn lack of evidence into proof of no effect or significance into proof of predictive accuracy.
- **Recap structure:** inspect the matching transcript before writing a recap. Follow its actual walkthrough of the displayed output, rather than inventing a narrative or mixing separate examples. Use direct headings such as “Walk through the model output.” Explain values in context, including residual signs, quartiles and units. Keep observed worst errors distinct from future-error guarantees.
- **Illustration reference:** `src/assets/diagnostics-null-delivery.webp` in 14.6 is the approved raster style: soft painted texture, warm ivory, teal/sage and a simple scene related to the explanation. Place it beside short explanatory text, with responsive stacking. It can be decorative rather than quantitative; never let it replace a meaningful source graph. Broader illustration/definition/style retrofits remain deferred in `todo.md`.

- For supporting illustrations, prefer mathematical ideas, charts, calendars, objects, or abstract compositions over people. Keep the soft painted ivory/teal/sage style; avoid making human scenes the default.
