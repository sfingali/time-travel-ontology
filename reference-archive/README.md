# Time Travel Meta-Archive

Companion narrative corpus for [time-travel-ontology](../README.md): public plot summaries, structure notes, and diagram/timeline sources for **time travel** and **interacting parallel / alternate universes**.

**No original media.** Spoilers throughout. Summaries are paraphrased from public sources (Wikipedia, fandom wikis, editorial explainers, local-language pages) — not a claim of first-hand viewing.

## Live corpus

| Section | Entries |
|---------|--------:|
| Films | **203** |
| TV / major arcs | **119** |
| Novels & major shorts | **139** |
| Diagram work-pages | **26** |
| Exhaustive deep entries | **168** |
| **Catalogued works** | **461** |
| Diagram images (Git LFS) | **71** under [`diagrams/assets/`](diagrams/assets/) |

## Layout

| Path | Contents |
|------|----------|
| [`films/`](films/) | One entry per film (YAML + summary) |
| [`tv/`](tv/) | Series / major arcs |
| [`novels/`](novels/) | Prose fiction |
| [`diagrams/`](diagrams/) | URL indexes, hunt logs, **local diagram captures** |
| [`candidates/`](candidates/) | Harvest lists for expansion |
| [`sources/`](sources/) | Bibliography |
| [`logs/`](logs/) | Stream / wave progress notes |
| [`index.md`](index.md) | Master catalog |

## Entry frontmatter (AV)

```yaml
title:
year:
medium: film | tv
creators:
original_title:        # optional
languages:
original_language:
country:
mechanism:             # pipe-separated tags
paradox_type:
summary_depth: brief | detailed | exhaustive
diagram_refs: []
plot_summary_sources: []
flag_diagrams: true
```

These tags feed `npm run import` in the ontology package (draft stubs only; hand-crafted `instances/*.json` are never overwritten).

## Diagram assets

Public, spoiler-heavy timeline/infographic captures and free-licensed Commons files. See [`diagrams/DIAGRAM_HUNT_SUMMARY.md`](diagrams/DIAGRAM_HUNT_SUMMARY.md) and [`diagrams/ASSETS_NOTE.md`](diagrams/ASSETS_NOTE.md). Large binaries are stored with **Git LFS**.

## Scope

Classic machine time travel **and** parallel/alternate stories where universes or timelines **interact** (e.g. *Donnie Darko*, *Coherence*, *Everything Everywhere All at Once*).
