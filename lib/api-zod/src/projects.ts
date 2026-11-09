import { z } from "zod";

const url = z
  .string()
  .max(500)
  .url()
  .refine((value) => {
    return /^https:\/\/[^/?#@]+(?:[/?#]|$)/.test(value);
  });
export const ProjectSettingsSchema = z
  .object({
    revision: z
      .number()
      .int()
      .min(0)
      .max(Number.MAX_SAFE_INTEGER - 1),
    hidden: z
      .array(url)
      .max(300)
      .refine((rows) => new Set(rows).size === rows.length),
    additions: z
      .array(
        z
          .object({
            name: z.string().trim().min(1).max(100),
            description: z.string().max(1000),
            url,
            language: z.string().trim().min(1).max(60),
          })
          .strict(),
      )
      .max(100)
      .refine((rows) => new Set(rows.map((r) => r.url)).size === rows.length),
  })
  .strict();
