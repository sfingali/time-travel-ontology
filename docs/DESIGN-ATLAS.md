# Design spec: a topology-first atlas

## Visual approach

Build a **deterministic visual compiler**, not a generative illustrator. Each chart has three coordinated layers: **world structure**, **events in local time**, and **identity/causal relationships**. Geometry expresses topology; arrows express relationships; color helps track identity. No single channel carries two meanings.

Keep the references’ useful devices—genealogical connectors, return arcs, aligned event markers, separated self-trajectories—but reject decorative tangles and color-only semantics. References 5, 6, 9, and 10 show a cover or stills rather than usable chart grammar. References are visual inspiration, not authority: the supplied corpus declares *Your Name* mutable-single and *12 Monkeys* single-fixed, regardless of their reference descriptions.

---

## 1. Non-negotiable rendering rules

1. **`topologyPatternId` selects the composition template.** Never infer it from title, imagery, graph shape, or `primaryRuleSetId`.
2. **`worlds[].kind` selects the world primitive.** A template cannot recast a timeline as a branch.
3. **Only encoded relationships become connections.** Shared labels, proximity, and shared event participation do not establish travel, ancestry, or continuity.
4. **Declaration and evidence remain distinguishable.** A declared bootstrap rule can receive a bootstrap badge without manufacturing a closed causal cycle.
5. **Missing semantics remain visible.** Show “fork event unspecified,” “local order unresolved,” or “inversion segment unspecified”; do not complete the story.
6. Preserve source IDs, duplicate edges, unresolved correspondence keys, and `semanticReview`. Layout is not semantic repair.

Every chart header states:

> **Topology:** `origin_plus_twins` · **Primary physics:** `bootstrap_ontological`  
> **Mixins:** `predestination_closed_loop`, `fixed_novikov` · **Evidence status:** incomplete

Use separate statuses for schema validity, topology consistency, and supplied semantic review.

---

## 2. Primitive-to-form grammar

### Worlds

Each world is a labeled container holding a local-history rail and events.

| Ontology primitive | Mandatory visual form | Meaning |
|---|---|---|
| `kind: timeline` | Single-outline band; straight single history rail; **T** header tab | One ordered history |
| `kind: branch` | Single-outline band; **B** fork-shaped tab; structural fork connector to its parent **at the encoded fork event** | History derived by a fork |
| `kind: parallel_world` | Double-outline enclosure; **P** paired-frame tab; independent history rail | Coexisting universe; no implied shared past |

The **double enclosure**, not two history rails, identifies a parallel world.

- A missing branch anchor produces a detached **B** band with a parent-reference leader and “fork event unspecified.” Never invent a junction.
- `originWorldRef` draws a labeled **origin-reference connector**, not automatically a fork.
- `mirrorOf` draws a mirror-relation connector between world headers, not a branch junction.
- `spanLabel` appears under the world label. It does not establish a numeric axis or constrain event placement by itself.
- Layout frames are explicitly labeled **composition group**; only encoded containment relations may create **semantic containment**.

### Events

`events[].at.worldRef` determines containment. Each event has:

- a type glyph;
- `label`, or `id` if no label;
- the exact `at.timeLabel`;
- a compact source ID;
- participant chips from `agents[]`.

Use a restrained glyph vocabulary:

| `events[].type` | Glyph |
|---|---|
| `ordinary` | Circle |
| `departure` / `arrival` | Outward / inward arrow inside a square |
| `bootstrap_origin` | Interlocked-ring token |
| `intervention` | Diamond with a slash |
| `collapse` | Square containing an × |
| `birth` | Circle containing a + |
| `contact` | Two touching circles |
| `reveal` | Eye-shaped token |
| Other types | Neutral hexagon plus exact type text |

A `bootstrap_origin` glyph means **declared type**, not “first cause.” A `collapse` event does not terminate a world rail unless the data identifies that world’s termination.

### Edges

Route each `edges[].kind` through its own ports and routing channels.

| Kind | Stroke and routing |
|---|---|
| `causal` | Solid line, filled arrowhead; causal gutter |
| `temporal` | Dashed line, open arrowhead; time gutter; retain `relation`/`label` |
| `identity` | Dotted line with equality marker; identity gutter |
| `world_relation` | Paired thin line; world-header ports; explicit relation text |
| `family` | Orthogonal line with kinship marker; relationship panel |
| `intervention` | Heavy line with slash marker and arrowhead; effect gutter |

Direction follows the encoded relation. Symmetric relationships use nondirectional marks while preserving stored endpoint order in metadata.

**An edge is not necessarily a trajectory.** A causal arrow from a departure to an arrival remains causal unless a schema-backed relation or payload explicitly establishes travel. Unknown relations retain their exact text.

Crossings use small bridge gaps; only explicit junctions get dots.

