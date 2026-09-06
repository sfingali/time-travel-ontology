# Archive ontology import

Archive importer → instances/generated/ only.

Skip / overwrite policy
-----------------------
- NEVER writes or updates instances/*.json (hand-crafted encodings).
- ONLY writes under instances/generated/.
- If a hand-crafted instances/<slug>.json exists, that archive entry is skipped
  (no generated stub for the same slug).
- If instances/generated/<slug>.json already exists, it is left alone unless
  --force-generated is passed (refresh stubs).
- Always regenerates instances/generated/_index.json and the quality report.

Archive root resolution (first hit wins)
----------------------------------------
1. --archive <path>
2. ARCHIVE_ROOT env
3. ./reference-archive  (when that directory exists)
4. ../time-travel-archive (legacy sibling checkout)

Tag → catalogue mapping is documented in docs/IMPORT.md (and mirrored below).

See EXACT_TAG_RULES, RULE_HINTS, TOPOLOGY_FOR_PRIMARY in the importer.

Reports under instances/generated/ (IMPORT_REPORT.md, IMPORT_REPORT.json, _index.json).

## Mapping summary

| Family | ruleSetId |
|--------|-----------|
| entropy / turnstile | entropy_inversion |
| return_by_death / death_loop | death_checkpoint_rewrite |
| tva / prune | branch_bureaucracy_prune |
| worldlines / reading_steiner | worldline_attractor |
| tangent | tangent_universe |
| groundhog / loop | temporal_loop_exit |
| predestination / closed_loop | predestination_closed_loop |
| bootstrap | bootstrap_ontological |
| multiverse / parallel | multiverse_contact |
| branching / butterfly | branch_on_intervention |
| reality_rewrite | mutable_ripple |
| novikov / immutable | fixed_novikov |
| non_linear_consciousness | perception_nonlinear |
| soft devices | mutable_ripple (weight 1) |

Gaps: exhaustive / diagram-flagged without hand-crafted instances.
