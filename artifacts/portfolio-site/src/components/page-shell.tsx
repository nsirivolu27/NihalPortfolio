import { type ReactNode, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { portfolioProfile } from "@/lib/portfolio-data";
import { CmdaBackdrop } from "./cmda-backdrop";

export function PageShell({
  title,
  eyebrow,
  intro,
  children,
}: {
  title: string;
  eyebrow: string;
  intro: string;
  children: ReactNode;
}) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} — Nihal Sirivolu`;
    window.scrollTo(0, 0);
    return () => {
      document.title = previous;
    };
  }, [title]);
  return (
    <div className="portfolio-shell min-h-screen bg-background text-foreground">
      <CmdaBackdrop />
      <a href="#page-content" className="skip-link">
        Skip to content
      </a>
      <header className="border-b border-border">
        <div className="page-width flex flex-wrap items-center justify-between gap-5 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-3 font-semibold"
          >
            <span className="monogram">NS</span> Nihal Sirivolu
          </Link>
          <nav
            aria-label="Main navigation"
            className="flex flex-wrap gap-x-6 gap-y-3 text-sm"
          >
            <a
              href={portfolioProfile.resumeUrl}
              target="_blank"
              rel="noreferrer"
            >
              Resume ↗
            </a>
            <Link href="/projects">Projects</Link>
            <Link href="/">Experience & about</Link>
            <Link href="/writing">Writing</Link>
            <Link href="/investing">Investing</Link>
          </nav>
        </div>
      </header>
      <main id="page-content" className="page-width pb-24">
        <div className="py-16 sm:py-24">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground"
          >
            <ArrowLeft size={14} /> Back to home
          </Link>
          <p className="mt-12 font-mono-ui text-xs uppercase tracking-widest text-accent">
            {eyebrow}
          </p>
          <h1 className="mt-5 font-display text-6xl leading-none tracking-tight sm:text-8xl">
            {title}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {intro}
          </p>
        </div>
        {children}
      </main>
      <footer className="border-t border-border">
        <div className="page-width flex flex-wrap justify-between gap-5 py-8 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} Nihal Sirivolu</span>
          <a
            href={`mailto:${portfolioProfile.email}`}
            className="inline-flex items-center gap-2"
          >
            Let’s talk <ArrowUpRight size={16} />
          </a>
        </div>
      </footer>
    </div>
  );
}

export function SourceStatus({
  updatedAt,
  isError,
  isFetching,
  retry,
}: {
  updatedAt: string;
  isError: boolean;
  isFetching: boolean;
  retry: () => void;
}) {
  return (
    <div
      className="mb-8 flex flex-wrap items-center gap-3 text-xs text-muted-foreground"
      role="status"
    >
      <span>
        {isFetching
          ? "Checking for updates…"
          : isError
            ? "Live refresh unavailable. Showing saved content."
            : "Public source snapshot."}{" "}
        Updated{" "}
        {new Date(updatedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
        .
      </span>
      <button
        type="button"
        onClick={retry}
        disabled={isFetching}
        className="underline underline-offset-4 disabled:opacity-50"
      >
        Refresh
      </button>
    </div>
  );
}
