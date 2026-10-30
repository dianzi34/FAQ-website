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

The site currently displays 18 FAQs. Stress has ten (five per audience), Sleep has three loved-one questions. Eight questions have optional video links, using five distinct videos.

- `src/data/faqs.json`: preserve all 44 original records. This is the archive; only selected records appear online.
- `src/data/pilot.json`: `ids` selects the 13 visible original records; `videos` maps FAQ IDs to optional videos. To restore an archived FAQ, add its existing ID here.
- `src/data/resource-faqs.json`: five new source-derived Stress FAQs; all records here appear online. Use unique IDs, existing category/audience values, question, answerText, sourceUrl, origin and reviewStatus.
- `src/App.jsx`: navigation, filtering and rendering.
- `src/App.css`: styling and responsive layout.
- `content/PILOT.md`: current decisions and historical context.

Videos are optional. Verify the topic and actual YouTube watch URL; retain the provider page as `resourceUrl`. Unmatched questions have no video section. Do not invent new medical advice. Source-derived answers retain attribution and `needs_clinical_review` status.

The original archive has a documented swallowing-advice exception (faq-25). `content/source-rows.json` contains original unreviewed wording and is not imported by the app. Older restoration documents describe historical states.

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
