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

  // Identity semantics (decision #1): an identity link should say what it means.
  for (const edge of enc.edges) {
    if (edge.kind === "identity") {
      if (edge.identityRelation === undefined) {
        warnings.push(
          `Edge ${edge.id}: identity edge lacks identityRelation (personal_continuity | counterpart | loop_iteration | participation)`,
        );
      }
    } else if (edge.identityRelation !== undefined) {
      warnings.push(`Edge ${edge.id}: identityRelation set on a ${edge.kind} edge (expected on identity only)`);
    }
    if (edge.kind === "temporal") {
      if (edge.orderKind === undefined) {
        warnings.push(
          `Edge ${edge.id}: temporal edge lacks orderKind (chronological | experienced | presentation | simultaneity)`,
        );
      }
    } else if (edge.orderKind !== undefined && edge.kind !== "causal") {
      warnings.push(`Edge ${edge.id}: orderKind set on a ${edge.kind} edge (expected on temporal/causal)`);
    }
  }

  // Branch full-vs-draft (decision #2): a non-draft branch should name its parent
  // and fork event. Advisory — a draft can mark the fork point as unknown.
  for (const w of enc.worlds) {
    if (w.kind !== "branch") continue;
    if (w.draft !== true) {
      if (w.parentRef === undefined) {
        warnings.push(`Branch ${w.id}: not marked draft but has no parentRef`);
      }
      if (w.forkEventRef === undefined) {
        warnings.push(`Branch ${w.id}: not marked draft but has no forkEventRef`);
      }
    }
  }

  // Rule-set evidence (decision #3): a few structural prerequisites a graph CAN
  // check. Absence is an incomplete-evidence notice, not a rejection.
  const RULE_EVIDENCE: Record<string, string[]> = {
    entropy_inversion: ["inversion"],
    bootstrap_ontological: ["bootstrap_origin"],
    temporal_loop_exit: ["loop_reset"],
  };
  const eventTypes = new Set<string>(enc.events.map((e) => e.type));
  for (const id of enc.ruleSetIds) {
    const needed = RULE_EVIDENCE[id];
    if (needed) {
      for (const t of needed) {
        if (!eventTypes.has(t)) {
          warnings.push(`Rule "${id}" selected but no ${t} event present (incomplete evidence)`);
        }
      }
    }
  }

  // Topology conformance (decision #4): advisory, not a rejection.
  const parallelCount = enc.worlds.filter((w) => w.kind === "parallel_world").length;
  if (enc.topologyPatternId === "dual_parallel_pair" && parallelCount !== 2) {
    warnings.push(
      `Topology "dual_parallel_pair" but ${parallelCount} parallel world(s) present (expected exactly two)`,
    );
  }
  if (enc.topologyPatternId === "parallel_world_network" && parallelCount < 2) {
    warnings.push(
      `Topology "parallel_world_network" but ${parallelCount} parallel world(s) present (expected two or more)`,
    );
  }

  // Extend conformance to the remaining patterns (review Logic #5). All advisory:
  // the presence of a defining relation/feature is a structural expectation, not
  // a narrative-truth claim.
  const worldRelationKinds = new Set<string>();
  for (const e of enc.edges) {
    if (e.kind === "world_relation" && e.relation !== undefined) {
      worldRelationKinds.add(e.relation);
    }
  }
  const hasFork =
    worldRelationKinds.has("forksFrom") ||
    enc.worlds.some((w) => w.kind === "branch" && w.parentRef !== undefined);
  const hasAttract = worldRelationKinds.has("attractsToward");
  const hasCollapse =
    worldRelationKinds.has("collapsesInto") || worldRelationKinds.has("nestsWithin");
  const hasOrigin = enc.worlds.some(
    (w) => (w as { isOriginWorld?: boolean }).isOriginWorld === true,
  );

  if (
    (enc.topologyPatternId === "single_fixed_timeline" ||
      enc.topologyPatternId === "inverted_single_timeline") &&
    enc.worlds.length > 1
  ) {
    warnings.push(
      `Topology "${enc.topologyPatternId}" implies a single world but ${enc.worlds.length} world(s) are declared`,
    );
  }
  if (enc.topologyPatternId === "mutable_single_with_ripples" && !hasFork && !worldRelationKinds.has("supersedes")) {
    warnings.push(`Topology "mutable_single_with_ripples" but no forksFrom/supersedes rewrite relation present`);
  }
  if (enc.topologyPatternId === "branching_tree" && !hasFork) {
    warnings.push(`Topology "branching_tree" but no forksFrom fork relationship present`);
  }
  if (enc.topologyPatternId === "worldline_bundle" && !hasAttract) {
    warnings.push(`Topology "worldline_bundle" but no attractsToward attractor relation present`);
  }
  if (enc.topologyPatternId === "tangent_bubble" && !hasCollapse) {
    warnings.push(`Topology "tangent_bubble" but no collapsesInto/nestsWithin tangent relation present`);
  }
  if (enc.topologyPatternId === "origin_plus_twins" && !hasOrigin) {
    warnings.push(`Topology "origin_plus_twins" but no origin world (isOriginWorld) is declared`);
  }

  // Branch completeness + ancestry (Astra review rec #2/#3): advisory, never reject.
  for (const w of enc.worlds) {
    if (w.kind !== "branch") continue;
    if (w.branchSpecification === "COMPLETE") {
      if (w.parentRef === undefined || w.forkEventRef === undefined) {
        warnings.push(
          `Branch ${w.id}: declared COMPLETE but lacks a parentRef/forkEventRef (effective INCOMPLETE)`,
        );
      }
    }
    let cur = w.parentRef;
    const seen = new Set<string>();
    while (cur !== undefined) {
      if (cur === w.id) {
        warnings.push(`Branch ${w.id}: ancestry cycle (parent chain returns to itself)`);
        break;
      }
      if (seen.has(cur)) break;
      seen.add(cur);
      const parent = enc.worlds.find((x) => x.id === cur);
      cur = parent?.kind === "branch" ? parent.parentRef : undefined;
    }
  }

  // Abstraction annotations (Astra review rec #7): advisory reference checks.
  const eventIdsSet = new Set(enc.events.map((e) => e.id));
  const edgeIdsSet = new Set(enc.edges.map((e) => e.id));
  for (const e of enc.events) {
    if (e.duplicateOf !== undefined) {
      if (e.duplicateOf === e.id) warnings.push(`Event ${e.id}: duplicateOf references itself`);
      else if (!eventIdsSet.has(e.duplicateOf)) warnings.push(`Event ${e.id}: duplicateOf ${e.duplicateOf} is not an event`);
    }
    for (const ref of e.summaryOf ?? []) {
      if (ref === e.id) warnings.push(`Event ${e.id}: summaryOf references itself`);
      else if (!eventIdsSet.has(ref)) warnings.push(`Event ${e.id}: summaryOf ${ref} is not an event`);
    }
  }
  for (const ed of enc.edges) {
    if (ed.duplicateOf !== undefined) {
      if (ed.duplicateOf === ed.id) warnings.push(`Edge ${ed.id}: duplicateOf references itself`);
      else if (!edgeIdsSet.has(ed.duplicateOf)) warnings.push(`Edge ${ed.id}: duplicateOf ${ed.duplicateOf} is not an edge`);
    }
    for (const ref of ed.summaryOf ?? []) {
      if (!edgeIdsSet.has(ref)) warnings.push(`Edge ${ed.id}: summaryOf ${ref} is not an edge`);
    }
  }

  // semanticReview target references (Astra review rec #2/#6): advisory.
  for (const rev of enc.semanticReview ?? []) {
    if (rev.target.kind === "story") continue;
    const id = rev.target.id;
    const ok =
      rev.target.kind === "world"
        ? worldIds.has(id)
        : rev.target.kind === "event"
          ? eventIdsSet.has(id)
          : edgeIdsSet.has(id);
    if (!ok) {
      warnings.push(`semanticReview target ${rev.target.kind}/${id} is not a declared ${rev.target.kind}`);
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
