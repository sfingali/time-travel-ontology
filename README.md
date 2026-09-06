# time-travel-ontology

**Machine-checkable ontology for time-travel and interacting-multiverse stories.**

Encode any plotline as typed, validated data: which **laws of fictional physics** apply, how **worlds** relate, and a **narrative graph** of agents, events, and causal links. Encodings are comparable across a corpus and rich enough for a separate visual engine to render later — without baking layout or graphics into this repo.

| Layer | What it captures |
|-------|------------------|
| **Rule sets** | Named physics variants (fixed/Novikov, mutable ripple, branching, bootstrap, loops, worldlines, entropy inversion, tangent universes, multiverse contact, …) |
| **World topology** | **Timeline**, **branch**, and **parallel world** as related but **distinct** primitives — not synonyms |
| **Narrative encoding** | Agents (with identity continuity), events, interventions, edges, outcomes under those laws |

Zod schemas are the source of truth; JSON Schema is exported for non-TypeScript consumers. Hand-crafted instances under `instances/` must validate on every push (CI).

---

## Why this exists

Stephen’s meta-archive (`reference-archive/`) holds **461** public plot summaries and diagram sources across film, TV, and novels. Free-text summaries don’t compare cleanly and don’t feed a diagram engine. This package is the **contract**: stable IDs, explicit constraints, validated JSON.

**In scope:** formalisation, validation, import stubs from the archive, documentation for encoders and future renderers.  
**Out of scope:** the visual/diagram engine itself, literary scoring, ad-hoc per-story fields.

---

## Quick start

Requires **Node 20+**.

```bash
npm install
npm run build          # compile + export schema/ontology.schema.json
npm run validate       # all instances/*.json against the schema
npm test               # catalogues + instances + invalid fixture
npm run import         # draft stubs → instances/generated/ (never overwrites hand-crafted)
```

CI (`.github/workflows/ci.yml`) runs `npm ci`, `build`, `test`, and `validate` on push/PR.

---

## Core ideas (60-second version)

### Timeline ≠ branch ≠ parallel world

| Primitive | Meaning |
|-----------|---------|
| **Timeline** | One ordered history continuum (agents may loop *along* it) |
| **Branch** | A divergent history that **forks** from a parent at an event (same world-family) |
| **Parallel world** | A coexisting universe **not** necessarily a fork — may have correspondence maps |

Reusable topology patterns (`single_fixed_timeline`, `branching_tree`, `dual_parallel_pair`, `worldline_bundle`, `tangent_bubble`, `inverted_single_timeline`, …) live in `src/catalog/topologies.ts`. Details: [docs/TOPOLOGY.md](docs/TOPOLOGY.md).

### Rule sets and mixins

Every story encoding **must** set `primaryRuleSetId` (the dominant physics). Optional `mixinRuleSetIds` add secondary constraints. Philosophically opposing mixes are allowed when fiction is ambiguous, but the **primary** is what you compare on — see [docs/COMPATIBILITY.md](docs/COMPATIBILITY.md).

Catalogue today: **13** rule sets · **8** topology patterns · **21** validated hand-crafted instances.

### Exemplars

| Instance | Fingerprint |
|----------|-------------|
| [`instances/tenet.json`](instances/tenet.json) | `entropy_inversion` on one inverted timeline; turnstiles, pincers, Algorithm, Neil bootstrap (**27** events / **39** edges) |
| [`instances/primer.json`](instances/primer.json) | Failsafe preemption, overlapping selves, broken symmetry |
| [`instances/dark.json`](instances/dark.json) | Bootstrap knot + twin/origin worlds |
| [`instances/steins-gate.json`](instances/steins-gate.json) | Worldlines / attractor fields / Reading Steiner |
| [`instances/predestination.json`](instances/predestination.json) | Ontological bootstrap closed loop |

Encode a new title: [docs/ENCODING-GUIDE.md](docs/ENCODING-GUIDE.md).

---

## Repository map

```
src/schema/          Zod: rules, topology, narrative, StoryEncoding
src/catalog/         Named rule sets + topology patterns
src/validate.ts      CLI validator
src/export-json-schema.ts
schema/ontology.schema.json
instances/           Hand-crafted encodings (CI-gated)
instances/generated/ Importer drafts only
fixtures/invalid/    Negative tests
docs/                OVERVIEW · RULES · TOPOLOGY · NARRATIVE · ENCODING-GUIDE · COMPATIBILITY
reference-archive/   Narrative meta-archive companion (summaries + diagram assets)
.github/workflows/ci.yml
```

---

## Reference archive

[`reference-archive/`](reference-archive/) is the companion **narrative** corpus (public spoilers, no original media):

| Section | Count |
|---------|------:|
| Films | 203 |
| TV / major arcs | 119 |
| Novels & shorts | 139 |
| **Catalogued works** | **461** |
| Exhaustive deep entries | 168 |
| Local diagram images (LFS) | **71** under `diagrams/assets/` |

YAML frontmatter on entries maps into importer heuristics (`npm run import`). See [reference-archive/README.md](reference-archive/README.md).

---

## Documentation

| Doc | Contents |
|-----|----------|
| [OVERVIEW.md](docs/OVERVIEW.md) | Three layers, source of truth, non-goals |
| [RULES.md](docs/RULES.md) | Law catalogue |
| [TOPOLOGY.md](docs/TOPOLOGY.md) | Timeline / branch / parallel world |
| [NARRATIVE.md](docs/NARRATIVE.md) | Events & edges for a future visual engine |
| [ENCODING-GUIDE.md](docs/ENCODING-GUIDE.md) | How to formalise a story |
| [COMPATIBILITY.md](docs/COMPATIBILITY.md) | Primary vs mixin conventions |

---

## Visual engine contract (later)

This repo does **not** draw diagrams. A renderer should consume:

- `worlds[]` — timeline / branch / parallel world nodes + relations
- `agents[]` — identity groups and continuity roles
- `events[]` — typed beats located in a world/time label
- `edges[]` — `causal` · `temporal` · `identity` · `world_relation` · `intervention`
- `interventions[]` + `outcome` — rule effects and end-state world refs

No layout, colours, or graphics are prescribed here.

---

## Licence

MIT
