# Encoding guide

## Encode a new story
1. Set required primaryRuleSetId, ruleSetIds, optional mixinRuleSetIds. See COMPATIBILITY.md.
2. Pick topology; declare worlds.
3. Agents with identityGroup as needed.
4. Events spine with timeLabel and typed payload.
5. Edges: causal/temporal/identity/world_relation/intervention.
6. Interventions with ruleEffects.
7. Outcome with endWorldRefs.
8. Save instances/id.json; validate.

### primary vs mixin
primaryRuleSetId required in ruleSetIds. mixinRuleSetIds optional, no primary duplicate.

### Archive drafts
import script emits stubs to instances/generated/ without overwriting hand-crafted instances.

## Visual engines
Nodes: worlds, agents, events. Edges as above. Swimlanes and branch trees recommended.
