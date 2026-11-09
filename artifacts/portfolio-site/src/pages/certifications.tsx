import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { CertificationCards } from "@/components/certifications";
import { useCertifications } from "@/hooks/use-certifications";

export default function Certifications() {
  const query = useCertifications();
  const [issuer, setIssuer] = useState("All issuers");
  const items = query.data.items.filter(
    (item) => issuer === "All issuers" || item.issuer === issuer,
  );
  const completed = items.filter((item) => item.status === "earned");
  const inProgress = items.filter((item) => item.status === "in-progress");
  return (
    <PageShell
      title="Learning, documented."
      eyebrow="Certifications & learning"
      intro="Cloud credentials and AI coursework, with issuer verification links. Completed credentials and work in progress are kept separate."
    >
      <div className="certification-source">
        <div>
          <strong>Captured from LinkedIn</strong>
          <p>
            Last checked{" "}
            {new Date(query.data.capturedAt).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
            . Credentials reflect the last successful LinkedIn update.
          </p>
          {query.isError && (
            <p role="status">
              Refresh unavailable. Saved credentials are still shown.
            </p>
          )}
        </div>
        <a href={query.data.source} target="_blank" rel="noreferrer">
          View LinkedIn ↗
        </a>
        <button
          type="button"
          disabled={query.isFetching}
          onClick={() => void query.refetch()}
        >
          {query.isFetching ? "Refreshing…" : "Refresh snapshot"}
        </button>
      </div>
      <label className="certification-filter">
        Filter by issuer
        <select
          value={issuer}
          onChange={(event) => setIssuer(event.target.value)}
        >
          <option>All issuers</option>
          {[...new Set(query.data.items.map((item) => item.issuer))].map(
            (name) => (
              <option key={name}>{name}</option>
            ),
          )}
        </select>
      </label>
      <h2 className="mb-6 font-display text-4xl">
        Completed credentials{" "}
        <span className="text-muted-foreground">({completed.length})</span>
      </h2>
      <CertificationCards items={completed} />
      {inProgress.length > 0 && (
        <section className="mt-16" aria-labelledby="in-progress-heading">
          <h2 id="in-progress-heading" className="mb-4 font-display text-4xl">
            In progress
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Listed on LinkedIn as currently in progress. These have not been
            earned.
          </p>
          <CertificationCards items={inProgress} />
        </section>
      )}
    </PageShell>
  );
}
