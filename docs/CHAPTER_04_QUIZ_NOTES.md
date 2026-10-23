# Chapter 04 quiz adaptation

Source: `../04. Preliminary Data QA/11.1 QUIZ Preliminary Data QA.html`, embedded `quizData`: **13** questions, four options each, one correct response. Original files remain unchanged. Source feedback strings are empty; explanations are authored for this companion.

Preserve source topic order and answer positions. Changes: Q2 distinguishes arbitrary random replacement from defensible statistical imputation; Q3 explicitly excludes NA; Q6 asks for minimum/maximum (2, 20), distinguishing the numerical range of 18; Q7 supplies a concrete right-censoring cutoff; Q9 describes pivoting more precisely; Q12 replaces the unsupported claim that employee ages are left censored with an explicit under-18 bound (distinguishing truncation); Q13 supplies active subscriptions at the cutoff rather than implying cancellation rates are intrinsically censored. Q8 retains the course's general long-table preference with a task-dependent explanation. Q11 notes distinct-count whitespace behavior depends on the tool.

Quiz is the final lesson, 4.7. All questions and other lessons remain freely navigable. Answers are checked individually; feedback shows the correct answer and explanation; retries and full reset are available. State is local to the mounted page and resets when leaving/reloading. Score describes current checked answers, not a permanent attempt record.

Review: source IDs/order/answer positions checked against the embedded data. No external content or HTML execution is required.

Validation: full check passed (119 tests and production build); added quiz routing regression passed (23 routing tests). Browser verification could not run: agent-browser daemon failed to start and the computer-use browser inventory is empty. Desktop appearance and live interactions still need a browser pass.

Follow-up header check: browser access succeeded outside the sandbox. Inspected quiz at 1280px and 1000px; checked an answer and confirmed its explanation. Fixed the header endpoint tick painting over the current-lesson marker; explicit grid areas keep header regions separate. Geometry checks found no header overlaps at either width and no page overflow at 1000px. Full check now passes 120 tests plus production build; diff check passes. Full quiz retry/reset coverage remains outside this browser spot check.
