# Astra review — `sfingali/time-travel-ontology`

**Model:** `gpt-6-astra` via Experiential Labs (free route) · 2026-09-06
**Tokens:** 62,238 in / 6,698 out (469 reasoning) · **Cost:** $0.957
**`finish_reason`: `stop`** (clean, no truncation) · output 30,452 chars

**Scope (as instructed):** logic/ontology, functions/code, data/instances,
decisions/architecture. Visual/design deliberately excluded; narrative corpus
fact-checking out of scope. Reviewer's own summary retained verbatim below.

---

## 1. Verdict summary

The repository validates JSON structure and selected references, **not the fictional-physics consistency its positioning implies**.  
Timeline, branch, and parallel world are distinct Zod variants, but their defining semantic differences are largely **not enforced**.  
The importer currently emits schema-invalid stubs; generated files are outside the validation gate, so this does not contradict the verified **59/59 instances and 4/4 tests passing**.  
The seven supplied instances expose duplicated event spines, ambiguous edge semantics, and rule/topology contradictions that pass validation.  
Review coverage: all supplied code and seven instance bodies. `MANIFEST.txt`, the CI workflow, generated files, and the other 52 instance bodies were not supplied; their contents cannot be independently audited here.

## 2. Logic / Ontology findings

1. **[HIGH] The three primitives are syntactically distinct but not semantically secured.**  
   **Identifiers:** `TimelineSchema`, `BranchSchema`, `ParallelWorldSchema`, `StoryEncodingSchema.superRefine`.

   The discriminated union enforces `kind` and rejects fields belonging exclusively to another variant. That is a real structural distinction.

   However:
   - A branch needs neither `parentRef` nor a fork point.
   - There is no `forkEventRef`; `forkLabel` is optional free text.
   - A branch can name itself as parent, or participate in cyclic ancestry.
   - A parallel world can receive a `forksFrom` edge.
   - A timeline can have an origin without any distinction between derivation, creation, and historical divergence.

   **“Branch = fork from a parent at an event” is not enforced and is not fully expressible.** “Timeline = one ordered history” also lacks an explicit ordering contract.

   There is a conceptual issue beneath this: a branch is itself a history, and a parallel universe can have a timeline. Define these kinds as explicit encoding roles, or separate *history*, *universe*, and *derivation relation* into orthogonal concepts.

2. **[HIGH] The 13 rule sets are descriptive catalogue records, not executable laws.**  
   **Identifiers:** `RULE_SETS`, `RuleSetSchema`, `validateFile`.

   `constraints[]` contains strings. No validator dispatches on `pastMutability`, `createsBranches`, `allowsBootstrap`, or `paradoxHandling`.

   Consequently, a structurally valid story can select:
   - `entropy_inversion` without any inversion evidence;
   - `bootstrap_ontological` without a bootstrap entity or provenance loop;
   - `temporal_loop_exit` without resets or an exit condition;
   - `death_checkpoint_rewrite` without a death/checkpoint relationship;
   - `tangent_universe` without a collapse;
   - `branch_bureaucracy_prune` without a designated sacred line or pruning;
   - `worldline_attractor` without convergence evidence.

   **The catalogue’s constraints are not enforced by code.** Some narrative claims cannot be proven from a graph alone, but structural evidence requirements can be checked.

3. **[HIGH] Rule composition has no defined semantics.**  
   **Identifiers:** `docs/COMPATIBILITY.md`, `StoryEncodingSchema`, `RULE_SETS`.

   The compatibility table endorses combinations whose boolean properties conflict:
   - `entropy_inversion.allowsBootstrap = false` plus `bootstrap_ontological`;
   - `mutable_ripple.createsBranches = false` plus `branch_on_intervention`;
   - immutable rules plus overwrite rules in “tension mixes.”

   Does a mixin override the primary, add a capability, apply locally, or represent uncertainty? The model does not say. A false boolean is especially ambiguous: “prohibited” and “not supplied by this rule” are different meanings.

   **“Compare on the primary” is coherent only as coarse editorial classification**, not as comparison of effective fictional physics. No code enforces compatibility or requires tension documentation.

