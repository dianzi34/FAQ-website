# Caregiving FAQs

An accessible English-language caregiving FAQ MVP, implemented from `faq_prd.pdf` and the supplied NEU FAQ table. React + Vite + plain CSS, entirely static. No accounts, backend, database, tracking, or API calls in core interactions.

## Run locally

Node.js 20.19+ or 22+ recommended.

```sh
npm install
npm run dev
```

Open the URL printed by Vite. Build using `npm run build`; output is `dist/`. `npm run preview` serves the production build. `npm test` validates content coverage, search behavior, source traceability, and review metadata.

## MVP behavior

- Six topic categories; Stress and Sleep switch between loved-one and caregiver perspectives.
- Native keyboard-accessible FAQ accordions, live search of questions and answers across every topic, empty states, and a clear return path.
- A− / A+ adjust the root text size from 18 to 24px. Browser zoom remains available.
- Responsive layouts, visible focus rings, labeled search, a skip link, and 44px primary touch targets.
- Topic/perspective URLs use hash routing, including browser Back/Forward and refresh.
- About and medical disclaimer sections; no institutional endorsement.

## Edit content

Edit `src/data/faqs.json`, not React components. Every entry requires a stable unique `id`, one of the six existing `category` strings, `audience` (`caregiver` or `care_recipient`), `question`, 2–4 short `steps`, `note`, `sourceUrl` (URL or null), and `reviewStatus`. Keep draft guidance marked `needs_clinical_review`. This MVP deliberately labels every displayed answer as a draft: a future reviewed release must implement and verify explicit approval handling before changing that label.

Add a new JSON object to add a question; edit its fields to update it; remove the object to remove it. Run `npm test` and `npm run build` after editing. Existing questions preserve source row references in `sourceRows`. `origin` distinguishes the supplied table from new drafts. Avoid collecting any personal health information.

## Content provenance and review

`content/source-rows.json` retains all 44 original table rows for editorial comparison. It is **not imported by the application**; it contains original unreviewed and potentially unsafe wording. Six overlapping table rows are merged; one break-related row is incorporated into a required new draft, leaving 37 imported entries plus 12 new drafts (49 total). `content/CLINICAL_REVIEW.md` lists all questions and prioritizes swallowing, wandering, driving, medication safety, hallucinations, and progression. Some original advice was deliberately replaced with more cautious wording; changes are recorded, not silently treated as validated.

Sources were checked on 2026-10-22. Source links indicate reference guidance, not clinical approval or endorsement. All entries need qualified review before a public health-information launch. The MVP is privately hosted through Sites for review.

## Static deployment

### Cloudflare Pages

1. Push this `care-together` project to a GitHub repository.
2. In Cloudflare Pages, connect that repository and choose the production branch.
3. If the repository contains this project as a subfolder, set the root directory to `care-together`; otherwise use the repository root.
4. Set build command to `npm run build` and output directory to `dist`.
5. Use a supported Node.js version, deploy, then open the `pages.dev` URL shown in the project dashboard.
6. Later pushes to the production branch trigger new deployments automatically. No domain purchase is needed.

### GitHub Pages

Use a GitHub Actions workflow to install with `npm ci`, run `npm run build`, and upload `dist` using the Pages artifact/deploy actions. `base: './'` in `vite.config.js` allows subdirectory hosting. Hash routes do not require server rewrites.

### Sites

The project ID and static directory are recorded in `.openai/hosting.json`. The app remains a portable static bundle; Sites access control is a hosting-level restriction, not an application login feature.
