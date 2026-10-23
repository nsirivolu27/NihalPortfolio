export type InvestingSnapshot = {
  capturedAt: string;
  source: "screenshot" | "browser-sync";
  unrealized: number;
  realized: number;
  dayChange: number;
};

export function validateSnapshot(value: unknown): InvestingSnapshot {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Invalid snapshot.");
  const data = value as Record<string, unknown>;
  const keys = ["capturedAt", "source", "unrealized", "realized", "dayChange"];
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
