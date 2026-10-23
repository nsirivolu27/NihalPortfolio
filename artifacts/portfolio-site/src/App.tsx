import { type ReactNode, useEffect, useRef, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Projects from "@/pages/projects";
import Writing from "@/pages/writing";
import Investing from "@/pages/investing";
import InvestingSync from "@/pages/investing-sync";
import Featured from "@/pages/featured";
import Certifications from "@/pages/certifications";
import { CertificationsSection } from "@/components/certifications";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { usePortfolioProjects } from "@/hooks/use-project-settings";
import { ProjectManager } from "@/components/project-manager";
import { RepositoryGrid } from "@/components/repository-grid";
import { SourceStatus } from "@/components/page-shell";
import { education, technicalSkills } from "@/lib/portfolio-data";
import { CmdaBackdrop, ModelSketch } from "@/components/cmda-backdrop";
import { FeaturedProjects } from "@/components/featured-projects";
import type { SceneState } from "@/components/project-scene";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleArrowOutUpRight,
  Download,
  Github,
  Linkedin,
  Mail,
  Menu,
  X,
} from "lucide-react";
import {
  capabilityIndex,
  navItems,
  notes,
  portfolioProfile,
} from "@/lib/portfolio-data";
import { Route, Switch, useLocation, Router as WouterRouter } from "wouter";

const queryClient = new QueryClient();

