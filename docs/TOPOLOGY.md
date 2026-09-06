# World topology

## Distinct primitives

| Kind | Meaning |
|------|---------|
| `timeline` | A continuous history line (may be fixed or the root of forks). |
| `branch` | A divergent history that forksFrom a parent world; may be pruned or merged. |
| `parallel_world` | A coexisting world not defined as a fork of another; linked by correspondence/mirrors. |

Do **not** treat these as synonyms. A parallel overlay in BTTF-style rewrite is usually a **branch** (or transient overlay), not a parallel_world. Fringe/Counterpart twins are parallel_world.

## Relation kinds (edges with kind world_relation)

forksFrom, mergesInto, correspondsTo, prunes, nestsWithin, attractsToward, collapsesInto, mirrors, supersedes.

## Patterns (topologyPatternId)

- single_fixed_timeline
- mutable_single_with_ripples
- branching_tree
- dual_parallel_pair
- worldline_bundle
- tangent_bubble
- inverted_single_timeline
- origin_plus_twins

See src/catalog/topologies.ts for descriptions and typical relations.
