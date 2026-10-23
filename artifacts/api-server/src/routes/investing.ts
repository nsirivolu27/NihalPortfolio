import { Router, type IRouter } from "express";
import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { InvestingSnapshot } from "@workspace/api-zod";

const router: IRouter = Router();
const digest = (value: string) => createHash("sha256").update(value).digest();
let writing = false;

router.get("/investing", async (_req, res) => {
  res.set("Cache-Control", "no-store");
  const file = process.env["INVESTING_DATA_FILE"];
  if (!file) {
    res.status(503).json({ error: "Sync is not configured." });
    return;
  }
  try {
    const snapshot = InvestingSnapshot.parse(
      JSON.parse(await readFile(file, "utf8")),
    );
    res.json(snapshot);
  } catch {
    res
      .status(503)
      .json({
        error: "No synced snapshot is available. Keep the saved snapshot.",
      });
  }
});

router.post("/investing", async (req, res) => {
  res.set("Cache-Control", "no-store");
  const key = process.env["INVESTING_SYNC_TOKEN"];
  const file = process.env["INVESTING_DATA_FILE"];
  const origin = process.env["PORTFOLIO_ORIGIN"];
  if (!key || key.length < 32 || !file || !origin) {
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
    res
      .status(400)
      .json({
        error: "Only a dated snapshot of three percentages is accepted.",
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
    let previous: { capturedAt: string } | undefined;
    try {
      previous = InvestingSnapshot.parse(
        JSON.parse(await readFile(file, "utf8")),
      );
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    if (previous && Date.parse(previous.capturedAt) >= captured) {
      res
        .status(409)
        .json({
          error: "A newer or identical snapshot has already been saved.",
        });
      return;
    }
    await mkdir(dirname(file), { recursive: true });
    const temp = `${file}.${randomUUID()}.tmp`;
    await writeFile(temp, JSON.stringify(parsed.data, null, 2) + "\n", {
      mode: 0o600,
      flag: "wx",
    });
    await rename(temp, file);
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
