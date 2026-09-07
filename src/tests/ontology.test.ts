import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { validateStoryEncoding } from "../validate.js";
import {
  RULE_SETS,
  assertRuleSetsValid,
  RULE_SET_BY_ID,
} from "../catalog/rules.js";
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
  it("all instances/*.json validate via the semantic validator", async () => {
    const dir = path.join(root, "instances");
    const files = (await readdir(dir)).filter((f) => f.endsWith(".json"));
    assert.ok(files.length >= 20, "expected at least 20 instances");
    for (const f of files) {
      const raw = JSON.parse(await readFile(path.join(dir, f), "utf8"));
      const result = validateStoryEncoding(raw);
      assert.ok(
        result.success,
        `${f} should validate: ${JSON.stringify(result.errors)}`,
      );
    }
  });
});

describe("invalid fixtures", () => {
  it("every invalid fixture fails the semantic validator", async () => {
    const dir = path.join(root, "fixtures", "invalid");
    const files = (await readdir(dir)).filter((f) => f.endsWith(".json"));
    assert.ok(files.length >= 1, "need at least one invalid fixture");
    for (const f of files) {
      const raw = JSON.parse(await readFile(path.join(dir, f), "utf8"));
      const result = validateStoryEncoding(raw);
      assert.ok(
        !result.success,
        `${f} should fail validation but passed`,
      );
    }
  });

  it("a structurally valid story with an unknown ruleSetId is rejected", async () => {
    // Clean structural shape (passes Zod) but references a rule absent from the
    // catalogue — this hits the catalogue-membership lane (review findings #2/#6),
    // which the multi-defect fixture never reaches.
    const bogusRule = {
      meta: { id: "bogus", title: "Bogus Rule", medium: "film" },
      ruleSetIds: ["not_a_real_rule"],
      primaryRuleSetId: "not_a_real_rule",
      topologyPatternId: "single_fixed_timeline",
      worlds: [{ kind: "timeline", id: "w1", label: "World" }],
      events: [
        { id: "e1", type: "ordinary", label: "Event", at: { worldRef: "w1" } },
      ],
      outcome: { summary: "x", endWorldRefs: ["w1"] },
    };
    const result = validateStoryEncoding(bogusRule);
    assert.ok(!result.success);
    assert.match(result.errors.join("\n"), /not_a_real_rule/);
  });

  it("an intervention ruleEffect naming a non-active rule is rejected", async () => {
    // Structurally valid, but the intervention attributes an effect to a law that
    // is neither in the catalogue nor active in this encoding (review #2).
    const badEffect = {
      meta: { id: "bad-effect", title: "Bad Effect", medium: "film" },
      ruleSetIds: ["fixed_novikov"],
      primaryRuleSetId: "fixed_novikov",
      topologyPatternId: "single_fixed_timeline",
      worlds: [{ kind: "timeline", id: "w1", label: "World" }],
      events: [
        { id: "e1", type: "intervention", label: "Event", at: { worldRef: "w1" } },
      ],
      interventions: [
        {
          id: "iv1",
          eventId: "e1",
          ruleEffects: [{ ruleSetId: "entropy_inversion", effect: "flips arrow" }],
        },
      ],
      outcome: { summary: "x", endWorldRefs: ["w1"] },
    };
    const result = validateStoryEncoding(badEffect);
    assert.ok(!result.success);
    assert.match(result.errors.join("\n"), /entropy_inversion/);
    assert.match(result.errors.join("\n"), /not in the active ruleSetIds/);
  });
});

function schemaValidStory(): any {
  return {
    meta: { id: "sv", title: "Schema Valid", medium: "film" },
    ruleSetIds: ["fixed_novikov"],
    primaryRuleSetId: "fixed_novikov",
    topologyPatternId: "single_fixed_timeline",
    worlds: [{ kind: "timeline", id: "w1", label: "World" }],
    agents: [],
    events: [
      { id: "e1", type: "ordinary", label: "Event", at: { worldRef: "w1" } },
      { id: "e2", type: "checkpoint", label: "CP", at: { worldRef: "w1" } },
    ],
    edges: [],
    interventions: [],
    outcome: { summary: "x", endWorldRefs: ["w1"] },
  };
}

