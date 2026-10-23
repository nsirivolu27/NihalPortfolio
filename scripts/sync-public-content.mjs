import { writeFile } from "node:fs/promises";
import {
  normalizeBlog,
  normalizeRepositories,
} from "../artifacts/portfolio-site/src/lib/core/sources.ts";

const destination = new URL(
  "../artifacts/portfolio-site/src/data/",
  import.meta.url,
);
async function get(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": "NihalPortfolio" },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`Source returned HTTP ${response.status}`);
  return response.json();
}

// Sources update independently. A failed refresh never replaces the saved copy.
let failed = false;
for (const source of ["github", "blog"]) {
  try {
    let items = [];
    if (source === "github") {
      for (let page = 1; ; page++) {
        const batch = await get(
          `https://api.github.com/users/nsirivolu27/repos?type=owner&per_page=100&page=${page}`,
        );
        items.push(...normalizeRepositories(batch));
        if (batch.length < 100) break;
      }
    } else {
      for (let start = 1; ; start += 100) {
        const batch = await get(
          `https://nihalsblogaboutstuff.blogspot.com/feeds/posts/default?alt=json&max-results=100&start-index=${start}`,
        );
        const posts = normalizeBlog(batch);
        items.push(...posts);
        if (posts.length < 100) break;
      }
    }
    await writeFile(
      new URL(`${source}.json`, destination),
      JSON.stringify({ updatedAt: new Date().toISOString(), items }, null, 2) +
        "\n",
    );
    console.log(`${source}: saved ${items.length} public entries`);
  } catch (error) {
    failed = true;
    console.error(
      `${source}: refresh failed; existing snapshot retained. ${error.message}`,
    );
  }
}
if (failed) process.exitCode = 1;
