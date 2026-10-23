import { readFile, writeFile } from "node:fs/promises";
import { parseYahooHoldings } from "../artifacts/portfolio-site/src/lib/core/investing.ts";

const [file, asOf] = process.argv.slice(2);
if (
  !file ||
  !asOf ||
  !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(asOf) ||
  !Number.isFinite(Date.parse(asOf))
) {
  console.error(
    'Usage: npm run import:yahoo -- "path/to/quotes.csv" "2026-10-22T16:00:00-04:00"',
  );
  process.exit(1);
}
try {
  const holdings = parseYahooHoldings(await readFile(file, "utf8"));
  const snapshot = {
    asOf: new Date(asOf).toISOString(),
    currency: "USD",
    holdings,
  };
  // Only these public fields are retained. Raw exports, notes and account IDs stay outside the site.
  await writeFile(
    new URL(
      "../artifacts/portfolio-site/src/data/investing.json",
      import.meta.url,
    ),
    JSON.stringify(snapshot, null, 2) + "\n",
  );
  console.log(
    `Prepared ${holdings.length} holdings for the public investing page. Review the diff before publishing.`,
  );
} catch (error) {
  console.error(`Import failed; existing snapshot retained. ${error.message}`);
  process.exitCode = 1;
}