4. **[MED] The rule catalogue mixes different classification axes.**  
   **Identifiers:** `src/catalog/rules.ts`.

   The 13 entries combine:
   - mutation policies: fixed, overwrite, branching;
   - causal/provenance motifs: bootstrap, predestination;
   - repetition mechanisms: loop exit, death checkpoint;
   - travel/experience mechanisms: inversion, nonlinear perception;
   - world structures and controls: attractors, tangents, contact, pruning.

   `fixed_novikov` and `predestination_closed_loop` overlap heavily; bootstrap is a provenance property rather than a complete physics regime; death checkpoints specialize reset behavior. These overlaps are not inherently wrong, but a flat primary/mixin taxonomy obscures them.

   The missing composition model—not merely catalogue naming—is what makes the overlap operationally problematic.

5. **[HIGH] All eight topology patterns are advisory labels.**  
   **Identifiers:** `TOPOLOGY_PATTERNS`, `TopologyPatternSchema`, `validateFile`.

   Only catalogue membership is checked. There are no pattern-specific cardinality, world-kind, relation, or ancestry checks.

   Thus:
   - `single_fixed_timeline` and `inverted_single_timeline` accept multiple worlds and forks;
   - `dual_parallel_pair` accepts one timeline or six parallel worlds;
   - `branching_tree` accepts cyclic parentage;
   - `tangent_bubble` requires neither a tangent nor collapse;
   - `worldline_bundle` requires no attractor structure;
   - `origin_plus_twins` requires no origin or twins;
   - `mutable_single_with_ripples` requires no rewrite relationship.

   `typicalWorldKinds` and `typicalRelations` are explicitly “typical,” so treating them as hard constraints would require a deliberate contract change.

6. **[MED] Several topology names encode physics or exceptions rather than topology.**  
   **Identifiers:** `src/catalog/topologies.ts`, `docs/COMPATIBILITY.md`.

   `single_fixed_timeline` and `inverted_single_timeline` have the same world structure; their difference belongs primarily to physics. Loop/reset stories are paired with a topology named “fixed,” without explaining how multiple rewritten iterations form one ordered history.

   `mutable_single_with_ripples` models overwrites as transient **branches**, while its corresponding rule says no branches are created. `branching_tree` permits merges, which makes the combined relation graph more than a tree.

   Separate structural topology from mutation, activity/coexistence, and agent traversal policies.

7. **[HIGH] Graph edge kinds are labels with almost no semantic typing.**  
   **Identifiers:** `EdgeSchema`, `StoryEncodingSchema.superRefine`.

   Every edge endpoint may resolve to any world, event, or agent. A `world_relation` may connect agents and omit `relation`; a `causal` edge may connect worlds; a temporal edge may carry `relation: "prunes"`.

   There is also no distinction between:
   - world chronology;
   - agent-experienced sequence;
   - narrative presentation order;
   - simultaneity.

   These are essential distinctions for inversion and loop encodings. **Do not solve this by banning all cycles:** causal loops are legitimate here. Define relation-specific semantics and validate the relevant projection.

8. **[HIGH] Identity conflates personal continuity, counterparts, and participation.**  
   **Identifiers:** `AgentSchema`, `ContinuityRoleSchema`, `EdgeSchema`.

   `identityGroup` groups older selves, counterparts, variants, and iterations. Those are not necessarily one equivalence relation. An agent-to-event identity edge also does not identify which participant carries continuity.

   `continuedFrom`/`continuesAs` are existence-checked, but their agreement with each other, identity groups, and identity edges is not checked. Consumers cannot safely infer “same person” from the current generic identity relation.

