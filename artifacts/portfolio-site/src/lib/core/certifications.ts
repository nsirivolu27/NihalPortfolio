export type Certification = {
  id: string;
  name: string;
  issuer: string;
  status: "earned" | "in-progress";
  issued?: string;
  expires?: string;
  credentialUrl?: string;
};
export type CertificationSnapshot = {
  capturedAt: string;
  source: string;
  items: Certification[];
};

export function validateCertifications(value: unknown): CertificationSnapshot {
  const record = (input: unknown): Record<string, unknown> => {
    if (!input || typeof input !== "object" || Array.isArray(input))
      throw new Error("Invalid certification record");
    return input as Record<string, unknown>;
  };
  const snapshot = record(value);
  if (
    typeof snapshot.capturedAt !== "string" ||
    !Number.isFinite(Date.parse(snapshot.capturedAt)) ||
    snapshot.source !==
      "https://www.linkedin.com/in/nihalsirivolu/details/certifications/" ||
    !Array.isArray(snapshot.items)
  )
    throw new Error("Invalid certification source");
  const ids = new Set<string>();
  const items = snapshot.items.map((input) => {
    const item = record(input);
    for (const key of Object.keys(item))
      if (
        ![
          "id",
          "name",
          "issuer",
          "status",
          "issued",
          "expires",
          "credentialUrl",
        ].includes(key)
      )
        throw new Error("Unexpected certification field");
    for (const key of ["id", "name", "issuer"])
      if (
        typeof item[key] !== "string" ||
        !item[key].trim() ||
        item[key].length > 250
      )
        throw new Error("Missing certification details");
    if (item.status !== "earned" && item.status !== "in-progress")
      throw new Error("Invalid certification status");
    for (const key of ["issued", "expires"])
      if (
        item[key] !== undefined &&
        (typeof item[key] !== "string" ||
          !/^\d{4}-(0[1-9]|1[0-2])$/.test(item[key]))
      )
        throw new Error("Invalid certification month");
    if (item.credentialUrl !== undefined) {
      if (typeof item.credentialUrl !== "string")
        throw new Error("Invalid credential link");
      const url = new URL(item.credentialUrl);
      if (url.protocol !== "https:" || url.username || url.password)
        throw new Error("Credential links must use HTTPS");
    }
    if (ids.has(item.id as string)) throw new Error("Duplicate certification");
    ids.add(item.id as string);
    return item as Certification;
  });
  return { capturedAt: snapshot.capturedAt, source: snapshot.source, items };
}

export function certificationStatus(item: Certification, currentMonth: string) {
  if (item.status === "in-progress") return "in-progress";
  return item.expires && item.expires < currentMonth ? "expired" : "earned";
}
