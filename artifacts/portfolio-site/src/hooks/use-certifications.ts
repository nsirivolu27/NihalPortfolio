import { useQuery, useQueryClient } from "@tanstack/react-query";
import saved from "../../public/certifications.json";
import personal from "@/data/personal-certifications.json";
import {
  validateCertifications,
  type CertificationSnapshot,
} from "@/lib/core/certifications";

// The daily LinkedIn check publishes this public snapshot. No LinkedIn credentials reach the site.
const feedUrl =
  import.meta.env.VITE_CERTIFICATIONS_FEED_URL ||
  "https://raw.githubusercontent.com/nsirivolu27/NihalPortfolio/main/artifacts/portfolio-site/public/certifications.json";

// Keep owner-provided additions separate so a LinkedIn refresh cannot remove them.
const personalItems = validateCertifications({ ...saved, items: personal }).items;
const credentialKey = (item: { name: string; issuer: string }) =>
  `${item.issuer.trim().toLowerCase()}|${item.name.trim().toLowerCase()}`;

export function useCertifications() {
  const client = useQueryClient();
  return useQuery({
    queryKey: ["certifications"],
    select: (snapshot) => ({
      ...snapshot,
      items: [
        ...snapshot.items,
        ...personalItems.filter((personalItem) => !snapshot.items.some(
          (item) => item.id === personalItem.id || credentialKey(item) === credentialKey(personalItem),
        )),
      ],
    }),
    queryFn: async ({ signal }) => {
      const response = await fetch(feedUrl, {
        signal: AbortSignal.any([signal, AbortSignal.timeout(10000)]),
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Certification refresh unavailable");
      const next = validateCertifications(await response.json());
      // An older CDN copy must not replace a newer bundled snapshot.
      const current =
        client.getQueryData<CertificationSnapshot>(["certifications"]) ??
        validateCertifications(saved);
      return Date.parse(next.capturedAt) >= Date.parse(current.capturedAt)
        ? next
        : current;
    },
    initialData: validateCertifications(saved),
    initialDataUpdatedAt: Date.parse(saved.capturedAt),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    retry: false,
  });
}
