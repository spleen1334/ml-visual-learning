# Learning-page style

User-approved direction, updated during Chapter 04 review.

- Desktop is the primary target. Keep the teal/cream palette.
- Put important definitions and principles in prominent visual panels. Use a short label, a large readable statement (roughly 24–30px on desktop), selective bold/underline and an illustration or diagram that explains the concept.
- Do not bury a definition in a small gray introductory paragraph. Supporting introductions should be comfortably readable (about 18px), with a bold opening idea.
- Break long explanations into short labeled points. Use bold for key terms, italics for a takeaway or caveat, and restrained underline for the most important ideas. Avoid emphasizing everything equally.
- Pair a definition with a meaningful picture: data rows, distributions, relationships, model inputs/outputs or an annotated calculation. Prefer original SVG/HTML diagrams over decorative stock imagery.
- Explain every control: what changes, what stays fixed and what the learner should notice. Keep calculations visible and connect values to their sources where practical.
- Treat data preparation, QA and profiling as a central foundation, not a passing stage label. Use the source's iceberg analogy and clearly attribute its rough 80%+ estimate.
- No quizzes, answer scoring, completion gates or About sections. End each lesson with an emphasized summary.
- Display subchapters as 2.1, 2.2, etc., without a leading zero. Existing URL identifiers may stay stable.
- Before presenting a chapter, inspect its desktop output, source assumptions and actual interactions. Passing a build does not establish readability.

- Default section order: a short, prominent definition, then a graph, image or small worked example. Supporting text follows the visual; avoid walls of text.
- Use small, concept-specific examples before a separate full case study. Do not reuse the large case-study table throughout the lessons.
- Keep the PDF’s clear, simple wording when it already explains the concept well. Do not rephrase merely for novelty; correct material inaccuracies when needed.
- Distinguish counts of records within a category from counts of distinct labels. Explain the question each calculation answers.


Explain why a method is useful with a concrete scenario before its formula or controls. For example, a normal model turns the mean and standard deviation into expected ranges and a benchmark for unusual observations. Use simple, topic-specific illustrations for variable concepts rather than relying on label cards alone.

- For variance and standard deviation, start with concrete observations and units, then compare consistency at the same mean. Avoid abstract numbered sliders; explain the practical meaning of the metric before its arithmetic.

- A chapter-end workflow can be a clickable sequence: keep all steps visible and show the selected step’s task, relevant tools, and expected output. Do not gate progression or turn it into a quiz.

- Let faster, cheaper implementation agents inspect PDF diagrams, subtitles, and workbook data, then save concise source notes for review. The primary agent reviews those notes, teaching clarity, calculations, and the finished browser experience.

- Heat-map lessons should explicitly show why color makes dense counts easier to scan. Include marginal totals in the color treatment using clearly explained separate scales, and label percentage views with `%` and an explicit denominator.

- Explain new ML vocabulary in an always-visible key-terms area tied to a small example. Separate feature inputs (X), observed target labels (y), and predictions (ŷ). Explain that model notation does not prescribe chart axes: both axes may show features while color shows the target class.

- Trace representative input records through intermediate calculations to the result; introduce unfamiliar notation before aggregate scores.
- Distinguish manually supplied rules/weights, supplied fitted models, and live training. Show labeled inputs → fitting → model parameters → separate prediction inputs when explaining training; a live optimizer is optional.
- Verify mathematical meaning as well as layout: distance charts need faithful metric scales and readable coordinates; changing counts/scores should identify the contributing records.
