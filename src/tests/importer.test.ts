import assert from "node:assert/strict";
import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import { existsSync, mkdirSync, symlinkSync, copyFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import os from "node:os";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { validateStoryEncoding } from "../validate.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

/**
 * Integration round-trip: run the real importer (scripts/import-archive.mjs)
 * against a fixture archive in a temp tree, and assert it writes a valid stub
 * with a year correctly coerced to a number. Exercises the importer end-to-end
 * (real YAML parser + self-validation + stub build + output naming) without
 * ever touching the repo's tracked instances/.
 */
describe("importer round-trip", () => {
  it("parses a year-range frontmatter and writes a schema-valid stub", async () => {
    const tmp = await mkdtemp(path.join(os.tmpdir(), "tt-import-test-"));

    // Mirror the repo layout the importer needs: scripts/ + node_modules + dist.
    const scriptsDir = path.join(tmp, "scripts");
    const generatedDir = path.join(tmp, "instances", "generated");
    const archiveDir = path.join(tmp, "reference-archive", "films");
    mkdirSync(scriptsDir, { recursive: true });
    mkdirSync(generatedDir, { recursive: true });
    mkdirSync(archiveDir, { recursive: true });

    copyFileSync(
      path.join(root, "scripts", "import-archive.mjs"),
      path.join(scriptsDir, "import-archive.mjs"),
    );
    symlinkSync(path.join(root, "node_modules"), path.join(tmp, "node_modules"), "dir");
    symlinkSync(path.join(root, "dist"), path.join(tmp, "dist"), "dir");

    // A realistic frontmatter: a year range (parsed as a YAML string), a
    // diagram_refs block list, and a tag pair that maps to a known rule set.
    const fixture = [
      "---",
      "title: Ripple Fixture",
      "year: 2022-2024",
      "mechanism: entropy_inversion",
      "paradox_type: inversion",
      "summary_depth: draft",
      "diagram_refs:",
      "  - https://example.com/ripple-diagram",
      "flag_diagrams: false # inline comment, not a diagram",
      "plot_summary_sources:",
      "  - https://example.com/source",
      "---",
      "",
      "A test work used to exercise the importer.",
      "",
    ].join("\n");
    await writeFile(path.join(archiveDir, "ripple-fixture.md"), fixture, "utf8");

    const run = spawnSync(
      process.execPath,
      [
        path.join(scriptsDir, "import-archive.mjs"),
        "--archive",
        path.join(tmp, "reference-archive"),
        "--report",
        "json",
      ],
      { encoding: "utf8" },
    );

    try {
      assert.equal(
        run.status,
        0,
        `importer exited ${run.status}: ${run.stdout}\n${run.stderr}`,
      );

      const stubPath = path.join(generatedDir, "ripple-fixture.json");
      assert.ok(existsSync(stubPath), `expected stub at ${stubPath}`);

      const stub = JSON.parse(await readFile(stubPath, "utf8"));
      assert.equal(typeof stub.meta.year, "number", "meta.year must be a number");
      assert.equal(stub.meta.year, 2022);

      // The importer self-validates each stub before writing; assert the result
      // is a genuinely valid story encoding as an extra guard.
      const result = validateStoryEncoding(stub);
      assert.ok(result.success, JSON.stringify(result.errors));
    } finally {
      await rm(tmp, { recursive: true, force: true });
    }
  });
});
