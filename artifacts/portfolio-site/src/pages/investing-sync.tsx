import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { PageShell } from "@/components/page-shell";
import {
  buildYahooBookmark,
  extractYahooPercentages,
  formatPercent,
  validateSnapshot,
  type InvestingSnapshot,
} from "@/lib/core/investing";

export default function InvestingSync() {
  const bookmark = useRef<HTMLAnchorElement>(null);
  const [snapshot, setSnapshot] = useState<InvestingSnapshot | null>(null);
  const [key, setKey] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    const destination = new URL(
      `${import.meta.env.BASE_URL}investing/sync`,
      window.location.origin,
    ).href;
    bookmark.current?.setAttribute("href", buildYahooBookmark(destination));
    const captured = new URLSearchParams(window.location.hash.slice(1)).get(
      "snapshot",
    );
    if (captured) {
      window.history.replaceState(null, "", window.location.pathname);
      try {
        const parsed = validateSnapshot(JSON.parse(captured));
        if (parsed.source !== "browser-sync")
          throw new Error("Capture a new snapshot from Yahoo.");
        setSnapshot(parsed);
      } catch {
        setStatus(
          "Could not read that capture. Open the Yahoo summary and try again.",
        );
      }
    }
  }, []);
  const preview = () => {
    try {
      setSnapshot(
        validateSnapshot({
          ...extractYahooPercentages(text),
          capturedAt: new Date().toISOString(),
          source: "browser-sync",
        }),
      );
      setText("");
      setStatus("");
    } catch (error) {
      setStatus((error as Error).message);
    }
  };
  const publish = async () => {
    if (!snapshot) return;
    setSaving(true);
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}api/investing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify(snapshot),
        signal: AbortSignal.timeout(10_000),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not sync.");
      validateSnapshot(result);
      setKey("");
      setStatus("Saved. Your Investing page now shows these percentages.");
    } catch (error) {
      setStatus(
        error instanceof SyntaxError
          ? "Sync server unavailable. Start or configure the investing service."
          : (error as Error).message,
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <PageShell
      title="Sync from Yahoo."
      eyebrow="Owner / Portfolio update"
      intro="Capture the three gain/loss percentages from your signed-in Yahoo Finance summary, review them, and publish with your owner key."
    >
      <p className="mb-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        Scheduled captures run on weekdays at 5 PM Eastern through local automation on your
        computer, using your signed-in Yahoo session. If the computer is
        unavailable or Yahoo asks you to sign in again, the last successful
        capture stays visible. The tools below are a manual fallback for summary
        percentages.
      </p>
      <section className="archive-card max-w-3xl">
        <h2 className="font-display text-3xl">1. Capture the summary</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Drag the bookmark below to your browser’s bookmarks bar. Open Yahoo
          Finance → My Portfolio → All Portfolio Holdings, then click the
          bookmark. It reads the visible summary and brings just three
          percentages here for review.
        </p>
        <a
          ref={bookmark}
          className="action-link mt-6"
          onClick={(event) => {
            event.preventDefault();
            setStatus(
              "Drag this link to your bookmarks bar, then use it while viewing Yahoo Finance.",
            );
          }}
        >
          Sync portfolio ↗
        </a>
        <a
          href="https://finance.yahoo.com/portfolios/"
          target="_blank"
          rel="noreferrer"
          className="action-link mt-5"
        >
          Open Yahoo Finance ↗
        </a>
        <details className="mt-7">
          <summary className="cursor-pointer text-sm">
            If your browser blocks bookmarks
          </summary>
          <label htmlFor="yahoo-summary" className="mt-4 block text-sm">
            Paste the Yahoo summary here. It is parsed on this device; the
            pasted text is never submitted.
          </label>
          <textarea
            id="yahoo-summary"
            className="mt-3 min-h-32 w-full border border-border bg-background p-3 text-sm"
            value={text}
            onChange={(event) => setText(event.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          <button type="button" onClick={preview} className="action-link mt-3">
            Preview percentages
          </button>
        </details>
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          This manual fallback shares only the three summary percentages and
          replaces the previous snapshot, including its analytics. Scheduled
          captures also include named holdings' percentage returns and sector
          percentages. Yahoo passwords, cookies, balances and position sizes are
          never sent to this site.
        </p>
      </section>
      {snapshot && (
        <section className="archive-card mt-8 max-w-3xl">
          <h2 className="font-display text-3xl">2. Review & publish</h2>
          <dl className="mt-6 grid gap-5 sm:grid-cols-3">
            {[
              ["Unrealized", snapshot.unrealized],
              ["Realized", snapshot.realized],
              ["Day change", snapshot.dayChange],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="mt-2 font-display text-3xl">
                  {formatPercent(Number(value))}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-xs text-muted-foreground">
            Captured {new Date(snapshot.capturedAt).toLocaleString()}.
            Publishing makes these three percentages public.
          </p>
          <label htmlFor="publishing-key" className="mt-7 block text-sm">
            Owner publishing key
          </label>
          <input
            id="publishing-key"
            type="password"
            autoComplete="off"
            value={key}
            onChange={(event) => setKey(event.target.value)}
            className="mt-2 w-full border border-border bg-background p-3"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Use your portfolio’s publishing key, not your Yahoo password. The
            key is not saved in this browser.
          </p>
          <button
            disabled={saving || key.length < 32}
            onClick={() => void publish()}
            className="mt-6 bg-primary px-5 py-3 text-sm text-primary-foreground disabled:opacity-50"
          >
            {saving ? "Saving…" : "Publish percentages"}
          </button>
        </section>
      )}
      <p className="mt-6 text-sm" role="status">
        {status}
      </p>
      <Link href="/investing" className="action-link mt-8">
        Back to Investing
      </Link>
    </PageShell>
  );
}