describe("schema hard-validity (review findings #1/#3/#5)", () => {
  it("entropy 'forward' with inverted:true is rejected", () => {
    const s = schemaValidStory();
    s.events.push({
      id: "e3", type: "ordinary", label: "E", at: { worldRef: "w1" },
      payload: { entropy: "forward", inverted: true },
    });
    const result = validateStoryEncoding(s);
    assert.ok(!result.success);
    assert.match(result.errors.join("\n"), /contradicts entropy/);
  });

  it("checkpointEventId pointing to a non-checkpoint event is rejected", () => {
    const s = schemaValidStory();
    s.events.push({
      id: "e3", type: "ordinary", label: "E", at: { worldRef: "w1" },
      payload: { checkpointEventId: "e1" }, // e1 is an ordinary event
    });
    const result = validateStoryEncoding(s);
    assert.ok(!result.success);
    assert.match(result.errors.join("\n"), /checkpoint, loop_reset, or death/);
  });

  it("duplicate world id is rejected", () => {
    const s = schemaValidStory();
    s.worlds.push({ kind: "timeline", id: "w1", label: "World dup" });
    const result = validateStoryEncoding(s);
    assert.ok(!result.success);
    assert.match(result.errors.join("\n"), /Duplicate ID "w1"/);
  });

  it("cross-category id collision is rejected", () => {
    const s = schemaValidStory();
    s.events.push({ id: "w1", type: "ordinary", label: "Collide", at: { worldRef: "w1" } });
    const result = validateStoryEncoding(s);
    assert.ok(!result.success);
    assert.match(result.errors.join("\n"), /across categories/);
  });

  it("an implicit-mixin active rule outside explicit mixins is still valid", () => {
    const s = schemaValidStory();
    s.ruleSetIds = ["fixed_novikov", "mutable_ripple"];
    // mixinRuleSetIds omitted -> mutable_ripple is an implicit mixin (allowed)
    const result = validateStoryEncoding(s);
    assert.ok(result.success, JSON.stringify(result.errors));
  });
});

describe("design-tier decisions (Astra rulings B,B,B,B,B,A,B,B)", () => {
  it("accepts a root schemaVersion (decision #7)", () => {
    const s = schemaValidStory();
    s.schemaVersion = "1.0";
    const result = validateStoryEncoding(s);
    assert.ok(result.success, JSON.stringify(result.errors));
  });

  it("accepts identityRelation on identity edges (decision #1)", () => {
    const s = schemaValidStory();
    s.agents.push({ id: "protagonist", label: "Hero" });
    s.agents.push({ id: "a2", label: "Other" });
    s.edges.push({
      id: "id-a", kind: "identity", from: "protagonist", to: "a2",
      identityRelation: "counterpart",
    });
    const result = validateStoryEncoding(s);
    assert.ok(result.success, JSON.stringify(result.errors));
  });

  it("accepts orderKind on a temporal edge (decision #5)", () => {
    const s = schemaValidStory();
    s.edges.push({
      id: "t-a", kind: "temporal", from: "e1", to: "e2", orderKind: "experienced",
    });
    const result = validateStoryEncoding(s);
    assert.ok(result.success, JSON.stringify(result.errors));
  });

  it("adds the parallel_world_network pattern (decision #4)", () => {
    assert.ok(TOPOLOGY_BY_ID.has("parallel_world_network"));
  });

  it("encodes kinship as a family edge, never as identity", async () => {
    // Dark's id1 (Jonas & Martha as parents of Unknown) is a kinship link between
    // two distinct people: it is neither personal continuity nor a counterpart.
    const dark = JSON.parse(
      await readFile(path.join(root, "instances", "dark.json"), "utf8"),
    );
    const id1 = dark.edges.find((e: { id: string }) => e.id === "id1");
    assert.equal(id1.kind, "family");

    const result = validateStoryEncoding(dark);
    assert.ok(result.success, JSON.stringify(result.errors));
    // The identity-edge warning that used to fire on id1 is gone.
    assert.ok(
      !(result.warnings ?? []).some((w) => w.startsWith("Edge id1:")),
      JSON.stringify(result.warnings),
    );

    // "family" is not a kind of identity, so it is not an identityRelation value.
    const s = schemaValidStory();
    s.agents.push({ id: "parent", label: "Parent" });
    s.agents.push({ id: "child", label: "Child" });
    s.edges.push({
      id: "id-fam", kind: "identity", from: "parent", to: "child",
      identityRelation: "family",
    });
    const rejected = validateStoryEncoding(s);
    assert.ok(!rejected.success);
    assert.match(rejected.errors.join("\n"), /identityRelation/);
  });
});
