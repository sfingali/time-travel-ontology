# Stream 4 — Diagram / Timeline / Causality-Graph Archaeology

**Date:** 2026-09-06 (UTC) · reported for user zone Europe/London as afternoon BST  
**Executor:** Grok Bot (executor subagent)  
**Scope:** Sources & meta-descriptions of existing fan/academic/explainer diagrams — not invented art.

## Deliverables

| Path | Status |
|------|--------|
| `diagrams/MASTER-DIAGRAM-INDEX.md` | Done — exhaustive URL harvest with title/work/URL/type/lang/quality |
| `diagrams/works/<slug>.md` | Done — **26** work meta pages |
| `diagrams/assets/<slug>/` | Partial — see Assets |
| `diagrams/av-diagram-index.md` | Cross-updated with Stream 4 delta URL block |
| `diagrams/novel-diagram-index.md` | Cross-updated with Zombies/Kindred/11/22/63/Arrival |
| `logs/stream4-diagrams.md` | This file |

## Counts

- **Diagram source rows** in master index: **~120+** (tables across priority works + hubs)
- **Works with meta pages:** **26**
- **Works covered (priority + adjacent):** Primer, Predestination, Tenet, Looper, Dark, Steins;Gate, Donnie Darko, Butterfly Effect, 12 Monkeys (+TV), BTTF trilogy, Terminator franchise, Coherence, EEAAO, Loki, Fringe, Counterpart, Your Name, Arrival/Story of Your Life, All You Zombies, Kindred, 11/22/63, Timecrimes, Triangle, Interstellar, Edge of Tomorrow, Mr. Nobody
- **Languages:** English (majority), Italian (Il Sorpasso, FilmPost), Chinese (Steins;Gate flowchart), Japanese/German wiki usage notes

## Assets

| Asset | Result |
|-------|--------|
| `assets/all-you-zombies/All_you_zombies_timeline.png` | **Downloaded** (CC BY-SA 4.0, Commons) |
| `assets/dark/Dark_TV_Series_Family_Tree.svg` | URL verified; **Wikimedia HTTP 429** blocked download — listed in SOURCES.txt |
| `assets/primer/Time_Travel_Method.jpg` | URL verified (GFDL/CC BY-SA); **429** blocked — listed in SOURCES.txt |
| Editorial/fan images (Slate straws, Taylor Holmes, This Is Barry, Gizmodo graphs, A24 EEAAO map) | **URL-only** (unclear/commercial rights) |

## Method

1. Seeded from existing `av-diagram-index.md` / `novel-diagram-index.md`
2. WebSearch harvest per priority title + non-English (Italian hub, ZH Steins;Gate, Commons)
3. WebFetch of key explainers (Astronomy Trek Primer, Il Sorpasso, Commons pages, qntm)
4. Wrote master index + per-work meta (nodes/loops/branches) from fetched content
5. Attempted Commons downloads; attributed in SOURCES.txt even when rate-limited

## Notable high-signal finds

- Commons: All You Zombies timeline; Dark S1–S2 family tree; Primer Time Travel Method (+ SVG derivative)
- Italian aggregator: Il Sorpasso “Da Dark a Tenet” with downloadable maps for Dark/Tenet/Looper/Primer/Predestination/12 Monkeys/BTTF
- Interactive Dark: aldersonloop59 Lucidchart/SVG; academic GD 2025 Dark spiral contest
- Steins;Gate: gwern Mechanics PDF figures; wesleycox worldlines poster generator
- Tenet: aibaranov hand diagrams; Taylor Holmes location-relative infographic; Astromech phase map
- EEAAO: official A24 Ori Toor multiverse map
- Looper/Terminator: Michael Talley straw diagrams (Slate / Inside Pulse / Time Out)

## Gaps / follow-ups

- Retry Wikimedia downloads after rate-limit cool-down
- Butterfly Effect / Your Name still thinner on dedicated public diagrams than Primer/Dark class
- Japanese-language Steins;Gate / Your Name diagram pages under-harvested (search returned ZH/EN-heavy)
- Taylor Holmes image files themselves not mirrored (rights)

## Tools used

WebSearch, WebFetch, Shell (mkdir/curl/python). No browserUse/Task (unavailable to executor).
