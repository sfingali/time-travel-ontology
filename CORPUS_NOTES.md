# Corpus notes

Living bridge between the **narrative meta-archive** and this **ontology** package. Refresh when catalogue or instance counts move.

| | |
|--|--|
| Narrative corpus | [`reference-archive/`](reference-archive/) (also developed as `/workspace/time-travel-archive/` on the bot box) |
| Formal encodings | [`instances/`](instances/) + Zod/`schema/ontology.schema.json` |
| Last refreshed | 2026-09-06 |

---

## Live archive snapshot

| Section | Count |
|---------|------:|
| Films | **203** |
| TV / major arcs | **119** |
| Novels & shorts | **139** |
| **Catalogued works** | **461** |
| Exhaustive (`summary_depth`) | **168** |
| Diagram images (LFS) | **71** under `reference-archive/diagrams/assets/` |

Entry YAML (`mechanism`, `paradox_type`, …) feeds `ARCHIVE_ROOT=./reference-archive npm run import` → drafts in `instances/generated/` (never overwrites hand-crafted files).

---

## Ontology snapshot

| Asset | Count |
|-------|------:|
| Rule sets (`src/catalog/rules.ts`) | **13** |
| Topology patterns (`src/catalog/topologies.ts`) | **8** |
| Hand-crafted instances (`instances/*.json`) | **21** |
| Generated stubs (sample) | under `instances/generated/` |

### Rule set IDs

`fixed_novikov` · `mutable_ripple` · `branch_on_intervention` · `bootstrap_ontological` · `predestination_closed_loop` · `temporal_loop_exit` · `worldline_attractor` · `entropy_inversion` · `tangent_universe` · `multiverse_contact` · `branch_bureaucracy_prune` · `death_checkpoint_rewrite` · `perception_nonlinear`

### Topology pattern IDs

`single_fixed_timeline` · `mutable_single_with_ripples` · `branching_tree` · `dual_parallel_pair` · `worldline_bundle` · `tangent_bubble` · `inverted_single_timeline` · `origin_plus_twins`

### Hand-crafted instances (on `main`)

`about-time` · `arrival` · `back-to-the-future` · `dark` · `donnie-darko` · `edge-of-tomorrow` · `eeaao` · `frequency` · `groundhog-day` · `loki` · `looper` · `palm-springs` · `predestination` · `primer` · `re-zero` · `source-code` · `steins-gate` · `tenet` · `terminator-2` · `the-butterfly-effect` · `twelve-monkeys`

**Dense exemplar:** `tenet` — primary `entropy_inversion`, **27** events / **39** edges.

Still useful as **next encodes** (archive-rich, thin or missing as hand-crafted instances): Coherence, Mr. Nobody, Your Name / Counterpart / Fringe, Russian Doll, Interstellar, Timecrimes, Outlander, Bill & Ted, The Time Machine (1960), Terminator (1984), 11/22/63 — several already appear as importer stubs under `instances/generated/`.

---

## Top archive tags (heuristic signal)

**`mechanism` (top):** `time_machine` (52) · `loop` (12) · `time_slip` (10) · `unexplained_timeslip` (9) · `reality_rewrite` (8) · `parallel_worlds` / `multiverse_contact` (7) · `time_displacement` (6) · `oxford_net` / `cafe_seat_rules` (4) · …

**`paradox_type` (top):** `branching_timeline` (97) · `destiny_manipulation` (54) · `closed_loop` (37) · `reality_rewrite` (33) · `groundhog_day_loop` / `bootstrap` (32) · `parallel_worlds` (27) · `multiverse_contact` (26) · `set_right_what_once_went_wrong` (19) · `predestination` (18) · …

Map tags → catalogue IDs in the importer; refine by hand with `primaryRuleSetId` + optional `mixinRuleSetIds` ([docs/COMPATIBILITY.md](docs/COMPATIBILITY.md)).

---

## Design contract (stable)

1. **Rule sets** — named reusable fictional physics  
2. **World topology** — timeline / branch / parallel world as **distinct** primitives  
3. **Narrative encoding** — events, interventions, outcomes under those laws + topology  
4. Typed, machine-checkable schema (Zod → JSON Schema)  
5. Instances validate and compare across the corpus  
6. Entities/relations rich enough for a **later** visual engine — **not** implemented here  

See [README.md](README.md) and [docs/OVERVIEW.md](docs/OVERVIEW.md).
