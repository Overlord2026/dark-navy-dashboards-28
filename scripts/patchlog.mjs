import { execSync } from "node:child_process";
import { appendFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const mode = process.argv[2] || process.env.VITE_PUBLIC_MODE || "staging";
const buildId = process.argv[3] || process.env.BUILD_ID || "unknown";
const stamp = new Date().toISOString();

let commit = "unknown";
try {
  commit = execSync('git show -s --format="%h %ci %s" HEAD').toString().trim();
} catch {}

const dir = "ops/release";
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
const logPath = join(dir, "PATCHLOG.md");

const entry = `\n## ${stamp}  •  ${mode}\n- BUILD_ID: ${buildId}\n- COMMIT: ${commit}\n`;
appendFileSync(logPath, entry, { encoding: "utf8" });

console.log("Patch log updated:", logPath);