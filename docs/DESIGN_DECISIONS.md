# Design-tier decisions (Astra review, accepted 2026-09-06)

Records the semantic rulings made after the full Astra review
(`docs/ASTRA_REVIEW-2026-09-06.md`). Every change is **additive + advisory**: it
adds fields/patterns and surfaces warnings, and rejects **nothing** existing — so
the hand-crafted corpus stays valid (59/59) while its real gaps become visible.

Validation language:
- **Error** — an encoding contradicts an agreed format requirement.
- **Warning** — a suspicious / conflicting claim that needs review.
- **Incomplete evidence** — not enough shown to assess a claim; does **not** mean
  the story is impossible.

## 1. Identity (from Logic #8) → separate the meanings
Two agent records linked by an **identity** edge are not automatically "the same
person." Use `identityRelation` on identity edges:

| value | meaning |
|-------|---------|
| `personal_continuity` | one person across time / inverted stages |
| `counterpart` | a related version in another world, **not** one continuous life |
| `loop_iteration` | an appearance in a loop; whether memory continues is separate |
| `participation` | an event participant, not an identity claim |
| `other` | needs interpretation |

Rule of thumb: parenthood and causal provenance are **never** identity. An identity
edge without `identityRelation` warns as incomplete evidence.

## 2. Branches (Logic #1) → full vs draft
A fully-specified branch must name `parentRef` + `forkEventRef`. A branch whose fork
point is unknown should set `draft: true`. Reject self-parenting/cycles **only in
branch ancestry**; causal / travel / merge / world-creation loops stay legal. A
non-draft branch missing `parentRef` / `forkEventRef` warns.

## 3. Rule sets (Logic #2/#3) → check the checkable evidence
Rule names are commitments the encoding should demonstrate **where a computer can
check it**. Absence of a required evidence marker is an **incomplete-evidence
warning**, never a rejection:

| rule | what's checked |
|------|----------------|
| `entropy_inversion` | an `inversion` event |
| `bootstrap_ontological` | a `bootstrap_origin` event |
| `temporal_loop_exit` | a `loop_reset` event |

Plot-only claims (history stays consistent, destiny fulfilled, no external origin
"anywhere") stay editorial documentation. **Composition:** a `false` boolean in a
rule catalogue means *"this rule does not supply that capability,"* not *"the story
forbids it."* Genuine prohibitions are represented separately; incompatible
same-scope policies warn rather than forcing the primary to win.

## 4. World patterns (Logic #5) → add the missing category
Kept conformance **advisory**. Added `parallel_world_network` (9th pattern) so
larger multiverses (EEAAO-style) get an honest label instead of being stretched into
`dual_parallel_pair`. `dual_parallel_pair` now warns if it does not hold exactly two
`parallel_world`s; `parallel_world_network` warns below two.

## 5. Ordering (Logic #7) → model distinct orders
A temporal/`causal` edge may declare `orderKind`:

| value | meaning |
|-------|---------|
| `chronological` | order within a named world / time frame |
| `experienced` | order for a named agent / journey through a loop |
| `presentation` | order in a particular telling / edition |
| `simultaneity` | same frame, no direction |
| `unspecified` | not stated |

Cycles are **not** banned. A temporal edge without `orderKind` warns.

## 6. Outcomes (Logic #9) → narrow meaning
`endWorldRefs` = the **focal ending worlds** (the ones the described ending is
about), **not** an exhaustive survival list. Absence from it carries **no**
lifecycle meaning ("does not survive"). World-status/lifecycle modelling is a
separate, later capability.

## 7. Versioning (Decisions #5) → add `schemaVersion`
Root `schemaVersion` (e.g. `"1.0"`) is **optional**; omitted = legacy input, still
accepted by the compatibility reader. New encodings should stamp it. The strict
reader only accepts supported versions; unsupported future versions are rejected
clearly.

## 8. JSON Schema export (Functions #7 / Decisions #1) → structural only
`schema/ontology.schema.json` is a **structural** schema. It does **not** carry
Zod's `superRefine` semantic checks (uniqueness, refs, rule membership, checkpoint /
entropy consistency). "Passes JSON Schema" ≠ "passes repository validation." Use the
exported `validateStoryEncoding()` (TypeScript) as the reference implementation; the
language-neutral requirements are listed in `docs/COMPATIBILITY.md`.

## What is now surfaced across the corpus (advisory)
350 warnings across the 59 encodings: temporal edges without `orderKind`, identity
edges without `identityRelation`, non-draft branches without `forkEventRef`.
These are the real gaps to close in the exemplar pass (see `ASTRA_REVIEW`).

## New fields/patterns added
- edge: `identityRelation`, `orderKind`
- branch: `forkEventRef`, `draft`
- root: `schemaVersion`
- catalogue: `parallel_world_network` pattern
