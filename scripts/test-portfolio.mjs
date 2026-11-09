import assert from "node:assert/strict";
import {
  validateCertifications,
  certificationStatus,
} from "../artifacts/portfolio-site/src/lib/core/certifications.ts";
import { readFile } from "node:fs/promises";
import {
  extractYahooPercentages,
  validateSnapshot,
  buildYahooBookmark,
} from "../artifacts/portfolio-site/src/lib/core/investing.ts";
import {
  normalizeBlog,
  isInvestingPost,
  normalizeRepositories,
} from "../artifacts/portfolio-site/src/lib/core/sources.ts";

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log(`  ok  ${name}`);
};
const summary =
  "All Portfolio Holdings\n$999.00\nDay Change\n-$1.00 (-3.18%)\nUnrealized Gain/Loss\n+$2.00 (+127.58%)\nRealized Gain/Loss\n+$3.00 (+7.43%)";
const certificationSnapshot = JSON.parse(
  await readFile(
    new URL(
      "../artifacts/portfolio-site/public/certifications.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
test("credential feed keeps completed and in-progress entries distinct", () => {
  const snapshot = validateCertifications(certificationSnapshot);
  assert.ok(
    snapshot.items.every(
      (item) => item.status === "earned" || item.status === "in-progress",
    ),
  );
  assert.equal(
    certificationStatus(
      { id: "ml", name: "ML", issuer: "AWS", status: "in-progress" },
      "2026-10",
    ),
    "in-progress",
  );
});
test("credentials remain current through their expiry month", () => {
  const cert = {
    id: "aws",
    name: "AWS",
    issuer: "AWS",
    status: "earned",
    expires: "2029-08",
  };
  assert.equal(certificationStatus(cert, "2029-08"), "earned");
  assert.equal(certificationStatus(cert, "2029-09"), "expired");
});
test("malformed credential feeds and unsafe verification links fail before replacing the snapshot", () => {
  const item = certificationSnapshot.items.find(
    (item) => item.status === "earned",
  );
  for (const patch of [
    { credentialUrl: "javascript:alert(1)" },
    { issued: "2026-13" },
    { status: "verified" },
    { token: "secret" },
  ]) {
    assert.throws(() =>
      validateCertifications({
        ...certificationSnapshot,
        items: [{ ...item, ...patch }],
      }),
    );
  }
  assert.throws(() =>
    validateCertifications({ ...certificationSnapshot, items: [item, item] }),
  );
});
test("GitHub refresh preserves archived status and valid push dates without inventing missing dates", () => {
  const repo = {
    name: "Magentic.AI",
    owner: { login: "nsirivolu27" },
    private: false,
    html_url: "https://github.com/nsirivolu27/Magentic.AI",
    archived: true,
    pushed_at: "2026-10-23T00:00:00Z",
  };
  const [result] = normalizeRepositories([repo]);
  assert.equal(result.archived, true);
  assert.equal(result.pushedAt, repo.pushed_at);
  assert.equal(
    normalizeRepositories([{ ...repo, pushed_at: null }])[0].pushedAt,
    undefined,
  );
  assert.equal(
    normalizeRepositories([{ ...repo, pushed_at: "not a date" }])[0].pushedAt,
    undefined,
  );
});
test("Yahoo summary exports only three percentages, never amounts", () => {
  assert.deepEqual(extractYahooPercentages(summary), {
    unrealized: 127.58,
    realized: 7.43,
    dayChange: -3.18,
  });
});
test("Unicode minus and nonbreaking spaces preserve a loss", () => {
  assert.equal(
    extractYahooPercentages(
      summary.replaceAll("-", "−").replaceAll(" ", "\u00a0"),
    ).dayChange,
    -3.18,
  );
});
test("ambiguous repeated summaries and missing metrics fail closed", () => {
  assert.throws(() => extractYahooPercentages(summary + "\n" + summary));
  assert.throws(() =>
    extractYahooPercentages(
      summary.replace("Realized Gain/Loss", "Unavailable"),
    ),
  );
  assert.throws(() =>
    extractYahooPercentages("Unrealized Gain/Loss\n+$2.00 (+127.58%)"),
  );
});
const snapshot = {
  capturedAt: "2026-10-22",
  source: "screenshot",
  unrealized: 127.58,
  realized: 7.43,
  dayChange: -3.18,
};
test("public boundary rejects monetary/account fields and malformed numbers", () => {
  assert.deepEqual(validateSnapshot(snapshot), snapshot);
  for (const extra of ["holdings", "balance", "email", "token", "dollarGain"])
    assert.throws(() => validateSnapshot({ ...snapshot, [extra]: "private" }));
  for (const value of [null, "7.43", Infinity, NaN])
    assert.throws(() => validateSnapshot({ ...snapshot, realized: value }));
  assert.throws(() =>
    validateSnapshot({ ...snapshot, capturedAt: "yesterday" }),
  );
});
test("bookmark only permits HTTPS or local preview destinations", () => {
  assert.ok(
    buildYahooBookmark("https://example.com/investing/sync").startsWith(
      "javascript:",
    ),
  );
  assert.throws(() => buildYahooBookmark("http://example.com/investing/sync"));
});
test("bookmark executes its self-contained parser and opens percentage-only preview", () => {
  const script = buildYahooBookmark(
    "http://127.0.0.1:4174/investing/sync",
  ).slice("javascript:".length);
  let opened;
  const run = new Function("location", "document", "window", "alert", script);
  run(
    { hostname: "finance.yahoo.com", pathname: "/portfolios/" },
    { body: { innerText: summary } },
    {
      open: (url) => {
        opened = url;
      },
    },
    (message) => {
      throw new Error(message);
    },
  );
  const data = JSON.parse(
    new URLSearchParams(new URL(opened).hash.slice(1)).get("snapshot"),
  );
  assert.equal(validateSnapshot(data).unrealized, 127.58);
  assert.ok(!opened.includes("999"));
  let warning;
  run(
    { hostname: "evil.example", pathname: "/portfolios/" },
    {},
    {},
    (message) => {
      warning = message;
    },
  );
  assert.match(warning, /Yahoo/);
});
const repo = {
  name: "Example",
  owner: { login: "nsirivolu27" },
  private: false,
  html_url: "https://github.com/nsirivolu27/Example",
  archived: true,
  fork: false,
};
test("GitHub boundary keeps public archives and rejects private or foreign repositories", () => {
  assert.equal(normalizeRepositories([repo])[0].archived, true);
  assert.throws(() => normalizeRepositories([{ ...repo, private: true }]));
  assert.throws(() =>
    normalizeRepositories([{ ...repo, html_url: "javascript:alert(1)" }]),
  );
  assert.throws(() => normalizeRepositories({ message: "Rate limited" }));
});
const entry = {
  title: { $t: " Essay " },
  published: { $t: "2022-07-20T19:05:00-04:00" },
  link: [
    {
      rel: "alternate",
      href: "https://nihalsblogaboutstuff.blogspot.com/2022/essay.html",
    },
  ],
};
test("blog boundary preserves dates and only links to the actual blog", () => {
  assert.equal(normalizeBlog({ feed: { entry: [entry] } })[0].title, "Essay");
  assert.throws(() =>
    normalizeBlog({
      feed: {
        entry: [
          {
            ...entry,
            link: [{ rel: "alternate", href: "https://evil.example" }],
          },
        ],
      },
    }),
  );
  assert.throws(() => normalizeBlog({ error: "unavailable" }));
});
test("new finance posts reach Investing while other writing stays separate", () => {
  const posts = normalizeBlog({ feed: { entry: [
    { ...entry, category: [{ term: " Investing " }, { term: "Weekly Market Review" }] },
    { ...entry, category: [{ term: "Technology" }, null, { term: 12 }] },
  ] } });
  assert.deepEqual(posts[0].labels, ["Investing", "Weekly Market Review"]);
  assert.equal(isInvestingPost(posts[0]), true);
  assert.equal(isInvestingPost(posts[1]), false);
  assert.equal(isInvestingPost({ ...posts[1], labels: ["FINANCE"] }), true);
  assert.equal(isInvestingPost({ ...posts[1], labels: ["Stock Analysis"] }), true);
  assert.equal(isInvestingPost({ ...posts[1], labels: ["Weekly Market Review"] }), true);
  assert.equal(isInvestingPost({ ...posts[1], labels: ["financial technology"] }), false);
  assert.equal(isInvestingPost({ ...posts[1], labels: undefined }), false);
  assert.equal(isInvestingPost({ ...posts[1], labels: undefined, url: "https://nihalsblogaboutstuff.blogspot.com/2022/07/canoo-buy-now.html" }), true);
});
const saved = JSON.parse(
  await readFile(
    new URL(
      "../artifacts/portfolio-site/src/data/github.json",
      import.meta.url,
    ),
  ),
);
const blog = JSON.parse(
  await readFile(
    new URL("../artifacts/portfolio-site/src/data/blog.json", import.meta.url),
  ),
);
test("offline fallbacks contain the complete current archive and actual dated posts", () => {
  assert.equal(
    new Set(saved.items.map((item) => item.name)).size,
    saved.items.length,
  );
  assert.ok(saved.items.some((item) => item.name === "LLMM" && item.archived));
  assert.ok(saved.items.some((item) => item.name === "LNKZ"));
  assert.ok(blog.items.some((item) => item.title === "Is Canoo a buy now?"));
});
const pdf = await readFile(
  new URL(
    "../artifacts/portfolio-site/public/Nihal-Sirivolu-Resume.pdf",
    import.meta.url,
  ),
);
test("the resume download is an actual PDF", () =>
  assert.equal(pdf.subarray(0, 5).toString(), "%PDF-"));
const { validateAnalytics, holdingLeaders } =
  await import("../artifacts/portfolio-site/src/lib/core/investing.ts");
const { validateProjectSettings, curateProjects } =
  await import("../artifacts/portfolio-site/src/lib/core/projects.ts");
const analytics = {
  scope: "Yahoo My Holdings",
  positions: [
    { symbol: "A", name: "Alpha", unrealized: -20, dayChange: 2 },
    { symbol: "B", name: "Beta", unrealized: 100, dayChange: -4 },
    { symbol: "C", name: "Gamma", unrealized: null, dayChange: 0 },
  ],
  sectors: [{ name: "Technology", percent: 100 }],
};
test("return leaders use the selected period, never turn missing metrics into zero", () => {
  validateAnalytics(analytics);
  const total = holdingLeaders(analytics.positions, "unrealized");
  assert.equal(total.gainers[0].symbol, "B");
  assert.equal(total.losers[0].symbol, "A");
  assert.equal(total.unavailable, 1);
  assert.equal(total.flat, 0);
  const day = holdingLeaders(analytics.positions, "dayChange");
  assert.equal(day.gainers[0].symbol, "A");
  assert.equal(day.losers[0].symbol, "B");
  assert.equal(day.flat, 1);
  assert.deepEqual(
    holdingLeaders([analytics.positions[1]], "unrealized").losers,
    [],
  );
});
test("analytics reject nested private data, duplicates, and incomplete allocations", () => {
  for (const patch of [
    { positions: [{ ...analytics.positions[0], balance: 123 }] },
    { positions: [analytics.positions[0], analytics.positions[0]] },
    { sectors: [{ name: "Technology", percent: 50 }] },
    { positions: [{ ...analytics.positions[0], dayChange: "--" }] },
  ])
    assert.throws(() => validateAnalytics({ ...analytics, ...patch }));
});
const curatedRepo = {
  name: "Demo",
  description: "Source",
  url: "https://github.com/nsirivolu27/Demo",
  language: "Python",
  archived: false,
  fork: false,
};
test("deleting hides a project across refreshes, adding it back restores current GitHub metadata", () => {
  const settings = validateProjectSettings({
    revision: 0,
    hidden: [curatedRepo.url],
    additions: [],
  });
  assert.equal(
    curateProjects([{ ...curatedRepo, description: "Updated" }], settings)
      .length,
    0,
  );
  assert.equal(
    curateProjects([{ ...curatedRepo, description: "Updated" }], {
      ...settings,
      hidden: [],
    })[0].description,
    "Updated",
  );
  const custom = {
    name: "Custom",
    description: "Work",
    url: "https://example.com/work",
    language: "Data",
  };
  assert.equal(
    curateProjects([curatedRepo], {
      ...settings,
      hidden: [],
      additions: [custom],
    }).length,
    2,
  );
  assert.equal(
    curateProjects([curatedRepo], {
      ...settings,
      hidden: [],
      additions: [{ ...custom, url: curatedRepo.url }],
    })[0].description,
    "Source",
  );
});
test("project settings reject unsafe links, duplicate entries, and unknown fields", () => {
  for (const patch of [
    { hidden: ["javascript:alert(1)"] },
    { hidden: ["https://user:secret@example.com"] },
    { token: "secret" },
    { revision: -1 },
    { hidden: [curatedRepo.url, curatedRepo.url] },
  ])
    assert.throws(() =>
      validateProjectSettings({
        revision: 0,
        hidden: [],
        additions: [],
        ...patch,
      }),
    );
});
console.log(`\n${passed} passing\n`);
