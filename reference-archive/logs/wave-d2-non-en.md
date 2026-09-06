# Wave D2 — Non-English AV gap closure

**Finished:** 2026-09-06 ~14:00 UTC+01:00 (Europe/London)  
**Agent:** Grok Bot executor subagent  
**Archive:** `/workspace/time-travel-archive/`

## Goal
Close Wave B’s still-open non-English priority list and harvest further titles from `candidates/non-english-av.md`. Create NEW detailed entries (or deepen thin stubs) with original + English titles, `original_language` / `country`, public-source plots only (no invented plots, no media files). Match frontmatter style of `films/primer.md` / `tv/lovely-runner.md`.

## Corpus delta
| Metric | Before (Wave B) | After Wave D2 |
|--------|----------------:|--------------:|
| Films | 161 | **183** (+22) |
| TV | 95 | **110** (+15) |
| Novels & major shorts | 124 | 124 (unchanged) |
| **Catalogued AV+novels** | **380** | **417** (+37) |

Plus **7 substantially deepened** existing stubs (not counted as new files).

**New+deepened total this wave: 44** (37 new files + 7 deepenings) — exceeds ≥25 criterion.

## New entries created

### KR TV (7)
| Work | Path | Language / country |
|------|------|-------------------|
| Tomorrow With You | `tv/tomorrow-with-you.md` | Korean / South Korea |
| The King: Eternal Monarch | `tv/the-king-eternal-monarch.md` | Korean / South Korea |
| Mr. Queen | `tv/mr-queen.md` | Korean / South Korea |
| Rooftop Prince | `tv/rooftop-prince.md` | Korean / South Korea |
| Reborn Rich | `tv/reborn-rich.md` | Korean / South Korea |
| 365: Repeat the Year | `tv/365-repeat-the-year.md` | Korean / South Korea |
| W: Two Worlds | `tv/w-two-worlds.md` | Korean / South Korea |

### KR films (3)
| Work | Path | Language / country |
|------|------|-------------------|
| A Day | `films/a-day.md` | Korean / South Korea |
| Heaven's Soldiers | `films/heavens-soldiers.md` | Korean / South Korea |
| 2009: Lost Memories | `films/2009-lost-memories.md` | Korean / South Korea |

### JP TV / anime (7)
| Work | Path | Language / country |
|------|------|-------------------|
| Vivy: Fluorite Eye's Song | `tv/vivy-fluorite-eyes-song.md` | Japanese / Japan |
| Remake Our Life! | `tv/remake-our-life.md` | Japanese / Japan |
| Nobunaga Concerto | `tv/nobunaga-concerto.md` | Japanese / Japan |
| Thermae Romae (TV) | `tv/thermae-romae.md` | Japanese / Japan |
| Buddy Complex | `tv/buddy-complex.md` | Japanese / Japan |
| Occult Academy | `tv/occult-academy.md` | Japanese / Japan |
| Sagrada Reset (franchise note; film-slug) | `films/sagrada-reset.md` | Japanese / Japan |

### JP films (6)
| Work | Path | Language / country |
|------|------|-------------------|
| Cyborg She / My Girlfriend Is a Cyborg | `films/cyborg-she.md` | Japanese / Japan |
| Returner | `films/returner.md` | Japanese / Japan |
| Voices of a Distant Star | `films/voices-of-a-distant-star.md` | Japanese / Japan |
| My Tomorrow, Your Yesterday | `films/my-tomorrow-your-yesterday.md` | Japanese / Japan |
| The 100th Love with You | `films/the-100th-love-with-you.md` | Japanese / Japan |
| Erased (2016 live-action film) | `films/erased-2016.md` | Japanese / Japan |

### CN / HK / TW (4)
| Work | Path | Language / country |
|------|------|-------------------|
| A Step into the Past (TVB) | `tv/a-step-into-the-past.md` | Cantonese / Hong Kong |
| Secret (Jay Chou, 2007) | `films/secret-2007.md` | Mandarin / Taiwan |
| Suddenly Seventeen | `films/suddenly-seventeen.md` | Mandarin / China |
| The Myth (2005) | `films/the-myth.md` | Mandarin/Cantonese / China–HK |