9. **[MED] Interventions and outcomes do not encode machine-checkable state changes.**  
   **Identifiers:** `InterventionSchema`, `RuleEffectSchema`, `OutcomeSchema`.

   An intervention names an existing event and supplies free-text effects. There is no structured target world, resulting branch, overwritten state, preserved history, or collapsed world. The intervention edge and intervention record are independent representations.

   `outcome.endWorldRefs` is existence-checked, but its meaning is unclear: surviving worlds, selected focal worlds, or all final worlds? No lifecycle consistency can be enforced until this is defined.

   Requiring every intervention record to point to `type: "intervention"` would be too restrictive: the supplied encodings intentionally attach effects to deaths, inversions, and reveals.

## 3. Functions / Code findings

1. **[HIGH — `src/schema/story.ts`: `StoryEncodingSchema.superRefine`] IDs are not unique.**  
   Constructing `Set`s silently collapses duplicates. Duplicate world, agent, event, edge, and intervention IDs pass. Cross-category collisions also pass, making generic edge references ambiguous.

   Enforce uniqueness within every declared collection and either global node-ID uniqueness or typed references such as `{ entityKind, id }`. A duplicate ID can currently make a reference “resolve” to multiple incompatible entities.

2. **[HIGH — `src/schema/story.ts`: `superRefine`; `src/validate.ts`: `validateFile`] Rule-effect references escape catalogue validation.**  
   `interventions[].ruleEffects[].ruleSetId` is checked only as an identifier-shaped string. It need not exist in the catalogue or appear in the story’s active rules.

   A valid story can therefore attribute an intervention to `not_a_real_rule` and still pass `npm run validate`. Validate both catalogue membership and active-rule membership.

3. **[MED — `src/schema/story.ts`: rule-mixing refinement] Three rule fields can disagree without rejection.**  
   The code enforces primary inclusion, mixin inclusion, and exclusion of the primary from mixins. It does **not** enforce:
   - uniqueness;
   - primary-first ordering, as stated in `docs/NARRATIVE.md`;
   - equality between the active set and primary-plus-explicit-mixins.

   For example, two active rules with an explicitly empty `mixinRuleSetIds` pass. Consumers choosing explicit mixins versus deriving them from `ruleSetIds` will disagree.

   Store one canonical representation, or enforce exact set equality and document whether order matters.

4. **[HIGH — `src/schema/narrative.ts`: `EdgeSchema`; `src/schema/story.ts`: edge loop] Endpoint checking is only union membership.**  
   The `known`/`knownTo` predicates do not distinguish entity classes or check relation-specific endpoints.

   Make `EdgeSchema` a discriminated union and perform typed reference checks. Require `relation` on `world_relation`; reject it on unrelated edge kinds unless explicitly meaningful. Reconcile world relationship edges with `parentRef`, `mirrorOf`, and other duplicated descriptors.

5. **[MED — `src/schema/narrative.ts`: `EventPayloadSchema`; `src/schema/story.ts`: checkpoint check] Payload consistency and reference handling have holes.**
   - `entropy: "forward"` with `inverted: true` passes.
   - `checkpointEventId: ""` passes: it is a plain string and the refinement uses a truthiness guard.
   - A nonempty checkpoint reference may point to any event type.
   - Event types do not constrain payloads or require relevant evidence.
   - Device, artifact, authority, and attractor identifiers are mostly opaque strings with no declared registries.

   Use `IdSchema` and explicit presence checks for actual references. Distinguish deliberately opaque keys from resolvable references. Remove redundant entropy fields or validate their relationship.

6. **[HIGH — `src/validate.ts`: `validateFile`; `src/index.ts`: public exports] Library validation is weaker than repository validation.**  
   `StoryEncodingSchema.safeParse` accepts unknown active rule IDs and unknown topology IDs. The CLI and tests perform additional catalogue checks, but that combined validator is not exported.

   Consumers importing the advertised authoritative schema do not get the repository’s full validation behavior. Export a reusable `validateStoryEncoding` function returning structured diagnostics, and have the CLI and tests call it.

