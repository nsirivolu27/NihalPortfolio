import { Router, type IRouter } from "express";
import { createHash, timingSafeEqual } from "node:crypto";
import { InvestingSnapshot } from "@workspace/api-zod";
import {
  investingStoreConfigured,
  readInvestingSnapshot,
  saveInvestingSnapshot,
} from "../lib/investing-store";

const router: IRouter = Router();
const digest = (value: string) => createHash("sha256").update(value).digest();
let writing = false;

router.get("/investing", async (_req, res) => {
  res.set("Cache-Control", "no-store");
  if (!investingStoreConfigured()) {
    res.status(503).json({ error: "Sync is not configured." });
    return;
  }
  try {
    const snapshot = await readInvestingSnapshot();
    if (!snapshot) throw new Error("No snapshot");
    res.json(snapshot);
  } catch {
    res.status(503).json({
      error: "No synced snapshot is available. Keep the saved snapshot.",
    });
  }
});

router.post("/investing", async (req, res) => {
  res.set("Cache-Control", "no-store");
  const key = process.env["INVESTING_SYNC_TOKEN"];
  const origin = process.env["PORTFOLIO_ORIGIN"];
  if (!key || key.length < 32 || !investingStoreConfigured() || !origin) {
    res.status(503).json({ error: "Owner sync is not configured." });
    return;
  }
  if (req.get("origin") !== origin) {
    res.status(403).json({ error: "Unrecognized site origin." });
    return;
  }
  const supplied = req.get("authorization")?.replace(/^Bearer /, "") ?? "";
  if (!timingSafeEqual(digest(key), digest(supplied))) {
    res.status(401).json({ error: "Incorrect publishing key." });
    return;
  }
  const parsed = InvestingSnapshot.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error:
        "Only a dated percentage snapshot and validated analytics are accepted.",
    });
    return;
  }
  const captured = Date.parse(parsed.data.capturedAt);
  if (
    captured > Date.now() + 5 * 60_000 ||
    captured < Date.now() - 24 * 60 * 60_000
  ) {
    res
      .status(400)
      .json({ error: "Capture a fresh snapshot from Yahoo before syncing." });
    return;
  }
  if (writing) {
    res.status(409).json({ error: "Another sync is saving. Try again." });
    return;
  }
  writing = true;
  try {
    if (!(await saveInvestingSnapshot(parsed.data))) {
      res.status(409).json({
        error: "A newer or identical snapshot has already been saved.",
      });
      return;
    }
    res.json(parsed.data);
  } catch {
    res
      .status(503)
      .json({ error: "Could not save. The previous snapshot is preserved." });
  } finally {
    writing = false;
  }
});

export default router;
