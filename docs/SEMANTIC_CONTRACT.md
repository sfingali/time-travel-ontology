# Semantic contract

How to interpret a valid encoding. `validateStoryEncoding` guarantees structure,
references, and catalogue membership. It does **not** by itself fix interpretation.
This page is the normative interpretation contract (Astra review rec #2/#6/#7).

## Authority

- **Explicit typed graph fields are authoritative.** `worlds[]`, `agents[]`,
  `events[]`, `edges[]`, `interventions[]`, and `outcome` are the asserted encoding.
- **Labels and prose are explanatory evidence**, not silent overrides.
- Where a semantic dimension is recorded as `semanticReview: INCOMPLETE`/`DRAFT`,
  treat that as UNKNOWN — do not infer correctness.
- The **raw graph is the source of truth.** A consumer may request an
  abstraction-aware projection, but must expose that policy and keep source-ID
  traceability.

## Edge-kind contract

| Kind | Typical endpoints | Direction | Asserts | Authoritative for |
|---|---|---|---|---|
| `causal` | event → event (may be agents/worlds) | directed | causation between occurrences | causal provenance |
| `temporal` | event → event | directed | an ordering the encoding asserts | that ordering only |
| `identity` | agent → agent | directed | same entity under the declared identity convention | continuity |
| `world_relation` | world → world | directed | relation between worlds (`forksFrom`, `correspondsTo`, …) | world topology |
| `family` | agent → agent | directed | kinship, **never** identity/sameness | parenthood / siblinghood |
| `intervention` | event → event/agent | directed | an attempted change | intervention |

**Interpretation rules:**

- **Causation does not imply monotonic world time.** A `causal` edge is not a
  chronology assertion.
- **File order / array order do not imply chronology** unless explicitly specified.
- **Experienced order is relative to an identified experiencer** (`orderKind:
  experienced` needs an experiencer); `presentation` and `simultaneity` need an
  explicit frame/context. Equal-looking labels across worlds do **not** establish
  simultaneity.
- **Identity means the same entity** under the declared convention. **Counterpart**
  means a related but distinct entity. **`family` does not imply identity.**
- **Catalogue rule selection declares an available mechanism or constraint**, not
  proof that every event exhibits it.
- **Summary annotations do not transfer detailed-event placements to the summary.**

## Rule composition

There is **no implicit priority** between primary and mixin rules.

- Primary-vs-mixin status does not establish override precedence.
- **Capabilities grant permission**, not occurrence or obligation.
- **Prohibitions apply within their declared scope.**
- Report a **demonstrated conflict** only when assertions are incompatible *and*
  their scopes demonstrably overlap. Otherwise report **UNKNOWN**, not contradiction.
- An active set formed from `primary + mixinRuleSetIds` is bookkeeping; it is not a
  statement about how rules interact.

Composition is documented per rule in [`COMPATIBILITY.md`](COMPATIBILITY.md)
(capabilities / prohibitions / evidence obligations).

## Evidence obligations (mechanism completeness)

A rule/capability declares that a mechanism is available, not that the story must
satisfy every associated evidence obligation. Where an encoding claims a mechanism,
look for (do not invent):

| Mechanism | Evidence to look for |
|---|---|
| Branching | parent, fork occurrence, resulting branch identity |
| Mutable rewrite/ripple | before/after interpretation and an explicit rewrite/ripple relation |
| Loop/checkpoint | repeat/reset relation, target or checkpoint, and any claimed exit |
| Parallel-world contact | distinct world identities plus a contact/crossing relation |
| Inversion | explicit direction/state and its transition evidence |
| Bootstrap/predestination | the claimed dependency cycle and its referents |
| Nonlinear perception | distinction between presentation/perception and experienced/world order |
| Attractor / tangent / pruning | mechanism-specific relation and affected scope |

Report each obligation as **SATISFIED** / **MISSING** / **UNKNOWN**. A capability's
presence alone does not make every obligation mandatory.

## Statuses (three separate dimensions)

1. **Structural** — does it satisfy the schema? (required to pass)
2. **Referential** — do references resolve? (required to pass)
3. **Semantic / reviewed** — do the named laws, topology, relations, and evidence
   agree? (advisory; `semanticReview` records this, never rejects)

These are independent. An encoding can be structurally + referentially valid while
one or more semantic dimensions are `INCOMPLETE` / `UNKNOWN`.
