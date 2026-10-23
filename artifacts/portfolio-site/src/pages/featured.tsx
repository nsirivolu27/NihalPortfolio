import { useEffect, useState } from "react";
import { Link } from "wouter";
import { FeaturedProjects } from "@/components/featured-projects";
import { CmdaBackdrop } from "@/components/cmda-backdrop";
import type { SceneState } from "@/components/project-scene";
import { usePortfolioProjects } from "@/hooks/use-project-settings";
import { portfolioProfile } from "@/lib/portfolio-data";
import { SourceStatus } from "@/components/page-shell";

export default function Featured() {
  const repositories = usePortfolioProjects();
  const [scene, setScene] = useState<SceneState | null>(null);
  useEffect(() => {
    const previous = document.title;
    document.title = "Featured projects — Nihal Sirivolu";
    return () => {
      document.title = previous;
    };
  }, []);
  return (
    <div
      className="portfolio-shell featured-page"
      data-theme={scene?.theme ?? "workflow"}
    >
      <CmdaBackdrop scene={scene} />
      <a href="#featured" className="skip-link">
        Skip to featured project
      </a>
      <header className="featured-page-nav page-width">
        <Link href="/" className="featured-home">
          <span className="monogram">NS</span>Nihal Sirivolu
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/projects">All projects</Link>
          <a href={portfolioProfile.resumeUrl} target="_blank" rel="noreferrer">
            Resume ↗
          </a>
        </nav>
      </header>
      <main>
        <FeaturedProjects
          items={repositories.data.items}
          onSceneChange={setScene}
          standalone
        />
        <div className="page-width">
          <SourceStatus
            updatedAt={repositories.data.updatedAt}
            isError={repositories.isError}
            isFetching={repositories.isFetching}
            retry={() => void repositories.refetch()}
          />
          <p className="text-xs text-muted-foreground">
            GitHub metadata refreshes every five minutes while this page is
            visible. The featured selection is curated; repository details come
            from GitHub.
          </p>
        </div>
      </main>
      <footer className="page-width featured-page-footer">
        Built by Nihal Sirivolu. Project descriptions from GitHub. Interactive
        scenes are illustrations.
      </footer>
    </div>
  );
}
