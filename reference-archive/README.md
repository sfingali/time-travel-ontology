# Time Travel Meta-Archive

Companion **narrative** corpus for the [time-travel-ontology](../README.md) package: public plot summaries, structure notes, and diagram sources for **time travel** and **interacting parallel / alternate universes**.

The ontology turns these entries into validated rule/topology/narrative encodings. YAML tags here are not decoration — they are the import signal (`ARCHIVE_ROOT=./reference-archive npm run import` → `instances/generated/`), then you deepen by hand into CI-gated `instances/*.json`.

**No original media.** Spoilers throughout. Paraphrased from public sources only.

## Live corpus

| Section | Entries |
|---------|--------:|
| Films | **203** |
| TV / major arcs | **119** |
| Novels & major shorts | **139** |
| Diagram work-pages | **26** |
| Exhaustive deep entries | **168** |
| **Catalogued works** | **461** |
| Diagram images (Git LFS) | **71** in [`diagrams/assets/`](diagrams/assets/) |

Indexes: [`films/_index.md`](films/_index.md) · [`tv/_index.md`](tv/_index.md) · [`novels/_index.md`](novels/_index.md) · [`index.md`](index.md)

## Layout

| Path | Contents |
|------|----------|
| [`films/`](films/) [`tv/`](tv/) [`novels/`](novels/) | One markdown entry per work |
| [`diagrams/`](diagrams/) | URL indexes, hunt logs, **local captures** (LFS) |
| [`candidates/`](candidates/) | Expansion harvest lists |
| [`sources/`](sources/) | Bibliography |
| [`logs/`](logs/) | Stream / wave notes |

## Add or deepen an entry

1. Copy a nearby file in `films/`, `tv/`, or `novels/` (kebab-case slug).
2. Fill YAML frontmatter (below) + blurb / plot / structure / sources. Spoilers OK; don’t invent plot.
3. Link it from the section `_index.md` and bump counts in [`index.md`](index.md) if you’re maintaining totals.
4. Optional: run `ARCHIVE_ROOT=./reference-archive npm run import` from the repo root, then formalise the interesting titles under `instances/` using [ENCODING-GUIDE](../docs/ENCODING-GUIDE.md).
5. Prefer public citations in `plot_summary_sources` / `diagram_refs`.

### Frontmatter (AV)

```yaml
title:
year:
medium: film | tv
creators:
original_title:          # optional
languages:
original_language:
country:
mechanism:               # pipe-separated → importer heuristics
paradox_type:            # pipe-separated → rule-set hints
summary_depth: brief | detailed | exhaustive
diagram_refs: []
plot_summary_sources: []
flag_diagrams: true      # when fan/editorial diagrams matter
```

## Diagram assets

Spoiler-heavy timeline/infographic captures + Commons downloads. See [`diagrams/DIAGRAM_HUNT_SUMMARY.md`](diagrams/DIAGRAM_HUNT_SUMMARY.md) and [`diagrams/ASSETS_NOTE.md`](diagrams/ASSETS_NOTE.md). Binaries use **Git LFS**.

## Scope

Classic machine time travel **and** stories where universes/timelines **interact** (*Donnie Darko*, *Coherence*, *Everything Everywhere All at Once*, …).
