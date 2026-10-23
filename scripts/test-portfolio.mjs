import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  parseCsv,
  parseYahooHoldings,
  summarizeHoldings,
} from "../artifacts/portfolio-site/src/lib/core/investing.ts";
import {
  normalizeBlog,
  normalizeRepositories,
} from "../artifacts/portfolio-site/src/lib/core/sources.ts";

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log(`  ok  ${name}`);
};
const header = "Symbol,Current Price,Purchase Price,Quantity,Comment";

test("quoted commas, multiline notes, CRLF and escaped quotes retain column boundaries", () => {
  assert.deepEqual(parseCsv('a,b\r\n"hello,\nworld","say ""hi"""\r\n'), [
    ["a", "b"],
    ["hello,\nworld", 'say "hi"'],
  ]);
});
test("duplicate lots combine quantities and weighted purchase costs", () => {
  const holdings = parseYahooHoldings(
    `${header}\nAAPL,200,100,2,"long, term"\nAAPL,200,150,2,test`,
  );
  assert.deepEqual(holdings, [
    { symbol: "AAPL", quantity: 4, price: 200, costPerShare: 125 },
  ]);
  assert.deepEqual(summarizeHoldings(holdings), {
    marketValue: 800,
    cost: 500,
    gain: 300,
    returnPercent: 60,
  });
});
test("fractional holdings and quoted currency values parse without rounding quantities", () => {
  const [holding] = parseYahooHoldings(
    `${header}\nBRK-B,"$1,200.50",1000,0.25,note`,
  );
  assert.equal(holding.quantity * holding.price, 300.125);
});
test("missing cost basis never becomes a fabricated zero-cost gain", () => {
  const holdings = parseYahooHoldings(
    `${header}\nAAPL,200,,2,x\nAAPL,200,100,1,y`,
  );
  assert.equal(summarizeHoldings(holdings).gain, null);
  assert.equal(summarizeHoldings(holdings).marketValue, 600);
});
test("zero-cost holdings have a dollar gain but no infinite percentage", () => {
  assert.equal(
    summarizeHoldings([
      { symbol: "A", price: 100, quantity: 1, costPerShare: 0 },
    ]).returnPercent,
    null,
  );
});
test("zero-quantity sold positions are omitted", () => {
  assert.equal(
    parseYahooHoldings(`${header}\nAAPL,200,100,0,x\nMSFT,400,300,2,y`).length,
    1,
  );
});
test("mixed currency exports cannot silently produce USD totals", () => {
  assert.throws(
    () =>
      parseYahooHoldings("Symbol,Current Price,Quantity,Currency\nA,100,1,EUR"),
    /USD/,
  );
});
test("watchlists without share counts are not treated as owned holdings", () => {
  assert.throws(
    () => parseYahooHoldings("Symbol,Current Price\nA,100"),
    /Quantity/,
  );
  assert.throws(() => parseYahooHoldings(`${header}\nA,100,50,,x`), /quantity/);
});
test("missing quotes, negative quantities, and malformed values fail instead of understating totals", () => {
  for (const row of [
    "A,N/A,100,1,x",
    "A,200,100,-1,x",
    "A,200oops,100,1,x",
    "A,200,100,1,x,extra",
  ]) {
    assert.throws(() => parseYahooHoldings(`${header}\n${row}`));
  }
});
test("conflicting current prices cannot be combined", () => {
  assert.throws(
    () => parseYahooHoldings(`${header}\nA,200,100,1,x\nA,201,100,1,y`),
    /Conflicting/,
  );
});
test("broken quoting is rejected", () => {
  assert.throws(() => parseCsv('"unfinished'), /Unclosed/);
  assert.throws(() => parseCsv('"done"oops'), /Unexpected/);
});
test("empty portfolios have no gain or invented percentage", () => {
  assert.deepEqual(summarizeHoldings([]), {
    marketValue: 0,
    cost: null,
    gain: null,
    returnPercent: null,
  });
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
console.log(`\n${passed} passing\n`);
