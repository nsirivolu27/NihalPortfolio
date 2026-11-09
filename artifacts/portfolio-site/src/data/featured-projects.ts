export type ProjectTheme = "quantum" | "football" | "relay" | "workflow";

// Change this list to choose featured repositories. Names must match GitHub exactly.
// The name, description and source link are always supplied by the repository feed.
export const featuredProjects: {
  repository: string;
  theme: ProjectTheme;
  world: string;
  control: string;
}[] = [
  {
    repository: "Magentic.AI",
    theme: "workflow",
    world: "AI / Human review",
    control: "Explore the stages",
  },
  {
    repository: "quantum-datacenter-anomaly",
    theme: "quantum",
    world: "Quantum / Data infrastructure",
    control: "Rotate the qubit",
  },
  {
    repository: "fantasy-copilot",
    theme: "football",
    world: "Sports / Decision science",
    control: "Trace the play",
  },
  {
    repository: "LNKZ",
    theme: "relay",
    world: "Connected systems / Context",
    control: "Move the signal",
  },
];
