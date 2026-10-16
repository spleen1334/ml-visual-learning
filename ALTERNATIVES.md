# Existing alternatives to ML Visual Interactive

Investigated 2026-10-16. Scope: local course folders 01–05, ending with Univariate Profiling. This is research and a recommendation, not an implementation or hands-on product test.

## Recommendation

Try **CODAP** first if the priority is learning by changing real data without building software. Pair it with **Seeing Theory** or **Art of Stat** for individual conceptual explanations. If following this specific course's chapter order, case studies, and guided interactions is essential, a small custom app is justified. I did not find a verified ready-made browser adaptation of this course in the searches performed; this is not proof that none exists.

The educational format to search for is **explorable explanations**: learners manipulate data or parameters while the explanation and graphics respond.

## Closest matches

| Resource | What it already provides | Fit to this course | Main remaining gap |
| --- | --- | --- | --- |
| [CODAP](https://codap.concord.org/) · [GitHub](https://github.com/concord-consortium/codap) | Free browser data-analysis environment; spreadsheet paste/CSV import; tables, drag-and-drop graphs, linked selections; curriculum/plugin ecosystem | Best overall starting point for experimenting with course data and learning profiling | The Maven lesson sequence, specific QA challenges, feedback, and teaching narrative still need authoring |
| [Seeing Theory](https://seeing-theory.brown.edu/) · [GitHub](https://github.com/seeingtheory/Seeing-Theory) | Chapter-based visual probability/statistics explanations, including expectation, variance, distributions, regression | Closest conceptual reference for an interactive textbook | No course-specific QA/cleaning workflow; different syllabus; site archived and README says no longer maintained |
| [Art of Stat web apps](https://artofstat.com/web-apps) | Categorical and quantitative exploration, mean vs. median, distributions, and regression apps | Strong ready-to-use supplement for chapter 05 | Separate tools rather than this course's guided path; no verified reusable full-course codebase in this investigation |
| [StatKey](https://www.lock5stat.com/StatKey/) · [one-variable workspace](https://www.lock5stat.com/StatKey/descriptive_1_quant/descriptive_1_quant.html) | Edit/upload data; dotplots, histograms, boxplots; histogram bucket control; descriptive statistics | Very direct substitute for several univariate experiments | Limited teaching narrative and preliminary QA workflow |
| [Orange](https://orangedatamining.com/) · [GitHub](https://github.com/biolab/orange3) | Visual data-analysis/ML workflows; distribution and imputation widgets | Best broader no-code option if continuing to later modeling chapters | Primarily a desktop workflow application; adapting its source into a small chapter website would be substantial work |
| [OpenRefine](https://openrefine.org/) · [GitHub](https://github.com/OpenRefine/OpenRefine) | Local data cleaning through a browser: facets, clustering inconsistent labels, transformations, undo/redo | Strong practical companion to chapter 04 | A data-cleaning application rather than an interactive statistics textbook; local Java application, not a standalone static page |

These fit assessments are judgments based on official pages and repositories. Controls and features were inspected through documentation/page content, not exercised in a browser session.

## Why CODAP deserves a trial before building

CODAP explicitly targets learning through data exploration. Its official site documents dynamically linked tables/graphs, editable data entry, spreadsheet paste, and CSV/TXT import. Its [developer documentation](https://codap.concord.org/developers/) supports embedding it in a webpage, adding JavaScript plugins, exchanging data and user-action information through an API, and deploying the platform as a static site. The repository is MIT-licensed.

Start with the [guided tutorials and example documents](https://codap.concord.org/get-started/). The tutorials run inside CODAP and include automatic action-completion check marks, making them a more relevant demonstration of guided learning than a blank analysis canvas.

A useful compromise is a small course-navigation website that opens prepared CODAP activities. This avoids recreating a general-purpose table/graph environment. Embedded CODAP may also work, but prototype interaction, reset behavior, mobile layout, and state isolation before choosing it. Do not assume the documented integration is already validated for this project.

**Trial two activities:**

1. Import a copy of the Maven Market QA data. Change a missing-price marker, fix a category spelling, and correct a date/type problem. Check whether the relevant summaries and linked highlights communicate the consequences clearly.
2. Import a numeric sample. Edit one extreme observation, adjust histogram bins, and compare mean, median, and spread. Check whether the app can support a short prediction → experiment → explanation loop without excessive setup.

Choose prepared CODAP activities if these feel intuitive and most extra work is writing prompts. Choose a custom app if the platform needs extensive plugins or UI work to explain each step. Forking CODAP itself would add unnecessary maintenance for a small course companion.

## What GitHub can realistically save

- **Use directly:** CODAP as a hosted learning tool; Orange as a desktop tool; OpenRefine as a local cleaning tool.
- **Integrate selectively:** CODAP activities/plugins if the trial works.
- **Study as design/code references:** Seeing Theory and the examples linked from the curated lists below. Seeing Theory is not a maintained application starter. Its GitHub license file is Apache-2.0, while the README separately requests noncommercial visualization use; clarify the intended reuse terms before copying assets or visualization code.
- **Discover more examples:** [interactive-machine-learning-list](https://github.com/stared/interactive-machine-learning-list) and [awesome-explorables](https://github.com/blob42/awesome-explorables). These are resource catalogs, not turnkey curricula.

Searches included the exact workbook name `Maven_ML_Demos`, the Udemy course slug, and combinations of Maven, Preliminary QA, visual guide, and GitHub. No verified repository implementing the requested course adaptation surfaced. Generic ML repositories frequently emphasize model training and do not solve the first-five-chapters teaching need.

## Match the actual material

Local inspection found 36 VTT files across folders 01–05 (2, 4, 1, 10, 19 respectively) and two **XLSX**, rather than legacy XLS, workbooks in `XLS Files/`. Both contain 24 sheets. Early relevant sheets include `Preliminary QA`, `Histograms`, and `Normal Distribution`; Astra's build plan maps these in more detail.

The QA subtitles use a grocery inventory case with missing prices recorded as zero, text-formatted dates, numeric-looking product identifiers, a suspicious price, and inconsistent category labels. The histogram case simulates two dice. The normal-distribution case compares female Olympic athlete heights and a general-population sample. An alternative covering only neural networks or regression would miss most of these activities.

## Research limits and next decision

Official product/repository documentation was checked live. No tools were installed, no course workbooks changed, no runtime recalculation tested, and no external app received course data. This research does not establish a public redistribution license for the course's explanations, workbook data, or videos. A public version should use original teaching text/data or separately cleared material; the initial plan can remain a personal course companion.

The next useful action is either the two-activity CODAP trial or the first custom QA lesson described in `BUILD_PLAN.md`. Building every chapter before validating the learning interaction would increase rework.

## Source details

- [CODAP overview](https://codap.concord.org/): audience, imports, dynamic linking, examples.
- [CODAP developers](https://codap.concord.org/developers/): embedding, plugins, static deployment, MIT license.
- [CODAP repository](https://github.com/concord-consortium/codap): source and license.
- [Seeing Theory](https://seeing-theory.brown.edu/): chapter topics and archived status.
- [Seeing Theory repository](https://github.com/seeingtheory/Seeing-Theory): maintenance notice and README reuse request; [license file](https://github.com/seeingtheory/Seeing-Theory/blob/master/LICENSE).
- [Art of Stat](https://artofstat.com/web-apps): available interactive concept/data apps.
- [StatKey one-variable tool](https://www.lock5stat.com/StatKey/descriptive_1_quant/descriptive_1_quant.html): upload/edit controls, graph types, statistics, histogram controls.
- [Orange Distributions](https://orangedatamining.com/widget-catalog/visualize/distributions/): bin-width slider, fitted distributions, KDE smoothing, selection output.
- [Orange Impute](https://orangedatamining.com/widget-catalog/transform/impute/): missing-data operations.
- [Orange repository](https://github.com/biolab/orange3): visual analysis application source.
- [OpenRefine overview](https://openrefine.org/) and [repository](https://github.com/OpenRefine/OpenRefine): cleaning capabilities and local application architecture.
- [Udemy course](https://www.udemy.com/course/visual-guide-to-machine-learning/): course identity and curriculum context; local subtitles/workbooks are the primary scope evidence.
