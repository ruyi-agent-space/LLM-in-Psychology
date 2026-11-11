# Validation record

## Local checks · 2026-11-11

- Python 3.12: 27 offline tests passed, covering graph integrity, date/source references, JSON/browser wrapper equality, all required support paths, metadata parsing, relevance, transitive deduplication, freshness, diversity, failure preservation and missed-Monday recovery.
- `node --check site/app.js` passed.
- Cloud-browser QA at desktop width: graph renders all 60 nodes and 174 links; node selection shows lower-panel detail; empty-search state works; reset and navigation work; Weekly/Daily/Challenges/Evidence content renders; challenge disclosure expands.
- Mobile QA in a real 390px iframe viewport: reading cards and graph controls adapt; body client/scroll widths both 375px (15px browser scrollbar), so no document-level horizontal overflow. The wide network and top navigation intentionally scroll within their containers. Developmental filter returned 16 nodes and 23 links.
- Nine bibliography entries rendered with the explicit 2025-11-11 to 2026-11-11 review window.
- JSON export click was exercised, but the browser's download-event capture timed out; downloaded-byte readback is not verified. Export logic is local Blob/JSON generation; no network upload.
- Browser console entries observed were extension metadata errors, not application errors. This is a manual smoke test, not an exhaustive accessibility or cross-browser certification.

## Real automation verification

First real run: https://github.com/ruyi-agent-space/LLM-in-Psychology/actions/runs/42956686052

- All 21 initial tests passed in GitHub Actions.
- Europe PMC returned 300 records; arXiv returned HTTP 429.
- The workflow correctly wrote a source warning, preserved the seed daily readings, generated a visibly partial weekly sample, committed the output as `54648c7c35d37f9f0d8dfebb1a8ad4e033bd746f`, and uploaded the private downloadable artifact.
- That first run intentionally concluded failure because the original policy required every source to succeed.
- The next version permits explicitly marked partial-coverage daily refresh, while separately retaining last-complete timestamps. HTTP 429 now stops immediate retries and persists a 24-hour source cooldown. Its 27 offline tests pass. Follow-up real run succeeded: https://github.com/ruyi-agent-space/LLM-in-Psychology/actions/runs/42957212022

- All 27 tests passed on GitHub Actions.
- Europe PMC returned 300 records and the daily list refreshed to three real candidates at `2026-11-11T04:08:06Z`.
- arXiv was correctly deferred without another request until `2026-11-12T04:03:16Z`. Coverage remains explicitly partial; no full-source-success timestamp is fabricated.
- The data commit is `de1264a4d8f3281374ecd559bb7941e92b3ad2c0`; generated JSON was read back from GitHub. The five weekly entries retain their `2026-11-11T04:03:16Z` sample date and partial-source labels.
- The private `psychology-dashboard` artifact was uploaded (ID `13828025534`, ZIP SHA-256 `02b1fe1e0b4fc40af8d414eaaabbb89d436c3a994a2dedf8aa2a1c96de9d6883`).
- The scheduled workflow is installed for daily 06:00 UTC runs. Successful manual/push verification proves the pipeline ran, not that future source availability or GitHub scheduling is guaranteed.
- Repository metadata was rechecked: private, `has_pages: false`.

## Evidence limitations

The bibliography is a targeted, curated map, not an exhaustive systematic review. Publication dates were checked on primary publisher/conference/preprint pages. Narrative frameworks and guides are not relabeled as systematic reviews. All graph edges are editorial hypotheses; coverage and citations do not establish clinical efficacy, causal mechanisms or suitability for individual psychological assessment. Developmental/child longitudinal evidence remains incomplete.

## Strict review candidate · 2026-11-11

The nine baseline bibliography entries were independently checked at their original pages; substantive limitations and uneven domain coverage are documented in [REVIEW-AUDIT.md](REVIEW-AUDIT.md). The candidate retains 60 nodes and 174 relationships, corrects clinical privacy filtering, and adds individually selected context references and explicit unverified relationship rationales.

The candidate's JavaScript syntax, weekly sorting, clinical privacy path and empty-search behavior were exercised in V8. This is not a fresh browser QA run. Python execution is unavailable locally in the review thread; the candidate was therefore verified through read-only PR CI. The exact result and live-preview limits are recorded below.

Automatic approval review rejected moving `main`: it required explicit authorization for a default-branch commit. Main therefore remains unchanged; the candidate is being retained for review separately. Publication and Pages remain disabled.

### Verified PR run

[Run 42959759143](https://github.com/ruyi-agent-space/LLM-in-Psychology/actions/runs/42959759143), code commit `fc1f5887f6462ecc013d7a05227f260b6acd7f15`:

- 38 Python tests passed, including earliest retrieved version dates, future-version exclusion, screening-policy recovery, source-failure preservation and auditable weekly papers.
- 6 Node tests passed: four view-model cases and two simulated-DOM application cases. The latter exercise actual node selection, related-button binding, filtering and exported JSON bytes; they are not browser or accessibility tests.
- JavaScript syntax checks passed.
- Rebuilding curated data reported 60 nodes / 174 edges and produced no generated-file differences.
- The read-only metadata preview succeeded with explicit **partial** coverage. It fetched 300 Europe PMC records, deduplicated to 296, and retained 43 eligible candidates. Europe PMC reached its configured cap; arXiv remained deferred under the existing cooldown.
- Three new reading candidates were selected at `2026-11-11T04:31:19Z`: psychotherapy-session assessment, radiology education learning outcomes (adjacent education domain), and a qualitative human-centered pedagogy study. These are metadata candidates, not quality-reviewed recommendations.
- Weekly sample counts were methods 4, cognition/social behavior 4, clinical 3, measurement 2, education 1. Counts cover five preset categories and the available capped sample, not a global top five.
- A [private review preview](https://github.com/ruyi-agent-space/LLM-in-Psychology/actions/runs/42959759143/artifacts/13827779237) was uploaded. Artifact ID `13827779237`; ZIP SHA-256 `0da57899238b292d48e84ecae252fc49e1205205f0848e3bc814dc9c11d6b609`; expires 2026-11-25.
- The PR job used contents-read permission. The main refresh job was skipped, and no refreshed preview data was committed to main or the review branch.

The initial PR run exposed a metacognition substring-classification error, which was corrected. Independent review also caught related-button binding and future-linked-version bugs; dedicated regressions now pass. Browser QA has not been repeated for this candidate. Main remains at the separately reviewed baseline until explicitly authorized.
