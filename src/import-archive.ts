// @ts-nocheck
/** CLI entry: delegates to scripts/import-archive.mjs
 * Flags passed through; env ARCHIVE_ROOT supported. See docs/IMPORT.md
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const script = path.join(root, "scripts", "import-archive.mjs");
const r = spawnSync(process.execPath, [script, ...process.argv.slice(2)], { stdio: "inherit", env: process.env });
process.exit(r.status ?? 1);
