import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { PageShell, SourceStatus } from "@/components/page-shell";
import { useBlog } from "@/hooks/use-public-content";
import { blogNotes, portfolioProfile } from "@/lib/portfolio-data";

const collections = [
  {
    title: "Research papers",
    works: [
      {
        title:
          "Learning Rules from Examples: Reasoning and Evaluation in ARC-AGI-2",
        credit: "Nihal Sirivolu",
        description:
          "How can we tell whether a solver learned a rule or simply matched the examples? This synthesis compares approaches to generating, checking, and scoring answers on ARC-AGI-2.",
        link: "https://github.com/nsirivolu27/arc-agi-2-research/blob/main/paper/arc-agi-2-research.pdf",
        format: "Research synthesis · PDF",
      },
      {
        title:
          "CNN Processing in Radiology: Data Preparation and Supervision in Knee MRI",
        credit: "Nihal Sirivolu and Nikhil Sirivolu",
        description:
          "We audited knee MRI exams and their radiology reports to understand what a model could learn from them. Only 58 of 4,407 exams had expert labels for all twelve findings.",
        link: "https://github.com/nsirivolu27/rsna-knee-abnormality-detection/blob/main/docs/paper/rsna-knee-data-audit.pdf",
        format: "Dataset audit · PDF",
      },
    ],
  },
  {
    title: "Technical writing",
    works: [
      {
        title: "Detecting anomalies in data-center telemetry",
        credit: "Quantum data-center anomaly project",
        description:
          "Eight lessons follow a server fault from simulated sensor readings to a comparison of classical and quantum detectors. Each lesson includes code and exercises.",
        link: "https://github.com/nsirivolu27/quantum-datacenter-anomaly/blob/main/docs/README.md",
        format: "Technical guide · 8 lessons",
      },
      {
        title: "Magentic: governed assistants inside real workflows",
        credit: "Magentic project",
        description:
          "A one-page walkthrough of how a team trains an assistant on its own material, approves a release, and reviews the assistant’s work during delivery.",
        link: "https://github.com/nsirivolu27/Magentic.AI/blob/main/docs/demo/magentic-overview.pdf",
        format: "Project brief · PDF",
      },
    ],
  },
];

export default function Writing() {
  const query = useBlog();
  return (
    <PageShell
      title="Writing."
      eyebrow="Research, projects & essays"
      intro="I write about how machines learn, what data can tell us, and the companies and technologies I’m following."
    >
      {collections.map((collection) => (
        <section key={collection.title} className="mb-12">
          <h2 className="mb-4 font-display text-4xl">{collection.title}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {collection.works.map((work) => (
              <article key={work.link} className="archive-card">
                <p className="font-mono-ui text-xs text-accent">
                  {work.format}
                </p>
                <h3 className="mt-4 font-display text-3xl leading-tight">
                  <a
                    href={work.link}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-accent underline decoration-border underline-offset-4"
                  >
                    {work.title}{" "}
                    <ArrowUpRight
                      size={16}
                      className="inline"
                      aria-hidden="true"
                    />
                  </a>
                </h3>
                <p className="mt-3 text-sm font-medium">{work.credit}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {work.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      ))}
      <section aria-labelledby="blog-heading">
        <h2 id="blog-heading" className="font-display text-4xl">
          Nihal’s Blog About Stuff
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Essays on technology and energy, plus my weekly market reviews. The
          archive goes back to 2022.
        </p>
        <div className="my-6 flex flex-wrap gap-5 text-sm">
          <a
            className="action-link"
            href={portfolioProfile.blogUrl}
            target="_blank"
            rel="noreferrer"
          >
            Visit the blog <ArrowUpRight size={16} />
          </a>
          <a
            className="action-link"
            href={`${portfolioProfile.blogUrl}feeds/posts/default?alt=rss`}
            target="_blank"
            rel="noreferrer"
          >
            Subscribe via RSS <ArrowUpRight size={16} />
          </a>
          <Link href="/investing" className="action-link">
            Investing &amp; analysis <ArrowUpRight size={16} />
          </Link>
        </div>
        <SourceStatus
          updatedAt={query.data.updatedAt}
          isError={query.isError}
          isFetching={query.isFetching}
          retry={() => void query.refetch()}
        />
        <div className="border-t border-border">
          {query.data.items.map((post) => (
            <article
              key={post.url}
              className="grid gap-3 border-b border-border py-6 sm:grid-cols-[9rem_1fr]"
            >
              <time
                className="font-mono-ui text-xs text-muted-foreground"
                dateTime={post.published}
              >
                {new Date(post.published).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  timeZone: "America/New_York",
                })}
              </time>
              <div>
                <h3 className="font-display text-3xl">
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-accent"
                  >
                    {post.title}{" "}
                    <ArrowUpRight
                      size={16}
                      className="inline"
                      aria-hidden="true"
                    />
                  </a>
                </h3>
                {blogNotes[post.url] && (
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {blogNotes[post.url]}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
        {!query.data.items.length && (
          <p className="py-6">Visit the blog to browse the archive.</p>
        )}
      </section>
    </PageShell>
  );
}
