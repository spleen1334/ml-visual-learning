# Chapter 01 review milestone

Current design: original teal/cream palette; illustrated four-stage course flow alongside the workflow buttons; emphasis and short text blocks; live sales chart; always-visible calculation with arrows; chapter summary. No quizzes, completion gates or About section.

Optional subchapter routing is implemented; Chapter 01 stays one page. See `docs/SUBCHAPTERS.md`. The opening PDF reference review is recorded in `docs/PDF_REFERENCES.md`.

Validation: 11 focused tests pass (math and routing), strict TypeScript, production build, and `git diff --check`. Browser review confirmed workflow and slider controls, desktop and phone layouts. The calculation diagram scrolls horizontally on small screens to preserve label readability.

`chapter-01-desktop.png` shows the current version. `chapter-01-mobile.png` is an earlier visual snapshot and is superseded; refer to the running app for the current phone layout.
