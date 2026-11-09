import { spawnSync } from "node:child_process";

const result = spawnSync("pnpm", ["run", "build"], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: { ...process.env, PORT: "3000", BASE_PATH: "/" },
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
