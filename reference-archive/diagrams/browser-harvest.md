# Wave C — Browser Diagram Harvest

**Harvest date:** 2026-09-06 (UTC)
**Screenshot root:** `/tmp/.sand-browser/time-travel-archive/`

Public pages were opened in a clean headless Chrome session; screenshots are viewport captures. Editorial/fan diagrams remain URL-only unless clearly public.

## Captured pages

| Work | Page / diagram | URL | Screenshot | Result |
|---|---|---|---|---|
| Primer | Gizmodo — definitive graph of intersecting timelines | https://gizmodo.com/the-definitive-graph-of-all-of-primers-intersecting-tim-5847205 | `/tmp/.sand-browser/time-travel-archive/primer-gizmodo.png` | Page and graph article loaded |
| Predestination | This Is Barry — timeline diagram explainer | https://www.thisisbarry.com/film/predestination-2014-movie-plot-ending-explained/ | `/tmp/.sand-browser/time-travel-archive/predestination-barry.png` | Page loaded |
| Dark | aldersonloop59 — visual S1–S2 timeline | https://aldersonloop59.github.io/dark-timeline/index.html | `/tmp/.sand-browser/time-travel-archive/dark-aldersonloop.png` | Full visual timeline loaded |
| Steins;Gate | Votuko, *The Mechanics of Steins;Gate* PDF | https://gwern.net/doc/fiction/science-fiction/time-travel/2023-votuko-themechanicsofsteinsgate.pdf | `/tmp/.sand-browser/time-travel-archive/steins-gwern.png` | Public PDF viewer loaded (105 pages; figures in document) |
| Donnie Darko | Radio Times — timeline explained | https://www.radiotimes.com/movies/donnie-darko-timeline-explained/ | `/tmp/.sand-browser/time-travel-archive/donnie-radiotimes.png` | Page loaded |
| Tenet | Artem Baranov — hand-drawn scene reconstructions | https://aibaranov.github.io/tenet2/ | `/tmp/.sand-browser/time-travel-archive/tenet-aibaranov.png` | Page and first diagram loaded |
| Looper | Slate — “Diagrammed With Straws” | https://slate.com/culture/2012/11/looper-explained-in-a-diagram-with-straws.html | `/tmp/.sand-browser/time-travel-archive/looper-slate.png` | Page and straw diagram loaded |
| Everything Everywhere All at Once | Ori Toor — A24 multiverse map | https://oritoor.com/everything-everywhere-all-at-once-map-of-the-multiverse | `/tmp/.sand-browser/time-travel-archive/eeaao-oritoor.png` | Public map landing page loaded |
| ‘—All You Zombies—’ | Wikimedia Commons timeline PNG | https://commons.wikimedia.org/wiki/File:All_you_zombies_timeline.png | `/tmp/.sand-browser/time-travel-archive/all-you-zombies-commons.png` | Public diagram image loaded; CC BY-SA noted in index |
| Your Name | Wikipedia plot/chronology page | https://en.wikipedia.org/wiki/Your_Name | `/tmp/.sand-browser/time-travel-archive/your-name-wikipedia.png` | Public chronology reference loaded; no dedicated chart visible in viewport |
| Terminator | Inside Pulse — Michael Talley franchise diagram | https://insidepulse.com/2015/09/02/terminator-franchise-diagram/ | `/tmp/.sand-browser/time-travel-archive/terminator-talley.png` | Page loaded |

## Checks / skips

- `https://timetravelmovies.org/donnie-darko-2001/` returned Chrome `DNS_PROBE_FINISHED_NXDOMAIN`; diagnostic screenshot: `/tmp/.sand-browser/time-travel-archive/donnie-timetravelmovies.png`.
- Donnie Darko Movies Stack Exchange and Anime Stack Exchange world-line page timed out in headless Chrome; no content screenshot was counted.
- No paywalls, login walls, or credentials were bypassed.

## New URL delta

- Added the public Commons direct file endpoint to the master index: https://commons.wikimedia.org/wiki/Special:FilePath/All_you_zombies_timeline.png
- All other captured page URLs were already present in `MASTER-DIAGRAM-INDEX.md`; this pass adds local browser evidence rather than duplicating source rows.

**Successful content screenshots:** 11
