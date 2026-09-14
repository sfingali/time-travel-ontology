# Corpus audit — 14 September 2026

A read-only pass over all 60 encodings in `instances/`, the 455 front-mattered
works in `reference-archive/`, and the catalogues. No instance was edited to
produce it. Raw per-instance data accompanies this note.

Headline: the corpus is **clean where the validator looks and uneven where it
does not**. All 60 validate. Every one of 1307 events carries the plain-English
`description` the README promises, and none merely restates its label — that
claim holds exactly. What the validator cannot see is that a fifth of those
events are an undeclared second telling of the same story, and that most of the
schema's semantic distinctions are declared but never populated.

---

## 1. A fifth of the corpus is an undeclared duplicate track

266 of 1307 events (20%), across 48 of 60 instances, carry an `e_x_` or `ev_`
prefix and restate beats already encoded under their own ids.

*La Jetée* is the clearest case. Twelve events tell the story; eight more repeat
it:

| Story event | Duplicate |
|---|---|
| `e_war` — post-apocalyptic underground | `e_x_war` — WWIII underground experiments |
| `e_send_past` — sent to past via memory anchor | `e_x_send` — prisoner sent to past via memory |
| `e_future_offer` — sent to far future, offered escape | `e_x_future` — visit future beings |
| `e_death` — killed on the pier | `e_x_death` — he is the dying man he saw |
| `e_loop_close` — the memory was the death | `e_x_loop` — memory was own death |

The `ev_` variant behaves the same way at coarser grain: `ev_opera` restates
`e_opera` in *Tenet*, `ev_mikkel` restates `e_mikkel` in *Dark*, `ev_comet`
summarises `e_dinner` and `e_blackout` in *Coherence*.

Three things make this a correctness problem rather than mere padding:

