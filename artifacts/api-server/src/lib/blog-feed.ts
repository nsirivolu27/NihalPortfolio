export async function fetchBlogPage(start: unknown, fetcher: typeof fetch = fetch) {
  const index = start === undefined ? "1" : start;
  if (typeof index !== "string" || !/^[1-9]\d{0,5}$/.test(index)) {
    return { status: 400, body: { error: "Invalid feed page" } };
  }
  try {
    // The destination is fixed; callers can only select a page of this public feed.
    const response = await fetcher(
      `https://nihalsblogaboutstuff.blogspot.com/feeds/posts/default?alt=json&max-results=100&start-index=${index}`,
      { signal: AbortSignal.timeout(8000) },
    );
    if (!response.ok) throw new Error("Feed unavailable");
    const body = await response.json();
    if (!body || typeof body !== "object" || !("feed" in body)) {
      throw new Error("Invalid feed");
    }
    const feed = body.feed;
    if (!feed || typeof feed !== "object" || Array.isArray(feed) ||
      ("entry" in feed && !Array.isArray(feed.entry))) {
      throw new Error("Invalid feed");
    }
    return { status: 200, body };
  } catch {
    return { status: 502, body: { error: "Blog feed temporarily unavailable" } };
  }
}
