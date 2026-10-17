# Project instructions

## Purpose and scope

Build a visual, interactive learning companion to the local **Visual Guide to Machine Learning** course. Follow its chapter flow and terminology closely. Favor simple, maintainable React/TypeScript and HTML/CSS/SVG visuals over elaborate infrastructure or unnecessary dependencies.

- Keep all project edits, generated assets, and Git operations inside `ml-visual-interactive/`. The parent course folders and learning files are read-only references.
- Follow the inherited shell instruction: prefix shell commands with `rtk`; use `rtk proxy` when raw output is needed.
- Build chapter by chapter. Present a usable desktop result for the user to validate before moving to another chapter. Do not interpret a sidebar outline as authorization to implement all listed lessons.
- Chapters 1–9 have implemented content. Chapter 10 currently has a sidebar outline only, taken from the video titles, with quizzes omitted. Check the live manifest before relying on this snapshot.
- Commit when requested or already authorized for the current work. Never push or publish without authorization. Preserve unrelated edits.

## Teaching approach

Use this default order in each section:

1. A short, prominent general definition or central idea. Keep it independent of the worked example; simplifying an example must not replace or remove the definition.
2. A meaningful graph, diagram, image, or small worked example.
3. Brief supporting explanations and a visually emphasized summary.

- Inspect the relevant PDF pages, subtitles, and workbook material before implementing a chapter. Start with `../Learning Files/3. Visual Guide to Machine Learning.pdf` and the matching numbered course folder. Existing source notes are in `docs/PDF_REFERENCES.md` and `docs/QA_DATA.md`.
- Preserve clear, simple source wording. Do not rewrite it merely for novelty. Correct material errors and document important departures from the source.
- Chapter-end reference sections should include a concrete project workflow: the order of checks, how findings guide tool choice, and what to do next. Do not imply every tool must be used. Where useful, make the workflow a clickable sequence with all steps visible and a selected task, tools, and expected output; keep progression ungated.
- Teach one concept at a time with a small dataset. Keep the full inventory dataset in its separate case study rather than repeating it in every lesson.
- Introduce case studies with the concrete assignment: who or what is measured, which groups are compared, and what difference the learner is investigating. Use those specific group names in controls and chart legends.
- Explain **why a method is useful** with a concrete scenario before introducing its formula or controls; a definition alone is not enough.
- Introduce unfamiliar ML terms and notation in a prominent, always-visible key-terms area with a small labeled example. Explain features, target, observed labels, classes, and predictions; distinguish X/y data roles from horizontal/vertical chart axes.
- For beginner statistics, label observations with a concrete scenario and units. Prefer clear scenario comparisons over abstract sliders when they make the purpose easier to understand; explain what the resulting number means in practice.
- Explain what an interactive control changes, why it matters, and what the learner should notice. Use explicit prompts or callouts where helpful; never turn these into quizzes.
- Keep worked calculations visible. Prefer annotated formulas, arrows, source-cell highlights, and clear links between input values and calculation terms over hidden “show calculation” panels. Let learners trace representative records or feature values through intermediate calculations to the final result. Introduce unfamiliar notation before using an aggregate score.
- Clearly distinguish hand-chosen rules/weights, supplied fitted models, and models actually trained in the demonstration. When a workflow claims to train a model, show its labeled inputs, fitting step, resulting rules/parameters, and separate prediction inputs. Live training is not required for every lesson.
- No quizzes, scoring, answer selectors, completion gates, or “About this chapter” sections. End with a concise, emphasized summary.
- Emphasize data preparation, QA, and profiling as the foundation: “garbage in, garbage out.” Attribute the course’s rough 80% effort estimate rather than stating it as a universal fact.
- Preserve conceptual distinctions: record counts within a category versus distinct labels; unknown values versus genuine zero; ordered categories can be task-defined numeric buckets; truncated survey samples versus actual censoring.

## Visual design and readability

- Desktop is the primary target. Do not spend effort on phone-specific polish unless asked.
- Preserve the established warm teal/cream theme. Do not redesign the palette without a request.
- Important definitions must stand out, typically around 24–30px or larger on desktop. Do not bury them in small gray introductory text.
- Break large text blocks into short, labeled pieces. Use selective **bold**, *italics*, and restrained underlining to create a readable hierarchy. Avoid giving everything equal emphasis.
- Favor explanatory SVG/HTML diagrams and charts over decorative pictures. A visual should clarify the idea, not simply fill space. Decision trees and process diagrams need visible directional connectors between related nodes; grouped boxes alone do not show a path.
- Support optional subchapters. Display their numbering as `2.1`, `4.2`, etc., without leading zeros. Preserve existing URL identifiers.
- Keep sidebar navigation focused on the course outline. Do not restore “The visual guide / A little curiosity…” introductory copy or “Explore at your own pace…” footer copy.
- Future chapters may expand to reveal their outline, but must not appear as published lessons or enter lesson pagination before they have content.

## Tables, corrections, and feedback

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
- Delegate routine implementation to faster, cheaper agents, preferably `gpt-6-luna` with high reasoning. Give each agent bounded chapter/component tasks and avoid overlapping edits. Use parallel agents for independent work when useful.
- Delegate PDF, subtitle, and workbook reading to faster, cheaper agents too. Have them save concise chapter source notes (page ranges, key definitions, data ranges, and corrections) so the primary agent can review those notes without repeating the full source read.
- The primary agent orchestrates the work, integrates changes, checks source fidelity, and verifies the result.
- For complex implementation, difficult debugging, or architecture decisions, use `gpt-6.1-sol` with **high** reasoning. Reserve this escalation for work that benefits from it rather than making it the default for routine tasks.
- When specifying an agent model or reasoning override, use `fork_turns: "none"` and supply the relevant project context and instructions explicitly. These model choices are user-authorized preferences; use the closest available option if a named model is unavailable and disclose a material substitution.
- Run `rtk npm run check` for code changes and `rtk git diff --check` before reporting completion. Use meaningful tests for calculation or routing changes; do not add tests merely to mirror trivial markup.
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
