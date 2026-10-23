# Learning-page style

User-approved direction: Section 9 (Classification Models) is the reference for how chapters and subchapters should look, including chapter creation, updates, and quality passes, refined through the Naive Bayes 9.5–9.8 review. Preserve working examples, visuals, and controls in already liked chapters; apply focused clarity and correctness improvements.

- The default is to copy the course explanation faithfully. Inspect the PDF visually and inspect the matching Excel data, formulas, and charts before implementation. Use 9.5–9.8 as the reference for visual style and text density.
- Do not reinvent the wheel: when the PDF or Excel already has a good graph or worked example, copy it closely instead of inventing a new dataset, visualization, dashboard, or activity. Preserve its structure, data, and calculation flow. Additions need a specific teaching reason or an explicit user request.
- Preserve source datasets, table structures, graphs, layout, colors, labels, and calculation order. Use a readable source-image crop directly or recreate it faithfully using raster graphics, SVG, or HTML/CSS. Preserve useful PDF/workbook graphs, including axes, scales, legends, and annotations. Do not replace a clear source visual with an invented example or dashboard.
- Generated and reproduced images can be raster graphics (PNG/WebP); SVG is optional. Prefer raster when it produces a clearer, more faithful visual. Choose by readability at the displayed size and interaction needs, not by format preference.
- Keep the introduction to a short, plain-language definition or assignment. Let the visual carry the explanation. Add a brief targeted clarification only where needed; avoid repeated descriptions, buzzwords, and compulsory definition/Why/glossary/summary panels.
- Excel-backed case studies replicate all relevant tables completely, including rows, columns, headers, ordering, totals, intermediate calculations, results, saved defaults, source controls, and meaningful graphs. Keep large tables accessible with contained scrolling. Do not substitute a sample or score cards for the worksheet. Explain the goal briefly in the header, then show the workbook reproduction.
- Animation is enough interactivity when it helps: highlight matching records, construct frequency tables, trace graph relationships, and reveal calculations in the source's sequence. Do not invent user-input tasks merely to make the page interactive. Provide autoplay plus Previous/Next for step demonstrations; manual stepping pauses, autoplay stops at the completed result, and reduced motion shows the final view.
- Retain the app's teal/cream shell, with the source visual's own meaningful colors inside it. Omit duplicated slide navigation and decorative mastheads. Desktop is the primary target.
- Keep definitions prominent and readable, and explain new terms through short labels beside the relevant visual. Use focused bold, underline and italics on the definition’s key action or concept; keep surrounding prose plain. Include a takeaway only if it adds something beyond the displayed result.
- Preserve separate PDF and workbook examples when their data differs; document that boundary. Correct genuine source errors and record important adaptations rather than silently changing the example.
- No quizzes, answer scoring, completion gates, or About sections.
- Explain optional controls briefly and keep calculations visibly connected to their inputs. Preserve mathematical distinctions and do not imply causal proof or validated predictions from a teaching example.
- Display subchapters as 2.1, 2.2, etc., without a leading zero. Existing URL identifiers may stay stable.
- Before presenting a chapter, review the implementation process (source notes, lesson order/routing, assumptions, calculations, interactions, and validation evidence) and the finished chapter as a learner (wording, visuals, examples, terminology, cognitive load, interaction guidance, readability, and desktop experience). Prioritize findings, fix must-fix items, and report any verification limit. Passing a build does not establish readability.

- Default lesson order: short header → faithful source visual or animation → only necessary clarification.
- Use small, concept-specific examples before a separate full case study. Do not reuse the large case-study table throughout the lessons.
- Keep the PDF’s clear, simple wording when it already explains the concept well. Do not rephrase merely for novelty; correct material inaccuracies when needed.
- Distinguish counts of records within a category from counts of distinct labels. Explain the question each calculation answers.


Use the source scenario to show the method’s purpose; a short sentence or annotation is usually enough.

- For variance and standard deviation, start with concrete observations and units, then compare consistency at the same mean. Avoid abstract numbered sliders; explain the practical meaning of the metric before its arithmetic.

- A chapter-end workflow can be a clickable sequence: keep all steps visible and show the selected step’s task, relevant tools, and expected output. Do not gate progression or turn it into a quiz.

- Let faster, cheaper implementation agents inspect PDF diagrams, subtitles, and workbook data, then save concise source notes for review. The primary agent reviews those notes, teaching clarity, calculations, and the finished browser experience.

- Heat-map lessons should explicitly show why color makes dense counts easier to scan. Include marginal totals in the color treatment using clearly explained separate scales, and label percentage views with `%` and an explicit denominator.

- Explain new ML vocabulary with brief labels tied to the source visual. Separate feature inputs (X), observed target labels (y), and predictions (ŷ). Explain that model notation does not prescribe chart axes: both axes may show features while color shows the target class.

- Trace representative input records through intermediate calculations to the result; introduce unfamiliar notation before aggregate scores.
- Distinguish manually supplied rules/weights, supplied fitted models, and live training. Show labeled inputs → fitting → model parameters → separate prediction inputs when explaining training; a live optimizer is optional.
- Verify mathematical meaning as well as layout: distance charts need faithful metric scales and readable coordinates; changing counts/scores should identify the contributing records.

- Reference implementation: Naive Bayes 9.5 has a short definition and diagram; 9.6 copies and animates the PDF frequency tables; 9.7 copies the probability lookup/product sequence with one denominator note; 9.8 replicates the complete Excel case with a short goal statement. Apply this approach to future lessons without requiring a new request to copy the sources.

- Decision Trees 9.9–9.14 follow the approved Naive Bayes source-reproduction approach. Preserve the approved 9.9 graph and layout; simplify repeated prose only, and emphasize entropy and information gain beside the graph. Lessons 9.10–9.13 retain the PDF entropy curve, split diagrams, complete traced trees, and forest diagram. Lesson 9.14 reproduces the separate full Decision Trees worksheet. Flag inconsistent slide counts and distinguish individual branch entropy changes from weighted information gain.

- In binary entropy explanations, emphasize 0 = low uncertainty and 1 = high uncertainty. Explain that useful input variables X produce low-entropy target-label groups after splitting; do not describe entropy as a property of the input variable itself. Keep the last-login example and its weighted calculation in 9.11; avoid duplicating them in 9.10.

- In the 9.14 workbook case, keep Excel’s connected left-to-right split structure and “Info Gain” labels, with compact entropy and green/red count cells. Put detailed calculations and the branch-versus-weighted gain distinction in pop-ups. Source rows start collapsed. Pivot filters show live matching counts, subscription proportion and entropy.

- The 9.14 pivot follows the demonstrated Excel grouping (Sessions > 10 → Follow → ID, with Newsletter as a report filter), rather than the workbook’s earlier saved ID-only layout. Collapsing a group changes row visibility, not the filtered population used in the entropy result.

- Keep the 9.14 Decision Tree Pivot optional and collapsed by default, described simply as an alternative table view of the same customer data. The connected decision tree is the primary exploration.

- Keep PDF mentions and source page numbers out of learner-facing captions, controls, and accessibility labels. Preserve explanatory captions; keep source/page provenance in reference documents and code metadata.

- The revised Chapter 12 is also a user-approved style reference: adapt the source’s working visual structure, preserve complete examples, use selectable text/tables, and add only brief clarification. Preserve this style in future lessons. Add a focused visual example when a conceptual comparison feels too dry, without inventing fitted results.

- Excel case studies preserve the worksheet’s spatial grouping: data beside charts, with parameters and forecasts above the relevant chart. Do not scatter connected tables into separate lesson panels.

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
