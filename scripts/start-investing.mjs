import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const local = new URL("../.local/", import.meta.url);
await mkdir(local, { recursive: true });
const keyFile = new URL("investing-key.txt", local);
let key;
try {
  key = (await readFile(keyFile, "utf8")).trim();
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  key = randomBytes(32).toString("hex");
  await writeFile(keyFile, key, { mode: 0o600, flag: "wx" });
}
if (key.length < 32) throw new Error("Invalid owner key file.");
console.log(
  `Owner publishing key is in ${fileURLToPath(keyFile)}. Keep it private.`,
);
const child = spawn(
  process.execPath,
  [
    fileURLToPath(
      new URL("../artifacts/api-server/dist/index.mjs", import.meta.url),
    ),
  ],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      HOST: "127.0.0.1",
      PORT: "4175",
      INVESTING_SYNC_TOKEN: key,
      INVESTING_DATA_FILE: fileURLToPath(new URL("investing.json", local)),
      PORTFOLIO_ORIGIN: process.env.PORTFOLIO_ORIGIN ?? "http://127.0.0.1:4174",
    },
  },
);
process.on("SIGINT", () => child.kill());
process.on("SIGTERM", () => child.kill());
child.on("exit", (code) => {
  process.exitCode = code ?? 1;
});
