# Public GitHub Pages

Target: https://ruyi-agent-space.github.io/LLM-in-Psychology/

The repository was verified public with Pages enabled before preparing this deployment. Only `site/` is published. Its seven files were checked for credentials, individual records and nonpublic clinical/interview content; the reviewed content is a research map plus public paper metadata. This is a scoped inspection, not a guarantee about all repository history.

## Update order

The radar runs at 06:00 UTC and recomputes weekly counts on Monday or after a missed update. A successful main radar workflow completion triggers the Pages workflow. It checks latest main, runs the data and browser tests, and publishes the exact checked artifact. Source changes or manual dispatch can also deploy. PR runs only validate.

This completion trigger is required because pushes made with `GITHUB_TOKEN` do not trigger another push workflow. A failed radar run does not replace the site; its last snapshot retains date-based stale warnings. Successful partial-source refreshes retain their visible partial-coverage status.

## Deployment checks

The guard verifies the original repository is public, the existing Pages site is public, its source is GitHub Actions, and its URL matches the expected project site. It does not create Pages or change visibility. A missing setting or insufficient permission stops deployment with the exact failing step.

The deployment uses `github-pages`, Pages write and OIDC permissions, a unique artifact name and an artifact-availability check. The deploy checkout is pinned to the validated source SHA. The workflow then opens the actual deployed URL in anonymous Chromium at desktop and narrow widths, checks project-path assets, navigation, JSON bytes and document overflow.

A cron entry is not proof of a completed scheduled publication. Deployment and live-check evidence must be read from the actual Pages run. If the repository audience is changed later, reassess the existing website's audience separately; the guard only controls new deployments.

## Administrative settings

In Settings > Pages, Source must be GitHub Actions. If it is not, an administrator must change that setting. Existing connected repository tools do not expose Pages administration; the workflow will report its read-back configuration. Do not change repository visibility to bypass a settings failure.

Official references: [custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [trigger rules](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow).
