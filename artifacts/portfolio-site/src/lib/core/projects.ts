export type AddedProject = {
  name: string;
  description: string;
  url: string;
  language: string;
};
export type ProjectSettings = {
  revision: number;
  hidden: string[];
  additions: AddedProject[];
};
export const emptyProjectSettings: ProjectSettings = {
  revision: 0,
  hidden: [],
  additions: [],
};

export function validateProjectSettings(value: unknown): ProjectSettings {
  const exact = (v: unknown, keys: string[]): v is Record<string, unknown> =>
    Boolean(
      v &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      Object.keys(v).length === keys.length &&
      Object.keys(v).every((k) => keys.includes(k)),
    );
  const safeUrl = (url: unknown) => {
    if (typeof url !== "string" || url.length > 500) return false;
    try {
      const parsed = new URL(url);
      return (
        parsed.protocol === "https:" && !parsed.username && !parsed.password
      );
    } catch {
      return false;
    }
  };
  if (
    !exact(value, ["revision", "hidden", "additions"]) ||
    !Number.isSafeInteger(value.revision) ||
    (value.revision as number) < 0 ||
    !Array.isArray(value.hidden) ||
    value.hidden.length > 300 ||
    !value.hidden.every(safeUrl) ||
    new Set(value.hidden).size !== value.hidden.length ||
    !Array.isArray(value.additions) ||
    value.additions.length > 100
  )
    throw new Error("Invalid project settings.");
  const urls = new Set();
  for (const project of value.additions) {
    if (
      !exact(project, ["name", "description", "url", "language"]) ||
      !safeUrl(project.url) ||
      urls.has(project.url) ||
      typeof project.name !== "string" ||
      !project.name.trim() ||
      project.name.length > 100 ||
      typeof project.description !== "string" ||
      project.description.length > 1000 ||
      typeof project.language !== "string" ||
      !project.language.trim() ||
      project.language.length > 60
    )
      throw new Error("Invalid or duplicate project.");
    urls.add(project.url);
  }
  return value as ProjectSettings;
}

// GitHub stays authoritative for its repositories; hiding survives later refreshes.
export function curateProjects<T extends AddedProject>(
  repos: T[],
  settings: ProjectSettings,
) {
  const known = new Set(repos.map((p) => p.url));
  return [
    ...repos,
    ...settings.additions
      .filter((p) => !known.has(p.url))
      .map((p) => ({ ...p, archived: false, fork: false })),
  ].filter((p) => !settings.hidden.includes(p.url));
}
