# LLM in Psychology · Research Atlas

A private, evidence-aware research dashboard connecting **foundation technology → reusable function → psychology task**. It follows the Finance dashboard's full-width network-first layout, with top navigation and supporting detail below the graph. No right sidebar, no diagnostic chatbot, no patient-data input, and no analytics.

## Open the dashboard

1. Download this repository using GitHub's **Code → Download ZIP**, then extract it.
2. Open `site/index.html` in a modern browser. All application data is bundled locally; no installation is necessary.
3. For the newest automatically refreshed data, download the repository again, or download the `psychology-dashboard` artifact from the latest [Actions run](https://github.com/ruyi-agent-space/LLM-in-Psychology/actions).

**This repository is private. No GitHub Pages or public website is enabled. A downloaded local copy does not automatically synchronize with GitHub.** External source links open their respective public publisher pages; dashboard data stays local.

## What is included

- **Network:** 60 nodes (18 technologies, 24 functions, 18 tasks) and 174 typed directed links. Search, seven-domain filters, relationship filters, zoom, keyboard-accessible node inspection, related-node navigation and filtered JSON export.
- **Weekly Spots:** five curated research directions. Automatic counts describe papers first published in the last seven days within the fetched metadata sample, not exhaustive field rankings.
- **Daily Spots:** three reading candidates selected for recency, topic relevance and direction diversity. Original publication and revision dates remain separate.
- **Core Challenges:** ten evidence-linked questions, each with a concrete evaluation approach.
- **Evidence:** eight sources first published within **2025-11-11 to 2026-11-11**, plus one explicitly older foundational preprint. Narrative reviews, methodological guides, systematic reviews and meta-analyses are separately labeled.

Covered domains: psychometrics, cognition/decision-making, social/personality psychology, clinical/counseling support, qualitative/research methods, education/learning and development. Developmental and children's longitudinal evidence remains explicitly under-supported.

## Evidence policy and safety

Every edge is an **editorial design hypothesis**, not an established dependency, causal mechanism, or efficacy claim. Source citations establish relevant context only. This is a curated evidence map, not an exhaustive systematic review or clinical recommendation.

- Human questionnaire scores do not establish a model's human-like psychological construct.
- Synthetic participants do not replace real people; behavioral fit does not establish cognitive mechanism equivalence.
- Clinical use requires qualified professional responsibility and prospective safety/effectiveness evaluation.
- Do not upload identifiable interviews, clinical records, or private information about minors. The dashboard does not accept those inputs.
- First-online publication dates determine the review window. A 2027 volume may contain a 2026 online-first article; a 2026 preprint revision does not erase a 2025 first publication.

## Automatic refresh

`.github/workflows/refresh.yml` runs **daily at 06:00 UTC**. Weekly sample counts update on Monday and catch up after a missed or failed Monday. A workflow change or manual dispatch also runs verification. GitHub schedules may be delayed.

The stdlib script retrieves public Europe PMC and arXiv metadata, validates dates, deduplicates DOI/title/source IDs, selects three recent candidates and records source status. It calls no model API, uses no personal data and needs no external secret. Its built-in workflow token has only `contents: write`. The workflow commits generated radar data and provides a downloadable static dashboard artifact, without publishing the repository.

If a source fails, previous successful content and timestamps remain intact. If fewer than three candidates qualify, the script does not invent a complete daily list. The page warns about source failures and stale data. Curated reviews, challenges and graph mappings are maintained separately, never overwritten by automated metadata screening.

See [automation details](docs/AUTOMATION.md) and [validation record](docs/VALIDATION.md).

## Maintain and test

```sh
python -m unittest discover -s tests -p 'test_*.py' -v
node --check site/app.js
python scripts/build_data.py
python scripts/refresh.py --force-weekly
```

`build_data.py` regenerates `data/graph.json`, `site/graph-data.js` and `site/research-data.js`. Update curated reviews in `data/research.json`. The refresh script writes only `data/radar.json` and `site/radar-data.js`. Tests ensure JSON/browser wrappers match, source references resolve, every task has support, dates are valid, and all graph links retain explicit evidence boundaries.

## Repository structure

- `site/`: standalone browser application
- `data/graph.json`: canonical network
- `data/research.json`: curated sources, directions and challenges
- `data/radar.json`: generated reading candidates, sample counts and freshness status
- `scripts/`: reproducible dataset build and metadata refresh
- `tests/`: offline data-integrity and updater fixtures
- `docs/`: methodology, automation and verification records

No public-hosting configuration is included. Any future publication must preserve the user's intended audience and separately address synchronization.
