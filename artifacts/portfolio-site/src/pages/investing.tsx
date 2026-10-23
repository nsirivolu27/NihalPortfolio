import { InvestingAnalyticsView } from "@/components/investing-analytics";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import snapshotData from "@/data/investing.json";
import { formatPercent, validateSnapshot } from "@/lib/core/investing";
import { useBlog } from "@/hooks/use-public-content";
import { blogNotes } from "@/lib/portfolio-data";
import { isInvestingPost } from "@/lib/core/sources";

export default function Investing() {
  const blog = useBlog();
  const query = useQuery({
    queryKey: ["investing"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.BASE_URL}api/investing`, {
        signal: AbortSignal.timeout(8000),
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Sync unavailable");
      return validateSnapshot(await response.json());
    },
    retry: false,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
  const snapshot = query.data ?? validateSnapshot(snapshotData);
  const date =
    snapshot.capturedAt.length === 10
      ? `${snapshot.capturedAt}T12:00:00`
      : snapshot.capturedAt;
  const essays = blog.data.items.filter(isInvestingPost);
  return (
    <PageShell
      title="Investing & analysis."
      eyebrow="Markets / Research and performance"
      intro="I use this page to share my stock research and the performance of investments I track manually in Yahoo Finance. Each update shows when the data was captured."
    >
      <section aria-labelledby="performance-title">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
          <h2 id="performance-title" className="font-display text-4xl">
            Portfolio snapshot.
          </h2>
          <button
            className="action-link"
            disabled={query.isFetching}
            onClick={() => void query.refetch()}
          >
            {query.isFetching ? "Checking…" : "Refresh snapshot"}
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Unrealized gain / loss", snapshot.unrealized],
            ["Realized gain / loss", snapshot.realized],
            ["Day change", snapshot.dayChange],
          ].map(([label, value]) => (
            <div key={label} className="archive-card">
              <p className="font-mono-ui text-xs text-muted-foreground">
                {label}
              </p>
              <p
                className={`mt-6 font-display text-5xl ${Number(value) < 0 ? "text-accent" : "text-foreground"}`}
              >
                {formatPercent(Number(value))}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground" role="status">
          {snapshot.source === "screenshot"
            ? "Screenshot supplied"
            : "Synced from Yahoo Finance"}{" "}
          <time dateTime={snapshot.capturedAt}>
            {new Date(date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </time>
          .
          {snapshot.source === "screenshot"
            ? " The screenshot’s valuation date was not provided."
            : ` Captured ${new Date(date).toLocaleTimeString("en-US", { timeZoneName: "short" })}.`}
          {query.isError
            ? " Live refresh unavailable; showing the last available snapshot."
            : ""}
        </p>
        {Date.now() - Date.parse(snapshot.capturedAt) >
          4 * 24 * 60 * 60_000 && (
          <p role="status" className="mt-3 text-sm text-accent">
            This snapshot is more than four days old. A new Yahoo capture is
            pending.
          </p>
        )}
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Yahoo's reported percentages are separate, not added or annualized.
          Day change refers to the captured trading day.
        </p>
      </section>
      {snapshot.analytics && (
        <InvestingAnalyticsView analytics={snapshot.analytics} />
      )}
      <section
        className="mt-10 border-t border-border pt-8"
        aria-labelledby="analysis-title"
      >
        <p className="font-mono-ui text-xs uppercase tracking-wider text-accent">
          Research notes / From the blog
        </p>
        <h2 id="analysis-title" className="mt-4 font-display text-5xl">
          Stock analysis.
        </h2>
        <div className="mt-8 grid gap-5">
          {essays.map((post) => (
            <article key={post.url} className="archive-card">
              <p className="font-mono-ui text-xs text-muted-foreground">
                <time dateTime={post.published}>
                  {new Date(post.published).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </p>
              <h3 className="mt-4 font-display text-4xl">{post.title}</h3>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {blogNotes[post.url] ??
                  "Read my market research and analysis on Nihal’s Blog About Stuff."}
              </p>
              <a
                href={post.url}
                target="_blank"
                rel="noreferrer"
                className="action-link mt-6"
              >
                Read the original analysis <ArrowUpRight size={16} />
              </a>
            </article>
          ))}
        </div>
        <p className="mt-5 text-xs text-muted-foreground">
          Original publication dates are preserved. These essays reflect my
          thinking at the time, rather than a current recommendation.
        </p>
      </section>
      <div className="mt-12 flex flex-wrap gap-6 text-sm">
        <Link href="/writing" className="action-link">
          More writing <ArrowUpRight size={16} />
        </Link>
        <Link href="/investing/sync" className="action-link">
          Owner sync <ArrowUpRight size={16} />
        </Link>
      </div>
    </PageShell>
  );
}
