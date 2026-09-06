import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { StoryEncodingSchema } from "../schema/story.js";
import { RULE_SETS, assertRuleSetsValid, RULE_SET_BY_ID } from "../catalog/rules.js";
import {
  TOPOLOGY_PATTERNS,
  assertTopologiesValid,
  TOPOLOGY_BY_ID,
} from "../catalog/topologies.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

describe("catalogues", () => {
  it("rule sets parse and have required ids", () => {
    assertRuleSetsValid();
    const required = [
      "fixed_novikov",
      "mutable_ripple",
      "branch_on_intervention",
      "bootstrap_ontological",
      "predestination_closed_loop",
      "temporal_loop_exit",
      "worldline_attractor",
      "entropy_inversion",
      "tangent_universe",
      "multiverse_contact",
      "branch_bureaucracy_prune",
      "death_checkpoint_rewrite",
      "perception_nonlinear",
    ];
    for (const id of required) {
      assert.ok(RULE_SET_BY_ID.has(id), `missing rule ${id}`);
    }
    assert.ok(RULE_SETS.length >= 13);
  });

  it("topology patterns parse", () => {
    assertTopologiesValid();
    assert.ok(TOPOLOGY_PATTERNS.length >= 8);
    assert.ok(TOPOLOGY_BY_ID.has("single_fixed_timeline"));
    assert.ok(TOPOLOGY_BY_ID.has("origin_plus_twins"));
    assert.ok(TOPOLOGY_BY_ID.has("inverted_single_timeline"));
  });
});

describe("instances", () => {
  it("all instances/*.json validate", async () => {
    const dir = path.join(root, "instances");
    const files = (await readdir(dir)).filter((f) => f.endsWith(".json"));
    assert.ok(files.length >= 20, "expected at least 20 instances");
    for (const f of files) {
      const raw = JSON.parse(await readFile(path.join(dir, f), "utf8"));
      const result = StoryEncodingSchema.safeParse(raw);
      assert.ok(
        result.success,
        `${f} should validate: ${JSON.stringify(result.success ? null : result.error.issues)}`,
      );
      if (result.success) {
        for (const id of result.data.ruleSetIds) {
          assert.ok(RULE_SET_BY_ID.has(id), `${f} unknown rule ${id}`);
        }
        assert.ok(
          TOPOLOGY_BY_ID.has(result.data.topologyPatternId),
          `${f} unknown topology`,
        );
        assert.ok(result.data.primaryRuleSetId, `${f} missing primaryRuleSetId`);
        assert.ok(
          result.data.ruleSetIds.includes(result.data.primaryRuleSetId),
          `${f} primary not in ruleSetIds`,
        );
      }
    }
  });
});

describe("invalid fixtures", () => {
  it("rejects at least one invalid fixture", async () => {
    const dir = path.join(root, "fixtures", "invalid");
    const files = (await readdir(dir)).filter((f) => f.endsWith(".json"));
    assert.ok(files.length >= 1, "need at least one invalid fixture");
    let sawFailure = false;
    for (const f of files) {
      const raw = JSON.parse(await readFile(path.join(dir, f), "utf8"));
      const result = StoryEncodingSchema.safeParse(raw);
      if (!result.success) sawFailure = true;
    }
    assert.ok(sawFailure, "expected at least one fixture to fail schema");
  });
});
