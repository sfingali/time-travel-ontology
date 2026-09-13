# World topology

## Distinct primitives

| Kind | Meaning |
|------|---------|
| `timeline` | A continuous history line (may be fixed or the root of forks). |
| `branch` | A divergent history that forksFrom a parent world; may be pruned or merged. |
| `parallel_world` | A coexisting world not defined as a fork of another; linked by correspondence/mirrors. |

Do **not** treat these as synonyms. A parallel overlay in BTTF-style rewrite is usually a **branch** (or transient overlay), not a parallel_world. Fringe/Counterpart twins are parallel_world.

## Descent and entry are different claims

Two questions about a world are independent, and the model keeps them apart:

**Where did this world come from?** A `branch` is a *child*: it begins at a splitting event and shares every moment of its parent's history before that point. Say so with `parentRef` + `forkEventRef`, and a `forksFrom` relation.

**Was it already running?** Set `preExisting: true`. The world was under way before any traveller entered it and is not the product of a split in this story. It keeps running after the traveller leaves.

`preExisting` exists to separate *there is no fork* from *the fork point is unknown*. A branch left without a `forkEventRef` says the second. Before this distinction existed, a pre-existing world could only be encoded as a parentless branch marked `draft` — which asserted a fork nobody could find. A branch that also declares `preExisting` is contradictory and the validator says so.

## Joining is not merging

| Relation | What happens to the histories |
|----------|-------------------------------|
| `mergesInto` | Two histories **combine**. Afterwards there is one. |
| `joinsInto` | A **traveller crosses** from one world into another. Both keep running independently; only the traveller transfers. |

`joinsInto` runs source → destination, and its destination should be `preExisting`. If the destination came into being *because* of the crossing, that is a fork, and `forksFrom` is the relation you want.

A crossing happens at a moment, so it is also recorded on the event: an `arrival` carries `payload.originWorldRef` naming the world the traveller left, and a `departure` may carry `payload.destinationWorldRef`. These are the world counterparts of `originTimeLabel` / `destinationTimeLabel` — the schema could already say *when* a traveller came from, but not *where*.

Both records are wanted. The event payload is the source of truth, because it is anchored to the specific crossing and a story may cross the same pair of worlds more than once. The world-level `joinsInto` edge states the structural fact once, which is what a renderer reads when it lays out lanes.

**Worked example — The Waif.** Each time the man shoots himself, the shot forks his world: `b_78`, `b_114` and `b_184` carry the half where he dies, each with a `parentRef` and a `forkEventRef`. The surviving thread does not continue in either half. It joins `w_her`, then `w_whered`, then `w_fam` — three worlds that were already running, that he never shared a history with, and that carry on after he leaves. Fork and join happen at one event and are recorded as two separate claims.

## Relation kinds (edges with kind world_relation)

forksFrom, joinsInto, mergesInto, correspondsTo, prunes, nestsWithin, attractsToward, collapsesInto, mirrors, originatesFrom, supersedes.

## Patterns (topologyPatternId)

- single_fixed_timeline
- mutable_single_with_ripples
- branching_tree
- dual_parallel_pair
- parallel_world_network
- worldline_bundle
- tangent_bubble
- inverted_single_timeline
- origin_plus_twins

See src/catalog/topologies.ts for descriptions and typical relations.
