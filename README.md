# LLM in Psychology · Research Atlas

A private, evidence-aware research dashboard connecting **foundation technology → reusable function → psychology task**. It follows the Finance dashboard's full-width network-first layout, with top navigation and supporting detail below the graph. No right sidebar, no diagnostic chatbot, no patient-data input, and no analytics.

## Open the dashboard

1. Download this repository using GitHub's **Code → Download ZIP**, then extract it.
2. Open `site/index.html` in a modern browser. All application data is bundled locally; no installation is necessary.
3. For the newest automatically refreshed data, download the repository again, or download the `psychology-dashboard` artifact from the latest [Actions run](https://github.com/ruyi-agent-space/LLM-in-Psychology/actions).

**This repository is private. No GitHub Pages or public website is enabled. A downloaded local copy does not automatically synchronize with GitHub.** External source links open their respective public publisher pages; dashboard data stays local.

## What is included

- **Network:** 60 nodes (18 technologies, 24 functions, 18 tasks) and 174 typed directed links. Search, seven-domain filters, relationship filters, zoom, keyboard-accessible node inspection, related-node navigation and filtered JSON export.
- **Weekly Spots:** five curated research directions, ordered by the last seven days' deduplicated sample counts. Expand each count to inspect titles, links, dates and matching signals. This is a ranking within five preset categories, not the field's top five.
- **Daily Spots:** three reading candidates selected for recency, topic relevance and direction diversity. Original publication and revision dates remain separate.
- **Core Challenges:** ten evidence-linked questions, each with a concrete evaluation approach.
- **Evidence:** eleven sources with the cited version published within **2025-11-11 to 2026-11-11**, plus one explicitly older foundational preprint. A recent journal version may have an older public preprint. Narrative reviews, methodological guides, systematic reviews and meta-analyses are separately labeled.

Covered domains: psychometrics, cognition/decision-making, social/personality psychology, clinical/counseling support, qualitative/research methods, education/learning and development. Developmental and children's longitudinal evidence remains explicitly under-supported.

## Evidence policy and safety

Every edge is an **unverified editorial design hypothesis**, with a direction and a stated rationale. Selected edges include review context and section descriptions; other edges explicitly lack verified direct relationship sources. These are not established dependencies, causal mechanisms, or efficacy claims. Node references are individually selected, not bulk-inherited from domains. Cross-cutting technologies appear through connections, and domain labels describe editorial uses rather than evidence strength. This is a curated evidence map, not an exhaustive systematic review or clinical recommendation.

- Human questionnaire scores do not establish a model's human-like psychological construct.
- Synthetic participants do not replace real people; behavioral fit does not establish cognitive mechanism equivalence.
- Clinical use requires qualified professional responsibility and prospective safety/effectiveness evaluation.
- Do not upload identifiable interviews, clinical records, or private information about minors. The dashboard does not accept those inputs.
- The first-online date of the **cited version** determines the review window; it is distinct from the work's first public preprint. A 2027 volume may contain a 2026 online-first article; a 2026 preprint revision does not erase a 2025 first publication.

## Automatic refresh

`.github/workflows/refresh.yml` runs **daily at 06:00 UTC**. Weekly sample counts update on Monday and catch up after a missed or failed Monday. A workflow change or manual dispatch also runs verification. GitHub schedules may be delayed.

The stdlib script retrieves public Europe PMC and arXiv metadata, groups retrieved DOI/title/source-ID versions before date filtering, and retains the earliest known retrieved date. It cannot guarantee finding every older version. Education requires learning/psychological-process signals, while cognitive research is kept distinct from claims of human simulation. Daily and weekly snapshots preserve audit metadata, coverage and per-source status. It calls no model API, uses no personal data and needs no external secret. Its built-in workflow token has only `contents: write`. The workflow commits generated radar data and provides a downloadable static dashboard artifact, without publishing the repository.

If one source fails but another supplies at least three eligible candidates, a clearly labeled partial-coverage reading list can still refresh; the last fully covered success time is retained separately. All-source failure or fewer than three candidates preserves the previous daily content and date. HTTP 429 triggers a 24-hour cooldown rather than rapid retries. The page warns about partial coverage, source failures and stale data. Curated reviews, challenges and graph mappings are maintained separately, never overwritten by automated metadata screening.

See [automation details](docs/AUTOMATION.md) and [validation record](docs/VALIDATION.md).

## Maintain and test

```sh
python -m unittest discover -s tests -p 'test_*.py' -v
node --check site/app.js
node --check site/view-model.js
node --test tests/test_view.cjs
python scripts/build_data.py
python scripts/refresh.py --force-weekly
```

`build_data.py` regenerates `data/graph.json`, `site/graph-data.js` and `site/research-data.js`. Update curated reviews in `data/research.json`. The refresh script writes only `data/radar.json` and `site/radar-data.js`. Tests ensure JSON/browser wrappers match, source references resolve, every task has support, dates are valid, all graph links retain explicit evidence boundaries, clinical filtering retains privacy constraints, weekly counts sort correctly, and known older versions cannot reappear as new publications. The workflow also rebuilds curated data and rejects an uncommitted generated-data difference.

## Repository structure

- `site/`: standalone browser application
- `data/graph.json`: canonical network
- `data/research.json`: curated sources, directions and challenges
- `data/radar.json`: generated reading candidates, sample counts and freshness status
- `scripts/`: reproducible dataset build and metadata refresh
- `tests/`: offline data-integrity and updater fixtures
- `docs/`: methodology, automation and verification records

No public-hosting configuration is included. Any future publication must preserve the user's intended audience and separately address synchronization.

## Review audit

See [the strict review and remaining limits](docs/REVIEW-AUDIT.md). Recent publication is not evidence of methodological quality: the learning review lacks independent coding and formal quality appraisal; the pedagogy umbrella review has internally inconsistent study counts and a 2025 search cutoff. Developmental, child longitudinal, older-adult and organizational psychology coverage remains incomplete.
