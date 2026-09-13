# Encoding guide

## Encode a new story
1. Set required primaryRuleSetId, ruleSetIds, optional mixinRuleSetIds. See COMPATIBILITY.md.
2. Pick topology; declare worlds. For branches, set `parentRef` + `forkEventRef` (or `draft: true` if the fork point is unknown). For a world that was already running before anyone arrived in it, set `preExisting: true` and type it `parallel_world` or `timeline` — do **not** encode it as a parentless branch, which claims a fork that does not exist. See TOPOLOGY.md, "Descent and entry are different claims".
2a. If a traveller crosses into a world rather than splitting one, record it twice: `payload.originWorldRef` on the `arrival` event (the crossing, at its moment) and a `joinsInto` world_relation from the world left to the world entered (the structural fact). Reserve `mergesInto` for histories that actually combine.
3. Agents with identityGroup as needed. Identity edges should set `identityRelation` (personal_continuity | counterpart | loop_iteration | participation).
4. Events spine with timeLabel and typed payload.
5. Edges: causal/temporal/identity/world_relation/intervention/family. Temporal edges should set `orderKind` (chronological | experienced | presentation | simultaneity). Use `family` for kinship (parenthood, siblinghood) between two distinct agents — it never implies sameness or counterparting, so never encode it as an `identity` edge.
6. Interventions with ruleEffects. Use `loop_exit` (not `loop_reset`) for the event where a time loop ends; use the optional `scope` on a ruleEffect when an effect applies only in a special context (e.g. `outside_the_knot`).
7. Outcome with endWorldRefs (the focal ending worlds).
8. Add `schemaVersion: "1.0"` on new encodings.
9. Save instances/id.json; validate.

### primary vs mixin
primaryRuleSetId required in ruleSetIds. mixinRuleSetIds optional, no primary duplicate.

### Archive drafts
import script emits stubs to instances/generated/ without overwriting hand-crafted instances.

## Visual engines
Nodes: worlds, agents, events. Edges as above. Swimlanes and branch trees recommended.
