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

export interface ValidationResult {
  success: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * Full semantic validation for one encoding: Zod structure/refinements plus
 * catalogue membership (rule sets, topology) and rule-effect membership.
 *
 * This is the single authority the CLI and tests share, so library consumers
 * get exactly the same behaviour the repository guarantees (`npm run validate`).
 * See the Astra review (docs/ASTRA_REVIEW-2026-09-06.md) findings #2 / #6.
 */
export function validateStoryEncoding(data: unknown): ValidationResult {
  const errors: string[] = [];
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return {
      success: false,
      errors: ["root must be a JSON object"],
    };
  }

  const parsed = StoryEncodingSchema.safeParse(data);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      errors.push(`${issue.path.join(".")} — ${issue.message}`);
    }
    return { success: false, errors };
  }

  const enc = parsed.data;

  for (const id of enc.ruleSetIds) {
    if (!RULE_SET_BY_ID.has(id)) {
      errors.push(`unknown ruleSetId "${id}"`);
    }
  }
  if (!TOPOLOGY_BY_ID.has(enc.topologyPatternId)) {
    errors.push(`unknown topologyPatternId "${enc.topologyPatternId}"`);
  }

  // Rule-effect references must name a catalogue rule AND one active in this
  // encoding — otherwise an intervention can attribute an effect to a law that
  // does not apply here (review finding #2).
  for (const iv of enc.interventions) {
    for (const re of iv.ruleEffects) {
      if (!RULE_SET_BY_ID.has(re.ruleSetId)) {
        errors.push(
          `intervention ${iv.id} ruleEffect references unknown ruleSetId "${re.ruleSetId}"`,
        );
      } else if (!enc.ruleSetIds.includes(re.ruleSetId)) {
        errors.push(
          `intervention ${iv.id} ruleEffect references ruleSetId "${re.ruleSetId}" which is not in the active ruleSetIds`,
        );
      }
    }
  }

  // Advisory until the hand-crafted corpus has been audited for these edge
  // conventions. Unknown endpoint IDs remain hard errors in StoryEncodingSchema.
  const warnings: string[] = [];
  const worldIds = new Set(enc.worlds.map((world) => world.id));
  for (const edge of enc.edges) {
    if (edge.kind === "world_relation") {
      if (edge.relation === undefined) {
        warnings.push(`Edge ${edge.id}: world_relation should specify relation`);
      }
      if (!worldIds.has(edge.from) || !worldIds.has(edge.to)) {
        warnings.push(`Edge ${edge.id}: world_relation endpoints should both be worlds`);
      }
    } else if (
      edge.relation !== undefined &&
      (edge.kind === "causal" || edge.kind === "temporal" || edge.kind === "identity")
    ) {
      warnings.push(`Edge ${edge.id}: relation on ${edge.kind} requires corpus/semantic review`);
    }
  }

  return { success: errors.length === 0, errors, warnings };
}

async function validateFile(filePath: string): Promise<ValidationResult> {
  const name = path.basename(filePath);
  let raw: string;
  try {
    raw = await readFile(filePath, "utf8");
  } catch (e) {
    return { success: false, errors: [`${name}: unable to read (${String(e)})`] };
  }

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    return { success: false, errors: [`${name}: invalid JSON (${String(e)})`] };
  }

  const result = validateStoryEncoding(data);
  return {
    ...result,
    errors: result.errors.map((error) => `${name}: ${error}`),
    warnings: result.warnings?.map((warning) => `${name}: ${warning}`),
  };
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
    const result = await validateFile(path.join(instancesDir, f));
    if (!result.success) {
      failed += 1;
      console.error(`FAIL ${f}`);
      for (const error of result.errors) console.error(`  ${error}`);
    } else {
      console.log(`OK   ${f}`);
    }
    for (const warning of result.warnings ?? []) {
      console.warn(`WARN ${warning}`);
    }
  }

  console.log(
    `\nValidated ${files.length} instance(s); ${files.length - failed} ok, ${failed} failed.`,
  );
  process.exit(failed > 0 ? 1 : 0);
}

// Run the CLI only when this module is executed directly, not when imported
// as a library (e.g. `validateStoryEncoding` via src/index.ts).
const __filename_local = fileURLToPath(import.meta.url);
const executedDirectly =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename_local);
if (executedDirectly) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
