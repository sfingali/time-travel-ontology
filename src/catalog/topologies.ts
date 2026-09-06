import type { TopologyPattern } from "../schema/topology.js";
import { TopologyPatternSchema } from "../schema/topology.js";

/** Reusable world-topology patterns (distinct from rule sets). */
const TOPOLOGY_PATTERNS_RAW: TopologyPattern[] = [
  {
    id: "single_fixed_timeline",
    label: "Single fixed timeline",
    description:
      "One Timeline world. No forks. Travel and causality close on the same line.",
    typicalWorldKinds: ["timeline"],
    typicalRelations: [],
    notes: "Pairs with fixed_novikov, predestination_closed_loop, entropy_inversion.",
  },
  {
    id: "mutable_single_with_ripples",
    label: "Mutable single timeline with ripples",
    description:
      "One primary Timeline; rewrite states may be modeled as transient Branches that supersede rather than coexist long-term.",
    typicalWorldKinds: ["timeline", "branch"],
    typicalRelations: ["supersedes", "forksFrom"],
    notes: "BTTF-style: 1985A as temporary overlay branch.",
  },
  {
    id: "branching_tree",
    label: "Branching tree",
    description:
      "Root timeline with Branches that forksFrom ancestors. May include prune or merge.",
    typicalWorldKinds: ["timeline", "branch"],
    typicalRelations: ["forksFrom", "mergesInto", "prunes"],
  },
  {
    id: "dual_parallel_pair",
    label: "Dual parallel pair",
    description:
      "Two ParallelWorlds linked by correspondsTo / mirrors. Not parent/child branches.",
    typicalWorldKinds: ["parallel_world"],
    typicalRelations: ["correspondsTo", "mirrors"],
  },
  {
    id: "parallel_world_network",
    label: "Parallel worlds network",
    description:
      "Two or more coexisting parallel worlds without requiring an all-to-all correspondence. A general alternative to dual_parallel_pair for larger multiverses (EEAAO-style).",
    typicalWorldKinds: ["parallel_world"],
    typicalRelations: ["correspondsTo", "mirrors"],
    notes:
      "Conformance is advisory; a focal pair (where relevant) may be declared per world. Avoids stretching dual_parallel_pair beyond exactly two worlds.",
  },
  {
    id: "worldline_bundle",
    label: "Worldline bundle with attractors",
    description:
      "Multiple worldlines (as Branches or Timelines) pulled toward attractor convergence; observer may jump between them.",
    typicalWorldKinds: ["timeline", "branch"],
    typicalRelations: ["attractsToward", "forksFrom", "supersedes"],
  },
  {
    id: "tangent_bubble",
    label: "Tangent bubble",
    description:
      "Primary Timeline plus a temporary Branch or nested world that collapsesInto primary.",
    typicalWorldKinds: ["timeline", "branch"],
    typicalRelations: ["nestsWithin", "forksFrom", "collapsesInto"],
  },
  {
    id: "inverted_single_timeline",
    label: "Inverted single timeline",
    description:
      "One Timeline; inverted and forward worldlines occupy the same world with opposite entropy direction (not separate branches).",
    typicalWorldKinds: ["timeline"],
    typicalRelations: [],
    notes: "Model inversion via event payload.entropy, not extra worlds.",
  },
  {
    id: "origin_plus_twins",
    label: "Origin world plus twin cycles (Dark-like)",
    description:
      "Interlocking family/bootstrap loops across eras; may include origin world and twin/mirror worlds feeding a knot.",
    typicalWorldKinds: ["timeline", "parallel_world", "branch"],
    typicalRelations: ["correspondsTo", "nestsWithin", "forksFrom", "originatesFrom"],
    notes: "Series-level abstraction: eras as timeLabels on one or few worlds.",
  },
];

// Freeze the catalogue so consumers cannot mutate shared state (review
// finding #13). The declared type stays `TopologyPattern[]` for stability.
export const TOPOLOGY_PATTERNS: TopologyPattern[] = Object.freeze(
  TOPOLOGY_PATTERNS_RAW.map((t) => Object.freeze(t)),
) as unknown as TopologyPattern[];

export const TOPOLOGY_BY_ID: ReadonlyMap<string, TopologyPattern> = new Map(
  TOPOLOGY_PATTERNS.map((t) => [t.id, t]),
);

export function getTopologyPattern(id: string): TopologyPattern {
  const t = TOPOLOGY_BY_ID.get(id);
  if (!t) throw new Error(`Unknown topology pattern id: ${id}`);
  return t;
}

export function assertTopologiesValid(): void {
  const seen = new Set<string>();
  for (const t of TOPOLOGY_PATTERNS) {
    if (seen.has(t.id)) {
      throw new Error(`duplicate topology pattern id: ${t.id}`);
    }
    seen.add(t.id);
    TopologyPatternSchema.parse(t);
  }
}
