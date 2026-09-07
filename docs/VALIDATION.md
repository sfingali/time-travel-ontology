# Validation contract & limits

What `npm run validate` proves — and what it deliberately does not.

`validateStoryEncoding()` (in `src/validate.ts`, exported from `src/index.ts`) is the
**single semantic authority** shared by the CLI, the tests, and library consumers. The
JSON Schema export (`schema/ontology.schema.json`) is **structural only** — it reflects
the Zod object shapes but not the `superRefine` logic, so it must not be treated as a
drop-in replacement for `validateStoryEncoding`.

## Enforced (a valid encoding must satisfy all of these)

- **Structure:** the encoding parses against the Zod schema (strict objects, required
  fields, valid `kind`/relationship enums, well-formed reference IDs).
- **Catalogue membership:** every `ruleSetId` names a rule set in the catalogue, and
  `topologyPatternId` names a declared topology pattern.
- **Rule-effect references:** every `intervention.ruleEffects[].ruleSetId` must be a
  catalogue rule **and** appear in the encoding's active `ruleSetIds`.
- **Uniqueness:** IDs are unique across worlds, agents, events, edges, and interventions,
  and across categories (generic edge references stay unambiguous).
- **Rule lists:** the active set equals `primary` plus the explicit mixins; rules are
  unique; the primary is not also a mixin.
- **Reference integrity:** edge/event endpoints and `checkpointEventId` resolve to
  declared entities, and checkpoint references point at a `checkpoint`/`loop_reset`/`death`
  event.
- **Contradictions:** an event cannot claim `entropy: "forward"` with `inverted: true`.
- **Version:** `schemaVersion`, when present, is a valid `MAJOR.MINOR` string.

## Advisory (warn, never reject)

These flag **incomplete evidence** or **convention drift** without blocking the encoding,
so a story is not rejected just because its evidence is still being gathered:

- Rule sets selected that have no matching evidence event present (e.g. `entropy_inversion`
  with no `inversion` event).
- A non-draft branch with no `parentRef` / `forkEventRef`.
- An identity edge with no `identityRelation`, or `identityRelation`/`orderKind` on an
  unexpected edge kind.
- A `world_relation` edge without a `relation`, or with non-world endpoints.
- Topology conformance, e.g. `dual_parallel_pair` declaring a number of parallel worlds
  other than exactly two, or `parallel_world_network` declaring fewer than two.

## Documented but not enforced (known limits)

These are deliberate. The review (docs/ASTRA_REVIEW-2026-09-06.md) flagged them; they
span the model, not just the validator, and some cannot be proven from a graph alone:

- **Rule sets are descriptive catalogue records, not executable laws.** Most
  `constraints[]` are prose; structural evidence dispatch exists only for a handful
  (`entropy_inversion`, `bootstrap_ontological`, `temporal_loop_exit`).
- **Rule composition is undefined.** Whether a mixin overrides the primary, adds a
  capability, applies locally, or expresses uncertainty is not modelled; `createsBranches:
  false` means "not supplied", not "forbidden".
- **Typed edge endpoints are not enforced per relation.** A `world_relation` may omit
  `relation`; endpoints are not constraint-checked by relation kind.
- **Ordering dimensions** (chronological vs experienced vs presentation vs simultaneity)
  are *expressible* via `orderKind` but not projected onto the graph.
- **Identity consistency** across `identityGroup`, `continuedFrom`/`continuesAs`, and
  identity edges is not cross-checked.
- **Interventions/outcomes carry no machine-checkable state change**; `endWorldRefs`
  means "focal ending worlds" (decision #6) but the wider lifecycle (inactive / overwritten
  / collapsed / merely absent) is not modelled.
- **Topology conformance is mostly advisory**; per-pattern cardinality/ancestry checks are
  a subset (the parallel-world counts), and the rest are labels awaiting a fuller model.
- **Narrative truth is not verifiable from a graph alone.** The ontology checks the
  *internal* consistency of an encoding, not whether the encoding matches the source work.

## Statuses

For analysis and reporting, treat the three channels separately:

1. **Structural** — does it satisfy the Zod schema?
2. **Referential** — do references resolve?
3. **Semantic** — do the named laws, topology, and relations agree with the graph?

A story can be structurally and referentially valid while its semantic status is
"incomplete evidence" or "advisory concern". The validator returns all three via
`ValidationResult { success, errors, warnings? }`.
