# Corpus notes for ontology design (from Stephen's meta-archive)

Source archive on Grok Bot box: `/workspace/time-travel-archive/` (films/tv/novels markdown with YAML frontmatter). This repo is the **formal schema + encodings**; the narrative archive stays separate.

## Observed `mechanism` tags (top)
time_machine, loop, time_slip, unexplained_timeslip, reality_rewrite, parallel_worlds, multiverse_contact, time_displacement, oxford_net, worldlines, standing_stones, speed_force, revival_leap, handshake_time_leap, subtle_knife_windows, …

## Observed `paradox_type` / structure tags (top)
branching_timeline, destiny_manipulation, closed_loop, reality_rewrite, bootstrap, groundhog_day_loop, parallel_worlds, multiverse_contact, set_right_what_once_went_wrong, predestination, butterfly_effect, grandfather_risk, reading_steiner, ambiguous_ontology, …

## Canonical example stories to encode (diverse rule/topology combos)
1. **Primer** — overlapping boxes, failsafe preemption, broken symmetry / multiple histories
2. **Predestination / —All You Zombies—** — bootstrap identity closed loop
3. **Twelve Monkeys / La Jetée** — predestination / closed loop witness
4. **Back to the Future** — mutable past with ripple / alternate 1985A branch
5. **Dark (Netflix)** — bootstrap + knot; interlocking family loops across eras
6. **Steins;Gate** — worldlines / Reading Steiner / attractor fields (quasi-branching)
7. **Tenet** — entropy inversion; single timeline with inverted agents
8. **Looper** — closed-ish loop with mutable personal timeline tension
9. **Donnie Darko** — tangent universe / Living Receiver closure
10. **Coherence** — decoherence / parallel-world bleed via comet
11. **Everything Everywhere All at Once** — verse-jumping multiverse contact
12. **Groundhog Day / Edge of Tomorrow / Russian Doll** — day/death loops with exit conditions
13. **Arrival** — non-linear perception (Heptapod); bootstrap knowledge
14. **The Butterfly Effect** — mutable past with cascading personal rewrites
15. **Mr. Nobody** — branching life-paths / observer
16. **Loki (TVA)** — pruned branches / Sacred Timeline bureaucracy
17. **Fringe / Counterpart** — parallel universe contact
18. **Your Name** — body-swap across time offset; comet catastrophe rewrite
19. **Re:Zero** — Return by Death loops (checkpoint rewrite)
20. **The Man Who Folded Himself** — self-multiplicity via time travel

## Design requirements (user)
- Rule sets / fictional physics as named, reusable law variants
- World topology: **timeline**, **branch**, and **parallel world** as related but distinct primitives
- Narrative encoding: events, interventions, outcomes under those laws + topology
- Typed machine-checkable schema (JSON Schema + Zod preferred)
- Instance data validates; comparable across corpus
- Rich enough for a later visual engine (events, causal links, forks, world identities) — do NOT implement the visual engine
