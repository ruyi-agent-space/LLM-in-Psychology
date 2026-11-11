# GitHub Pages readiness · 2026-11-11

Verified starting state: private source repository, `has_pages=false`, main `b6d90253a357c7fb6ed8265f46c3f1be78d0d2d4`. No website has been published by this change.

## Audience and account prerequisites

A private source repository does not make its Pages website private. GitHub Pro/Team can host from private repositories, but visitor access remains public unless the organization has Enterprise Cloud access control and explicitly chooses Private. Organization plan and private-Pages entitlement have not been verified.

- [Pages access control](https://docs.github.com/en/enterprise-cloud@latest/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site)
- [Publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Enterprise Cloud Pages API](https://docs.github.com/en/enterprise-cloud@latest/rest/pages/pages#update-information-about-a-github-enterprise-cloud-pages-site)

Before enabling deployment, an authorized administrator must verify Enterprise Cloud eligibility and organization permission to create private project sites; configure Pages Source as GitHub Actions and its visitor visibility as Private; then verify Pages metadata has `public:false` and `build_type:workflow`. Keep the repository private. Use the actual returned private URL; do not assume the public Finance-style URL.

Current connected tools manage repository contents and PRs but do not expose Pages administration or organization-plan settings. No local execution environment is available. Administrative settings have not been changed.

## Prepared workflow

`.github/workflows/pages.yml` validates the app and creates a private downloadable artifact. Deployment is disabled unless the repository variable `PSYCHOLOGY_PAGES_MODE` is explicitly `private`. The guard then requires both repository and Pages privacy to be verified. Missing configuration, permission errors, public visibility or unknown privacy stop deployment. The workflow does not create Pages or change visibility.

After an authorized administrator confirms private access, set that variable and run the Pages workflow. It uses the existing `github-pages` environment and Pages/OIDC permissions. Environment protection may require approval. OIDC authenticates deployment; it does not control visitor access.

## Refresh and deployment order

The radar refresh remains at 06:00 UTC, with weekly counts on Monday and missed-update recovery. Pages listens for successful main-branch radar workflow completion, validates latest main, and deploys the exact checked artifact. PR runs cannot deploy. Source changes and manual dispatch can also validate the site.

A data commit made with `GITHUB_TOKEN` does not trigger another push workflow. The completion trigger avoids that gap. [GitHub trigger rules](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow)

A failed refresh is not published. The previous site remains with date-based stale warnings. A successful partial-source refresh may deploy with its partial-coverage warning. Counts and metadata selection do not establish research quality.

## Acceptance evidence still required

- Read back repository privacy and Pages `public:false`.
- Record a successful deployment and actual private URL.
- Verify an authorized reader can view it, while anonymous/no-access visitors cannot fetch HTML or JS/data.
- Verify project-path assets, desktop/mobile controls, node links and downloaded JSON.
- Verify a real refresh completion leads to a real Pages deployment; cron configuration alone is not proof.

The existing [post-merge radar run](https://github.com/ruyi-agent-space/LLM-in-Psychology/actions/runs/42974835666) succeeded and updated data at 06:47:03 UTC. It did not deploy Pages. arXiv remained in 429 cooldown; Europe PMC reached its 300-record cap.

If public visitor access is preferred, obtain explicit approval. Publishing the website exposes its HTML, browser code and bundled research data even if git history stays private. Making the repository public is a separate, broader change exposing repository contents and history; it is not required for private Pages.
