import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import snapshotData from "@/data/investing.json";
import {
  summarizeHoldings,
  type InvestingSnapshot,
} from "@/lib/core/investing";

export default function Investing() {
  const snapshot: InvestingSnapshot = snapshotData;
  const summary = summarizeHoldings(snapshot.holdings);
  const money = (value: number | null) =>
    value === null
      ? "Not available"
      : new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: snapshot.currency,
        }).format(value);
  return (
    <PageShell
      title="The investing portfolio."
      eyebrow="Markets / A separate kind of portfolio"
      intro="A transparent view of my holdings, allocation, and unrealized performance, alongside the curiosity about companies and technology that started my blog."
    >
      {!snapshot.holdings.length ? (
        <section className="border border-border bg-card p-8 sm:p-12">
          <p className="font-mono-ui text-xs uppercase tracking-wider text-accent">
            Awaiting first portfolio snapshot
          </p>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl">
            The numbers belong here.
            <br />
            They’re not published yet.
          </h2>
          <p className="mt-6 max-w-2xl text-muted-foreground leading-relaxed">
            My holdings, dollar amounts, and performance will appear here once
            the first Yahoo Finance export is added. There are no sample
            investments or simulated returns on this page.
          </p>
          <Link href="/writing" className="action-link mt-8">
            Read my market essays <ArrowUpRight size={16} />
          </Link>
        </section>
      ) : (
        <>
          <p className="mb-8 text-sm text-muted-foreground">
            Yahoo Finance export · Valued as of{" "}
            <time dateTime={snapshot.asOf!}>
              {new Date(snapshot.asOf!).toLocaleString("en-US", {
                timeZone: "America/New_York",
                timeZoneName: "short",
              })}
            </time>{" "}
            · {snapshot.currency} · Snapshot, not live prices
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Market value", money(summary.marketValue)],
              ["Cost basis", money(summary.cost)],
              ["Unrealized gain / loss", money(summary.gain)],
              [
                "Unrealized return",
                summary.returnPercent === null
                  ? "Not available"
                  : `${summary.returnPercent.toFixed(2)}%`,
              ],
            ].map(([label, value]) => (
              <div key={label} className="border border-border bg-card p-6">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-4 font-display text-3xl">{value}</p>
              </div>
            ))}
          </div>
          <div
            className="mt-12 overflow-x-auto border border-border"
            role="region"
            aria-label="Holdings table"
            tabIndex={0}
          >
            <table className="holdings-table">
              <caption className="p-5 text-left font-display text-3xl">
                Holdings & allocation
              </caption>
              <thead>
                <tr>
                  {[
                    "Holding",
                    "Shares",
                    "Price",
                    "Value",
                    "Allocation",
                    "Unrealized gain / loss",
                  ].map((label) => (
                    <th scope="col" key={label}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {snapshot.holdings.map((holding) => {
                  const value = holding.quantity * holding.price;
                  const allocation =
                    summary.marketValue > 0
                      ? (value / summary.marketValue) * 100
                      : 0;
                  return (
                    <tr key={holding.symbol}>
                      <th scope="row">
                        <a
                          href={`https://finance.yahoo.com/quote/${encodeURIComponent(holding.symbol)}/`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {holding.symbol} ↗
                        </a>
                      </th>
                      <td>
                        {holding.quantity.toLocaleString("en-US", {
                          maximumFractionDigits: 8,
                        })}
                      </td>
                      <td>{money(holding.price)}</td>
                      <td>{money(value)}</td>
                      <td>
                        <div>{allocation.toFixed(1)}%</div>
                        <div className="mt-2 h-1 w-24 bg-muted">
                          <div
                            className="h-full bg-accent"
                            style={{ width: `${allocation}%` }}
                          />
                        </div>
                      </td>
                      <td>
                        {money(
                          holding.costPerShare === null
                            ? null
                            : value - holding.quantity * holding.costPerShare,
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            Unrealized return compares the current value of open holdings with
            their purchase cost. It excludes sold positions, dividends, fees,
            taxes, deposits, and withdrawals; it is not a total or annualized
            account return. Missing purchase costs are shown as unavailable.
          </p>
        </>
      )}
      <div className="mt-12 flex flex-wrap gap-6 text-sm">
        <Link href="/writing" className="action-link">
          Writing on companies & technology <ArrowUpRight size={16} />
        </Link>
        <a
          href="https://finance.yahoo.com/portfolios/"
          target="_blank"
          rel="noreferrer"
          className="action-link"
        >
          Yahoo Finance <ArrowUpRight size={16} />
        </a>
      </div>
    </PageShell>
  );
}
