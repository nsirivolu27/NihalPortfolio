import { ArrowUpRight, Award, BookOpen } from "lucide-react";
import { useCertifications } from "@/hooks/use-certifications";
import {
  certificationStatus,
  type Certification,
} from "@/lib/core/certifications";

const monthLabel = (month: string) =>
  new Date(`${month}-01T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

export function CertificationCards({ items }: { items: Certification[] }) {
  const now = new Date().toISOString().slice(0, 7);
  return (
    <div className="certification-grid">
      {items.map((item) => {
        const status = certificationStatus(item, now);
        return (
          <article
            key={item.id}
            className="certification-card"
            data-status={status}
          >
            <div className="certification-top">
              <span className="certification-icon" aria-hidden="true">
                {status === "in-progress" ? (
                  <BookOpen size={22} />
                ) : (
                  <Award size={22} />
                )}
              </span>
              <span className="certification-status">
                {status === "in-progress"
                  ? "In progress"
                  : status === "expired"
                    ? "Expired"
                    : "Completed"}
              </span>
            </div>
            <p className="certification-issuer">{item.issuer}</p>
            <h3>{item.name}</h3>
            <p className="certification-dates">
              {item.issued
                ? `Issued ${monthLabel(item.issued)}`
                : "Working toward this credential"}
              {item.expires ? ` · Expires ${monthLabel(item.expires)}` : ""}
            </p>
            {item.credentialUrl && status !== "in-progress" && (
              <a href={item.credentialUrl} target="_blank" rel="noreferrer">
                View credential <ArrowUpRight size={16} />
              </a>
            )}
          </article>
        );
      })}
    </div>
  );
}

export function CertificationsSection() {
  const query = useCertifications();
  const earned = query.data.items.filter((item) => item.status === "earned");
  return (
    <section
      id="certifications"
      className="page-width py-24"
      aria-labelledby="certifications-heading"
    >
      <div className="featured-heading">
        <div>
          <p className="featured-eyebrow">
            Certifications & continued learning
          </p>
          <h2 id="certifications-heading">
            Always learning.
            <br />
            <em>With the receipts.</em>
          </h2>
        </div>
        <p>
          {earned.length} completed credentials across cloud architecture, AI
          and responsible technology. Explore the full list and issuer
          verification links.
        </p>
      </div>
      <CertificationCards items={earned.slice(0, 3)} />
      <div className="certification-section-footer">
        <a
          href={`${import.meta.env.BASE_URL}certifications`}
          className="action-link"
        >
          All credentials & work in progress <ArrowUpRight size={18} />
        </a>
        <p>
          {query.isError
            ? "Refresh unavailable · showing saved credentials"
            : "LinkedIn snapshot"}{" "}
          ·{" "}
          {new Date(query.data.capturedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
    </section>
  );
}
