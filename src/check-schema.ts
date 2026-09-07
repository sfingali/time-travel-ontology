import { mkdtemp, readFile, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import os from "node:os";

// Verifies that a freshly regenerated JSON Schema is byte-identical to the
// committed schema/ontology.schema.json. Catches drift where the committed
// schema is stale relative to the Zod definitions.
async function main(): Promise<void> {
  const root = path.resolve(new URL("..", import.meta.url).pathname);
  const committed = path.join(root, "schema", "ontology.schema.json");

  const tmp = await mkdtemp(path.join(os.tmpdir(), "tt-schema-check-"));
  const fresh = path.join(tmp, "ontology.schema.json");

  const run = spawnSync(
    process.execPath,
    [path.join(root, "dist", "export-json-schema.js"), fresh],
    { encoding: "utf8" },
  );
  if (run.status !== 0) {
    console.error("failed to regenerate schema:\n" + run.stderr);
    process.exit(1);
  }

  const [a, b] = await Promise.all([
    readFile(committed, "utf8"),
    readFile(fresh, "utf8"),
  ]);
  await rm(tmp, { recursive: true, force: true });

  if (a === b) {
    console.log("schema/ontology.schema.json is up to date (no drift).");
    return;
  }

  console.error(
    "schema/ontology.schema.json is STALE vs the current Zod definitions.\n" +
      "Run `npm run build` and commit the regenerated file.",
  );
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
