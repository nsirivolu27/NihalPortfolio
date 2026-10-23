import { ArrowUpRight } from "lucide-react";
import type { Repository } from "@/lib/core/sources";

export function RepositoryGrid({ items }: { items: Repository[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((repo) => (
        <article
          key={repo.name}
          className="archive-card min-w-0"
          data-testid={`repository-${repo.name}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono-ui text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>{repo.language}</span>
            <span>
              {repo.archived
                ? "Archived"
                : repo.fork
                  ? "Fork"
                  : "Public repository"}
            </span>
          </div>
          <h3 className="mt-8 break-words font-display text-4xl">
            <a
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent"
            >
              {repo.name} <ArrowUpRight className="inline" size={22} />
            </a>
          </h3>
          <p className="mt-5 flex-1 text-sm leading-relaxed text-muted-foreground">
            {repo.description ||
              "No description provided on GitHub. Open the repository for its source and README."}
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
  );
}