7. **[HIGH — `src/export-json-schema.ts`: `main`; `schema/ontology.schema.json`] Exported JSON Schema is not validation-equivalent to Zod.**  
   Zod’s `superRefine` logic is not represented in the supplied JSON Schema. A downstream validator can accept:
   - dangling entity references;
   - a primary absent from `ruleSetIds`;
   - a mixin equal to the primary;
   - a mixin absent from the active set.

   Catalogue IDs are unrestricted identifier strings there too. Including `RuleSet` and `TopologyPattern` definitions does not connect those definitions to story ID membership.

   JSON Schema defaults also do not generally materialize the empty arrays that Zod produces. Document the export as a **structural schema**, with a separate semantic validation and normalization contract.

8. **[HIGH — `scripts/import-archive.mjs`: `buildStub`] Every newly built stub contains a forbidden payload key.**  
   `buildStub` emits `events[0].payload.mappingConfidence`, but `EventPayloadSchema` is strict and does not define it.

   **Every stub emitted by this function would fail the current story schema on that field**, independent of mapping quality. The importer neither imports the schema nor validates its output. Keep confidence in supported metadata or a dedicated draft schema, and validate before writing.

9. **[HIGH — `scripts/import-archive.mjs`: `parseFrontmatter`, `splitTags`] The claimed YAML bridge uses an incomplete parser.**  
   The parser supports a narrow subset, not YAML generally:
   - inline arrays such as `[time_machine, bootstrap]` remain one string;
   - unindented YAML sequence items are ignored;
   - inline comments remain in scalar values;
   - folded/literal block scalars become empty arrays rather than text;
   - quoted escapes are not decoded;
   - a leading BOM prevents frontmatter recognition.

   The archive’s documented example `flag_diagrams: true # ...` would not parse as boolean `true` if copied literally. Valid YAML can silently lose mapping and report signals. Use a YAML parser and validate a defined frontmatter schema.

10. **[HIGH — `scripts/import-archive.mjs`: `findHandMatch`, `normalizeTitle`, `main`] Matching and output identity can suppress or overwrite distinct works.**  
    `findHandMatch` matches normalized titles without medium, year, or creator identity, then accepts a hyphen-prefix slug match. An existing `terminator` encoding can therefore match another `terminator-*` archive entry that lacks its own encoding.

    Generated output uses only the basename across films, TV, and novels:
    - without force, a same-slug second work is treated as already generated;
    - with force, it overwrites the first work’s stub;
    - the index can contain multiple records pointing conceptually to the same output file.

    Use namespaced archive IDs and explicit aliases. Ambiguous matches must be reported, not silently counted as coverage.

11. **[MED — `scripts/import-archive.mjs`: existing-generated branch in `main`] The regenerated index can describe content that is not on disk.**  
    The comment says prior light metadata is read, but the branch only pushes newly computed `meta`; it never reads the retained stub. Changed mappings or archive metadata appear in `_index.json` while the file remains unchanged.

    Stubs for removed archive entries or newly hand-encoded works also remain on disk but disappear from the current index. Record retained-file metadata and freshness separately, and report orphaned or superseded generated files.

12. **[MED — `scripts/import-archive.mjs`: `mapTopology`, `parseArgs`, `main`] Silent fallback and dead-path behavior weaken import reliability.**
    - The ripple conditional’s `butterfly` alternative is unreachable because the preceding branch conditional already matches it.
    - Unknown CLI flags and invalid `--report` values are silently accepted; an invalid report format can write no report while still printing a report path.
    - An existing archive root with no recognized section directories completes successfully with zero scanned entries.
    - `exists` converts all access errors into “not found,” masking permission failures.

    Reject invalid arguments and malformed archive layouts; distinguish absence from operational errors.

13. **[MED — `src/catalog/rules.ts`, `src/catalog/topologies.ts`: assertion functions and exported collections] Catalogue integrity checks are incomplete.**  
    `assertRuleSetsValid` and `assertTopologiesValid` parse individual records but do not reject duplicate IDs. Map construction silently keeps the last duplicate.

    The arrays and returned objects are mutable. `ReadonlyMap` protects only the TypeScript map interface, not runtime data or nested objects. Mutating an exported record’s ID can make the array and lookup map disagree. Freeze catalogue data and validate unique IDs before building indexes.

