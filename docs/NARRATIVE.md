# Narrative model

Root type: **StoryEncoding** (`src/schema/story.ts`).

## Shape

- `meta` — id, title, year?, medium, sources?
- `schemaVersion?` — format version (omitted = legacy)
- `ruleSetIds` — catalogue ids (primary first)
- `topologyPatternId` — catalogue pattern id
- `worlds` — Timeline | Branch | ParallelWorld descriptors
- `agents` — id, label, identityGroup? (bootstrap/counterpart selves)
- `events` — id, type, label, at.{worldRef,timeLabel?}, agents?, payload?
- `edges` — id, kind, from, to, label?, relation?, identityRelation?, orderKind?
- `interventions` — id, eventId, ruleEffects[]
- `outcome` — summary, endWorldRefs[]

## Event types

`ordinary`, `departure`, `arrival`, `intervention`, `observation`, `death`, `birth`, `loop_reset`, `branch_fork`, `branch_prune`, `collapse`, `contact`, `bootstrap_origin`, `reveal`, `other`.

## Edge kinds

| Kind | Typical use |
|------|-------------|
| `causal` | Event A causes event B |
| `temporal` | Ordering / succession (set `orderKind`) |
| `identity` | Agent/object relationship (set `identityRelation`) |
| `world_relation` | Topology link; set `relation` |
| `intervention` | Deliberate change linking events |

## Note on semantics
- `identityRelation` on an identity edge distinguishes same-person / counterpart /
  loop-iteration / participation (see `DESIGN_DECISIONS.md`).
- `orderKind` on a temporal/causal edge distinguishes chronological / experienced /
  presentation / simultaneity.
- A branch world may use `forkEventRef` and `draft` (full vs draft).

## Referential integrity

The Zod schema checks that `worldRef`, agent ids on events, edge endpoints, intervention `eventId`, and `endWorldRefs` resolve to declared entities.
