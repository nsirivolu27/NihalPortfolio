export type Holding = {
  symbol: string;
  quantity: number;
  price: number;
  costPerShare: number | null;
};
export type InvestingSnapshot = {
  asOf: string | null;
  currency: string;
  holdings: Holding[];
};

// Yahoo exports quoted fields, including commas and escaped quotes in notes.
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [],
    field = "",
    quoted = false,
    closed = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        quoted = false;
        closed = true;
      } else field += c;
    } else if (c === '"' && field === "" && !closed) quoted = true;
    else if (c === "," || c === "\n" || c === "\r") {
      row.push(field.trim());
      field = "";
      closed = false;
      if (c !== ",") {
        if (row.some(Boolean)) rows.push(row);
        row = [];
        if (c === "\r" && text[i + 1] === "\n") i++;
      }
    } else {
      if (closed && c.trim())
        throw new Error("Unexpected text after a quoted CSV field");
      if (c === '"') throw new Error("Unexpected quote in CSV field");
      field += c;
    }
  }
  if (quoted) throw new Error("Unclosed quote in CSV");
  row.push(field.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

export function parseYahooHoldings(csv: string): Holding[] {
  const [headers, ...rows] = parseCsv(csv.replace(/^\uFEFF/, ""));
  if (!headers || rows.length === 0)
    throw new Error("The export has no holdings");
  const normalized = headers.map((header) =>
    header.toLowerCase().replace(/[^a-z]/g, ""),
  );
  const column = (...names: string[]) =>
    normalized.findIndex((header) => names.includes(header));
  const symbolIndex = column("symbol", "ticker");
  const quantityIndex = column("quantity", "shares");
  const priceIndex = column("currentprice", "lastprice", "price");
  const costIndex = column("purchaseprice", "costpershare");
  const currencyIndex = column("currency");
  if ([symbolIndex, quantityIndex, priceIndex].some((index) => index < 0)) {
    throw new Error(
      "Export must include Symbol, Quantity, and Current Price columns",
    );
  }
  const number = (value: string | undefined, label: string) => {
    const cleaned = (value ?? "").trim().replace(/[$,]/g, "");
    if (!/^\d+(\.\d+)?$/.test(cleaned) || !Number.isFinite(Number(cleaned))) {
      throw new Error(`${label} must be a nonnegative number`);
    }
    return Number(cleaned);
  };
  const lots = new Map<string, Holding>();
  for (const [index, row] of rows.entries()) {
    if (row.length !== headers.length)
      throw new Error(`CSV row ${index + 2} has the wrong number of columns`);
    const symbol = row[symbolIndex].toUpperCase();
    if (!/^[A-Z0-9^][A-Z0-9.^=/-]{0,24}$/.test(symbol))
      throw new Error(`Invalid symbol on row ${index + 2}`);
    if (currencyIndex >= 0 && row[currencyIndex].toUpperCase() !== "USD") {
      throw new Error(
        "Only USD-priced exports are supported; convert foreign currency before importing",
      );
    }
    const quantity = number(row[quantityIndex], `${symbol} quantity`);
    if (quantity === 0) continue;
    const price = number(row[priceIndex], `${symbol} current price`);
    const rawCost = costIndex < 0 ? "" : row[costIndex];
    const costPerShare =
      !rawCost || /^(n\/a|--|-)$/i.test(rawCost)
        ? null
        : number(rawCost, `${symbol} purchase price`);
    const existing = lots.get(symbol);
    if (existing) {
      if (existing.price !== price)
        throw new Error(
          `Conflicting current prices for ${symbol}; use one valuation time`,
        );
      existing.costPerShare =
        existing.costPerShare === null || costPerShare === null
          ? null
          : (existing.costPerShare * existing.quantity +
              costPerShare * quantity) /
            (existing.quantity + quantity);
      existing.quantity += quantity;
    } else lots.set(symbol, { symbol, quantity, price, costPerShare });
  }
  if (!lots.size) throw new Error("No positive holdings found");
  return [...lots.values()].sort((a, b) => a.symbol.localeCompare(b.symbol));
}

export function summarizeHoldings(holdings: Holding[]) {
  const marketValue = holdings.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );
  const completeCost =
    holdings.length > 0 && holdings.every((item) => item.costPerShare !== null);
  const cost = completeCost
    ? holdings.reduce(
        (sum, item) => sum + item.quantity * item.costPerShare!,
        0,
      )
    : null;
  const gain = cost === null ? null : marketValue - cost;
  return {
    marketValue,
    cost,
    gain,
    returnPercent: cost === null || cost === 0 ? null : (gain! / cost) * 100,
  };
}
