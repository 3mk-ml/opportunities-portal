# GitHub Pages Deployment

Repository: https://github.com/3mk-ml/opportunities-portal

## One-time repository setup

1. Open https://github.com/3mk-ml/opportunities-portal/settings/pages while signed in to the repository owner's account.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Open https://github.com/3mk-ml/opportunities-portal/actions/workflows/pages.yml.
4. Choose **Run workflow**, select **main**, and run it.
5. Confirm the workflow completes successfully. The deployment job displays the published site URL.

Expected URL after successful deployment: https://3mk-ml.github.io/opportunities-portal/

The URL is not evidence of a successful deployment. A failed Configure GitHub Pages step with a Not Found response usually means the one-time Pages configuration is still required.

## Future updates

Push reviewed project changes to main. The workflow validates the dataset, runs the existing self-tests and integration tests, checks JavaScript syntax and HTML, prepares the static artifact, and deploys it. Failed validation blocks deployment. No dependency installation or application build step is required.

Only index.html, detail.html, about.html, sw.js, css/, js/, assets/, and data/opportunities.json are included in the website artifact. Development scripts, documentation, review packages, and Git history are not included in the public site artifact.

## Typography

The original IBM Plex Sans Arabic Google Fonts stylesheet references remain unchanged in all three HTML pages. No font files were removed, replaced, or added. The current Service Worker caches same-origin application assets; it does not guarantee offline availability of the externally hosted font.

## Upload repair

Six source files cut short during an earlier transfer were restored from the original user-uploaded ZIP with SHA-256 verification. The temporary recovery workflow and payload have been removed after successful restoration. The deployment workflow does not modify repository content.

## Verification scope

Passing automated data checks validates the supplied structure and recorded verification fields. It does not independently establish human source review or guarantee current scholarship eligibility. Browser, real-device, and offline tests remain separate from the Node.js integration checks.
