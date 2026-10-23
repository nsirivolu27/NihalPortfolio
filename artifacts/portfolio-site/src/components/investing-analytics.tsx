import { useState } from "react";
import {
  formatPercent,
  holdingLeaders,
  type InvestingAnalytics,
} from "@/lib/core/investing";

export function InvestingAnalyticsView({
  analytics,
}: {
  analytics: InvestingAnalytics;
}) {
  const [metric, setMetric] = useState<"unrealized" | "dayChange">(
    "unrealized",
  );
  const leaders = holdingLeaders(analytics.positions, metric);
  return (
    <section className="mt-8" aria-labelledby="holdings-title">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <h2 id="holdings-title" className="font-display text-4xl">
          Gainers & losers.
        </h2>
        <div className="flex gap-2" aria-label="Return period">
          <button
            className="metric-tab"
            aria-pressed={metric === "unrealized"}
            onClick={() => setMetric("unrealized")}
          >
            Unrealized return
          </button>
          <button
            className="metric-tab"
            aria-pressed={metric === "dayChange"}
            onClick={() => setMetric("dayChange")}
          >
            Day change
          </button>
        </div>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        {analytics.positions.length} holdings reported by Yahoo ·{" "}
        {leaders.rising} gaining · {leaders.falling} losing · {leaders.flat}{" "}
        unchanged
        {leaders.unavailable ? ` · ${leaders.unavailable} unavailable` : ""}
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {(
          [
            ["Largest percentage gains", leaders.gainers],
            ["Largest percentage losses", leaders.losers],
          ] as const
        ).map(([label, rows]) => (
          <article key={label} className="archive-card">
            <h3 className="text-sm font-semibold">{label}</h3>
            <ol className="mt-3 divide-y divide-border">
              {rows.map((row) => (
                <li
                  key={row.symbol}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <a
                    href={`https://finance.yahoo.com/quote/${encodeURIComponent(row.symbol)}/`}
                    target="_blank"
                    rel="noreferrer"
                    className="min-w-0"
                  >
                    <strong className="text-sm">{row.symbol} ↗</strong>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {row.name}
                    </span>
                  </a>
                  <span
                    className={`shrink-0 font-mono-ui text-sm ${Number(row[metric]) < 0 ? "text-accent" : "text-foreground"}`}
                  >
                    {formatPercent(row[metric] as number)}
                  </span>
                </li>
              ))}
            </ol>
            {!rows.length && (
              <p className="mt-4 text-sm text-muted-foreground">
                No {label.includes("gains") ? "positive" : "negative"} returns
                reported for this period.
              </p>
            )}
          </article>
        ))}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Ranked by percentage, not dollar contribution. Unrealized return uses
        Yahoo’s recorded cost basis; day change uses the captured trading day.
        Watchlists and positions absent from Yahoo’s My Holdings table are
        excluded.
      </p>
      {!!analytics.sectors.length && (
        <div className="mt-8 archive-card">
          <h3 className="font-display text-3xl">Sector mix.</h3>
          <div className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {analytics.sectors.map((sector) => (
              <div key={sector.name}>
                <div className="mb-2 flex justify-between gap-3 text-xs">
                  <span>{sector.name}</span>
                  <span>{sector.percent.toFixed(2)}%</span>
                </div>
                <div className="h-1.5 bg-muted">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${sector.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Share of portfolio market value, as reported by Yahoo. Rounded
            percentages may not total exactly 100%.
          </p>
        </div>
      )}
    </section>
  );
}