function useReveal() {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const items = node.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Home() {
  const pageRef = useReveal();
  const repositories = usePortfolioProjects();
  const [featuredScene, setFeaturedScene] = useState<SceneState | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!resumeOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setResumeOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [resumeOpen]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(portfolioProfile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${portfolioProfile.email}`;
    }
  };

  return (
    <main
      ref={pageRef}
      className="portfolio-shell home-page min-h-[100dvh] bg-background text-foreground grain"
    >
      <CmdaBackdrop scene={featuredScene} />
      <a href="#top" className="skip-link">
        Skip to content
      </a>
      <header className="fixed left-0 right-0 top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-[4.5rem] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a
            href="#top"
            data-testid="link-home"
            className="group flex items-center gap-3"
          >
            <span className="flex h-9 w-9 items-center justify-center bg-primary font-mono-ui text-[11px] font-bold tracking-[-.08em] text-primary-foreground transition-transform group-hover:rotate-[-8deg]">
              {portfolioProfile.monogram}
            </span>
            <span className="hidden text-sm font-semibold tracking-[-.02em] sm:block">
              {portfolioProfile.name}
            </span>
          </a>
          <nav
            className="hidden items-center gap-5 lg:flex"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                data-testid={`link-nav-${item.label.toLowerCase()}`}
                className="group relative text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setResumeOpen(true)}
              data-testid="button-header-resume"
              className="hidden items-center gap-2 border border-primary bg-primary px-4 py-2.5 text-[12px] font-bold text-primary-foreground transition hover:bg-secondary hover:text-secondary-foreground sm:flex"
            >
              Resume <Download size={13} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              data-testid="button-mobile-menu"
              className="flex h-10 w-10 items-center justify-center border border-border lg:hidden"
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
              <span className="sr-only">Toggle navigation</span>
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav
            className="border-t border-border bg-background px-5 py-4 lg:hidden"
            aria-label="Mobile navigation"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                data-testid={`link-mobile-${item.label.toLowerCase()}`}
                className="flex items-center justify-between border-b border-border py-4 text-sm font-semibold last:border-0"
              >
                {item.label}{" "}
                <ChevronRight size={16} className="text-muted-foreground" />
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setResumeOpen(true);
              }}
              data-testid="button-mobile-resume"
              className="mt-4 flex w-full items-center justify-between bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"
            >
              Resume <Download size={15} />
            </button>
          </nav>
        )}
      </header>

      <section
        id="top"
        className="relative mx-auto max-w-[1440px] px-5 pb-12 pt-28 sm:px-8 lg:px-12 lg:pt-32"
      >
        <div className="hero-grid pointer-events-none absolute inset-0 -z-0" />
        <div className="hero-index reveal" aria-hidden="true">
          <span className="hero-index__label">Portfolio / 01</span>
          <span className="hero-index__line" />
          <span className="hero-index__label">CMDA / Virginia Tech</span>
        </div>
        <div className="relative z-10 grid items-end gap-8 lg:grid-cols-[1.25fr_.75fr] lg:gap-20">
          <div>
            <div className="reveal flex items-center gap-3 font-mono-ui text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              {portfolioProfile.availability}
            </div>
            <h1 className="reveal reveal-delay-1 mt-8 max-w-[900px] font-display text-[clamp(4.5rem,11vw,10.75rem)] leading-[.82] tracking-[-.055em]">
              Data to models.
              <br />
              <em className="text-accent">Models</em> to impact.
            </h1>
            <div className="reveal reveal-delay-2 mt-10 flex max-w-[680px] flex-col gap-8 sm:flex-row sm:items-end">
              <p
                data-testid="text-hero-intro"
                className="max-w-[380px] text-lg leading-[1.35] text-muted-foreground sm:text-xl"
              >
                {portfolioProfile.intro}
              </p>
              <div className="flex shrink-0 flex-col gap-5">
                <a
                  href={portfolioProfile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
                >
                  Read my resume <Download size={16} />
                </a>
                <a
                  href="#work"
                  data-testid="link-scroll-work"
                  className="magnetic-link inline-flex w-fit items-center gap-2 border-b border-primary pb-2 text-[12px] font-bold uppercase tracking-[.13em]"
                >
                  Explore projects <ArrowDown size={14} />
                </a>
              </div>
            </div>
          </div>
          <div className="reveal reveal-delay-3 lg:pb-1">
            <div className="portrait-slot aspect-[4/5] max-w-[330px] ml-auto p-6 sm:p-8">
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="font-mono-ui text-[10px] uppercase tracking-[.16em] text-primary-foreground/65">
                    CMDA / Virginia Tech
                  </span>
                  <CircleArrowOutUpRight
                    size={18}
                    strokeWidth={1.5}
                    className="text-secondary"
                  />
                </div>
                <ModelSketch />
                <div>
                  <div className="mb-4 h-px w-12 bg-secondary" />
                  <p className="max-w-[230px] font-display text-4xl leading-[.95]">
                    Observe.
                    <br />
                    Model. Validate.
                  </p>
                  <p className="mt-4 max-w-[230px] text-xs leading-relaxed text-primary-foreground/65">
                    Virginia Tech · Class of 2027
                    <br />
                    Engineer. Researcher. Writer.
                    <br />
                    Data, computing, and applied mathematics.
                  </p>
                </div>
              </div>
              <span className="signal-stamp">
                Projects / Research / Learning
              </span>
            </div>
          </div>
        </div>
      </section>

      <FeaturedProjects
        items={repositories.data.items}
        onSceneChange={setFeaturedScene}
      />

      <section id="work" className="page-width py-12 sm:py-16">
        <div className="mb-12 flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div>
            <p className="font-mono-ui text-[10px] font-bold uppercase tracking-[.18em] text-accent">
              01 / Public GitHub projects
            </p>
            <h2 className="mt-5 font-display text-6xl leading-[.88] tracking-[-.04em] sm:text-8xl">
              Everything
              <br />
              <em>I’m building.</em>
            </h2>
          </div>
          <p className="max-w-[340px] text-sm leading-relaxed text-muted-foreground">
            {repositories.data.items.length} projects across AI, data, and
            software. GitHub details update automatically.
          </p>
        </div>
        <ProjectManager />
        <SourceStatus
          updatedAt={repositories.data.updatedAt}
          isError={repositories.isError}
          isFetching={repositories.isFetching}
          retry={() => void repositories.refetch()}
        />
        <RepositoryGrid items={repositories.data.items} />
        <a href="projects" className="action-link mt-10">
          Browse all projects <ArrowUpRight size={18} />
        </a>
      </section>

      <section id="capabilities" className="capability-section">
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <div className="reveal grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-12">
            <div>
              <p className="font-mono-ui text-[10px] font-bold uppercase tracking-[.18em] text-accent">
                02 / Skills
              </p>
              <h2 className="mt-5 max-w-[440px] font-display text-6xl leading-[.88] tracking-[-.04em] sm:text-8xl">
                Technical
                <br />
                <em>skills.</em>
              </h2>
            </div>
            <div className="flex items-end">
              <p className="max-w-[520px] text-sm leading-relaxed text-muted-foreground">
                My coursework, research, and internships have given me experience
                in these four areas.
              </p>
            </div>
          </div>
          <div className="capability-list mt-8">
            {capabilityIndex.map((capability, index) => (
              <article
                key={capability.number}
                className={`capability-row reveal reveal-delay-${index + 1}`}
              >
                <span className="capability-row__number font-mono-ui">
                  {capability.number}
                </span>
                <div>
                  <h3 className="font-display text-4xl leading-none tracking-[-.03em] sm:text-5xl">
                    {capability.title}
                  </h3>
                  <p className="mt-4 max-w-[560px] text-sm leading-relaxed text-muted-foreground">
                    {capability.copy}
                  </p>
                </div>
                <span className="capability-row__proof font-mono-ui">
                  {capability.proof}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-width py-16" aria-label="Technical skills">
        <div className="grid gap-8 sm:grid-cols-2">
          {technicalSkills.map((group) => (
            <div key={group.label}>
              <h2 className="font-mono-ui text-xs uppercase tracking-wider text-accent">
                {group.label}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {group.items}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="notes"
        className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16"
      >
        <div className="reveal flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div>
            <p className="font-mono-ui text-[10px] font-bold uppercase tracking-[.18em] text-accent">
              04 / Experience
            </p>
            <h2 className="mt-5 font-display text-6xl leading-[.88] tracking-[-.04em] sm:text-8xl">
              Where I<br />
              <em>have worked.</em>
            </h2>
          </div>
          <p className="max-w-[280px] text-sm leading-relaxed text-muted-foreground">
            My experience includes computer vision, wearable technology, and
            cloud-based data systems.
          </p>
        </div>
        <div className="mt-8 grid border-t border-border md:grid-cols-3">
          {notes.map((note, index) => (
            <article
              key={note.number}
              data-testid={`card-note-${note.number}`}
              className={`reveal reveal-delay-${index + 1} group border-b border-border py-7 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono-ui text-[10px] uppercase tracking-[.13em] text-accent">
                  {note.kind}
                </span>
                <ArrowUpRight
                  size={15}
                  className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </div>
              <h3 className="mt-10 max-w-[240px] font-display text-4xl leading-[.95]">
                {note.title}
              </h3>
              <p className="mt-5 max-w-[290px] text-sm leading-relaxed text-muted-foreground">
                {note.copy}
              </p>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {note.highlights.map((highlight) => (
                  <li key={highlight} className="border-l border-accent pl-3">
                    {highlight}
                  </li>
                ))}
              </ul>
              <div className="mt-8 font-mono-ui text-[9px] uppercase tracking-[.12em] text-muted-foreground">
                {note.location}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="border-y border-border tint-sand">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-12 lg:px-12 lg:py-16">
          <div className="reveal">
            <p className="font-mono-ui text-[10px] font-bold uppercase tracking-[.18em] text-accent">
              05 / About me
            </p>
            <div className="mt-8 flex h-24 w-24 items-center justify-center rounded-full border border-primary bg-secondary font-display text-4xl">
              {portfolioProfile.monogram}
            </div>
          </div>
          <div className="reveal reveal-delay-1">
            <p className="max-w-[800px] font-display text-5xl leading-[.92] tracking-[-.04em] sm:text-7xl">
              I’m interested in how data and mathematical models can explain
              complex systems and inform better decisions.
            </p>
            <div className="mt-12 grid gap-7 border-t border-primary/20 pt-7 sm:grid-cols-2">
              <p className="text-sm leading-relaxed text-primary/70">
                I’m graduating from Virginia Tech in May 2027. My current work
                focuses on computer vision and software development. Outside
                of that, I enjoy writing, following financial markets, and
                fantasy football.
              </p>
              <div className="space-y-4 font-mono-ui text-[10px] uppercase tracking-[.12em] text-primary/65">
                <p>
                  <span className="text-accent">Currently:</span> AI Tourism
                  research at Virginia Tech
                </p>
                <p>
                  <span className="text-accent">Studying:</span> CMDA at
                  Virginia Tech, May 2027
                </p>
                <p>
                  <span className="text-accent">Certified:</span> AWS Solutions
                  Architect Associate & Cloud Practitioner
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-width py-12" aria-labelledby="education-title">
        <p className="font-mono-ui text-xs uppercase tracking-wider text-accent">
          Education & foundations
        </p>
        <h2 id="education-title" className="mt-5 font-display text-5xl">
          Virginia Tech.
        </h2>
        <p className="mt-5 text-lg">{education.degree}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {education.school} · {education.date}
        </p>
        <div className="mt-10">
          <h3 className="font-semibold">Coursework</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {education.coursework.map((course) => (
              <li
                key={course}
                className="border border-border px-3 py-2 text-xs text-muted-foreground"
              >
                {course}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CertificationsSection />

      <section
        className="border-t border-border bg-card"
        aria-labelledby="beyond-title"
      >
        <div className="page-width py-12">
          <p className="font-mono-ui text-xs uppercase tracking-wider text-accent">
            Beyond the code
          </p>
          <h2
            id="beyond-title"
            className="mt-5 font-display text-5xl sm:text-7xl"
          >
            A few other things
            <br />
            <em>I think about.</em>
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <a href="writing" className="archive-card group">
              <span className="font-mono-ui text-xs uppercase tracking-wider text-accent">
                Writing / 01
              </span>
              <h3 className="mt-6 font-display text-4xl">
                Nihal’s Blog About Stuff{" "}
                <ArrowUpRight className="inline" size={24} />
              </h3>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                My writing on technology, energy, and ideas I want to understand
                better.
              </p>
            </a>
            <a href="investing" className="archive-card group">
              <span className="font-mono-ui text-xs uppercase tracking-wider text-accent">
                Markets / 02
              </span>
              <h3 className="mt-6 font-display text-4xl">
                The investing portfolio{" "}
                <ArrowUpRight className="inline" size={24} />
              </h3>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                My stock research and performance updates from the investments
                I track in Yahoo Finance.
              </p>
            </a>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-accent text-accent-foreground">
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <div className="reveal grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="font-mono-ui text-[10px] font-bold uppercase tracking-[.18em] opacity-60">
                06 / Contact
              </p>
              <h2 className="mt-6 max-w-[850px] font-display text-[clamp(4rem,9vw,9rem)] leading-[.8] tracking-[-.06em]">
                Let’s get
                <br />
                <em>in touch.</em>
              </h2>
            </div>
            <p className="max-w-[260px] text-sm leading-relaxed opacity-70">
              Feel free to reach out about a role, a project, or something
              you’d like to discuss.
            </p>
          </div>
          <div className="reveal reveal-delay-1 mt-8 flex flex-col gap-4 border-t border-accent-foreground/25 pt-6 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={copyEmail}
              data-testid="button-copy-email"
              className="magnetic-link inline-flex items-center gap-3 text-left font-mono-ui text-xs font-bold uppercase tracking-[.1em]"
            >
              {copied ? <Check size={18} /> : <Mail size={18} />}{" "}
              {copied ? "Address copied" : portfolioProfile.email}
            </button>
            <span className="hidden h-5 w-px bg-accent-foreground/25 sm:block" />
            <a
              href={`mailto:${portfolioProfile.email}`}
              data-testid="link-email"
              className="magnetic-link inline-flex items-center gap-2 font-mono-ui text-xs font-bold uppercase tracking-[.1em]"
            >
              Start a conversation <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <p className="font-mono-ui text-[10px] uppercase tracking-[.13em] text-primary-foreground/55">
            © {new Date().getFullYear()} / {portfolioProfile.name}
          </p>
          <div className="flex flex-wrap items-center gap-5 font-mono-ui text-[10px] uppercase tracking-[.13em]">
            <button
              type="button"
              onClick={() => setResumeOpen(true)}
              data-testid="button-footer-resume"
              className="text-primary-foreground/65 transition hover:text-secondary"
            >
              Resume
            </button>
            {portfolioProfile.githubUrl ? (
              <a
                href={portfolioProfile.githubUrl}
                target="_blank"
                rel="noreferrer"
                data-testid="link-github-profile"
                className="inline-flex items-center gap-2 text-primary-foreground/65 transition hover:text-secondary"
              >
                <Github size={14} /> GitHub
              </a>
            ) : (
              <button
                type="button"
                onClick={() => setResumeOpen(true)}
                data-testid="button-github-slot"
                className="inline-flex items-center gap-2 text-primary-foreground/65 transition hover:text-secondary"
              >
                <Github size={14} /> GitHub slot
              </button>
            )}
            {portfolioProfile.linkedinUrl ? (
              <a
                href={portfolioProfile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                data-testid="link-linkedin-profile"
                className="inline-flex items-center gap-2 text-primary-foreground/65 transition hover:text-secondary"
              >
                <Linkedin size={14} /> LinkedIn
              </a>
            ) : null}
            <a
              href="#top"
              data-testid="link-back-top"
              className="inline-flex items-center gap-2 text-secondary"
            >
              Back to top <ArrowUp size={14} />
            </a>
          </div>
        </div>
      </footer>

      <Dialog open={resumeOpen} onOpenChange={setResumeOpen}>
        <DialogContent className="w-full max-w-[440px] border border-border bg-background p-7 shadow-2xl sm:p-9">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono-ui text-[10px] uppercase tracking-[.16em] text-accent">
                Resume
              </p>
              <DialogTitle className="mt-3 font-display text-5xl leading-none">
                The resume.
                <br />
                <em>Ready to read.</em>
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="mt-7 text-sm leading-relaxed text-muted-foreground">
            Experience, research, projects, technical skills, and certifications
            in one downloadable PDF.
          </DialogDescription>
          {portfolioProfile.resumeUrl ? (
            <a
              href={portfolioProfile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setResumeOpen(false)}
              data-testid="link-resume-download"
              className="mt-7 flex items-center justify-between bg-primary px-4 py-3 text-xs font-bold uppercase tracking-[.1em] text-primary-foreground"
            >
              Open resume <Download size={16} />
            </a>
          ) : (
            <a
              href={`mailto:${portfolioProfile.email}`}
              onClick={() => setResumeOpen(false)}
              data-testid="link-resume-contact"
              className="mt-7 flex items-center justify-between bg-primary px-4 py-3 text-xs font-bold uppercase tracking-[.1em] text-primary-foreground"
            >
              Ask for the current version <ArrowUpRight size={16} />
            </a>
          )}
          <p className="mt-4 font-mono-ui text-[9px] uppercase tracking-[.12em] text-muted-foreground">
            {portfolioProfile.resumeLabel}
          </p>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/projects" component={Projects} />
        <Route path="/featured" component={Featured} />
        <Route path="/certifications" component={Certifications} />
        <Route path="/writing" component={Writing} />
        <Route path="/investing" component={Investing} />
        <Route path="/investing/sync" component={InvestingSync} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
