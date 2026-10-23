import { z } from "zod";

// Strict boundary: dollar amounts, holdings, account details and unknown keys fail.
export const InvestingSnapshot = z
  .object({
    capturedAt: z.string().datetime({ offset: true }),
    source: z.literal("browser-sync"),
    unrealized: z.number().finite().min(-1e7).max(1e7),
    realized: z.number().finite().min(-1e7).max(1e7),
    dayChange: z.number().finite().min(-1e7).max(1e7),
  })
  .strict();
