import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { PageShell, SourceStatus } from "@/components/page-shell";
import { useRepositories } from "@/hooks/use-public-content";
import { repositoryNotes } from "@/lib/portfolio-data";

export default function Projects() {
  const query = useRepositories();
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("All");
  const items = query.data.items;
  const languages = [...new Set(items.map((repo) => repo.language))].sort();
  const filtered = useMemo(
    () =>
      items.filter((repo) => {
        const details = repositoryNotes[repo.name];
        return (
          (language === "All" || repo.language === language) &&
          `${repo.name} ${repo.description} ${details?.description ?? ""}`
            .toLowerCase()
            .includes(search.toLowerCase().trim())
        );
      }),
    [items, search, language],
  );
  return (
    <PageShell
      title="Things I’ve built."
      eyebrow="The project archive"
      intro="From computer vision and AI infrastructure to wearables, renovation tools, and fantasy football. Every public repository, with room for the experiments too."
    >
      <SourceStatus
        updatedAt={query.data.updatedAt}
        isError={query.isError}
        isFetching={query.isFetching}
        retry={() => void query.refetch()}
      />
      <div className="mb-8 grid gap-4 sm:grid-cols-[1fr_220px]">
        <label className="block text-sm">
          Search projects
          <span className="mt-2 flex items-center gap-3 border border-border bg-card px-4">
            <Search size={16} aria-hidden="true" />
            <input
              className="w-full bg-transparent py-3 outline-none"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Try vision, LNKZ, or Python"
            />
          </span>
        </label>
        <label className="block text-sm">
          Language
          <select
            className="mt-2 w-full border border-border bg-card p-3"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            <option>All</option>
            {languages.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="mb-6 text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} of {items.length} public repositories
      </p>
      <div className="grid gap-5 md:grid-cols-2">
        {filtered.map((repo) => (
          <article key={repo.name} className="archive-card">
            <div className="flex flex-wrap items-center justify-between gap-3 font-mono-ui text-[10px] uppercase tracking-wider text-muted-foreground">
              <span>{repo.language}</span>
              <span>
                {repo.archived
                  ? "Archived"
                  : repo.fork
                    ? "Fork"
                    : (repositoryNotes[repo.name]?.status ?? "Public project")}
              </span>
            </div>
            <h2 className="mt-8 break-words font-display text-4xl">
              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent"
              >
                {repositoryNotes[repo.name]?.title ?? repo.name}{" "}
                <ArrowUpRight className="inline" size={22} />
              </a>
            </h2>
            <p className="mt-5 flex-1 text-sm leading-relaxed text-muted-foreground">
              {repositoryNotes[repo.name]?.description ||
                repo.description ||
                "Source code and project details on GitHub."}
            </p>
            <a
              className="mt-8 text-sm underline underline-offset-4"
              href={repo.url}
              target="_blank"
              rel="noreferrer"
            >
              Explore {repo.name}
            </a>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <div className="border border-border p-10 text-center">
          <p>No projects match those filters.</p>
          <button
            className="mt-4 underline"
            onClick={() => {
              setSearch("");
              setLanguage("All");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </PageShell>
  );
}
