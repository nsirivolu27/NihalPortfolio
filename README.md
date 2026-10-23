# Nihal Sirivolu — Portfolio

The existing React/Vite portfolio, expanded with experience and education, a real resume download, all public GitHub projects, Blogger writing, and a separate public investing page. No added dependencies or account credentials are required.

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

Build output: `artifacts/portfolio-site/dist/public`. Existing hosting must rewrite `/projects`, `/writing`, and `/investing` to `index.html` for direct navigation. Set `BASE_PATH` to the deployed prefix with a trailing slash if hosting under a subdirectory. The static portfolio does not require the scaffold API server or database.

## Content and provenance

- `artifacts/portfolio-site/src/lib/portfolio-data.ts`: curated copy, experience, education, source links, project context.
- `src/data/github.json` and `src/data/blog.json` inside the same artifact: dated public-source snapshots. The UI attempts a live refresh and retains the saved content on errors, rate limits, or blocked cross-origin requests.
- `public/Nihal-Sirivolu-Resume.pdf`: supplied September 8, 2026 software-engineering resume (`NihalResume_SWE_Provided.pdf`). Experience titles/dates and the 4SightAI location follow that latest local resume. Older resume and LinkedIn snapshots differed.
- LinkedIn: https://www.linkedin.com/in/nihalsirivolu — public search exposed a partial profile only; no claim that hidden roles were imported. Older LinkedIn describes a location-sharing LNKZ project, whereas the current repository is an AI-context platform. They are not presented as the same implementation.
- Public GitHub repository metadata and READMEs were read on October 22, 2026 (America/New_York). Archived LLMM remains visible, clearly labeled. Private repositories are excluded.
- Blogger: https://nihalsblogaboutstuff.blogspot.com/ — two public posts, July and August 2022. Original publication dates and canonical links are retained. No article HTML is executed.
- Hyperspectral research remains from the existing portfolio, labeled in progress with no public repository. Unsupported deployed-status and 78% MRI-accuracy claims were removed.

Refresh the saved GitHub and Blogger snapshots with `npm run sync:content`, then review and rebuild. This paginates both sources, requires no key, and preserves the last good data independently if a source fails. It is not a scheduled publishing job.

## Public investing page

The owner requested public holdings, dollar amounts, and performance. The page currently has an honest empty state because no holdings export was supplied. It is **not connected to a Yahoo account**; an account email alone provides no data access. No Yahoo passwords, cookies, or guessed private APIs are used.

1. Export the portfolio from Yahoo Finance in a desktop browser (My Portfolio → select portfolio → Export).
2. Keep the raw CSV outside this repository. Confirm prices and purchase costs are all in USD, including foreign-listed securities. Symbols alone cannot establish currency. The importer rejects an explicit non-USD Currency field.
3. Run the import with the actual valuation timestamp, including its time-zone offset:

```powershell
npm run import:yahoo -- 'C:\path\quotes.csv' '2026-10-22T16:00:00-04:00'
```

Required columns: `Symbol`, `Quantity`, `Current Price` (aliases: `Ticker`, `Shares`, `Last Price` or `Price`). Optional: `Purchase Price` / `Cost Per Share`, `Currency`. Blank purchase cost remains unknown. Duplicate lots aggregate with weighted purchase cost. Positive long holdings only; zero holdings are skipped, missing prices and negative quantities rejected. There is no FX conversion.

Only symbols, quantities, prices, purchase costs, currency and timestamp enter `src/data/investing.json`. Notes and account identifiers are discarded. Review this **public** file before committing and deploying. Invalid input leaves the previous snapshot untouched.

The page calculates market value, allocation, and **unrealized** gain/return for open positions. It does not manufacture a historical curve or call unrealized gain total account performance: dividends, fees, taxes, closed positions, and cash flows require additional source records. Prices are explicitly dated snapshots, never labeled live.

## Hosting

This work preserves the existing GitHub/Replit project. It does not create a second hosted site or change the production audience. The live site URL and deployment configuration still need to be confirmed before publishing changes.