14. **[HIGH — `src/tests/ontology.test.ts`: “rejects at least one invalid fixture”] The negative test permits invalid fixtures to start passing.**  
    The test succeeds if **any one** fixture fails. All other invalid fixtures may pass unnoticed.

    The sole supplied fixture has multiple simultaneous defects, so it does not isolate reference integrity, catalogue checks, strictness, or primary membership. Assert failure for every fixture and verify expected diagnostic codes/paths. Add one-defect mutations of valid stories and importer round-trip tests.

15. **[LOW — `src/validate.ts`: `validateFile`, `main`; `src/import-archive.ts`: CLI delegate] CLI failure handling is functional but coarse.**  
    `readFile` errors occur outside `validateFile`’s JSON error handling, aborting the whole validation run instead of reporting the affected file and continuing. Schema refinement paths also generally identify only the collection, not its element.

    The import delegate forwards arguments/environment and propagates unsuccessful status, but `@ts-nocheck` is unnecessary and `spawnSync.error` is not reported explicitly. These are secondary operational issues, not explanations for the verified passing state.

## 4. Data / Instances findings

1. **[HIGH] The supplied instances demonstrate semantic failures, not merely hypothetical validator gaps.**

   | Instance / identifiers | Encoding-level issue that passes |
   |---|---|
   | `dark.json`: `id1` | An `identity` edge joins Jonas and Martha with label “parents of Unknown.” Parenthood is not identity. |
   | `dark.json`: `iv_origin` | An effect attributed to `fixed_novikov` says preventing an accident removes derived worlds. No rule scope explains this against the immutable-history law. |
   | `eeaao.json`: `topologyPatternId`, `worlds` | `dual_parallel_pair` contains six parallel worlds. Either the instance or the pattern contract must change. |
   | `steins-gate.json`: `wr5`, `w_alpha_root` | A “Beta attractor” relation targets a world declared with `attractorFieldId: "alpha"`. Attractor endpoints are not formally modeled. |
   | `tenet.json`: `tp1`, `tp4` | The same temporal kind expresses backward-lived succession and simultaneity. |
   | `primer.json`: `rep_3`, `npri1`, `prx1` | A bare self-causal edge and duplicate causal endpoint pairs receive no diagnostics. A self-loop needs interpretation, not automatic rejection. |
   | `predestination.json`: `rep_5` | An identity edge between events is labeled `bootstrap_causes`, mixing identity with causal provenance. |
   | `groundhog-day.json`: `e_exit` | Loop exit is represented as `loop_reset` with iteration zero; there is no typed distinction between resetting and leaving the loop. |

   These observations concern the JSON’s internal semantics, not factual accuracy of archive summaries.

2. **[HIGH] Repair/padding event spines coexist with richer encodings without an abstraction contract.**  
   **Identifiers:** `ev_*`, `e_pad_*`, `rep_*`, and `bridge_*` across the supplied instances.

   Tenet contains five additional `ev_*` events repeating major beats, connected to each other but not integrated into the richer event spine. Other instances add similarly overlapping “repaired” and padded sequences.

   These are not declared as summaries, perspectives, aliases, or alternate granularity. A consumer must either double-count events or invent deduplication logic. Adding edges between duplicate summaries does not establish semantic integration.

3. **[HIGH] Some added events conflict with world placement elsewhere in the same encoding.**  
   Examples:
   - Dark’s `e_mikkel` is in `w_adam`, while similarly described `ev_mikkel` is in `w_origin`.
   - Steins;Gate’s `e_steins` is in `w_steins`, while `ev_steins` and `e_pad_sg` are in `w_alpha_root`; the latter additionally names `worldlineId: "steins_gate"`.
   - EEAAO’s rock-world event `e_rock` is in `w_rock`, while `e_pad_rock` is in `w_alpha`.

   These may be intended as summaries or observations, but they are not encoded that way. Reference existence alone cannot detect the contradiction.

