# Rule sets

Rule sets are **reusable law variants**. A story selects one primary id plus optional mixin ids in `ruleSetIds`.

## Catalogue IDs (stable)

| ID | Past | Branches | Bootstrap | Paradox |
|----|------|----------|-----------|---------|
| `fixed_novikov` | immutable | no | yes | self_consistency |
| `mutable_ripple` | mutable_overwrite | no | no | overwrite |
| `branch_on_intervention` | mutable_branch | yes | no | branch |
| `bootstrap_ontological` | conditional | no | yes | self_consistency |
| `predestination_closed_loop` | immutable | no | yes | self_consistency |
| `temporal_loop_exit` | conditional | no | no | checkpoint_reset |
| `worldline_attractor` | mutable_branch | yes | no | branch |
| `entropy_inversion` | immutable | no | no | self_consistency |
| `tangent_universe` | conditional | yes | no | collapse_tangent |
| `multiverse_contact` | conditional | no | no | ignore_or_unspecified |
| `branch_bureaucracy_prune` | mutable_branch | yes | no | prune |
| `death_checkpoint_rewrite` | mutable_overwrite | no | no | checkpoint_reset |
| `perception_nonlinear` | perception_only | no | yes | ignore_or_unspecified |

## How to pick

1. Ask: does changing the past **overwrite**, **fork**, or **fail**?
2. Ask: are coexisting worlds **branches of one history** or **parallel worlds**?
3. Ask: is nonlinearity **physical travel**, **entropy inversion**, **perception**, or **checkpoint death**?
4. Mixins: add `bootstrap_ontological` when objects/people lack external origin; add loop/exit rules when iteration is central.

## Fields

Each rule: `id`, `label`, `description`, `pastMutability`, `createsBranches`, `allowsBootstrap`, `paradoxHandling`, `constraints[]`, optional `paramsNotes` / `params`.

Full definitions live in `src/catalog/rules.ts`.
