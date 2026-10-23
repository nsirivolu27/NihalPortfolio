import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { InvestingSnapshot } from "@workspace/api-zod";

type Snapshot = ReturnType<typeof InvestingSnapshot.parse>;
let databaseReady: Promise<typeof import("@workspace/db").pool> | undefined;

export function investingStoreConfigured() {
  return Boolean(
    process.env["DATABASE_URL"] || process.env["INVESTING_DATA_FILE"],
  );
}

async function database() {
  if (!databaseReady) {
    databaseReady = (async () => {
      const { pool } = await import("@workspace/db");
      await pool.query(`CREATE TABLE IF NOT EXISTS portfolio_investing_snapshot (
        id smallint PRIMARY KEY CHECK (id = 1),
        captured_at timestamptz NOT NULL,
        payload jsonb NOT NULL
      )`);
      return pool;
    })().catch((error) => {
      databaseReady = undefined;
      throw error;
    });
  }
  return databaseReady;
}

export async function readInvestingSnapshot(): Promise<Snapshot | undefined> {
  if (process.env["DATABASE_URL"]) {
    const pool = await database();
    const result = await pool.query(
      "SELECT payload FROM portfolio_investing_snapshot WHERE id = 1",
    );
    return result.rows.length
      ? InvestingSnapshot.parse(result.rows[0].payload)
      : undefined;
  }
  const file = process.env["INVESTING_DATA_FILE"];
  if (!file) throw new Error("Storage is not configured");
  try {
    return InvestingSnapshot.parse(JSON.parse(await readFile(file, "utf8")));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw error;
  }
}

export async function saveInvestingSnapshot(
  snapshot: Snapshot,
): Promise<boolean> {
  const value = InvestingSnapshot.parse(snapshot);
  if (process.env["DATABASE_URL"]) {
    const pool = await database();
    // Atomic timestamp comparison prevents concurrent serverless instances from overwriting newer data.
    const result = await pool.query(
      `INSERT INTO portfolio_investing_snapshot (id, captured_at, payload)
      VALUES (1, $1, $2::jsonb)
      ON CONFLICT (id) DO UPDATE SET captured_at = EXCLUDED.captured_at, payload = EXCLUDED.payload
      WHERE portfolio_investing_snapshot.captured_at < EXCLUDED.captured_at
      RETURNING id`,
      [value.capturedAt, JSON.stringify(value)],
    );
    return result.rows.length === 1;
  }
  const file = process.env["INVESTING_DATA_FILE"];
  if (!file) throw new Error("Storage is not configured");
  const previous = await readInvestingSnapshot();
  if (
    previous &&
    Date.parse(previous.capturedAt) >= Date.parse(value.capturedAt)
  )
    return false;
  await mkdir(dirname(file), { recursive: true });
  const temp = `${file}.${randomUUID()}.tmp`;
  await writeFile(temp, JSON.stringify(value, null, 2) + "\n", {
    mode: 0o600,
    flag: "wx",
  });
  await rename(temp, file);
  return true;
}
