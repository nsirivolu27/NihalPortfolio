// Read-only DOM extractor for the signed-in Yahoo All Portfolio Holdings / My Holdings UI.
// Call through the browser tool after checking that the table is fully loaded and unpaginated.
// Never write the full page text, monetary columns, cookies, or authentication state to disk.
export function captureVisibleYahoo() {
  const tab = document.querySelector("#tab-HOLDINGS_VIEW");
  if (tab?.getAttribute("aria-selected") !== "true")
    throw new Error("Select My Holdings first.");
  const text = document.body.innerText
    .replace(/\u2212/g, "-")
    .replace(/\u00a0/g, " ");
  if (!text.includes("All Portfolio Holdings"))
    throw new Error("Open the All Portfolio Holdings overview.");
  const metric = (label) => {
    const matches = [
      ...text.matchAll(
        new RegExp(
          `(?:^|\\n)\\s*${label}\\s*\\n\\s*[+-]?\\$?[\\d,.]+\\s*\\(\\s*([+-]?[\\d,.]+)\\s*%\\s*\\)`,
          "gi",
        ),
      ),
    ];
    if (matches.length !== 1) throw new Error(`Missing or ambiguous ${label}`);
    return Number(matches[0][1].replace(/,/g, ""));
  };
  const tables = [...document.querySelectorAll("table")].filter((t) =>
    t.innerText.includes("Exposure"),
  );
  if (tables.length !== 1)
    throw new Error("Holdings table is missing or ambiguous.");
  const table = tables[0];
  const headings = [...table.querySelectorAll("thead th, thead td")].map((c) =>
    c.innerText.trim(),
  );
  if (
    headings.slice(0, 7).join("|") !==
    "Symbol|Exposure|Cost Basis|Market Value|Day Change|Unrealized Gain/Loss|Realized Gain/Loss"
  )
    throw new Error("Yahoo table columns changed.");
  const positions = [...table.querySelectorAll("tbody tr")].map((row) => {
    const cells = [...row.querySelectorAll("td")];
    if (cells.length !== 8)
      throw new Error("Unexpected or expanded holding row.");
    const link = cells[0].querySelector("a");
    const symbol = link?.getAttribute("href")?.match(/\/quote\/([^/]+)/)?.[1];
    if (!symbol) throw new Error("Missing holding symbol.");
    const percent = (index) => {
      const value = cells[index].innerText.trim();
      if (value === "--" || value === "—") return null;
      const matches = value.match(/[+\-−]?\s*[\d,]+\.\d+\s*%/g);
      if (matches?.length !== 1) throw new Error("Missing holding percentage.");
      return Number(matches[0].replace(/[,%\s]/g, "").replace("−", "-"));
    };
    return {
      symbol,
      name: link.textContent
        .trim()
        .replace(
          new RegExp(`^${symbol.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s+`),
          "",
        ),
      dayChange: percent(4),
      unrealized: percent(5),
    };
  });
  const section = text
    .split("Sector Allocation\n")[1]
    ?.split("Portfolio News")[0];
  if (!section) throw new Error("Sector allocation has not loaded.");
  const sectors = [
    ...section.matchAll(
      /([A-Za-z][A-Za-z '&-]+)\s*\$[\d,.]+\s*\(\s*([\d.]+)%\s*\)/g,
    ),
  ].map((m) => ({ name: m[1].trim(), percent: Number(m[2]) }));
  if (!sectors.length || !positions.length)
    throw new Error("Incomplete Yahoo data.");
  return {
    capturedAt: new Date().toISOString(),
    source: "browser-sync",
    unrealized: metric("Unrealized Gain/Loss"),
    realized: metric("Realized Gain/Loss"),
    dayChange: metric("Day Change"),
    analytics: { scope: "Yahoo My Holdings", positions, sectors },
  };
}
