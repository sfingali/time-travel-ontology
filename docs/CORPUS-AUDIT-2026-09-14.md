# Corpus audit — 14 September 2026

A read-only pass over all 60 encodings in `instances/`, the 455 front-mattered
works in `reference-archive/`, and the catalogues. No instance was edited to
produce it. Raw per-instance data accompanies this note.

Headline: the corpus is **clean where the validator looks and uneven where it
does not**. All 60 validate. Every one of 1307 events carries the plain-English
`description` the README promises, and none merely restates its label — that
claim holds exactly. What the validator cannot see is that the encodings are
uniformly sized regardless of the work, and that most of the schema's semantic
distinctions are declared but never populated.

---

## 1. The corpus is sized to a quota, not to the works

| | events |
|---|---|
| minimum | 20 |
| maximum | 32 |
| median | 22 |
| standard deviation | 2.0 |
| within 20–24 | 57 of 60 (95%) |

No encoding has fewer than twenty events. *La Jetée*, a 28-minute short built
from stills, has twenty. *Dark*, three seasons and a four-generation family
tree, has twenty-four. *Primer* and *The Time Machine (1960)* have the same
count. Only *Tenet* (32), *The Waif* (28) and *EEAAO* (26) sit outside the band.

A floor this hard is an authoring artefact, not a property of the stories. It
matters most for anyone building reader guides from these encodings: the
granularity is constant, so a three-season serial and a short film are
represented at the same resolution, and the encoding cannot tell you which
work actually has more going on. Worlds, agents and edges are similarly
narrow: median 3 worlds, 5.5 agents, 27.5 edges.

**Suggested response.** Treat event count as unreliable signal. Where a guide
needs more beats than the encoding carries, expect to return to the source
rather than to `instances/`.

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