### EU (6)
| Work | Path | Language / country |
|------|------|-------------------|
| Les Visiteurs 3 / Bastille Day (La Révolution) | `films/les-visiteurs-3.md` | French / France |
| Peut-être | `films/peut-etre.md` | French / France |
| La Belle Époque | `films/la-belle-epoque.md` | French / France |
| Abracadabra (2017) | `films/abracadabra-2017.md` | Spanish / Spain (borderline possession) |
| Sexmission | `films/sexmission.md` | Polish / Poland |
| Tidsrejsen | `tv/tidsrejsen.md` | Danish / Denmark |

### IN (4)
| Work | Path | Language / country |
|------|------|-------------------|
| Jango (2021 Tamil) | `films/jango.md` | Tamil / India |
| Oke Oka Jeevitham / Kanam | `films/oke-oka-jeevitham.md` | Telugu (+ Tamil) / India |
| Who (2018) | `films/who-2018.md` | Malayalam / India (wiki plot thin) |
| 13B: Fear Has a New Address | `films/13b.md` | Hindi / India (borderline prophetic TV) |

## Substantially deepened stubs (7)
| Work | Path | Notes |
|------|------|-------|
| Cafe Funiculi Funicula / Before the Coffee Gets Cold | `films/cafe-funiculi-funicula.md` | Full café-chair rules + four vignettes |
| Bubble Fiction: Boom or Bust | `films/bubble-fiction.md` | Economy-mission comedy expanded |
| Je t'aime, je t'aime | `films/je-taime-je-taime.md` | Capsule failure / memory shards; diagram flag |
| Il Mare | `films/il-mare.md` | Nested warning-letter loop; remake lineage |
| The Lake House | `films/the-lake-house.md` | Remake comparison vs Il Mare |
| Higurashi When They Cry | `tv/higurashi.md` | Question/answer fragment loops |
| Aditya 369 | `films/aditya-369.md` | Past court + 2504 future sandwich |

**Already substantial (skipped duplicate create):** `tv/signal.md`, `tv/someday-or-one-day.md`, `tv/erased.md` (anime; live-action film added separately as `films/erased-2016.md`).

## Indexes / meta
- Regenerated `films/_index.md` (**183**) and `tv/_index.md` (**110**) from YAML frontmatter
- Updated root `index.md` live corpus counts (catalogued **417**)
- This log: `logs/wave-d2-non-en.md`

## Method
- Plots paraphrased from English Wikipedia (and search/explainers where EN wiki thin, e.g. *A Day*)
- **No invented plots**; thin wiki pages left thin with explicit notes (`who-2018`, parts of `jango`, `erased-2016`)
- Borderline inclusions flagged in-entry: Abracadabra (possession), 13B (ghost/prophecy), Voices of a Distant Star (relativistic lag), Suddenly Seventeen (age/persona), La Belle Époque (theatrical “time travel” service)
- YAML includes `original_title`, `original_language`, `country` on new/deepened non-EN files

## Remaining gaps (next harvest)
### Still thin / optional deepen
- Local-language wiki pass (JA/KO/ZH/FR) for thin EN pages: `films/who-2018.md`, `films/jango.md`, `films/erased-2016.md`
- Thermae Romae **theatrical films** (distinct from `tv/thermae-romae.md`) if wanted as separate film entries
- Signal / Someday already detailed — optional diagram-link harvest only

### From `candidates/non-english-av.md` still open (sample)
- JP: Re:Zero (if missing/thin), Inuyasha Bone-Eater arcs, Doraemon TT arcs, Samurai Commando 1549, Enoshima Prism, Riding the Metro, Winds of God, Paprika (dream/parallel), Place Promised in Our Early Days, Link Click (CN donghua), Magical Shopping Arcade Abenobashi
- KR: further cable/Netflix TT not on Wave B list (Life on Mars KR deepen, etc. if thin)
- CN: more *chuanyue* costume dramas beyond Scarlet Heart / Step into the Past
- EU: more Nordic/Eastern European TT comedies beyond Sexmission / Tidsrejsen
- IN: 24 (Tamil) deepen if thin; Maanaadu already likely present — verify; other loop films

## Success criteria
| Criterion | Status |
|-----------|--------|
| ≥25 new/deepened non-EN entries | **Met** (37 new + 7 deepened = 44) |
| Log with titles, paths, languages | **This file** |
| Report corpus delta + remaining gaps | **Above** |
