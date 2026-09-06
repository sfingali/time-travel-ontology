# Encoding guide

## Encode a new story
1. Set required primaryRuleSetId, ruleSetIds, optional mixinRuleSetIds. See COMPATIBILITY.md.
2. Pick topology; declare worlds. For branches, set `parentRef` + `forkEventRef` (or `draft: true` if the fork point is unknown).
3. Agents with identityGroup as needed. Identity edges should set `identityRelation` (personal_continuity | counterpart | loop_iteration | participation).
4. Events spine with timeLabel and typed payload.
5. Edges: causal/temporal/identity/world_relation/intervention. Temporal edges should set `orderKind` (chronological | experienced | presentation | simultaneity).
6. Interventions with ruleEffects.
7. Outcome with endWorldRefs (the focal ending worlds).
8. Add `schemaVersion: "1.0"` on new encodings.
9. Save instances/id.json; validate.

### primary vs mixin
primaryRuleSetId required in ruleSetIds. mixinRuleSetIds optional, no primary duplicate.

### Archive drafts
import script emits stubs to instances/generated/ without overwriting hand-crafted instances.

## Visual engines
Nodes: worlds, agents, events. Edges as above. Swimlanes and branch trees recommended.
