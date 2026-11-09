import { useQuery } from "@tanstack/react-query";
import {
  curateProjects,
  emptyProjectSettings,
  validateProjectSettings,
} from "@/lib/core/projects";
import { useRepositories } from "./use-public-content";

export function useProjectSettings() {
  return useQuery({
    queryKey: ["project-settings"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.BASE_URL}api/projects`, {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) throw new Error("Project settings unavailable.");
      return validateProjectSettings(await response.json());
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: false,
  });
}

export function usePortfolioProjects() {
  const repos = useRepositories();
  const settings = useProjectSettings();
  return {
    ...repos,
    data: {
      ...repos.data,
      items: curateProjects(
        repos.data.items,
        settings.data ?? emptyProjectSettings,
      ),
    },
    settings,
  };
}
