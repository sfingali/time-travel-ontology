# time-travel-ontology

Machine-checkable **TypeScript + Zod** ontology for time-travel and interacting-multiverse stories.

Encode any plotline as:

1. **Rule set** — fictional physics / law variants
2. **World topology** — Timeline, Branch, and ParallelWorld as distinct primitives
3. **Narrative graph** — events, interventions, causal links, outcomes

Intended consumers: formalisation workflows and a **separate** visual engine (not implemented here).

## Requirements

- Node.js 20+

## Install and verify

From this directory:

1. Install dependencies with the package manager (`install` script target in package.json).
2. Run **build** — compiles TypeScript and writes `schema/ontology.schema.json`.
3. Run **validate** — checks every file in `instances/` against Zod + catalogues.
4. Run **test** — catalogue checks, all instances, and at least one failing invalid fixture.

Package scripts: `build`, `validate`, `test`, `export-schema`.

## Layout

```
src/schema/       Zod: RuleSet, Topology, Narrative, StoryEncoding
src/catalog/      Named rule sets and topology patterns
src/validate.ts   CLI validator
src/export-json-schema.ts
schema/ontology.schema.json
instances/        Story encodings
fixtures/invalid/ Negative examples for tests
docs/             Contract docs
CORPUS_NOTES.md   Design notes from the meta-archive
```

## Docs

- docs/OVERVIEW.md
- docs/RULES.md
- docs/TOPOLOGY.md
- docs/NARRATIVE.md
- docs/ENCODING-GUIDE.md

## Licence

MIT
