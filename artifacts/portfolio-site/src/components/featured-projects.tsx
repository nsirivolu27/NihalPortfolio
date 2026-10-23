import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { featuredProjects } from "@/data/featured-projects";
import type { Repository } from "@/lib/core/sources";
import { ProjectScene, type SceneState } from "./project-scene";
import { WorkflowPreview } from "./workflow-preview";

export function FeaturedProjects({
  items,
  onSceneChange,
  standalone = false,
}: {
  items: Repository[];
  onSceneChange: (scene: SceneState | null) => void;
  standalone?: boolean;
}) {
  const section = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState(
    () =>
      (standalone &&
        new URLSearchParams(window.location.search).get("project")) ||
      featuredProjects[0].repository,
  );
  const [progress, setProgress] = useState(35);
  const [inView, setInView] = useState(false);
  const available = featuredProjects.flatMap((feature) => {
    const repo = items.find((item) => item.name === feature.repository);
    return repo ? [{ ...feature, repo }] : [];
  });
  const active =
    available.find((item) => item.repository === selected) ?? available[0];

  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "-15% 0px -15% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    onSceneChange(
      (standalone || inView) && active
        ? { theme: active.theme, progress }
        : null,
    );
    return () => onSceneChange(null);
  }, [inView, standalone, active?.theme, progress, onSceneChange]);

  useEffect(() => {
    if (!standalone || !active) return;
    const url = new URL(window.location.href);
    url.searchParams.set("project", active.repository);
    window.history.replaceState(window.history.state, "", url);
  }, [standalone, active?.repository]);

  if (!active) return null;
  const Heading = standalone ? "h1" : "h2";
  return (
    <section
      ref={section}
      id="featured"
      className="featured-section page-width"
      data-theme={active.theme}
      aria-labelledby="featured-heading"
    >
      <div className="featured-heading">
        <div>
          <p className="featured-eyebrow">
            {standalone
              ? "Featured project / Overview"
              : "Selected projects / Interactive previews"}
          </p>
          <Heading id="featured-heading">
            {standalone ? (
              active.repository
            ) : (
              <>
                Featured projects.
                <br />
                <em>A closer look.</em>
              </>
            )}
          </Heading>
        </div>
        <p>
          {active.theme === "workflow"
            ? "Magentic.AI is a workspace for reviewing AI-generated work. Explore how a draft moves through review and approval."
            : "Choose a project to explore its interactive preview and find the code on GitHub."}
        </p>
      </div>
      <div className="featured-stage" data-theme={active.theme}>
        {active.theme === "workflow" && (
          <div className="featured-stage-backdrop" aria-hidden="true">
            <ProjectScene theme={active.theme} progress={progress} />
          </div>
        )}
        <div
          className="featured-choices"
          role="group"
          aria-label="Featured projects"
        >
          {available.map((feature, index) => (
            <button
              key={feature.repository}
              type="button"
              aria-pressed={active.repository === feature.repository}
              aria-controls="featured-detail"
              onClick={() => {
                setSelected(feature.repository);
                setProgress(35);
              }}
            >
              <span aria-hidden="true">0{index + 1}</span>
              {feature.repository}
            </button>
          ))}
        </div>
        <div className="featured-body" id="featured-detail">
          <div className="featured-copy" aria-live="polite" aria-atomic="true">
            <p className="featured-eyebrow">{active.world}</p>
            <h3>{active.repo.name}</h3>
            <p className="featured-description">
              {active.repo.description ||
                "Find the code and documentation on GitHub."}
            </p>
            <span className="featured-language">
              {active.repo.language}
              {active.repo.archived ? " / Archived" : " / Public repository"}
            </span>
            {active.repo.pushedAt && (
              <p className="featured-language">
                Last push{" "}
                <time dateTime={active.repo.pushedAt}>
                  {new Date(active.repo.pushedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </p>
            )}
            <a
              className="featured-source"
              href={active.repo.url}
              target="_blank"
              rel="noreferrer"
            >
              Explore the project <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="featured-world">
            {active.theme === "workflow" ? (
              <WorkflowPreview progress={progress} onChange={setProgress} />
            ) : (
              <>
                <div className="featured-art" key={active.theme}>
                  <ProjectScene theme={active.theme} progress={progress} />
                </div>
                <div className="featured-control">
                  <label htmlFor="scene-progress">
                    {active.control}
                    <span aria-hidden="true">↔</span>
                  </label>
                  <input
                    id="scene-progress"
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(event) =>
                      setProgress(Number(event.target.value))
                    }
                  />
                  <p>
                    Interactive illustration · explore the real project on
                    GitHub
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="featured-footer">
          <span>
            0{available.indexOf(active) + 1} / 0{available.length}
          </span>
          <span>Explore the ideas behind each project.</span>
          <a
            href={
              standalone
                ? `${import.meta.env.BASE_URL}projects`
                : `${import.meta.env.BASE_URL}featured?project=${encodeURIComponent(active.repository)}`
            }
          >
            {standalone ? "All repositories ↗" : "Open featured page ↗"}
          </a>
        </div>
      </div>
    </section>
  );
}
