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
                  : repo.url.startsWith("https://github.com/")
                    ? "Public repository"
                    : "Project"}
            </span>
          </div>
          <h3 className="mt-4 break-words font-display text-3xl">
            <a
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent"
            >
              {repo.name} <ArrowUpRight className="inline" size={22} />
            </a>
          </h3>
          {repo.description && (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {repo.description}
            </p>
          )}
          {repo.pushedAt && (
            <p className="mt-4 text-xs text-muted-foreground">
              Last push{" "}
              <time dateTime={repo.pushedAt}>
                {new Date(repo.pushedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