4. **[MED] “Tenet-class ≥20 events” is neither enforced nor a coherent completeness criterion.**  
   `StoryEncodingSchema.events` requires only one event. The test’s `files.length >= 20` counts **instance files**, not events.

   Event count measures segmentation, not whether a story’s defining mechanism is represented. The visible duplicate/padded spines illustrate the weakness directly. Prefer mechanism-specific evidence, declared granularity, meaningful relation coverage, and review of disconnected or redundant subgraphs.

   Documentation also drifts: README gives Tenet **27 events / 39 edges**, while the supplied file has **32 / 44**, matching `CORPUS_NOTES.md`.

5. **[HIGH] Generated stubs are unvalidated scaffolding, not miniature formal encodings.**  
   **Identifiers:** `buildStub`, `src/validate.ts.main`, instance tests.

   The importer always emits one `timeline`, one placeholder agent, one ordinary event, and no edges or interventions—even when assigning branching, tangent, or parallel-pair topology.

   Both validation entry points intentionally inspect only top-level `instances/*.json`. Therefore the reported ~383 generated files are not covered by the verified 59-instance result. Existing generated file contents were not supplied, but current `buildStub` additionally guarantees the forbidden-key defect described above.

6. **[HIGH] Tag mapping is lossy and can assert laws unsupported by the input signal.**  
   **Identifiers:** `EXACT_TAG_RULES`, `RULE_HINTS`, `mapRules`, `mapTopology`.

   Examples of semantic overreach:
   - `grandfather_risk` → fixed Novikov: a paradox risk does not specify its resolution;
   - `alternate_history` / `butterfly_effect` → branching: neither establishes continued parent-world existence;
   - `overlapping_selves` → bootstrap: overlapping selves need not lack external provenance;
   - `information_transfer` → bootstrap: transfer alone does not imply originlessness;
   - `relativistic_time_dilation` → perception-only: physical elapsed-time differences are not merely nonlinear perception;
   - unspecified mechanisms → mutable ripple: absence of evidence becomes an affirmative overwrite policy.

   Scores sum repeated tags; duplicate signals can inflate confidence. Equal scores resolve alphabetically, not semantically. Confidence ignores the margin between competing rules and does not establish mixin compatibility. Compound fallback tags keep only the first regex match, and only three mixins survive.

   Treat outputs as reviewable hypotheses with an explicit unknown state, per-tag provenance, competing candidates, and mapping-version metadata.

## 5. Decisions / Architecture findings

1. **[HIGH] Zod is a workable structural authority, but there is no single validation authority.**  
   Validation currently exists in three unequal forms:
   - Zod structure plus refinements;
   - CLI/test catalogue checks added separately;
   - JSON Schema structure without refinements.

   The decision is sound only if these layers are explicitly distinguished. Publish one semantic validator API and document precisely what non-TypeScript consumers must additionally implement.

2. **[MED] Build/test/validate gating is useful but overstates assurance without adversarial tests.**  
   The verified build, 59 successful validations, and four passing tests establish that the current accepted dataset fits current checks. They do not establish rejection coverage.

   The importer is JavaScript outside TypeScript compilation, and `npm test` does not exercise it. The actual CI workflow was not supplied, so its checkout configuration and generated-schema drift checks cannot be confirmed. Rebuilding a schema should also be followed by a clean-diff check if the export is committed.

3. **[HIGH] Excluding rendering is clean; the semantic consumer contract is not yet sufficient.**  
   No layout or graphics belong in this review. The downstream problem is meaning:
   - What determines chronological versus experiential ordering?
   - Which endpoint types and directions does each relation permit?
   - How is a fork connected to its triggering event?
   - Are world descriptor references or world edges authoritative?
   - Are counterparts identical agents or related individuals?
   - Is a world inactive, overwritten, collapsed, or merely absent from the outcome selection?

   A consumer can display the records, but cannot reliably interpret topology and continuity without inventing ontology rules.