---

## 3. Identity: grouping without conflation

### Stable identity tokens

Assign each `identityGroup` a stable token—short code, accent color, and patterned swatch. Reuse it on agent cards and event participant chips.

Keep every `agents[].id` separate. Sharing `identityGroup` produces a **group bracket**, not an invented pairwise identity edge.

| `continuityRole` | Role marker |
|---|---|
| `primary` | Filled center dot |
| `counterpart` | Paired offset squares |
| `younger_self` | Small backward-age chevron, labeled “younger self” |
| `bootstrap_sink` | Inward arrows inside a ring, labeled “bootstrap sink” |
| `observer_persistent` | Eye marker |
| Absent | No role marker |

These markers do not create missing selves, memory transfers, parentage, or lifespan segments.

`homeWorldRef` places an agent’s **registry card**, not all their appearances. Event participation is located by the event’s `at.worldRef`.

### Correspondence is a separate layer

Render `correspondenceMap[]` as a **keyed correspondence ladder** between world headers:

> Eva:`martha` ⇄ Adam:`martha`

- Keep `localKey`, `remoteWorldRef`, and `remoteKey` visible.
- Attach to an agent or event only when an explicit namespace/resolver establishes that the key identifies it.
- Otherwise attach to a **world-local key port**. `winden` need not become a person or event.
- `correspondenceKey` labels the mapping set.
- `mirrorOf` asserts world-level mirroring; it does not imply a complete correspondence map.
- Correspondence never implies temporal simultaneity or traversable contact.

For dense graphs, put agent identity and family edges in a dedicated relationship panel. Repeated visual instances carry the same source ID and a “reference copy” marker.

---

## 4. Nine topology signatures

Each template has a fixed header pictogram and a characteristic composition. **The pictogram represents the declaration; the body renders only supplied entities and relationships.**

| `topologyPatternId` | Composition signature |
|---|---|
| `single_fixed_timeline` | One history composition; loops occupy return-arc gutters, never extra worlds |
| `branching_tree` | Parent bands above descendants; fork junctions only at documented anchors |
| `dual_parallel_pair` | Two equal-status world modules separated by a correspondence/contact gutter; no common trunk |
| `worldline_bundle` | Closely stacked world modules inside a labeled bundle bracket; attractor annotations span only supported members |
| `tangent_bubble` | Base history with a rounded tangent-region frame; creation/closure attachments only when encoded |
| `inverted_single_timeline` | One history frame and one coordinate-time ruler; opposing traversal tracks inside it |
| `origin_plus_twins` | Origin module above a two-column derived-world group; labeled derivation connectors, not a branching Y |
| `mutable_single_with_ripples` | One active history rail; encoded superseded states appear in a hatched revision register, not sibling-world lanes |
| `parallel_world_network` | Equal-status world modules in a deterministic network atlas; explicit interworld links, no invented root |

All modules retain their `worlds[].kind` styling, even when it makes the declared pattern look unusual.

**Topology assertion:** emit `supported`, `under-specified`, or `conflicting`, with field-level reasons. A conflicting story gets an explicit warning and a literal-data body beside the declared-topology pictogram. The renderer neither hides the conflict nor “fixes” the primitive types.

---

## 5. Thirteen physics signatures

Physics is an **orthogonal visual layer**, not a second topology selector.

The primary rule gets one large labeled seal; mixins receive smaller outline seals. Comparative charts align and sort by `primaryRuleSetId`. `ruleSetIds` remains available in the legend and metadata; inconsistent primary/mixin declarations are reported.

| Rule set | Distinct seal | Evidence-backed body treatment |
|---|---|---|
| `fixed_novikov` | Lock over a line | Consistency annotations at encoded effects |
| `mutable_ripple` | Expanding wavefronts | Ripple marks and revision links at recorded changes |
| `branch_on_intervention` | Diamond becoming a Y | Intervention-linked forks where supplied |
| `bootstrap_ontological` | Interlocked rings | Bootstrap entity tokens; closed routing only for encoded cycles |
| `predestination_closed_loop` | Closed arrow through a diamond | Encoded attempt→fulfilment path highlighted |
| `temporal_loop_exit` | Circular arrow with an exit notch | Reset links, explicit iterations, and documented exit |
| `perception_nonlinear` | Eye above scattered ticks | Perceptual access links without moving history events |
| `worldline_attractor` | Separate lines crossing a common gate | Attractor gate spanning documented equivalent outcomes |
| `entropy_inversion` | Opposed chevrons in one frame | Traversal direction and entropy-state markers |
| `tangent_universe` | Small bubble touching a line | Tangent lifecycle annotations where supplied |
| `multiverse_contact` | Bridge between separate frames | Contact/traversal connectors with explicit endpoints |
| `death_checkpoint_rewrite` | Death mark returning to a checkpoint flag | Encoded death→checkpoint rewrite link |
| `branch_bureaucracy_prune` | Fork ending at a cutting bar | Pruning marks on explicitly affected branches |

