# Diagram Mass Hunt — Log

**Date:** 2026-09-06 (UTC) · user zone Europe/London = BST (UTC+1)  
**Executor:** Grok Bot (executor subagent)  
**Tools:** WebSearch + WebFetch only (no invented URLs)  
**Scope:** Expand MASTER-DIAGRAM-INDEX with many independent fan/academic diagram variants per priority work.

## Deliverables

| Path | Status |
|------|--------|
| `diagrams/MASTER-DIAGRAM-INDEX.md` | Rewritten — full table with variation_id |
| `diagrams/VARIATIONS.md` | New — grouped by work |
| `logs/diagram-mass-hunt.md` | This file |

## Counts

- **Rows written:** **227**
- **Unique URLs:** **200**
- **Works:** **44**
- **Languages:** en, it, ja, ko, zh
- **Prior Stream 4 baseline:** ~120+ rows / ~100–110 unique URLs (approx.)
- **Approx. new unique URLs this wave:** **~90** (vs ~110 prior unique estimate)
- **Net row growth vs prior ~120:** **+107** rows

## Method

1. Read existing MASTER-DIAGRAM-INDEX.md + stream4 log
2. Parallel WebSearch waves per priority title + patterns:
   - `[title] timeline diagram` / `causality diagram` / `bootstrap paradox chart` / `world line chart` / `multiverse map`
   - Non-English: `Zeitstrahl`, `linea temporal`, `年表`, `世界線`, `タイムライン 図`
   - Aggregators: Il Sorpasso, Commons, Taylor Holmes, This Is Barry, mjyoung, wikis
3. WebFetch key hubs (Il Sorpasso, dark.netflix.io)
4. Deduplicate; assign variation_ids (`dark-family-v*`, `dark-timeline-v*`, `primer-v*`, …)
5. Write MASTER + VARIATIONS + this log

## Highest-yield new finds

- **Dark:** `dark.netflix.io`, Hello Jury, Business Insider, TV Guide S3, Bustle, Forbes, drarmstr tree, GitHub visualizer
- **Primer:** Unreality definitive chart, CinemaHolic, YouTube illustrated, Willemsen&Kiss Tom-B academic map, Networkologies
- **Looper:** Rick Slusher Visual.ly (+ academic PDF Fig.4)
- **Steins;Gate:** JP アニヲタWiki 世界線, Gokitsu 徹底図解, Divergence Meter
- **Donnie Darko:** Kaedrin, mjyoung AB–GH
- **Predestination/Zombies:** Taylor Holmes unpack, mjyoung, Bootstraps companion
- **Endgame:** ScreenRant interactive map (Oren Bell) + branch inventory
- **Lost:** Lostpedia Frozen wheel + Looper full timeline + flash-sideways timeline
- **Madoka / Re:Zero / STR:** Puella Magi timelines, Lanobare 年表, note.com chronology
- **Triangle:** Chessboard Factory infographic
- **Tenet:** CBR pincer explainer

## Gaps remaining

- Palm Springs / Russian Doll / Frequency / Link Click still thin on dedicated public *diagram* pages
- Your Name Japanese fan 年表 under-harvested vs Steins;Gate JP yield
- Direct Imgur/DeviantArt album URLs low recall via site: search
- Wikimedia image downloads not re-attempted (prior 429)

## Per-work unique URL counts

- Primer: **16**
- Predestination: **7**
- All You Zombies: **6**
- Tenet: **10**
- Looper: **8**
- Dark: **21**
- Steins;Gate: **12**
- Donnie Darko: **8**
- Butterfly Effect: **4**
- 12 Monkeys: **6**
- Back to the Future: **6**
- Terminator: **5**
- Coherence: **4**
- EEAAO: **4**
- Loki: **6**
- Fringe: **4**
- Counterpart: **3**
- Your Name: **3**
- Arrival: **5**
- Interstellar: **5**
- Triangle: **3**
- Timecrimes: **4**
- Edge of Tomorrow: **3**
- Groundhog Day: **3**
- Source Code: **3**
- Palm Springs: **2**
- Russian Doll: **2**
- Madoka Homura: **3**
- Re:Zero: **3**
- Summertime Rendering: **2**
- Link Click: **2**
- Mr. Nobody: **3**
- Spider-Verse: **3**
- Endgame time heist: **6**
- Lost time travel: **6**
- Quantum Leap: **4**
- Outlander stones: **3**
- Frequency: **2**
- Kindred: **2**
- 11/22/63: **2**
- Girl Who Leapt Through Time: **1**
- ARQ: **1**
- About Time: **1**
- Cross-cutting: **20**
