import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = await mkdtemp(join(tmpdir(), "portfolio-api-test-"));
const file = join(dir, "snapshot.json");
const token = randomBytes(32).toString("hex");
const probe = createServer();
await new Promise((resolve) => probe.listen(0, "127.0.0.1", resolve));
const port = probe.address().port;
await new Promise((resolve) => probe.close(resolve));
const base = `http://127.0.0.1:${port}`;
let child;
let passed = 0;
const start = async () => {
  child = spawn(
    process.execPath,
    [
      fileURLToPath(
        new URL("../artifacts/api-server/dist/index.mjs", import.meta.url),
      ),
    ],
    {
      stdio: "ignore",
      env: {
        ...process.env,
        PORT: String(port),
        HOST: "127.0.0.1",
        INVESTING_DATA_FILE: file,
        INVESTING_SYNC_TOKEN: token,
        PORTFOLIO_ORIGIN: base,
      },
    },
  );
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(`${base}/api/healthz`)).ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("API did not start; run npm run build first.");
};
const stop = async () => {
  if (child && child.exitCode === null)
    await new Promise((resolve) => {
      child.once("exit", resolve);
      child.kill();
    });
};
const snapshot = {
  capturedAt: new Date().toISOString(),
  source: "browser-sync",
  unrealized: 10,
  realized: 2,
  dayChange: -1,
};
const post = (body, auth = token, origin = base) =>
  fetch(`${base}/api/investing`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth}`,
      Origin: origin,
    },
    body: JSON.stringify(body),
  });
const test = async (name, fn) => {
  await fn();
  passed++;
  console.log(`  ok  ${name}`);
};
try {
  await start();
  await test("missing snapshot returns unavailable without inventing returns", async () =>
    assert.equal((await fetch(`${base}/api/investing`)).status, 503));
  await test("wrong publishing key and foreign origins cannot write", async () => {
    assert.equal((await post(snapshot, "incorrect")).status, 401);
    assert.equal(
      (await post(snapshot, token, "https://other.example")).status,
      403,
    );
  });
  await test("amounts and account data are rejected, not silently retained", async () => {
    for (const extra of ["balance", "holdings", "email", "token"])
      assert.equal(
        (await post({ ...snapshot, [extra]: "private" })).status,
        400,
      );
  });
  await test("stale, future, invalid and screenshot captures cannot masquerade as syncs", async () => {
    for (const patch of [
      { capturedAt: "2020-01-01T00:00:00Z" },
      { capturedAt: "2099-01-01T00:00:00Z" },
      { realized: null },
      { source: "screenshot" },
    ])
      assert.equal((await post({ ...snapshot, ...patch })).status, 400);
  });
  await test("valid sync persists and public reads contain exactly the approved fields", async () => {
    assert.equal((await post(snapshot)).status, 200);
    assert.deepEqual(JSON.parse(await readFile(file, "utf8")), snapshot);
    assert.deepEqual(
      await (await fetch(`${base}/api/investing`)).json(),
      snapshot,
    );
  });
  await test("older and invalid writes preserve the last good snapshot", async () => {
    assert.equal(
      (
        await post({
          ...snapshot,
          capturedAt: new Date(Date.now() - 60_000).toISOString(),
        })
      ).status,
      409,
    );
    assert.equal((await post({ ...snapshot, unrealized: "oops" })).status, 400);
    assert.deepEqual(JSON.parse(await readFile(file, "utf8")), snapshot);
  });
  await stop();
  await start();
  await test("snapshot survives a server restart", async () =>
    assert.deepEqual(
      await (await fetch(`${base}/api/investing`)).json(),
      snapshot,
    ));
  console.log(`\n${passed} API checks passing\n`);
} finally {
  await stop();
  // Only the unique temporary directory created by this test is removed.
  await rm(dir, { recursive: true, force: true });
}
