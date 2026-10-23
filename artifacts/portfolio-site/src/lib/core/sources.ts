export type Repository = {
  name: string;
  description: string;
  url: string;
  language: string;
  archived: boolean;
  fork: boolean;
  pushedAt?: string;
};

export type BlogPost = {
  title: string;
  url: string;
  published: string;
  labels?: string[];
};

export function isInvestingPost(post: BlogPost): boolean {
  return (
    post.url.endsWith("/canoo-buy-now.html") ||
    (post.labels ?? []).some((label) =>
      ["investing", "finance", "stock analysis", "weekly market review"].includes(
        label.trim().toLowerCase(),
      ),
    )
  );
}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Invalid source data");
  return value as Record<string, unknown>;
}

export function normalizeRepositories(value: unknown): Repository[] {
  if (!Array.isArray(value))
    throw new Error("GitHub returned an invalid repository list");
  return value
    .map((item) => {
      const repo = record(item);
      const owner = record(repo.owner);
      if (
        owner.login !== "nsirivolu27" ||
        repo.private !== false ||
        typeof repo.name !== "string" ||
        repo.html_url !== `https://github.com/nsirivolu27/${repo.name}`
      ) {
        throw new Error("Unexpected or non-public repository");
      }
      return {
        name: repo.name,
        description:
          typeof repo.description === "string" && repo.description !== "None"
            ? repo.description
            : "",
        url: repo.html_url as string,
        language:
          typeof repo.language === "string" ? repo.language : "Not specified",
        archived: repo.archived === true,
        fork: repo.fork === true,
        ...(typeof repo.pushed_at === "string" && Number.isFinite(Date.parse(repo.pushed_at))
          ? { pushedAt: repo.pushed_at }
          : {}),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function normalizeBlog(value: unknown): BlogPost[] {
  const feed = record(record(value).feed);
  const entries = feed.entry ?? [];
  if (!Array.isArray(entries))
    throw new Error("Blogger returned an invalid feed");
  return entries
    .map((item) => {
      const entry = record(item);
      const title = record(entry.title).$t;
      const published = record(entry.published).$t;
      const links = entry.link;
      if (!Array.isArray(links)) throw new Error("Missing blog links");
      const url = links
        .map(record)
        .find((link) => link.rel === "alternate")?.href;
      if (
        typeof title !== "string" ||
        typeof published !== "string" ||
        !Number.isFinite(Date.parse(published)) ||
        typeof url !== "string" ||
        new URL(url).origin !== "https://nihalsblogaboutstuff.blogspot.com"
      ) {
        throw new Error("Invalid blog entry");
      }
      const labels = Array.isArray(entry.category)
        ? entry.category.flatMap((category) => {
            if (!category || typeof category !== "object") return [];
            const term = (category as Record<string, unknown>).term;
            return typeof term === "string" && term.trim() ? [term.trim()] : [];
          })
        : [];
      return {
        title: title.trim(),
        published,
        url,
        ...(labels.length ? { labels: [...new Set(labels)] } : {}),
      };
    })
    .sort((a, b) => Date.parse(b.published) - Date.parse(a.published));
}
