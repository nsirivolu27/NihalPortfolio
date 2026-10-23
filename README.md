# Nihal Sirivolu â€” Portfolio

The existing React/Vite portfolio, expanded with experience and education, a real resume download, all public GitHub projects, Blogger writing, and a separate public investing page. No new dependencies. Public content needs no credentials; owner-triggered investing updates use a separate publishing key.

## Run locally

Use Node 24 and pnpm 10. On PowerShell:

```powershell
pnpm install --frozen-lockfile
$env:PORT = '4173'
$env:BASE_PATH = '/'
pnpm --filter @workspace/portfolio-site dev
```

Validation:

```powershell
npm test
npx tsc --noEmit
pnpm typecheck
$env:PORT = '4173'
$env:BASE_PATH = '/'
npm run build
```

Build output: `artifacts/portfolio-site/dist/public`. Existing hosting must rewrite `/projects`, `/writing`, `/investing`, and `/investing/sync` to `index.html` for direct navigation. Set `BASE_PATH` to the deployed prefix with a trailing slash if hosting under a subdirectory. The static portfolio works with saved snapshots. Dynamic investing sync requires the Express API and a persistent data file; no database is required.

## Content and provenance

- `artifacts/portfolio-site/src/lib/portfolio-data.ts`: profile copy, experience, education and source links. Project cards use GitHub names and descriptions verbatim, without curated overrides.
- `src/data/github.json` and `src/data/blog.json` inside the same artifact: dated public-source snapshots. The UI attempts a live refresh and retains the saved content on errors, rate limits, or blocked cross-origin requests.
- `public/Nihal-Sirivolu-Resume.pdf`: the user-supplied `NihalResume.pdf` from October 22, 2026, copied byte-for-byte. Experience follows this version: Edrevel June 2026–present, IDPro Meta Wearables/Project Aria work, 4SightAI remote. The downloadable source is unchanged; website project descriptions follow current GitHub rather than the PDF’s older Magentic description or unsupported 89.43% MRI accuracy claim.
- LinkedIn: https://www.linkedin.com/in/nihalsirivolu â€” public search exposed a partial profile only; no claim that hidden roles were imported. Older LinkedIn describes a location-sharing LNKZ project, whereas the current repository is an AI-context platform. They are not presented as the same implementation.
- Public GitHub repository metadata and READMEs were read on October 22, 2026 (America/New_York). Archived LLMM remains visible, clearly labeled. Private repositories are excluded.
- Blogger: https://nihalsblogaboutstuff.blogspot.com/ â€” two public posts, July and August 2022. Original publication dates and canonical links are retained. No article HTML is executed.
- Every current public GitHub repository appears on both the homepage and searchable archive, with original repository names and descriptions. The latest refresh returned 12 repositories. Empty descriptions remain explicitly empty; archived LLMM is retained and marked archived. Repository descriptions take precedence over older resume project claims.

Refresh the saved GitHub and Blogger snapshots with `npm run sync:content`, then review and rebuild. This paginates both sources, requires no key, and preserves the last good data independently if a source fails. It is not a scheduled publishing job.

## CMDA design and content order

Resume and all public projects lead the navigation and homepage. The background uses decorative coordinate grids, contour lines, regression points, and a model sketch inspired by Computational Modeling & Data Analytics. These illustrations are not financial performance charts. Motion respects reduced-motion preferences. The Canoo stock essay is on Investing; the technology/energy essay remains on Writing.

## Investing: percentage-only snapshots and owner sync

The owner narrowed publication to gain/loss percentages. The screenshot supplied October 22, 2026 contains unrealized +127.58%, realized +7.43%, and day change -3.18%. Its valuation date is unknown, so the page labels the supplied date and never calls it today's performance. No account email, holdings, balances, dollar amounts, or screenshot assets are stored. Returns are not summed or annualized.

Yahoo manually tracked portfolios have no documented public portfolio API available to this implementation. This is an **owner-triggered browser capture**, not Yahoo OAuth or a continuous account connection. No private Yahoo endpoints, passwords, or cookies are used. Actual signed-in Yahoo capture still needs validation with the owner's browser; markup changes fail closed instead of guessing. A local paste fallback handles browsers that block bookmarklets.

Local setup (after `npm run build`):

```powershell
npm run start:investing
```

This starts the API on loopback port 4175 and creates a random publishing key in ignored `.local/investing-key.txt`. It never prints the key. The frontend dev server on `http://127.0.0.1:4174` proxies `/api/investing`. If using another preview origin, set `PORTFOLIO_ORIGIN` before starting the helper. Open `/investing/sync`, drag **Sync portfolio** to the bookmarks bar, open the signed-in Yahoo All Portfolio Holdings summary, and activate the bookmark. Review the three captured percentages, enter the publishing key (not a Yahoo password), and publish. The key remains in page memory only. Copying the visible Yahoo summary into the fallback textarea parses on-device and discards raw text before submission.

The bookmark sends only the three percentages, capture time and source in a URL fragment to the same portfolio site. The owner page clears the fragment, requires explicit review, and writes through an authenticated API. POST accepts only those five fields; extra account/monetary fields, stale captures, duplicate/older captures, wrong keys and foreign origins fail. Writes replace the data file atomically; public reads validate the file and the UI keeps its saved/last fetched snapshot if the API is unavailable.

For production, run the built Express server alongside the frontend and route `/api/investing` to it **before** the SPA fallback. Set server-only environment variables:

- `INVESTING_SYNC_TOKEN`: a random publishing key of at least 32 characters, kept in hosting secrets.
- `INVESTING_DATA_FILE`: an absolute JSON file path on a persistent volume, outside static assets.
- `PORTFOLIO_ORIGIN`: the exact public HTTPS origin (no path or trailing slash).
- `PORT`: API listen port; optional `HOST` defaults to `0.0.0.0`.

Use one API writer process for the file-backed store. Production hosting without durable storage needs a persistent store before enabling sync. Never put the owner key in a Vite environment variable or commit `.local`. A static-only deployment continues to show the saved screenshot snapshot and cannot accept updates.

`npm test` checks extraction, fail-closed privacy boundaries, bookmark execution and public content. After building, `npm run test:api` exercises real HTTP authorization, strict schemas, freshness, persistence, rejected-write preservation and restart behavior with disposable synthetic data.

## Hosting

This work preserves the existing GitHub/Replit project. It does not create a second hosted site or change the production audience. The live site URL and deployment configuration still need to be confirmed before publishing changes.
