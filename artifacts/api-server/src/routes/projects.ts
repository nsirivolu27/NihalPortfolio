import { Router, type IRouter } from "express";
import { readFile, writeFile, rename, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";
import { ProjectSettingsSchema as settingsSchema } from "@workspace/api-zod";
import { requireOwner } from "../lib/owner";

type Settings = ReturnType<typeof settingsSchema.parse>;
const empty: Settings = { revision: 0, hidden: [], additions: [] };
let ready: Promise<typeof import("@workspace/db").pool> | undefined;
async function database() {
  if (!ready)
    ready = (async () => {
      const { pool } = await import("@workspace/db");
      await pool.query(`CREATE TABLE IF NOT EXISTS portfolio_project_settings (
      id smallint PRIMARY KEY CHECK (id = 1), revision integer NOT NULL, payload jsonb NOT NULL)`);
      await pool.query(
        "INSERT INTO portfolio_project_settings (id, revision, payload) VALUES (1, 0, $1::jsonb) ON CONFLICT DO NOTHING",
        [JSON.stringify(empty)],
      );
      return pool;
    })().catch((error) => {
      ready = undefined;
      throw error;
    });
  return ready;
}
async function read(): Promise<Settings> {
  if (process.env["DATABASE_URL"]) {
    const result = await (
      await database()
    ).query("SELECT payload FROM portfolio_project_settings WHERE id = 1");
    return settingsSchema.parse(result.rows[0].payload);
  }
  const file = process.env["PROJECTS_DATA_FILE"];
  if (!file) throw new Error("Storage unavailable");
  try {
    return settingsSchema.parse(JSON.parse(await readFile(file, "utf8")));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return empty;
    throw error;
  }
}
let writing = false;
const router: IRouter = Router();
router.put("/projects", requireOwner, (_req, res) => {
  res.json({ authenticated: true });
});
router.get("/projects", async (_req, res) => {
  res.set("Cache-Control", "no-store");
  try {
    res.json(await read());
  } catch {
    res.status(503).json({ error: "Project settings unavailable." });
  }
});
router.post("/projects", requireOwner, async (req, res) => {
  const parsed = settingsSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Use valid project details and HTTPS links." });
    return;
  }
  if (writing) {
    res
      .status(409)
      .json({ error: "Another edit is saving. Reload and try again." });
    return;
  }
  writing = true;
  try {
    const value = { ...parsed.data, revision: parsed.data.revision + 1 };
    if (process.env["DATABASE_URL"]) {
      const result = await (
        await database()
      ).query(
        "UPDATE portfolio_project_settings SET revision = $1, payload = $2::jsonb WHERE id = 1 AND revision = $3 RETURNING id",
        [value.revision, JSON.stringify(value), parsed.data.revision],
      );
      if (!result.rows.length) {
        res
          .status(409)
          .json({
            error:
              "Projects changed in another session. Reload before editing.",
          });
        return;
      }
    } else {
      const file = process.env["PROJECTS_DATA_FILE"];
      if (!file) throw new Error("Storage unavailable");
      if ((await read()).revision !== parsed.data.revision) {
        res.status(409).json({ error: "Reload projects before editing." });
        return;
      }
      await mkdir(dirname(file), { recursive: true });
      const temp = `${file}.${randomUUID()}.tmp`;
      await writeFile(temp, JSON.stringify(value), { flag: "wx", mode: 0o600 });
      await rename(temp, file);
    }
    res.json(value);
  } catch {
    res
      .status(503)
      .json({ error: "Could not save. Existing projects are unchanged." });
  } finally {
    writing = false;
  }
});
export default router;
