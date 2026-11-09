import assert from "node:assert/strict";
import { fetchBlogPage } from "../artifacts/api-server/src/lib/blog-feed.ts";

const feed = { feed: { entry: [{ category: [{ term: "Investing" }] }] } };
let requested;
const success = async (url) => {
  requested = url;
  return Response.json(feed);
};
assert.deepEqual(await fetchBlogPage(undefined, success), { status: 200, body: feed });
assert.equal(requested, "https://nihalsblogaboutstuff.blogspot.com/feeds/posts/default?alt=json&max-results=100&start-index=1");
await fetchBlogPage("101", success);
assert.ok(requested.endsWith("start-index=101"));
for (const invalid of ["0", "-1", "https://example.com", "1&alt=other", ["1", "2"]]) {
  assert.equal((await fetchBlogPage(invalid, () => { throw new Error("Must not fetch"); })).status, 400);
}
for (const unavailable of [
  async () => new Response("Unavailable", { status: 503 }),
  async () => Response.json({ error: "Not a feed" }),
  async () => { throw new Error("Network unavailable"); },
]) {
  assert.deepEqual(await fetchBlogPage("1", unavailable), {
    status: 502, body: { error: "Blog feed temporarily unavailable" },
  });
}
assert.equal((await fetchBlogPage("1", async () => Response.json({ feed: {} }))).status, 200);
console.log("Blog feed: pagination, labels, fixed destination, invalid queries, upstream failure, and empty feed checks passed");
