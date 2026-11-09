import { createHash, timingSafeEqual } from "node:crypto";
import type { Request, Response, NextFunction } from "express";
const digest = (value: string) => createHash("sha256").update(value).digest();

export function isPortfolioOrigin(origin: string | undefined): boolean {
  // Preserve the scheduled updater's configured origin alongside the public site.
  const configured = process.env["PORTFOLIO_ORIGIN"];
  return Boolean(configured && (origin === configured || origin === "https://nihalsirivolu.com"));
}

export function requireOwner(req: Request, res: Response, next: NextFunction) {
  const key = process.env["INVESTING_SYNC_TOKEN"];
  const origin = process.env["PORTFOLIO_ORIGIN"];
  res.set("Cache-Control", "no-store");
  if (!key || key.length < 32 || !origin) {
    res.status(503).json({ error: "Owner publishing is not configured." });
    return;
  }
  if (!isPortfolioOrigin(req.get("origin"))) {
    res.status(403).json({ error: "Unrecognized site origin." });
    return;
  }
  const supplied = req.get("authorization")?.replace(/^Bearer /, "") ?? "";
  if (!timingSafeEqual(digest(key), digest(supplied))) {
    res.status(401).json({ error: "Incorrect publishing key." });
    return;
  }
  next();
}
