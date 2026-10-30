# Caregiving FAQs

React + Vite static website. Production: https://caregiving-faqs.pages.dev/

## Local development

Use Node.js 22 LTS and npm. No application credentials are required.

```sh
npm ci
npm run dev
```

Before submitting changes, run `npm test` and `npm run build`. Build output is `dist/`; `npm run preview` serves the build locally.

## Editing content

The current website has only Stress and Sleep tips pages, each with For My Loved One / For Myself switching. All tips are visible immediately. No videos, FAQ questions, accordions, or category landing page.

- `src/data/self-tips.json`: the user's complete supplied text: 11 Stress items (including the help paragraph) and 11 Sleep items. Preserve wording, section order, numbers and reference markers. Sleep references now use per-tip `references` arrays (number + original URL). Both Stress and Sleep references use the supplied per-tip URLs; preserve the original destinations and timestamps.
- `src/data/loved-one-tips.json`: original loved-one Stress/Sleep answers converted to tip lists without questions. sourceId records provenance.
- `src/App.jsx`: direct topic routes, audience switching and list rendering.
- `src/App.css`: responsive layout and text sizing.

Old FAQ data, pilot selection and video mappings are archived and NOT imported by the current application. They are not the active editing source. See content/TIPS.md.

Two direct links: `/#topic=stress` and `/#topic=sleep` default to For Myself. Add `&audience=care_recipient` for the loved-one view. Existing stress/sleep links with explicit audiences remain supported.

## Team workflow

1. Clone the repository and run `npm ci`.
2. Create a branch, for example `git switch -c content/stress-update`.
3. Edit and preview locally.
4. Run `npm test` and `npm run build`. When an approved content selection changes, update the selection assertions and this README together.
5. Push the branch and open a pull request for teammate review.

Do not commit node_modules, dist, .env files, tokens or deployment credentials.

## Publishing

The current Cloudflare Pages project `caregiving-faqs` uses Direct Upload. A Git push does NOT automatically update the live website; repository-based deployment has not been configured.

Build with `npm run build`, then upload the contents of `dist/` (or a ZIP with index.html and assets/ at its root) as a Production deployment to the existing project. Keep this project to retain the public URL. CI/Wrangler automation can be configured separately with reviewed repository secrets.

`.openai/hosting.json` belongs to the old ChatGPT Sites host, not current Cloudflare hosting. Do not publish updates to the old host.

Direct links use hash routes, for example `/#topic=stress&audience=caregiver` and `/#topic=sleep&audience=care_recipient`. No server rewrite rules are needed.
