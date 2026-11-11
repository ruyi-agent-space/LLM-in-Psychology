# Strict review of the Psychology atlas · 2026-11-11

Baseline: `a42ef0fab891a296e27fc658fb849be4f63d17bb`. The repository was verified private with `has_pages: false`; publication was not enabled.

## Evidence and scope

All nine baseline bibliography entries resolved to primary publisher, conference or preprint pages. No definite title, DOI or cited-version date error was found. Three evidence limitations required correction:

- [Learning psychology review](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2026.1974520/full): single-author extraction/coding, no independent verification and no formal quality or risk-of-bias assessment. Search cutoff: 2026-06-16.
- [Pedagogy umbrella review](https://link.springer.com/article/10.1186/s40561-026-00449-x): the abstract reports 50 reviews, while the selection arithmetic and quality groups each total 49. The atlas flags the inconsistency rather than changing the author's total. Search cutoff is 2025-08; the search also covers non-LLM chatbot/ITS work.
- [Dual-validity review](https://www.annualreviews.org/content/journals/10.1146/annurev-psych-100925-034807): 2026-08-10 is the cited journal version's online-first date. The work was already public as a 2025-06-20 [preprint](https://arxiv.org/abs/2506.16697).

Added a mental-health narrative review, a safety scoping review and GUIDE-LLM reporting guidance. The bibliography now contains 11 cited versions within the preferred window plus one older foundational preprint; these are not 11 newly originated works or independent efficacy studies.

Coverage remains uneven. Education and adjacent educational technology are prominent. Child longitudinal outcomes, older-adult and organizational psychology lack independent review coverage. The qualitative-review PDF returned 403 during the review; its date and summary were checked at abstract level, not its full methodology.

## Graph corrections

The baseline assigned all seven domains and the same eight sources to every technology. Technology use contexts and node background references are now selected individually. The clinical filter retains consent/privacy governance and its screening constraint.

All 174 relationships remain **unverified editorial hypotheses**. Each has a directional rationale; six have an explicitly identified review-context location. Others say that direct relationship sources have not been verified. Context citations do not establish that an edge is necessary, effective or safe. Developmental gaps have machine-readable fields.

Challenge tests are stored with the curated questions instead of depending on display-array positions. Clinical safety explicitly measures multi-turn risk misses, over-alerting, escalation completion, delay, adverse events and harmful agreement. Professional supervision does not replace prospective validation. Educational dependence is kept within learning/autonomy scope; emotional dependence is not inferred from education reviews.

## Radar corrections

The baseline weekly order was fixed despite counts 3, 8, 2, 0, 16. The view now sorts the five preset categories by deduplicated sample count, shows zero/unknown separately and exposes the counted papers.

Metadata screening now requires an LLM title signal or at least two abstract mentions. Education additionally requires psychological-process or learning-outcome signals. Cognitive/social research is no longer labeled as necessarily human simulation. PTSD terminology is included in the clinical vocabulary.

Observed examples motivated the changes: the baseline education sample included a nursing RAG review and an ophthalmic question-answering readability study. DP-LENS is legitimate adjacent HCI/cognitive-load research, but its presence does not establish human simulation. Its earlier July preprint also illustrates why a November journal date cannot guarantee a newly originated work.

Retrieved versions are grouped before date filtering, excluding missing/future-dated versions before choosing the linked representative. The earliest observed group date is retained alongside the linked record's date and version list. Earlier unobserved versions may still exist because queries are capped; the UI and methodology state this limitation. Weekly papers, matching signals, query definitions, candidate counts and cap indicators are retained for audit. Policy changes rebuild the weekly snapshot.

## Validation and maintenance

JavaScript syntax was independently compiled in V8, and sample-count sorting, the clinical privacy path and empty search were exercised against the committed-data candidate. These are not browser tests.

The workflow now also runs four Node view regressions and two simulated-DOM application regressions, checks JavaScript syntax, and rebuilds graph/bibliography artifacts to reject generated-data drift. Python regression fixtures cover the new screening, version-date and audit-record behavior. The exact Actions outcome is recorded in VALIDATION.md after the run. Old-policy weekly counts are withheld until recomputed; the PR job can produce a private preview without updating main.

The downloaded dashboard remains a static local snapshot. Automatic updates occur in the private repository and downloadable artifact; a previously downloaded copy does not synchronize itself. arXiv's existing 429 cooldown is retained. A successful partial workflow does not establish complete provider coverage or guarantee future schedules.