When detail is absent, show the seal and **“declared; mechanism not localized.”** Never generate forks, reset counts, attractor memberships, or pruning events from the rule name.

`interventions[].ruleEffects[]` appears as anchored effect callouts with `ruleSetId`, verbatim `effect`, and `scope`. Do not flatten scoped effects into universal physics.

---

## 6. Time and ordering

### Two explicitly labeled axis states

**Resolved local time:** left-to-right coordinate time within a world.

- Use only schema-defined temporal relations and deterministic, documented time-label parsers.
- Preserve raw `timeLabel` even when a normalized value is available.
- Use **ordinal spacing by default**; label it “ordered, not to scale.”
- Metric spacing requires comparable resolved values and displays units and axis breaks.

**Unresolved local time:** detached event cards in a labeled **“time not positioned”** shelf inside their world.

- `multi-era`, `cycle`, `S3`, or `grief machine` are not automatically dates.
- Array order and causal direction are not chronology.
- A separately defined temporal partial order may arrange cards as an **order diagram**, not a metric timeline.
- Contradictory order constraints are flagged, not forced into a misleading sequence.

A date-like label in one world does not align with another world’s date without an explicit shared coordinate basis. Default cross-world charts have independent rulers.

### Loops and inversion

- A backward traversal bends through a reserved return gutter; it does not bend or reverse the world’s time rail.
- A causal strongly connected component may receive a cycle bracket. Do not close an otherwise open path to illustrate a declared rule.
- Repeated selves occupy **agent occurrence tracks**, subordinate to the world band. Those tracks are not worlds.
- Entropy inversion keeps coordinate time pointing right. Documented agent traversal may point left, with repeated direction chevrons and an `inverted` label.
- Backward displacement alone does not establish entropy inversion.

### Attractors

An attractor is a **transverse annotated gate**, not a merger. Separate histories remain separate through it. Only explicit membership and outcome correspondence may place events under the same gate; otherwise the chart displays the declared attractor seal without inventing a convergence.

---

## 7. Layout and publication grammar

### One automatic overview/detail system

The engine always produces:

1. **Topology overview:** world primitives, structural relations, primary physics, outcome.
2. **Event atlas:** local histories, event labels, causal/temporal routing.
3. **Relationship panel when needed:** identities, family, correspondence keys.
4. **Evidence footer:** unresolved fields, semantic review, sources, encoding legend.

Small stories combine these on one page. Large stories paginate without shrinking text below the publication threshold.

### Deterministic layout order

1. Measure labels using bundled fonts.
2. Place world modules using the declared topology template.
3. Resolve supported local-time constraints.
4. Place events and unresolved-time shelves.
5. Place agent occurrence tracks only where supported.
6. Route structural links, then event edges, then identity/correspondence.
7. Optimize crossings and label collisions under those hard constraints.
8. Split overflowing modules into indexed detail pages.

Use constrained layered layout, not an unconstrained force graph. For `parallel_world_network`, use a stable world-level atlas with explicit links and indexed module details; geometric proximity means only layout proximity.

### Print rules

- White background; dark neutral text; low-chroma world surfaces.
- Identity accents are supplementary to codes and patterns.
- Minimum 9 pt final-size body text; distinct line weights and dash patterns.
- Horizontal labels; callouts rather than text along curves.
- Bundle edges only when semantics match; expose multiplicity and source IDs.
- Never silently deduplicate. Overview aggregation must link to an expanded edge register.
- Repeat legends and world IDs on detail pages.

`outcome.endWorldRefs` receives an **“end-state world”** tag. Omission from that array does not independently prove destruction.

---

## 8. Renderer contract and implementation

Use **TypeScript + the ontology’s Zod schema → semantic scene graph → constrained layout → SVG → PNG**.

No LLM participates in runtime semantic interpretation.

```ts
type RenderRequest = {
  story: Plotline;                  // validated, immutable
  profile: {
    pageWidthMm: number;
    pageHeightMm: number;
    minTextPt: number;
    locale: string;
  };
  focusIds?: string[];              // selection, never semantic overrides
};

type VisualAssertion = {
  sourcePaths: string[];
  status: "declared" | "encoded" | "derived" | "unresolved";
  derivationRule?: string;
};

function render(req: RenderRequest): ChartArtifact {
  const story = PlotlineSchema.parse(req.story);
  const facts = indexAndResolve(story);       // no mutation or story completion
  const audit = auditReferencesAndTopology(facts);
  const scene = compileGrammar(
    facts,
    topologyRegistry[story.topologyPatternId],
    ruleSignatureRegistry
  );
  const pages = layoutAndPaginate(scene, req.profile);
  assertVisualSemantics(pages, facts);
  return exportSVGAndPNG(pages, audit);
}
```

