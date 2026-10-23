import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { PageShell, SourceStatus } from "@/components/page-shell";
import { useBlog } from "@/hooks/use-public-content";
import { blogNotes, portfolioProfile } from "@/lib/portfolio-data";

export default function Writing() {
  const query = useBlog();
  const posts = query.data.items.filter(post => !post.url.endsWith("/canoo-buy-now.html"));
  return (
    <PageShell
      title="Nihal’s Blog About Stuff."
      eyebrow="Writing / Technology and energy"
      intro="I write about technology, energy, and ideas that interest me. These posts go back to 2022. You can find my stock research on the Investing page."
    >
      <div className="mb-10 flex flex-wrap gap-5 text-sm">
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
      </div>
      <Link href="/investing" className="action-link mb-10">Read my stock analysis <ArrowUpRight size={16} /></Link>
      <SourceStatus
        updatedAt={query.data.updatedAt}
        isError={query.isError}
        isFetching={query.isFetching}
        retry={() => void query.refetch()}
      />
      <div className="border-t border-border">
        {posts.map((post, index) => (
          <article
            key={post.url}
            className="grid gap-6 border-b border-border py-10 sm:grid-cols-[150px_1fr_auto]"
          >
            <div className="font-mono-ui text-xs text-muted-foreground">
              <span className="mb-3 block text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <time dateTime={post.published}>
                {new Date(post.published).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  timeZone: "America/New_York",
                })}
              </time>
            </div>
            <div>
              <h2 className="font-display text-4xl">
                <a
                  href={post.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent"
                >
                  {post.title}
                </a>
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {blogNotes[post.url] ??
                  "Read the original essay on Nihal’s Blog About Stuff."}
              </p>
            </div>
            <a
              href={post.url}
              target="_blank"
              rel="noreferrer"
              className="action-link self-start"
              aria-label={`Read ${post.title}`}
            >
              Read essay <ArrowUpRight size={16} />
            </a>
          </article>
        ))}
      </div>
      {!posts.length && (
        <p className="py-10">Visit the blog to explore the latest posts.</p>
      )}
      <p className="mt-8 max-w-2xl text-xs leading-relaxed text-muted-foreground">
        Posts retain their original publication dates and reflect my thinking at
        the time. Market commentary is historical writing, not a current
        investment recommendation.
      </p>
    </PageShell>
  );
}
