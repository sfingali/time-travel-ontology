# Encoding guide

## Encode a new story

1. **Pick rule sets** — primary law + mixins (`docs/RULES.md`). Prefer catalogue ids; do not invent per-story physics fields.
2. **Pick topology pattern** — then declare concrete `worlds` with kinds timeline | branch | parallel_world (`docs/TOPOLOGY.md`).
3. **List agents** — use `identityGroup` for bootstrap / older-younger / counterpart selves.
4. **List events** — aim for a visualizable spine (departures, arrivals, interventions, deaths, forks, collapses). Put eras in `at.timeLabel`.
5. **Wire edges** — causal/temporal/identity/world_relation/intervention. World topology edges should set `relation`.
6. **Record interventions** — link key events to `ruleEffects` citing catalogue rule ids.
7. **Outcome** — short summary + `endWorldRefs` that exist in `worlds`.
8. Save as `instances/<id>.json` and run the validate script.

## What visual engines should expect

**Nodes**

- Worlds: `{ id, kind, label, … }` — shape/color by kind.
- Agents: `{ id, label, identityGroup? }` — group by identityGroup.
- Events: `{ id, type, label, at.worldRef, at.timeLabel? }` — place on world swimlanes by timeLabel.

**Edges**

- `causal` / `temporal` / `intervention` — usually event→event.
- `identity` — agent↔agent or agent↔event.
- `world_relation` — world↔world (or prune ops); use `relation` for arrow semantics.

**Layouts that work**

- Swimlanes per world; timeLabels left→right.
- Branching trees for forksFrom.
- Parallel columns for correspondsTo pairs.
- Loop highlights for closed causal cycles / loop_reset chains.

Engines should **not** require fields outside this schema; optional `payload` is free-form but opaque.
