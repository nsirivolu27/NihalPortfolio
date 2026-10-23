import { useMemo, useState } from "react";
import { ProjectManager } from "@/components/project-manager";
import { Search } from "lucide-react";
import { PageShell, SourceStatus } from "@/components/page-shell";
import { usePortfolioProjects } from "@/hooks/use-project-settings";
import { RepositoryGrid } from "@/components/repository-grid";

export default function Projects() {
  const query = usePortfolioProjects();
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("All");
  const items = query.data.items;
  const languages = [...new Set(items.map((repo) => repo.language))].sort();
  const filtered = useMemo(
    () =>
      items.filter((repo) => {
        return (
          (language === "All" || repo.language === language) &&
          `${repo.name} ${repo.description} ${repo.language}`
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
      intro="My projects cover computer vision, data analysis, software development, and a few personal interests. Browse the collection or filter by language."
    >
      <ProjectManager />
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
        {filtered.length} of {items.length} projects
      </p>
      <RepositoryGrid items={filtered} />
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
