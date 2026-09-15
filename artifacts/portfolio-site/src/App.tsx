import { type ReactNode, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleArrowOutUpRight,
  Download,
  Github,
  Mail,
  Menu,
  MoveDown,
  X,
} from 'lucide-react';
import { capabilityIndex, navItems, notes, portfolioProfile, projects, strengths } from '@/lib/portfolio-data';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function useReveal() {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const items = node.querySelectorAll<HTMLElement>('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Home() {
  const pageRef = useReveal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!resumeOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setResumeOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
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
    <main ref={pageRef} className="portfolio-shell min-h-[100dvh] bg-background text-foreground grain">
      <header className="fixed left-0 right-0 top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-[4.5rem] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="#top" data-testid="link-home" className="group flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center bg-primary font-mono-ui text-[11px] font-bold tracking-[-.08em] text-primary-foreground transition-transform group-hover:rotate-[-8deg]">{portfolioProfile.monogram}</span>
            <span className="hidden text-sm font-semibold tracking-[-.02em] sm:block">{portfolioProfile.name}</span>
          </a>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} data-testid={`link-nav-${item.label.toLowerCase()}`} className="group relative text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground">
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setResumeOpen(true)} data-testid="button-header-resume" className="hidden items-center gap-2 border border-primary bg-primary px-4 py-2.5 text-[12px] font-bold text-primary-foreground transition hover:bg-secondary hover:text-secondary-foreground sm:flex">
              Resume <Download size={13} strokeWidth={2.5} />
            </button>
            <button type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} data-testid="button-mobile-menu" className="flex h-10 w-10 items-center justify-center border border-border md:hidden">
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
              <span className="sr-only">Toggle navigation</span>
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="border-t border-border bg-background px-5 py-4 md:hidden" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} data-testid={`link-mobile-${item.label.toLowerCase()}`} className="flex items-center justify-between border-b border-border py-4 text-sm font-semibold last:border-0">
                {item.label} <ChevronRight size={16} className="text-muted-foreground" />
              </a>
            ))}
            <button type="button" onClick={() => { setMenuOpen(false); setResumeOpen(true); }} data-testid="button-mobile-resume" className="mt-4 flex w-full items-center justify-between bg-primary px-4 py-3 text-sm font-bold text-primary-foreground">
              Resume <Download size={15} />
            </button>
          </nav>
        )}
      </header>

      <section id="top" className="relative mx-auto min-h-[720px] max-w-[1440px] px-5 pb-20 pt-32 sm:px-8 lg:px-12 lg:pt-40">
        <div className="hero-grid pointer-events-none absolute inset-0 -z-0" />
        <div className="hero-index reveal" aria-hidden="true">
          <span className="hero-index__label">Portfolio / 01</span>
          <span className="hero-index__line" />
          <span className="hero-index__label">Make room</span>
        </div>
        <div className="relative z-10 grid items-end gap-14 lg:grid-cols-[1.25fr_.75fr] lg:gap-20">
          <div>
            <div className="reveal flex items-center gap-3 font-mono-ui text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              {portfolioProfile.availability}
            </div>
            <h1 className="reveal reveal-delay-1 mt-8 max-w-[900px] font-display text-[clamp(4.5rem,11vw,10.75rem)] leading-[.82] tracking-[-.055em]">
              Good work<br /><em className="text-accent">needs</em> room.
            </h1>
            <div className="reveal reveal-delay-2 mt-10 flex max-w-[680px] flex-col gap-8 sm:flex-row sm:items-end">
              <p data-testid="text-hero-intro" className="max-w-[380px] text-lg leading-[1.35] text-muted-foreground sm:text-xl">{portfolioProfile.intro}</p>
              <a href="#work" data-testid="link-scroll-work" className="magnetic-link inline-flex w-fit items-center gap-2 border-b border-primary pb-2 text-[12px] font-bold uppercase tracking-[.13em]">See selected work <ArrowDown size={14} /></a>
            </div>
          </div>
          <div className="reveal reveal-delay-3 lg:pb-1">
            <div className="portrait-slot aspect-[4/5] max-w-[330px] ml-auto p-6 sm:p-8">
              <div className="portrait-orbit portrait-orbit--outer" />
              <div className="portrait-orbit portrait-orbit--inner" />
              <span className="portrait-orbit__dot portrait-orbit__dot--one" />
              <span className="portrait-orbit__dot portrait-orbit__dot--two" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="font-mono-ui text-[10px] uppercase tracking-[.16em] text-primary-foreground/65">{portfolioProfile.photoStatus}</span>
                  <CircleArrowOutUpRight size={18} strokeWidth={1.5} className="text-secondary" />
                </div>
                <div>
                  <div className="mb-4 h-px w-12 bg-secondary" />
                  <p className="max-w-[200px] font-display text-4xl leading-[.95]">A real photo can live here later.</p>
                  <p className="mt-4 max-w-[230px] text-xs leading-relaxed text-primary-foreground/65">For now, a quiet placeholder for the person behind the work.</p>
                </div>
              </div>
              <span className="signal-stamp">Replace with photo</span>
            </div>
          </div>
        </div>
        <div className="reveal mt-24 flex items-center gap-4 border-t border-border pt-5 font-mono-ui text-[10px] uppercase tracking-[.13em] text-muted-foreground">
          <MoveDown size={14} className="text-accent" /> Scroll to wander
          <span className="ml-auto hidden sm:inline">{portfolioProfile.location}</span>
        </div>
      </section>

      <div className="overflow-hidden border-y border-primary bg-primary py-3 text-primary-foreground">
        <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap font-mono-ui text-[10px] font-bold uppercase tracking-[.2em]">
          {[...Array(2)].flatMap((_, copyIndex) => ['Product thinking', 'Clear systems', 'Useful software', 'Human-scale work'].map((label, index) => <span key={`${copyIndex}-${index}`} className="flex items-center gap-8"><span>{label}</span><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-secondary" /></span>))}
        </div>
      </div>

      <section className="manifesto-band" aria-label="Portfolio statement">
        <div className="manifesto-band__inner">
          <span className="font-mono-ui text-[10px] uppercase tracking-[.16em]">A small belief</span>
          <p className="font-display text-4xl leading-[.9] tracking-[-.03em] sm:text-6xl">The best work leaves a little more possibility behind.</p>
          <span className="manifesto-band__mark" aria-hidden="true">↘</span>
        </div>
      </section>

      <section id="work" className="mx-auto max-w-[1440px] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="reveal mb-16 flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div>
            <p className="font-mono-ui text-[10px] font-bold uppercase tracking-[.18em] text-accent">01 / Selected work</p>
            <h2 className="mt-5 max-w-[600px] font-display text-6xl leading-[.88] tracking-[-.04em] sm:text-8xl">The work,<br /><em>in progress.</em></h2>
          </div>
          <p className="max-w-[300px] text-sm leading-relaxed text-muted-foreground">Starter content lives here until the real case studies arrive. The structure is ready for stories with more texture.</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-12">
          {projects.map((project, index) => (
            <article key={project.id} data-testid={`card-project-${project.id}`} className={`project-card reveal reveal-delay-${index + 1} group ${index === 0 ? 'lg:col-span-7' : index === 1 ? 'lg:col-span-5' : 'lg:col-span-6 lg:col-start-4'}`}>
              <div className={`project-visual relative flex aspect-[1.2/1] flex-col justify-between overflow-hidden border border-primary/15 p-6 sm:p-8 ${project.accent === 'lime' ? 'bg-secondary text-primary' : project.accent === 'tomato' ? 'bg-accent text-accent-foreground' : 'bg-[#d6ab62] text-primary'}`}>
                <div className="flex items-start justify-between">
                  <span className="font-mono-ui text-[10px] font-bold uppercase tracking-[.15em] opacity-65">Starter content / {project.index}</span>
                  <ArrowUpRight size={20} className="project-arrow" />
                </div>
                <div className="relative">
                  <div className="absolute -bottom-8 right-0 h-32 w-32 rounded-full border border-current opacity-25" />
                  <p className="relative max-w-[360px] font-display text-5xl leading-[.86] tracking-[-.04em] sm:text-7xl">{project.title}</p>
                  <p className="relative mt-5 max-w-[350px] text-sm leading-relaxed opacity-70">{project.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-x border-b border-border px-5 py-4">
                <span className="mr-auto font-mono-ui text-[10px] uppercase tracking-[.13em] text-muted-foreground">{project.type}</span>
                {project.tags.map((tag) => <span key={tag} className="font-mono-ui text-[9px] uppercase tracking-[.1em] text-muted-foreground">#{tag}</span>)}
                {project.githubUrl ? (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" data-testid={`link-project-github-${project.id}`} className="ml-2 inline-flex items-center gap-1 font-mono-ui text-[9px] font-bold uppercase tracking-[.1em] text-primary transition-colors hover:text-accent">GitHub <ArrowUpRight size={12} /></a>
                ) : null}
                {project.demoUrl ? (
                  <a href={project.demoUrl} target="_blank" rel="noreferrer" data-testid={`link-project-demo-${project.id}`} className="inline-flex items-center gap-1 font-mono-ui text-[9px] font-bold uppercase tracking-[.1em] text-primary transition-colors hover:text-accent">Live demo <ArrowUpRight size={12} /></a>
                ) : null}
                {!project.githubUrl && !project.demoUrl ? (
                  <span data-testid={`status-project-links-${project.id}`} className="font-mono-ui text-[9px] uppercase tracking-[.1em] text-muted-foreground/70">Links pending</span>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="capabilities" className="capability-section">
        <div className="mx-auto max-w-[1440px] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
          <div className="reveal grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-24">
            <div>
              <p className="font-mono-ui text-[10px] font-bold uppercase tracking-[.18em] text-accent">02 / Capability index</p>
              <h2 className="mt-5 max-w-[440px] font-display text-6xl leading-[.88] tracking-[-.04em] sm:text-8xl">Useful<br /><em>range.</em></h2>
            </div>
            <div className="flex items-end">
              <p className="max-w-[520px] text-sm leading-relaxed text-muted-foreground">A strong portfolio does more than list tools. It shows how knowledge moves from question to decision to something another person can use.</p>
            </div>
          </div>
          <div className="capability-list mt-16">
            {capabilityIndex.map((capability, index) => (
              <article key={capability.number} className={`capability-row reveal reveal-delay-${index + 1}`}>
                <span className="capability-row__number font-mono-ui">{capability.number}</span>
                <div>
                  <h3 className="font-display text-4xl leading-none tracking-[-.03em] sm:text-5xl">{capability.title}</h3>
                  <p className="mt-4 max-w-[560px] text-sm leading-relaxed text-muted-foreground">{capability.copy}</p>
                </div>
                <span className="capability-row__proof font-mono-ui">{capability.proof}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="practice" className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 py-28 sm:px-8 lg:grid-cols-[.85fr_1.15fr] lg:gap-28 lg:px-12 lg:py-40">
          <div className="reveal">
            <p className="font-mono-ui text-[10px] font-bold uppercase tracking-[.18em] text-secondary">02 / How I work</p>
            <h2 className="mt-5 max-w-[420px] font-display text-6xl leading-[.88] tracking-[-.04em] sm:text-8xl">A practice,<br /><em>not a pitch.</em></h2>
            <p className="mt-8 max-w-[320px] text-sm leading-relaxed text-primary-foreground/60">{portfolioProfile.statement}</p>
          </div>
          <div className="space-y-0">
            {strengths.map((strength, index) => (
              <div key={strength.number} className={`reveal reveal-delay-${index + 1} grid gap-5 border-t border-primary-foreground/20 py-7 sm:grid-cols-[60px_1fr] sm:gap-8`}>
                <span className="font-mono-ui text-[10px] text-secondary">{strength.number}</span>
                <div>
                  <h3 className="font-display text-3xl leading-none sm:text-4xl">{strength.title}</h3>
                  <p className="mt-3 max-w-[430px] text-sm leading-relaxed text-primary-foreground/60">{strength.copy}</p>
                </div>
              </div>
            ))}
            <div className="reveal flex items-center gap-3 border-t border-primary-foreground/20 pt-7 font-mono-ui text-[10px] uppercase tracking-[.14em] text-primary-foreground/55">
              <span className="h-2 w-2 rounded-full bg-secondary" /> Available for thoughtful collaborations
            </div>
          </div>
        </div>
      </section>

      <section id="notes" className="mx-auto max-w-[1440px] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="reveal flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div>
            <p className="font-mono-ui text-[10px] font-bold uppercase tracking-[.18em] text-accent">03 / Notes to self</p>
            <h2 className="mt-5 font-display text-6xl leading-[.88] tracking-[-.04em] sm:text-8xl">Thinking<br /><em>out loud.</em></h2>
          </div>
          <p className="max-w-[280px] text-sm leading-relaxed text-muted-foreground">A small corner for unfinished thoughts. No hot takes required.</p>
        </div>
        <div className="mt-16 grid border-t border-border md:grid-cols-3">
          {notes.map((note, index) => (
            <article key={note.number} data-testid={`card-note-${note.number}`} className={`reveal reveal-delay-${index + 1} group border-b border-border py-7 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0`}>
              <div className="flex items-center justify-between">
                <span className="font-mono-ui text-[10px] uppercase tracking-[.13em] text-accent">{note.kind}</span>
                <ArrowUpRight size={15} className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
              <h3 className="mt-10 max-w-[240px] font-display text-4xl leading-[.95]">{note.title}</h3>
              <p className="mt-5 max-w-[290px] text-sm leading-relaxed text-muted-foreground">{note.copy}</p>
              <div className="mt-8 flex items-center gap-2 font-mono-ui text-[9px] uppercase tracking-[.12em] text-muted-foreground"><span className="h-px w-6 bg-border" /> Drafting room</div>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="border-y border-border bg-[#e6d7ba]">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 py-28 sm:px-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-24 lg:px-12 lg:py-36">
          <div className="reveal">
            <p className="font-mono-ui text-[10px] font-bold uppercase tracking-[.18em] text-accent">04 / A little context</p>
            <div className="mt-8 flex h-24 w-24 items-center justify-center rounded-full border border-primary bg-secondary font-display text-4xl">{portfolioProfile.monogram}</div>
          </div>
          <div className="reveal reveal-delay-1">
            <p className="max-w-[800px] font-display text-5xl leading-[.92] tracking-[-.04em] sm:text-7xl">I care about the moment an idea stops being abstract and starts being useful.</p>
            <div className="mt-12 grid gap-7 border-t border-primary/20 pt-7 sm:grid-cols-2">
              <p className="text-sm leading-relaxed text-primary/70">This is the space for the human version of the bio: a few specifics, a point of view, and the things that make the work feel like it came from a person.</p>
              <div className="space-y-4 font-mono-ui text-[10px] uppercase tracking-[.12em] text-primary/65">
                <p><span className="text-accent">Currently:</span> collecting the right details</p>
                <p><span className="text-accent">Usually:</span> asking one more question</p>
                <p><span className="text-accent">Believes:</span> clarity is a creative act</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-accent text-accent-foreground">
        <div className="mx-auto max-w-[1440px] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
          <div className="reveal grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="font-mono-ui text-[10px] font-bold uppercase tracking-[.18em] opacity-60">05 / Make contact</p>
              <h2 className="mt-6 max-w-[850px] font-display text-[clamp(4rem,9vw,9rem)] leading-[.8] tracking-[-.06em]">Have a good<br /><em>question?</em></h2>
            </div>
            <p className="max-w-[260px] text-sm leading-relaxed opacity-70">A hello, a half-formed idea, or a project that needs a calm second brain.</p>
          </div>
          <div className="reveal reveal-delay-1 mt-16 flex flex-col gap-4 border-t border-accent-foreground/25 pt-6 sm:flex-row sm:items-center">
            <button type="button" onClick={copyEmail} data-testid="button-copy-email" className="magnetic-link inline-flex items-center gap-3 text-left font-mono-ui text-xs font-bold uppercase tracking-[.1em]">
              {copied ? <Check size={18} /> : <Mail size={18} />} {copied ? 'Address copied' : portfolioProfile.email}
            </button>
            <span className="hidden h-5 w-px bg-accent-foreground/25 sm:block" />
            <a href={`mailto:${portfolioProfile.email}`} data-testid="link-email" className="magnetic-link inline-flex items-center gap-2 font-mono-ui text-xs font-bold uppercase tracking-[.1em]">Start a conversation <ArrowUpRight size={16} /></a>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <p className="font-mono-ui text-[10px] uppercase tracking-[.13em] text-primary-foreground/55">© {new Date().getFullYear()} / {portfolioProfile.name}</p>
          <div className="flex flex-wrap items-center gap-5 font-mono-ui text-[10px] uppercase tracking-[.13em]">
            <button type="button" onClick={() => setResumeOpen(true)} data-testid="button-footer-resume" className="text-primary-foreground/65 transition hover:text-secondary">Resume</button>
            {portfolioProfile.githubUrl ? (
              <a href={portfolioProfile.githubUrl} target="_blank" rel="noreferrer" data-testid="link-github-profile" className="inline-flex items-center gap-2 text-primary-foreground/65 transition hover:text-secondary"><Github size={14} /> GitHub</a>
            ) : (
              <button type="button" onClick={() => setResumeOpen(true)} data-testid="button-github-slot" className="inline-flex items-center gap-2 text-primary-foreground/65 transition hover:text-secondary"><Github size={14} /> GitHub slot</button>
            )}
            <a href="#top" data-testid="link-back-top" className="inline-flex items-center gap-2 text-secondary">Back to top <ArrowUp size={14} /></a>
          </div>
        </div>
      </footer>

      {resumeOpen && (
        <div role="dialog" aria-modal="true" aria-labelledby="resume-dialog-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setResumeOpen(false); }} className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 p-5 backdrop-blur-sm">
          <div className="w-full max-w-[440px] border border-border bg-background p-7 shadow-2xl sm:p-9">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono-ui text-[10px] uppercase tracking-[.16em] text-accent">Resume</p>
                <h2 id="resume-dialog-title" className="mt-3 font-display text-5xl leading-none">Details,<br /><em>soon.</em></h2>
              </div>
              <button type="button" onClick={() => setResumeOpen(false)} data-testid="button-close-resume" className="flex h-9 w-9 items-center justify-center border border-border"><X size={16} /></button>
            </div>
            <p className="mt-7 text-sm leading-relaxed text-muted-foreground">The resume PDF is intentionally waiting for the real work history. In the meantime, start with a conversation and I will share the right context.</p>
            {portfolioProfile.resumeUrl ? (
              <a href={portfolioProfile.resumeUrl} target="_blank" rel="noreferrer" onClick={() => setResumeOpen(false)} data-testid="link-resume-download" className="mt-7 flex items-center justify-between bg-primary px-4 py-3 text-xs font-bold uppercase tracking-[.1em] text-primary-foreground">Open resume <Download size={16} /></a>
            ) : (
              <a href={`mailto:${portfolioProfile.email}`} onClick={() => setResumeOpen(false)} data-testid="link-resume-contact" className="mt-7 flex items-center justify-between bg-primary px-4 py-3 text-xs font-bold uppercase tracking-[.1em] text-primary-foreground">Ask for the current version <ArrowUpRight size={16} /></a>
            )}
            <p className="mt-4 font-mono-ui text-[9px] uppercase tracking-[.12em] text-muted-foreground">{portfolioProfile.resumeLabel}</p>
          </div>
        </div>
      )}
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
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
