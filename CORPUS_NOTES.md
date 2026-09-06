# Corpus notes

Bridge between the **narrative meta-archive** and this **ontology**. Refresh when counts move.

| | |
|--|--|
| Narrative corpus | [`reference-archive/`](reference-archive/) |
| Formal encodings | [`instances/`](instances/) |
| Importer report | [`instances/generated/IMPORT_REPORT.md`](instances/generated/IMPORT_REPORT.md) |
| Last refreshed | 2026-09-06 (exhaustive formalisation wave) |

---

## Live snapshot

| Asset | Count |
|-------|------:|
| Archive works (films/TV/novels) | **461** |
| Diagram images (LFS) | **71** |
| Hand-crafted instances | **59** (all Tenet-class: ≥20 events) |
| Generated stubs | **~383** under `instances/generated/` |
| Rule sets | **13** |
| Topology patterns | **8** |

Rough formalisation coverage: **59/461 ≈ 13%** hand-encoded (up from ~5%).

---

## Hand-crafted inventory (59)

**Prior + fingerprint (37):** about-time, arrival, back-to-the-future, dark, donnie-darko, edge-of-tomorrow, eeaao, frequency, groundhog-day, loki, looper, palm-springs, predestination, primer, re-zero, source-code, steins-gate, tenet, terminator-2, the-butterfly-effect, twelve-monkeys, 11-22-63, bill-and-ted, coherence, counterpart, fringe, happy-death-day, interstellar, mr-nobody, outlander, run-lola-run, russian-doll, sliding-doors, terminator, the-time-machine-1960, timecrimes, your-name

**Mission B (+22):** arq, avengers-endgame, before-the-coffee-gets-cold, boss-level, continuum, deja-vu, erased, harry-potter-prisoner-of-azkaban, hot-tub-time-machine, la-jetee, night-watch-discworld, project-almanac, quantum-leap, replay, spider-man-into-the-spider-verse, the-end-of-eternity, the-endless, the-man-who-folded-himself, travelers, triangle, umbrella-academy, x-men-days-of-future-past

Gold density exemplar: `tenet` (32 events / 44 edges). All 59 pass `npm run validate`.

---

## Catalogue IDs

**Rules:** `fixed_novikov` · `mutable_ripple` · `branch_on_intervention` · `bootstrap_ontological` · `predestination_closed_loop` · `temporal_loop_exit` · `worldline_attractor` · `entropy_inversion` · `tangent_universe` · `multiverse_contact` · `branch_bureaucracy_prune` · `death_checkpoint_rewrite` · `perception_nonlinear`

**Topologies:** `single_fixed_timeline` · `mutable_single_with_ripples` · `branching_tree` · `dual_parallel_pair` · `worldline_bundle` · `tangent_bubble` · `inverted_single_timeline` · `origin_plus_twins`

---

## Importer

`ARCHIVE_ROOT=./reference-archive npm run import` (see [docs/IMPORT.md](docs/IMPORT.md)):
- Maps YAML `mechanism` / `paradox_type` → rules/topologies
- **Never** overwrites `instances/*.json`; only `instances/generated/`
- Quality report lists gaps (exhaustive/diagram-flagged without hand encoding)

---

## Design contract

1. Named reusable rule sets  
2. Timeline / branch / parallel world as **distinct** primitives  
3. Narrative graphs under those laws  
4. Zod → JSON Schema; CI validate  
5. Visual engine **out of scope** here — consume `worlds` / `events` / `edges` later  