- **The schema has fields for exactly this and they are unused.** `duplicateOf`
  ("asserts the same semantic occurrence"), `summaryOf` ("summarises the listed
  events") and `abstractionLevel` appear **zero times** in the corpus. The
  duplicates are therefore indistinguishable from distinct occurrences.
- **They are fully wired in.** 100% of the 266 are edge-connected, versus 98%
  of ordinary events. The graph asserts causal and temporal relations for the
  second telling as though it were separate.
- **The distribution is mechanical.** Exactly eight `e_x_` events appear in 22
  different instances. That is an authoring pass, not a property of 22 stories.

**The effect on every count in this repository.** Twelve instances have no
duplicates at all: `11-22-63`, `about-time`, `bill-and-ted`, `counterpart`,
`fringe`, `happy-death-day`, `outlander`, `run-lola-run`, `sliding-doors`,
`terminator-2`, `the-time-machine-1960`, `the-waif`.

| | declared | de-duplicated |
|---|---|---|
| total events | 1307 | **1041** |
| minimum | 20 | 12 |
| median | 22 | 17 |
| maximum | 32 | 28 |
| standard deviation | 2.0 | **4.0** |
| instances in the 20–24 band | 57 of 60 | **16 of 60** |

The apparent uniformity of the corpus — every work encoded at 20–24 events
regardless of scale — is **entirely an artefact of the duplicates**. Removed,
the encodings vary as you would expect: *La Jetée* 12, *Dark* 19, *Tenet* 27.
The underlying work is better than it looks; it has been inflated by a fifth.

**Suggested response.** Either annotate the duplicates with `summaryOf` /
`duplicateOf` — which is what those fields are for and would make the second
track a legitimate abstraction layer — or remove them. Leaving them undeclared
means every consumer over-counts, and comparison between a de-duplicated
instance and an inflated one is meaningless.

## 2. Declared distinctions are almost never populated

Documented conventions, and how often they are actually followed:

| Convention | Followed |
|---|---|
| temporal edge sets `orderKind` | **2 of 194** (1%) |
| identity edge sets `identityRelation` | **6 of 67** (8%) |
| a loop that ends uses `loop_exit` | **1 of 14** loop stories |
| a bootstrap story carries a `bootstrap_origin` event | 15 of 24 (62%) |

These are not obscure. `orderKind` is the field that separates chronological
from experienced order — the distinction a renderer needs before it can place
anything on an axis. `identityRelation` separates *the same person later* from
*a counterpart* from *a loop iteration*. Both are effectively empty corpus-wide,
so no comparison across the corpus can currently rest on either.

`loop_exit` is the sharpest case: ENCODING-GUIDE says to use it for the event
where a loop ends, and of fourteen loop stories only *Groundhog Day* does.
*Edge of Tomorrow*, *Palm Springs*, *Happy Death Day*, *Russian Doll*,
*Boss Level*, *Arq* and *Triangle* all have loops that demonstrably end and all
record only `loop_reset`.

**Suggested response.** These need story judgement and cannot be filled
mechanically — see §6. Either populate them deliberately or drop the fields;
a distinction nobody fills is worse than no distinction, because it reads as
absence of the phenomenon rather than absence of the annotation.

### The advisory inventory

351 advisories across the corpus, in only six classes. Two account for 72%:

| Class | Count |
|---|---|
| temporal edge lacks `orderKind` | 192 |
| branch lacks `forkEventRef` | 73 |
| identity edge lacks `identityRelation` | 61 |
| topology conformance | 10 |
| rule selected without structural evidence | 9 |
| `relation` set on a non-world edge | 6 |

The 73 branches lacking a fork event are less alarming than they look: 70 of
them do name a `parentRef` and are missing only the precise event. Three name
no parent at all, and all three are in `the-waif` — the sole such case in 60
instances.

## 3. Structural anomalies the validator does not check

| Finding | Count | Instances |
|---|---|---|
| worlds declared that hold no events | 11 | 8 |
| worlds nothing references at all | 6 | 4 |
| events touched by no edge | 19 | 9 |
| branches with no parent at all | 3 | 1 (`the-waif`) |
| outcome worlds that hold no events | 2 | 1 (`spider-man-into-the-spider-verse`) |
| dangling identity-chain references | 0 | — |

Several of these are load-bearing rather than cosmetic:

- **`run-lola-run` `w_run3`** is isolated and empty. Run three is the film's
  actual ending — the one where both leads win.
- **`sliding-doors` `w_miss`** is isolated. It is one of the two timelines the
  film is named for.
- **`spider-man-into-the-spider-verse`** names `w_65` and `w_616b` as
  `outcome.endWorldRefs` while neither holds a single event, so the encoding's
  declared ending is unreachable from its own graph.
- **`fringe`** declares `w_observer` and `w_reset` — the dystopian future and
  the final reset — and populates neither.

The pattern is consistent: the world that *matters at the end* is the one most
likely to be declared and left empty.

## 4. Rule set and topology are nearly the same axis

All 13 rule sets and all 9 topology patterns are used; no catalogue entry is
dead. But the two axes are close to redundant: **10 of 13 rule sets determine
the topology exactly**, covering 43 of 60 instances (71%).

| Rule set | n | Topology |
|---|---|---|
| `mutable_ripple` | 12 | always `mutable_single_with_ripples` |
| `branch_on_intervention` | 8 | always `branching_tree` |
| `predestination_closed_loop` | 7 | always `single_fixed_timeline` |
| `fixed_novikov` | 5 | always `single_fixed_timeline` |
| `branch_bureaucracy_prune` | 3 | always `branching_tree` |
| `death_checkpoint_rewrite`, `tangent_universe`, `worldline_attractor` | 2 each | one topology each |
| `entropy_inversion`, `perception_nonlinear` | 1 each | one topology each |

Only three carry real information in the second axis: `bootstrap_ontological`
(3 topologies), `temporal_loop_exit` (2) and `multiverse_contact` (2).

Mixins tell a different story: `bootstrap_ontological` is the most-used mixin
(21) despite being primary only 3 times. Bootstrap is treated as a flavour
that attaches to other laws rather than as a governing law itself.

**Suggested response.** Not a defect, but worth knowing before adding rule
sets: a new rule set that implies exactly one topology adds nothing the primary
id did not already say.

## 5. Payload fields are a long tail of single-story extensions

35 payload fields are in use. The top four (`note`, `travelMode`, `tags`,
`bootstrapEntity`) account for most usage. **Sixteen are used by exactly one
instance** — `entropy`, `inverted`, `turnstileId`, `pincerRole`, `freeportId`
and `algorithmPiece` (all *Tenet*); `boxId`, `boxDuration`, `failsafeId`
(*Primer*); `worldlineId`, `divergenceMagnitude`, `readingSteiner`
(*Steins;Gate*); `nexusEvent`, `sacredTimeline` (*Loki*); `checkpointEventId`,
`attractorFieldId`.

These are story-specific vocabulary living in a shared schema. That is a
legitimate choice, but it should be a deliberate one: they will never support
cross-corpus comparison, and each is a field every consumer must ignore.

## 6. Archive coverage

455 works carry front-matter; 58 of the 60 encodings match one by slug.
`the-waif` is original and has no archive entry, correctly. `eeaao` matches by
title rather than slug: the archive entry is `everything-everywhere-all-at-once.md`.
This is **not** a defect. `findHandMatch` in the importer treats slug identity as
authoritative and then falls back to title + medium + year + creator, so the
work resolves to `eeaao.json` and no duplicate stub is generated. Verified
against `instances/generated/`, which contains 381 stubs and no entry for it.

Encoded coverage is **58 of 455 (12%)**. By medium the archive is 201 film,
119 TV, 119 novel, and 16 short/novella/collection.

## 7. What can and cannot be fixed mechanically

Almost nothing here is safely fixable without reading the works. Filling
`orderKind` means deciding whether an edge asserts chronological or experienced
order; filling `identityRelation` means deciding whether two agents are the same
person or counterparts; adding `loop_exit` means identifying the beat where a
loop ends. Each is a claim about the story, and guessing would put invented
facts into a corpus whose main virtue is that it does not contain any.

Genuinely mechanical, and safe to apply: **nothing.** The one candidate — the
`eeaao` slug mismatch — turned out on inspection to be handled by the importer's
title fallback and not a defect at all. No instance is edited by this audit.

Everything belongs on a decisions list for whoever knows the works. The
highest-value items, in order:

1. The four empty end-state worlds (`spider-verse` ×2, `fringe` ×2) and the two
   isolated named timelines (`run-lola-run` `w_run3`, `sliding-doors` `w_miss`).
   These are load-bearing and small in number.
2. `loop_exit` on the thirteen loop stories whose loops end.
3. `identityRelation` on 61 identity edges.
4. `orderKind` on 192 temporal edges — the largest and the least urgent, since
   a renderer can decline to place anything it cannot order.

## 8. What is in good shape

Worth stating plainly, because the list above is all problems:

- All 60 encodings validate, with zero errors.
- Description coverage is complete and genuinely written for a lay reader:
  1307 of 1307 events, none echoing its label, only 3 under 40 characters and
  4 carrying ontology jargon.
- Every event in every instance carries a `timeLabel`.
- No dangling identity-chain references anywhere.
- 20 instances are structurally clean, fully labelled, richly described and
  carry a semantic review — the strongest candidates for reader guides:
  `about-time`, `arq`, `counterpart`, `dark`, `donnie-darko`, `erased`,
  `groundhog-day`, `loki`, `night-watch-discworld`, `outlander`, `palm-springs`,
  `project-almanac`, `quantum-leap`, `re-zero`, `replay`, `steins-gate`,
  `the-end-of-eternity`, `the-time-machine-1960`, `travelers`,
  `x-men-days-of-future-past`.

---

# Decisions worksheet

Everything below needs someone who knows the works. Each item names an existing
event or world and the specific question. Nothing here is a proposed invention.

## A. Where does each loop end?

`loop_exit` appears in one instance of fourteen. But the absence is not always
wrong — four encodings say plainly that their loop does not end, and are right
to carry no exit. The other nine already contain the exit beat, typed as
something else.

### A1 — absence is correct, no change needed

| Instance | Evidence in the encoding |
|---|---|
| `arq` | outcome: "No clean exit on screen"; `e_robot` carries `exitFailed: true`; `e_outer_reset` continues the nesting |
| `triangle` | `e_no_exit` — "Loop continues; no external exit shown", `exitFailed: true` |
| `re-zero` | Return by Death is ongoing; outcome describes progression, not exit |
| `boss-level` | `e_enter` is a `departure` with `exitCondition: "reset spindle"`; outcome calls the endings "ambiguous continue" |

### A2 — the exit beat exists but is typed as something else

Confirm the event, and whether its `type` should become `loop_exit`.

| Instance | Candidate | Current type | Why it looks like the exit |
|---|---|---|---|
| `edge-of-tomorrow` | `e_exit` | `arrival` | "General reset to pre-invasion briefing — victory"; carries `exitCondition: "Omega destroyed"` |
| `happy-death-day` | `e_next_day` | `checkpoint` | label says "Next calendar morning **confirms exit**" |
| `palm-springs` | `e_exit` *or* `e_nov10` | `arrival` / `checkpoint` | both read "Wake Nov 10 — loop broken". **These two duplicate each other** — pick one |
| `russian-doll` | `e_exit_s1` | `ordinary` | "S1 exit: mutual help breaks the shared loop". `ev_s1_exit` duplicates it |
| `replay` | `e_survive` | `ordinary` | "Jeff survives 1988 heart attack" — but `e_epilogue` shows others still looping, so scope the claim |
| `run-lola-run` | `e_exit` | `checkpoint` | "Run 3 exits need for further resets" |
| `erased` | `e_2003` | `arrival` | "2003 wake from 15-year coma" ends the revival cycle |
| `source-code` | `e_freeze` | `checkpoint` | `exitCondition: "remain in SC world"`; the loop ends by forking, via `e_fork_alt` |
| `the-endless` | `e_escape` | `arrival` | "Brothers reach outside" — but the same event notes a "larger unnoticed loop", so this may be an exit from one pod only |

## B. Six declared worlds that hold no events

In each case the empty world is the one that matters at the end.

**`11-22-63` — `w_jfk_saved`, `w_accepted`.** The dystopian present created by
saving Kennedy is the novel's central turn, and it holds no events and no
world relations. `w_accepted` (the present Jake returns to after undoing the
change) is likewise empty. `outcome.endWorldRefs` names only `w_2015`.
*Decision: populate both, or drop them and let `w_2015` carry the ending.*

**`run-lola-run` — `w_run3`.** Run three, the double win, is empty and
unreferenced. More seriously, `outcome.endWorldRefs` is `['w_run2']` — the run
in which **Manni is killed**. As encoded, the story ends in the failed run.
*Decision: this looks like a straightforward error in the outcome. Confirm
that run three is the ending and move the reference, populating `w_run3`.*

**`sliding-doors` — `w_miss`.** One of the two timelines the film is named
for. `w_catch` has seven events; `w_miss` has none, and no relations.
`endWorldRefs` is `['w_root', 'w_catch']`.
*Decision: populate `w_miss`, or state why only one fork is encoded.*

**`spider-man-into-the-spider-verse` — `w_65`, `w_616b`.** Gwen's Earth-65 and
Peter B.'s Earth are both named in `outcome.endWorldRefs` while holding no
events, so the declared ending is unreachable from the graph. They do carry
`correspondsTo` relations, so they are not orphans — just empty.
*Decision: either give each the beat where its Spider returns home, or narrow
`endWorldRefs` to `w_1610`.*

**`fringe` — `w_observer`, `w_reset`.** The Observer-occupied 2036 dystopia and
the final reset continuum: the show's entire endgame, declared as branches with
no events and no relations. Note `w_over_there` holds only 2 events against
`w_over_here`'s 20, so the parallel side is thin even where populated.
*Decision: populate, or reduce the scope note to what the encoding covers.*

## C. Bulk annotation, in priority order

1. **266 duplicate events** (§1) — annotate with `summaryOf` / `duplicateOf`, or
   remove. Affects every count in the repository.
2. **`identityRelation` on 61 identity edges** — same person, counterpart, loop
   iteration or participation. Six are already set, as a pattern to follow.
3. **`orderKind` on 192 temporal edges** — chronological, experienced,
   presentation or simultaneity. Largest and least urgent: a renderer can
   decline to place what it cannot order.
4. **`bootstrap_origin`** — 9 of 24 instances claiming bootstrap carry no such
   event: `continuum`, `deja-vu`, `donnie-darko`,
   `harry-potter-prisoner-of-azkaban`, `primer`, `timecrimes`, `triangle`,
   `umbrella-academy`, `your-name`.
