# Rule-set compatibility

Every story encoding **must** declare:

- `primaryRuleSetId` — the dominant fictional physics / law
- `ruleSetIds` — the full active catalogue set (primary + mixins)
- `mixinRuleSetIds` (optional) — secondary laws; each must appear in `ruleSetIds` and must **not** equal the primary

Validators reject encodings where primary or any mixin is missing from `ruleSetIds`.

## Coherent mixes

Mixins that reinforce the primary without changing topology class:

| Primary | Compatible mixins | Why |
|---------|-------------------|-----|
| `fixed_novikov` | `predestination_closed_loop`, `bootstrap_ontological` | Same immutability family; loops and bootstrap close consistently |
| `predestination_closed_loop` | `fixed_novikov`, `bootstrap_ontological` | Fate-fulfillment on one line |
| `entropy_inversion` | `fixed_novikov`, `predestination_closed_loop`, `bootstrap_ontological` | Tenet: one timeline, inverted entropy, pincer destiny |
| `temporal_loop_exit` | `death_checkpoint_rewrite` | Loops / death-resets with exit criteria |
| `death_checkpoint_rewrite` | `mutable_ripple`, `temporal_loop_exit` | Checkpoint rewrite is a scoped overwrite |
| `mutable_ripple` | `branch_on_intervention` | BTTF-like: ripples as transient superseding branches |
| `worldline_attractor` | `branch_on_intervention`, `bootstrap_ontological` | Steins;Gate worldlines + observer continuity |
| `tangent_universe` | `fixed_novikov`, `bootstrap_ontological` | Tangent collapses back into primary |
| `branch_bureaucracy_prune` | `branch_on_intervention`, `multiverse_contact` | Sacred line + prune authority |
| `multiverse_contact` | `branch_on_intervention` | Parallel contact; branches optional |
| `perception_nonlinear` | `bootstrap_ontological`, `fixed_novikov` | Knowledge loops without physical travel |
| `bootstrap_ontological` | `fixed_novikov`, `predestination_closed_loop` | Closed causal provenance |

## Tension mixes

Useful when the work itself is ambiguous — document tension in interventions notes / outcome summary:

| Mix | Tension |
|-----|---------|
| `mutable_ripple` + `fixed_novikov` | Change advertised but key beats lock (About Time child rule; Frequency) |
| `mutable_ripple` + `predestination_closed_loop` | Looper / Terminator change-fate / become-fate |
| `branch_on_intervention` + `fixed_novikov` | Primer: branching under single-history talk |
| `temporal_loop_exit` + `branch_on_intervention` | Source Code: loops that fork a kept continuum |
| `multiverse_contact` + `entropy_inversion` | Usually incoherent — prefer one primary |

## Topology pairing

Prefer catalogue topology patterns that match the primary:

- `entropy_inversion` -> `inverted_single_timeline`
- `fixed_novikov` / `predestination_*` / loops -> `single_fixed_timeline`
- `mutable_ripple` -> `mutable_single_with_ripples`
- `branch_*` -> `branching_tree`
- `worldline_attractor` -> `worldline_bundle`
- `tangent_universe` -> `tangent_bubble`
- `multiverse_contact` -> `dual_parallel_pair`

See `docs/ENCODING-GUIDE.md` for the encoding checklist.
