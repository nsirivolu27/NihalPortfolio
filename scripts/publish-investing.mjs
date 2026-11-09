import { isDeepStrictEqual } from "node:util";
import { readFile } from "node:fs/promises";
import { validateSnapshot } from "../artifacts/portfolio-site/src/lib/core/investing.ts";

// Input must already be sanitized from the visible Yahoo page. Never accept raw page text.
const file = process.argv[2];
if (!file)
  throw new Error(
    "Usage: node --experimental-strip-types scripts/publish-investing.mjs <sanitized-json-path>",
  );
const snapshot = validateSnapshot(JSON.parse(await readFile(file, "utf8")));
if (snapshot.source !== "browser-sync" || !snapshot.analytics)
  throw new Error("A complete browser capture with analytics is required.");
const origin = "https://nihalportfolio-zeta.vercel.app";
const key = (
  await readFile(
    new URL("../.local/investing-key.txt", import.meta.url),
    "utf8",
  )
).trim();
const response = await fetch(`${origin}/api/investing`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Origin: origin,
    Authorization: `Bearer ${key}`,
  },
  body: JSON.stringify(snapshot),
  signal: AbortSignal.timeout(20_000),
});
if (!response.ok && response.status !== 409)
  throw new Error(
    `Publishing failed (${response.status}). Previous snapshot preserved.`,
  );
const saved = validateSnapshot(
  await (
    await fetch(`${origin}/api/investing`, {
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    })
  ).json(),
);
if (Date.parse(saved.capturedAt) < Date.parse(snapshot.capturedAt))
  throw new Error("Public snapshot did not update.");
if (
  saved.capturedAt === snapshot.capturedAt &&
  !isDeepStrictEqual(saved, snapshot)
)
  throw new Error("Public verification mismatch.");
console.log(
  `Verified public Yahoo snapshot: ${saved.capturedAt}; ${saved.analytics?.positions.length ?? 0} holdings with percentage metrics.`,
);