4. **[MED] Vendoring the archive supports reproducibility; the “two-way bridge” is not implemented as a round trip.**  
   The implemented path is archive → heuristic stub → manual encoding. Handcrafted detection influences skip/report behavior, but no exporter updates archive tags, records reviewed mappings, or reconciles semantic changes back into archive metadata.

   This is a useful one-way ingestion pipeline with coverage feedback, not a synchronized two-way model. Stable archive IDs and explicit provenance are prerequisites for stronger integration.

5. **[MED] Strict objects coexist with a story-specific payload catalogue and no schema version.**  
   `EventPayloadSchema` hardcodes fields such as `freeportId`, `readingSteiner`, and Algorithm pieces, while common mechanisms still use unstructured notes. `RuleSetSchema.params` permits arbitrary data, but stories have no explicit active-rule parameter binding; some catalogue parameter suggestions are not representable as structured story fields.

   With strict rejection and no encoding `schemaVersion`, future fixes to references, edge types, and payload semantics will require coordinated migrations. Organize extensions by reusable mechanism and version the format before tightening it.

## 6. Risks & technical debt

1. **False confidence from “validated.”** Structurally accepted stories can contradict their named laws and topology. Reports need separate structural, referential, semantic, and editorial statuses.

2. **Comparison bias.** Arbitrary primary selection, heuristic defaults, incompatible mixins, and duplicate event spines can distort corpus-level statistics while every file remains valid.

3. **Migration cost is already accumulating.** Typed edges, fork-event references, rule scopes, and explicit ordering will affect existing instances. Tightening validation without staged migrations will encourage further placeholder repairs.

4. **Coverage accounting is unreliable.** Fuzzy hand matching, cross-medium slug collisions, retained stale stubs, and indexes describing recomputed rather than stored content can inflate or obscure formalization coverage.

5. **Duplicated semantic authority will drift.** Parent references versus world edges, identity groups versus continuity links, repeated relation enums, and three rule-list fields create disagreement opportunities.

6. **Naive “stronger validation” could reject legitimate stories.** Global acyclicity, one birth/death per agent, mandatory travel pairing, or forced world-lifetime rules would be inappropriate without explicit granularity and relation semantics. Distinguish hard invariants from warnings and incomplete-evidence notices.

## 7. Top recommendations

1. **Create and export one semantic validation API.**  
   Centralize catalogue checks, unique IDs, typed references, active rule-effect membership, and structured diagnostics. Make the CLI and tests thin callers.

2. **Define the graph’s semantic contract before adding more instances.**  
   Specify endpoint types, relation direction, chronology versus experienced order versus simultaneity, identity versus counterpart relations, and authoritative representations.

3. **Make branch identity enforceable.**  
   Require a parent and fork-event reference for fully specified branches, validate ancestry, and introduce an explicit incomplete/draft representation where evidence is missing.

4. **Repair and test the importer immediately.**  
   Remove the forbidden `mappingConfidence` field, use real YAML parsing, validate generated output, namespace archive IDs, reject ambiguous matching, and distinguish retained-file metadata from current mapping proposals.

5. **Replace the negative-test aggregate with isolated rejection tests.**  
   Assert every invalid fixture fails for its intended reason. Add mutation tests for uniqueness, references, rule membership, topology, payload consistency, importer collisions, and YAML syntax.

6. **Define rule composition and topology conformance levels.**  
   Separate capabilities from prohibitions, allow explicit scope/uncertainty, and distinguish advisory patterns from enforced ones. Add a general parallel-world network rather than stretching `dual_parallel_pair`.

7. **Clean the seven exemplars before expanding coverage.**  
   Reconcile duplicate `ev_*`/`e_pad_*` events, repair internal world-placement conflicts and misused identity edges, and replace the event-count bar with mechanism-specific completeness checks.

8. **Publish validation limits and version the format.**  
   Label JSON Schema as structural, document semantic-validator requirements and default normalization, add `schemaVersion` and migration tooling, and generate counts from data rather than maintaining conflicting prose snapshots.