# time-travel-ontology

**Machine-checkable ontology for time-travel and interacting-multiverse stories.**

[![CI](https://github.com/sfingali/time-travel-ontology/actions/workflows/ci.yml/badge.svg)](https://github.com/sfingali/time-travel-ontology/actions/workflows/ci.yml)

**13** rule sets · **9** topology patterns · **59** validated instances · **461** archive works · **52** diagram images (13 works + 6 concept diagrams)

Encode a plotline as typed JSON: which **laws** apply, how **worlds** relate, and a **narrative graph** (agents, events, edges). Comparable across the corpus; consumable by a later visual engine. Zod is the source of truth; `schema/ontology.schema.json` is exported for everyone else.

| Layer | Captures |
|-------|----------|
| **Rule sets** | Named fictional physics (Novikov, mutable ripple, branching, bootstrap, loops, worldlines, entropy inversion, tangent universes, multiverse contact, …) |
| **World topology** | **Timeline**, **branch**, and **parallel world** — related, **not** synonyms |
| **Narrative** | Agents (identity continuity), events, interventions, edges, outcomes |

**In scope:** formalisation, validation, archive→stub import, docs for encoders/renderers.  
**Out of scope:** drawing diagrams, literary scoring, ad-hoc fields.

---

## Quick start

Node **20+**. This repo already vendors the narrative corpus at [`reference-archive/`](reference-archive/).

```bash
npm install
npm run build       # tsc + export JSON Schema
npm run validate    # instances/*.json must pass
npm test

# Optional: draft stubs from archive YAML (instances/generated/ only; never touches instances/*.json). Defaults to ./reference-archive when present.
npm run import
```

CI runs `build` / `test` / `validate` on every push.

---

## Timeline ≠ branch ≠ parallel world

| Primitive | Meaning |
|-----------|---------|
| **Timeline** | One ordered history (agents may loop *along* it) |
| **Branch** | History that **forks** from a parent at an event |
| **Parallel world** | Coexisting universe, not necessarily a fork (optional correspondence maps) |

Patterns: `single_fixed_timeline`, `branching_tree`, `dual_parallel_pair`, `worldline_bundle`, `tangent_bubble`, `inverted_single_timeline`, … — see [docs/TOPOLOGY.md](docs/TOPOLOGY.md).

Every encoding needs **`primaryRuleSetId`**; optional **`mixinRuleSetIds`** for secondary laws. Compare on the primary. [docs/COMPATIBILITY.md](docs/COMPATIBILITY.md).

### Start here

| File | Why |
|------|-----|
| [`instances/tenet.json`](instances/tenet.json) | Entropy inversion, single timeline, pincers — **32** events / **44** edges |
| [`instances/primer.json`](instances/primer.json) | Failsafe preemption / overlapping selves |
| [`instances/dark.json`](instances/dark.json) | Bootstrap knot + origin/twin worlds |
| [`instances/steins-gate.json`](instances/steins-gate.json) | Worldlines / attractors |
| [`instances/predestination.json`](instances/predestination.json) | Ontological closed loop |

New story → [docs/ENCODING-GUIDE.md](docs/ENCODING-GUIDE.md).

---

## Layout

```
src/schema/   src/catalog/   schema/ontology.schema.json
instances/              # hand-crafted (CI)
instances/generated/    # importer drafts only
docs/                   # OVERVIEW RULES TOPOLOGY NARRATIVE ENCODING-GUIDE COMPATIBILITY IMPORT
reference-archive/      # narrative corpus + diagram assets
.github/workflows/ci.yml
```

---

## Reference archive

Public spoilers, **no original media**: **203** films · **119** TV · **139** novels (**461** total) · **52** diagram images under `reference-archive/diagrams/assets/` — one folder per work, real committed blobs, no Git LFS.

YAML `mechanism` / `paradox_type` tags are the bridge into this ontology (`npm run import` → stubs; deepen by hand into `instances/`). Mapping + skip policy: [docs/IMPORT.md](docs/IMPORT.md). Corpus notes: [reference-archive/README.md](reference-archive/README.md).

---

## Docs & visual-engine contract

| Doc | |
|-----|--|
| [OVERVIEW](docs/OVERVIEW.md) · [RULES](docs/RULES.md) · [TOPOLOGY](docs/TOPOLOGY.md) | Model |
| [NARRATIVE](docs/NARRATIVE.md) · [ENCODING-GUIDE](docs/ENCODING-GUIDE.md) · [COMPATIBILITY](docs/COMPATIBILITY.md) · [IMPORT](docs/IMPORT.md) · [VALIDATION](docs/VALIDATION.md) · [SEMANTIC-CONTRACT](docs/SEMANTIC_CONTRACT.md) · **[DESIGN-ATLAS](docs/DESIGN-ATLAS.md)** | Practice |

A future renderer should read `worlds[]`, `agents[]`, `events[]`, and `edges[]` (`causal` · `temporal` · `identity` · `world_relation` · `family` · `intervention`) plus `interventions[]` / `outcome`. **No layout or graphics are prescribed here.**

---

## Licence

MIT
