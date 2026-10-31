# Chapter 9 review

Preview: http://127.0.0.1:4173/#chapter-09

All 25 lessons follow the existing sidebar identifiers and source sequence. Chapter 10 remains an outline. New work is limited to this app directory.

## What to review

- KNN: vary K, inspect selected neighbors and the class vote; Spotify case follows the video’s query (scaled tempo 25, key 60).
- Naïve Bayes: inspect class frequency denominators; toggle the three customer features and follow the products into normalized scores.
- Trees: compare entropy and weighted information gain, trace a customer’s path, then inspect tree votes and a subscription split.
- Logistic regression: read probability versus observed label, vary the threshold, trace coefficients into the sigmoid, and compare summed log-likelihood. Luxe Dining includes all 624 customer observations and the supplied workbook coefficients.
- Sentiment: toggle cleaning rules, follow word-presence flags, and compare predictions with held-out human labels.

## Evidence and limits

Source mapping and departures are documented in `docs/CHAPTER_09_SOURCES.md`. Browser review uses a 1440 × 1100 desktop viewport. All 25 routes rendered without document-width overflow. Representative screenshots are saved alongside this note.

Controls were exercised with browser DOM click events and native keyboard arrows/Home/End for sliders. The automation tool’s pointer dispatch was unreliable in earlier chapter reviews; this review does not claim a complete native-pointer audit. Verified displayed changes include Bayes newsletter-on purchase score 25.4%, zero information gain for the balanced gender split, flat logistic log-likelihood −8.318, unsubscribe probability 66.4% at nine weekly emails, 0 false positives / 3 false negatives at a 90% spam threshold, removal of negation from prepared text, and separate held-out sentiment labels.

The logistic case reads supplied workbook coefficients; the other compact model demonstrations explain mechanics rather than claiming production evaluation. Sentiment weights are explicitly illustrative. The course’s summed agreement measure is distinguished from actual likelihood (product of probabilities / sum of log-probabilities).

Final checks: `rtk npm run check` passed all 57 tests across 12 files, TypeScript, and the production build. `rtk git diff --check` passed. A final browser sweep confirmed all 25 routes have rendered headings, valid lesson label references, and no document-width overflow. The Spotify default vote is 13 Listened, 6 Skipped, 1 Favorited; Customer D’s tree route reaches Stay through Age > 35 → No. Vite retains its existing large-chunk advisory.
