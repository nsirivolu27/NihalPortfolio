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
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...process.env,
        NODE_ENV: "production",
        PORT: String(port),
        HOST: "127.0.0.1",
        DATABASE_URL: "",
        INVESTING_DATA_FILE: file,
        PROJECTS_DATA_FILE: join(dir, "projects.json"),
        INVESTING_SYNC_TOKEN: token,
        PORTFOLIO_ORIGIN: base,
      },
    },
  );
  let output = "";
  child.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });
  for (let i = 0; i < 300; i++) {
    if (child.exitCode !== null)
      throw new Error(`API exited before listening: ${output}`);
    try {
      if ((await fetch(`${base}/api/healthz`)).ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`API did not start within 30 seconds: ${output}`);
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
  await test("analytics accept only sanitized percentages and reject private nested fields", async () => {
    const analytics = {
      scope: "Yahoo My Holdings",
      positions: [
        {
          symbol: "TEST",
          name: "Test company",
          unrealized: 3,
          dayChange: null,
        },
      ],
      sectors: [],
    };
    assert.equal(
      (
        await post({
          ...snapshot,
          analytics: {
            ...analytics,
            positions: [{ ...analytics.positions[0], shares: 5 }],
          },
        })
      ).status,
      400,
    );
    const current = {
      ...snapshot,
      capturedAt: new Date(Date.now() + 1000).toISOString(),
      analytics,
    };
    assert.equal((await post(current)).status, 200);
    assert.deepEqual(
      await (await fetch(`${base}/api/investing`)).json(),
      current,
    );
    Object.assign(snapshot, current);
  });
  const projectsUrl = `${base}/api/projects`;
  const projectPost = (data, key = token, origin = base) =>
    fetch(projectsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: origin,
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(data),
    });
  let projectState;
  await test("project controls require owner credentials and correct origin", async () => {
    projectState = await (await fetch(projectsUrl)).json();
    assert.deepEqual(projectState, { revision: 0, additions: [], hidden: [] });
    assert.equal((await projectPost(projectState, "wrong")).status, 401);
    assert.equal(
      (await projectPost(projectState, token, "https://elsewhere.example"))
        .status,
      403,
    );
  });
  await test("add, hide, and restore persist globally, with stale-edit protection", async () => {
    const project = {
      name: "Demo",
      description: "Example",
      url: "https://example.com/project",
      language: "Python",
    };
    assert.equal(
      (
        await projectPost({
          ...projectState,
          additions: [{ ...project, url: "javascript:alert(1)" }],
        })
      ).status,
      400,
    );
    const added = await projectPost({ ...projectState, additions: [project] });
    assert.equal(added.status, 200);
    projectState = await added.json();
    const hidden = await projectPost({
      ...projectState,
      hidden: [project.url],
    });
    assert.equal(hidden.status, 200);
    assert.equal((await projectPost(projectState)).status, 409);
    projectState = await hidden.json();
    assert.deepEqual((await (await fetch(projectsUrl)).json()).hidden, [
      project.url,
    ]);
    const restored = await projectPost({ ...projectState, hidden: [] });
    assert.equal(restored.status, 200);
    projectState = await restored.json();
    assert.deepEqual((await (await fetch(projectsUrl)).json()).hidden, []);
  });
  await stop();
  await start();
  await test("snapshot survives a server restart", async () =>
    assert.deepEqual(
      await (await fetch(`${base}/api/investing`)).json(),
      snapshot,
    ));
  await test("project settings also survive restart", async () =>
    assert.deepEqual(await (await fetch(projectsUrl)).json(), projectState));
  console.log(`\n${passed} API checks passing\n`);
} finally {
  await stop();
  // Only the unique temporary directory created by this test is removed.
  await rm(dir, { recursive: true, force: true });
}