Implement three coordinated core draw modes: **world overview**, **event history**, and **relationship detail**. They share primitives, IDs, and styles rather than becoming three unrelated chart systems.

- Use schema-versioned adapters for recognized `payload` and relation semantics. Unknown payloads remain inspectable annotations.
- Use ELK.js for constrained module/layer placement, with a custom local-time placement and arc-routing pass.
- Generate native SVG with `data-source-id`, source JSON paths, `<title>`, `<desc>`, and embedded provenance.
- Rasterize the same SVG with resvg at requested dimensions/DPI.
- Emit a machine-readable coverage/audit manifest alongside SVG/PNG.

**Required invariants:** no event changes world; no branch junction lacks an encoded anchor; no arrow reverses a directional relation; no correspondence becomes travel; no aggregation loses provenance; identical input/configuration produces identical output.

---

## 9. Worked composition: *Dark*

### Page composition

**Top:** declaration strip and three-world topology overview.

- Origin: **T**, single-outline module.
- Adam: **T**, single-outline module.
- Eva: **P**, double-outline module.
- Adam and Eva sit below Origin under a neutral **“derived-world pair”** composition bracket.
- `originWorldRef`, `wr3`, and `wr4` appear as labeled origin relationships—not forks.
- `wr5: nestsWithin` receives its own explicit relation annotation; it is not generalized to Eva.
- `wr1`, `wr2`, and `mirrorOf` occupy the interworld gutter with individually recoverable provenance.

The topology says “origin plus twins”; the actual glyphs preserve the asymmetric `kind` values.

### Event atlas

Each event stays in its encoded world, including the repaired and padding events assigned to `w_origin`.

- Bare `1986` and `2020` labels can use a documented year parser.
- Labels such as `multi-era`, `cross conception`, and `mythology` remain unpositioned unless a supported temporal relation orders them.
- `rep_1` explicitly orders `ev_mikkel` before `ev_apocalypse`.
- The `c1`–`c15` chain is routed as **causality**, not adopted as coordinate chronology.
- `e_origin_trip` retains its `departure` glyph and `w_origin` location despite its “reach origin world” label.
- `e_dissolve` remains in Origin; its label is not a license to relocate it.

### Knot and identity detail

Show bootstrap-entity tokens for `knot_worlds`, `jonas_father`, `tannhaus_book`, and `unknown`. Highlight `boot1` as the supplied “family bootstrap” causal edge.

**Do not fabricate a closed knot:** the supplied causal edge list does not itself encode a directed cycle. The interlocked-ring primary seal and quoted `ruleEffects` communicate the declared bootstrap physics.

In the relationship panel:

- Martha and her counterpart share the `martha_eva` group token.
- Claudia and `claudia_alt` share another token.
- Mikkel receives “younger self”; no missing older-self node is invented.
- Unknown receives “bootstrap sink.”
- `id1` remains the exact Jonas→Martha family relation labeled “parents of Unknown”; it is not expanded into two unsupported parent-child edges.
- The three correspondence-map entries terminate at keyed ports unless key resolution is explicit.

Keep `ndar2`/`dkx2` as a multiplicity-marked pair with their incomplete-review warning. Show `dkx1` between its event endpoints, not converted into agent identity. End with the supplied outcome summary and an end-state tag on `w_origin`.

---

## 10. Worked composition: *Tenet*

**Available evidence:** corpus declaration plus reference image; no processed Tenet event JSON is supplied. This is a concrete composition prescription, not a reconstructed film graph.

### Page composition

- Header: `inverted_single_timeline` and the opposed-chevron `entropy_inversion` seal.
- One world-history frame with a rightward coordinate-time ruler.
- Agent occurrence tracks inside that frame, never parallel-world containers.
- Forward and inverted segments share identity tokens; direction chevrons and explicit state labels distinguish their traversal.
- Multiple appearances at a shared encoded event connect to one event node rather than duplicating the event into separate histories.
- A documented inversion transition joins occurrence tracks at its supplied anchor, not at a world fork.
- Long reversed segments run through internal trajectory gutters; causal edges remain in their separate gutter.

Borrow the reference’s separated self-tracks and clear direction changes, not its film-specific locations or implied off-screen paths.

If the eventual JSON supplies only the topology and primary rule, render **one history frame plus the inversion declaration**, with “inversion segments not specified.” Do not populate journeys from the poster.

---

**Recommendation:** ship a provenance-preserving chart compiler with topology templates and an orthogonal physics-signature registry. The defining quality is not how convincingly it draws a knot; it is how clearly it distinguishes **a knot declared by the ontology, a cycle encoded in the graph, and a connection the data does not establish**.