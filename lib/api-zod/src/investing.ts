import { z } from "zod";

const percent = z.number().finite().min(-1e7).max(1e7);
const analytics = z
  .object({
    scope: z.literal("Yahoo My Holdings"),
    positions: z
      .array(
        z
          .object({
            symbol: z.string().regex(/^[A-Z0-9.^=-]{1,20}$/),
            name: z
              .string()
              .min(1)
              .max(160)
              .regex(/^[^$\r\n]+$/),
            unrealized: percent.nullable(),
            dayChange: percent.nullable(),
          })
          .strict(),
      )
      .min(1)
      .max(200)
      .refine(
        (rows) => new Set(rows.map((r) => r.symbol)).size === rows.length,
      ),
    sectors: z
      .array(
        z
          .object({
            name: z.string().regex(/^[A-Za-z][A-Za-z '&-]{0,59}$/),
            percent: z.number().finite().min(0).max(100),
          })
          .strict(),
      )
      .max(20)
      .refine(
        (rows) =>
          new Set(rows.map((r) => r.name)).size === rows.length &&
          (!rows.length ||
            Math.abs(rows.reduce((sum, r) => sum + r.percent, 0) - 100) <= 0.2),
      ),
  })
  .strict();

// Only named securities and percentage metrics cross this boundary, never balances or sizes.
export const InvestingSnapshot = z
  .object({
    capturedAt: z.string().datetime({ offset: true }),
    source: z.literal("browser-sync"),
    unrealized: z.number().finite().min(-1e7).max(1e7),
    realized: z.number().finite().min(-1e7).max(1e7),
    dayChange: z.number().finite().min(-1e7).max(1e7),
    analytics: analytics.optional(),
  })
  .strict();
