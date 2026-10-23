import { useQuery } from "@tanstack/react-query";
import savedRepos from "@/data/github.json";
import savedBlog from "@/data/blog.json";
import { normalizeBlog, normalizeRepositories } from "@/lib/core/sources";

async function get(url: string, signal: AbortSignal) {
  const response = await fetch(url, {
    signal: AbortSignal.any([signal, AbortSignal.timeout(10000)]),
  });
  if (!response.ok) throw new Error("Source temporarily unavailable");
  return response.json();
}

export function useRepositories() {
  return useQuery({
    queryKey: ["public-repositories"],
    queryFn: async ({ signal }) => {
      const items = [];
      for (let page = 1; ; page++) {
        const batch = await get(
          `https://api.github.com/users/nsirivolu27/repos?type=owner&per_page=100&page=${page}`,
          signal,
        );
        items.push(...normalizeRepositories(batch));
        if (batch.length < 100) break;
      }
      return { updatedAt: new Date().toISOString(), items };
    },
    initialData: savedRepos,
    initialDataUpdatedAt: Date.parse(savedRepos.updatedAt),
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
}

export function useBlog() {
  return useQuery({
    queryKey: ["public-blog"],
    queryFn: async ({ signal }) => {
      const items = [];
      for (let start = 1; ; start += 100) {
        const batch = await get(
          `https://nihalsblogaboutstuff.blogspot.com/feeds/posts/default?alt=json&max-results=100&start-index=${start}`,
          signal,
        );
        const posts = normalizeBlog(batch);
        items.push(...posts);
        if (posts.length < 100) break;
      }
      return { updatedAt: new Date().toISOString(), items };
    },
    initialData: savedBlog,
    initialDataUpdatedAt: Date.parse(savedBlog.updatedAt),
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
}
