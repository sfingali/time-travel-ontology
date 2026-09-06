import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { StoryEncodingSchema } from "./schema/story.js";
import { RULE_SET_BY_ID, assertRuleSetsValid } from "./catalog/rules.js";
import {
  TOPOLOGY_BY_ID,
  assertTopologiesValid,
} from "./catalog/topologies.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const instancesDir = path.join(root, "instances");

async function validateFile(filePath: string): Promise<string[]> {
  const errors: string[] = [];
  const raw = await readFile(filePath, "utf8");
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    return [`${filePath}: invalid JSON (${String(e)})`];
  }

  const parsed = StoryEncodingSchema.safeParse(data);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      errors.push(
        `${path.basename(filePath)}: ${issue.path.join(".")} — ${issue.message}`,
      );
    }
    return errors;
  }

  const enc = parsed.data;
  for (const id of enc.ruleSetIds) {
    if (!RULE_SET_BY_ID.has(id)) {
      errors.push(`${path.basename(filePath)}: unknown ruleSetId "${id}"`);
    }
  }
  if (!TOPOLOGY_BY_ID.has(enc.topologyPatternId)) {
    errors.push(
      `${path.basename(filePath)}: unknown topologyPatternId "${enc.topologyPatternId}"`,
    );
  }
  return errors;
}

async function main(): Promise<void> {
  assertRuleSetsValid();
  assertTopologiesValid();

  const files = (await readdir(instancesDir))
    .filter((f) => f.endsWith(".json"))
    .sort();

  if (files.length === 0) {
    console.error("No instances/*.json found");
    process.exit(1);
  }

  let failed = 0;
  for (const f of files) {
    const errs = await validateFile(path.join(instancesDir, f));
    if (errs.length) {
      failed += 1;
      console.error(`FAIL ${f}`);
      for (const e of errs) console.error(`  ${e}`);
    } else {
      console.log(`OK   ${f}`);
    }
  }

  console.log(
    `\nValidated ${files.length} instance(s); ${files.length - failed} ok, ${failed} failed.`,
  );
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
