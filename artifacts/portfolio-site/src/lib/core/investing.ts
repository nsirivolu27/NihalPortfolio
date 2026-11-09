export type InvestingSnapshot = {
  capturedAt: string;
  source: "screenshot" | "browser-sync";
  unrealized: number;
  realized: number;
  dayChange: number;
  analytics?: InvestingAnalytics;
};

export type HoldingReturn = {
  symbol: string;
  name: string;
  unrealized: number | null;
  dayChange: number | null;
};
export type InvestingAnalytics = {
  scope: "Yahoo My Holdings";
  positions: HoldingReturn[];
  sectors: { name: string; percent: number }[];
};

function exactKeys(
  value: unknown,
  keys: string[],
): asserts value is Record<string, unknown> {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    Object.keys(value).length !== keys.length ||
    Object.keys(value).some((key) => !keys.includes(key))
  )
    throw new Error("Unexpected analytics fields.");
}

export function validateAnalytics(value: unknown): InvestingAnalytics {
  exactKeys(value, ["scope", "positions", "sectors"]);
  if (
    value.scope !== "Yahoo My Holdings" ||
    !Array.isArray(value.positions) ||
    !value.positions.length ||
    value.positions.length > 200 ||
    !Array.isArray(value.sectors) ||
    value.sectors.length > 20
  )
    throw new Error("Invalid analytics scope.");
  const symbols = new Set<string>();
  for (const position of value.positions) {
    exactKeys(position, ["symbol", "name", "unrealized", "dayChange"]);
    if (
      typeof position.symbol !== "string" ||
      !/^[A-Z0-9.^=-]{1,20}$/.test(position.symbol) ||
      symbols.has(position.symbol) ||
      typeof position.name !== "string" ||
      !position.name.length ||
      position.name.length > 160 ||
      /[$\r\n]/.test(position.name)
    )
      throw new Error("Invalid or duplicate holding.");
    symbols.add(position.symbol);
    for (const key of ["unrealized", "dayChange"]) {
      const metric = position[key];
      if (
        metric !== null &&
        (typeof metric !== "number" ||
          !Number.isFinite(metric) ||
          Math.abs(metric) > 1e7)
      )
        throw new Error("Invalid holding percentage.");
    }
  }
  const sectors = new Set<string>();
  let total = 0;
  for (const sector of value.sectors) {
    exactKeys(sector, ["name", "percent"]);
    if (
      typeof sector.name !== "string" ||
      !/^[A-Za-z][A-Za-z '&-]{0,59}$/.test(sector.name) ||
      sectors.has(sector.name) ||
      typeof sector.percent !== "number" ||
      !Number.isFinite(sector.percent) ||
      sector.percent < 0 ||
      sector.percent > 100
    )
      throw new Error("Invalid sector allocation.");
    sectors.add(sector.name);
    total += sector.percent;
  }
  if (value.sectors.length && Math.abs(total - 100) > 0.2)
    throw new Error("Incomplete sector allocation.");
  return value as InvestingAnalytics;
}

export function holdingLeaders(
  positions: HoldingReturn[],
  metric: "unrealized" | "dayChange",
) {
  const known = positions.filter((p) => p[metric] !== null);
  const sorted = [...known].sort(
    (a, b) =>
      (b[metric] as number) - (a[metric] as number) ||
      a.symbol.localeCompare(b.symbol),
  );
  return {
    gainers: sorted.filter((p) => (p[metric] as number) > 0).slice(0, 3),
    losers: sorted
      .filter((p) => (p[metric] as number) < 0)
      .reverse()
      .slice(0, 3),
    rising: known.filter((p) => (p[metric] as number) > 0).length,
    falling: known.filter((p) => (p[metric] as number) < 0).length,
    flat: known.filter((p) => p[metric] === 0).length,
    unavailable: positions.length - known.length,
  };
}

export function validateSnapshot(value: unknown): InvestingSnapshot {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Invalid snapshot.");
  const data = value as Record<string, unknown>;
  const keys = [
    "capturedAt",
    "source",
    "unrealized",
    "realized",
    "dayChange",
    ...(Object.hasOwn(data, "analytics") ? ["analytics"] : []),
  ];
  if (
    Object.keys(data).length !== keys.length ||
    Object.keys(data).some((key) => !keys.includes(key))
  )
    throw new Error("Only gain/loss percentages may be shared.");
  if (
    typeof data.capturedAt !== "string" ||
    !Number.isFinite(Date.parse(data.capturedAt))
  )
    throw new Error("A valid capture date is required.");
  if (data.source !== "screenshot" && data.source !== "browser-sync")
    throw new Error("Unknown source.");
  for (const key of ["unrealized", "realized", "dayChange"]) {
    if (
      typeof data[key] !== "number" ||
      !Number.isFinite(data[key]) ||
      Math.abs(data[key]) > 1e7
    )
      throw new Error("Invalid percentage.");
  }
  if (Object.hasOwn(data, "analytics")) validateAnalytics(data.analytics);
  return data as InvestingSnapshot;
}

// Self-contained so the bookmark can run this parser on the visible Yahoo page.
export function extractYahooPercentages(text: string) {
  const normalized = text.replace(/\u2212/g, "-").replace(/\u00a0/g, " ");
  const read = (label: string) => {
    const pattern = new RegExp(
      `(?:^|\\n)\\s*${label}\\s*\\n\\s*[+-]?\\$?[\\d,.]+\\s*\\(\\s*([+-]?[\\d,.]+)\\s*%\\s*\\)`,
      "gi",
    );
    const matches = [...normalized.matchAll(pattern)];
    if (matches.length !== 1)
      throw new Error(
        `Open the All Portfolio Holdings summary. Could not uniquely read ${label}.`,
      );
    const value = Number(matches[0][1].replace(/,/g, ""));
    if (!Number.isFinite(value))
      throw new Error(`Invalid ${label} percentage.`);
    return value;
  };
  return {
    unrealized: read("Unrealized Gain/Loss"),
    realized: read("Realized Gain/Loss"),
    dayChange: read("Day Change"),
  };
}

export function formatPercent(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function buildYahooBookmark(destination: string) {
  const url = new URL(destination);
  if (
    url.protocol !== "https:" &&
    !(
      url.protocol === "http:" &&
      ["localhost", "127.0.0.1"].includes(url.hostname)
    )
  )
    throw new Error("Use HTTPS or a local preview.");
  // A URL fragment never sends the captured data to the server in a request URL.
  return `javascript:(()=>{try{if(location.hostname!=="finance.yahoo.com"||!location.pathname.startsWith("/portfolios"))throw Error("Open your Yahoo Finance portfolio summary first.");const read=${extractYahooPercentages.toString()};const snapshot={...read(document.body.innerText),capturedAt:new Date().toISOString(),source:"browser-sync"};window.open(${JSON.stringify(url.href)}+"#snapshot="+encodeURIComponent(JSON.stringify(snapshot)),"_blank","noopener,noreferrer");}catch(e){alert(e.message)}})()`;
}
