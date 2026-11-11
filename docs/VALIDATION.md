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
