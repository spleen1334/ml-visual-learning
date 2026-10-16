# Chapters and optional subchapters

`src/app/course.ts` is the course manifest. A chapter can have a `content` component (one page), `subchapters` (separate pages), or both (overview plus nested lessons).

Getting Started deliberately has only `content`. Future chapters without content remain non-clickable roadmap items. Do not publish placeholder subchapters.

To split a larger chapter, create its React components, import them in `course.ts`, and add:

```tsx
{
  id: 'chapter-04',
  number: '04',
  title: 'Preliminary Data QA',
  subtitle: 'Find and understand the issues',
  subchapters: [
    { id: 'missing-values', title: 'Missing values', content: MissingValues },
    { id: 'ranges', title: 'Ranges and unusual values', content: Ranges },
  ],
}
```

The sidebar generates numbered nested links automatically. Links such as `#chapter-04/missing-values` work directly and on reload; browser Back/Forward updates the lesson. A chapter without an overview opens its first subchapter. Unknown sections fall back to the chapter overview or first subchapter; unpublished/unknown chapters fall back to the first published chapter. Lesson state resets when navigating between pages. Navigation imposes no gates or scores.

Keep IDs stable, unique within their parent, and URL-safe (lowercase words and hyphens). Subchapter IDs can repeat across different chapters. No routing dependency, backend or CMS is needed.

Before publishing a nested chapter, verify its direct links, Back/Forward, selected navigation state, keyboard access and phone layout. Each subchapter should have its own heading, explanation, visual experiment and concise summary. Numerical fixtures and routing behavior belong in focused tests.

The shell adds Previous/Next links across published pages, updates the document title, focuses the lesson region and returns to the top when the active lesson changes. On narrow screens the current chapter's subchapter links appear above the lesson as a horizontal strip; desktop keeps the nested sidebar links. The deferred end-of-project table of contents is separate from this basic lesson navigation (see `todo.md`).

Desktop is the primary supported design target (user preference, 2026-10-16). Keep basic narrow-screen behavior but do not spend chapter implementation time on phone-specific polish or exhaustive phone QA.
