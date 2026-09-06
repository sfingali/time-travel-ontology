import type { RuleSet } from "../schema/rules.js";
import { RuleSetSchema } from "../schema/rules.js";

/**
 * Named reusable law variants. IDs are stable contract strings for encodings.
 */
export const RULE_SETS: RuleSet[] = [
  {
    id: "fixed_novikov",
    label: "Fixed timeline (Novikov self-consistency)",
    description:
      "Past is not freely mutable. Any attempted change either fails, was always part of history, or is constrained so the timeline remains self-consistent.",
    pastMutability: "immutable",
    createsBranches: false,
    allowsBootstrap: true,
    paradoxHandling: "self_consistency",
    constraints: [
      "Interventions cannot produce inconsistent histories",
      "Information and objects may bootstrap if self-consistent",
    ],
    paramsNotes: "No free overwrite; traveler actions must close consistently.",
  },
  {
    id: "mutable_ripple",
    label: "Mutable past with ripples",
    description:
      "Changing the past overwrites or ripples through the same timeline (BTTF-like). Alternate states may appear as temporary overlays before consolidation.",
    pastMutability: "mutable_overwrite",
    createsBranches: false,
    allowsBootstrap: false,
    paradoxHandling: "overwrite",
    constraints: [
      "Past changes rewrite downstream present/future",
      "Fading photographs / memory dissonance are narrative signals of rewrite",
    ],
    paramsNotes: "Optional rippleDelay or fadeSignal params in story payloads.",
  },
  {
    id: "branch_on_intervention",
    label: "Branch on intervention",
    description:
      "Interventions fork a new branch rather than overwriting the parent timeline. Parent may continue unchanged.",
    pastMutability: "mutable_branch",
    createsBranches: true,
    allowsBootstrap: false,
    paradoxHandling: "branch",
    constraints: [
      "Each decisive intervention may create a Branch world",
      "Parent timeline remains unless explicitly pruned or merged",
    ],
  },
  {
    id: "bootstrap_ontological",
    label: "Bootstrap / ontological paradox",
    description:
      "Information, objects, or persons exist in a closed causal loop with no external origin. Compatible with fixed or looped topologies.",
    pastMutability: "conditional",
    createsBranches: false,
    allowsBootstrap: true,
    paradoxHandling: "self_consistency",
    constraints: [
      "At least one entity or info packet has no external provenance",
      "identityGroup should link bootstrap selves",
    ],
    paramsNotes: "Mark bootstrap_origin events; link agents via identityGroup.",
  },
  {
    id: "predestination_closed_loop",
    label: "Predestination closed loop",
    description:
      "Attempts to change fate fulfill it. Causal structure is a closed loop; free will is illusory at the plot level.",
    pastMutability: "immutable",
    createsBranches: false,
    allowsBootstrap: true,
    paradoxHandling: "self_consistency",
    constraints: [
      "Key interventions cause the outcomes they sought to prevent",
      "Loop edges should close agent/event cycles",
    ],
  },
  {
    id: "temporal_loop_exit",
    label: "Temporal loop with exit conditions",
    description:
      "Groundhog / death / day loops that repeat until exit criteria are met (learning, moral change, external break).",
    pastMutability: "conditional",
    createsBranches: false,
    allowsBootstrap: false,
    paradoxHandling: "checkpoint_reset",
    constraints: [
      "loop_reset events demarcate iterations",
      "Exit requires satisfying stated or implied conditions",
    ],
    paramsNotes: "payload.iteration or exitCondition on reset/exit events.",
  },
  {
    id: "worldline_attractor",
    label: "Worldlines and attractor fields",
    description:
      "Steins;Gate-like: discrete worldlines with attractor fields that resist divergence; observer continuity (Reading Steiner) across shifts.",
    pastMutability: "mutable_branch",
    createsBranches: true,
    allowsBootstrap: false,
    paradoxHandling: "branch",
    constraints: [
      "Worldlines attract toward convergence points",
      "Observer may retain memory across worldline shifts",
      "Use attractsToward world relations and worldline_bundle topology",
    ],
    paramsNotes: "attractorField id; divergenceMagnitude in payloads.",
  },
  {
    id: "entropy_inversion",
    label: "Entropy inversion (single timeline)",
    description:
      "Tenet-like: one timeline; agents or objects can have inverted entropy and move opposite to thermodynamic arrow. No branching required.",
    pastMutability: "immutable",
    createsBranches: false,
    allowsBootstrap: false,
    paradoxHandling: "self_consistency",
    constraints: [
      "Inverted and forward processes meet on the same timeline",
      "Turnstile / inversion events mark entropy flip",
    ],
    paramsNotes: "payload.entropy: forward | inverted",
  },
  {
    id: "tangent_universe",
    label: "Tangent universe",
    description:
      "Donnie Darko-like temporary tangent universe nested in primary; must collapse, returning artifacts/energy to the primary line.",
    pastMutability: "conditional",
    createsBranches: true,
    allowsBootstrap: false,
    paradoxHandling: "collapse_tangent",
    constraints: [
      "Tangent nestsWithin or forksFrom primary",
      "Tangent must collapse; Living Receiver / engineered collapse common",
    ],
    paramsNotes: "collapseDeadline timeLabel on tangent world.",
  },
  {
    id: "multiverse_contact",
    label: "Multiverse / parallel contact",
    description:
      "Coexisting parallel worlds with travel, correspondence, or verse-jumping (EEAAO, Fringe, Counterpart). Worlds are not mere branches of one history.",
    pastMutability: "conditional",
    createsBranches: false,
    allowsBootstrap: false,
    paradoxHandling: "ignore_or_unspecified",
    constraints: [
      "Use parallel_world descriptors with correspondsTo / mirrors",
      "Contact events link agents across worlds",
    ],
  },
  {
    id: "branch_bureaucracy_prune",
    label: "Sacred line with bureaucratic prune",
    description:
      "Loki TVA-like: branches from a sacred timeline are detected and pruned by an enforcing agency.",
    pastMutability: "mutable_branch",
    createsBranches: true,
    allowsBootstrap: false,
    paradoxHandling: "prune",
    constraints: [
      "Sacred / canonical timeline designated",
      "Nexus events fork Variants; prune edges remove branches",
    ],
    paramsNotes: "sacredWorldRef; pruneAuthority agent.",
  },
  {
    id: "death_checkpoint_rewrite",
    label: "Death checkpoint rewrite",
    description:
      "Re:Zero-like Return by Death: dying rewinds to a checkpoint; knowledge may carry; timeline from checkpoint is rewritten.",
    pastMutability: "mutable_overwrite",
    createsBranches: false,
    allowsBootstrap: false,
    paradoxHandling: "checkpoint_reset",
    constraints: [
      "death events trigger return to checkpoint",
      "Observer retains memory across rewrites",
    ],
    paramsNotes: "checkpointEventId; saveAuthority optional.",
  },
  {
    id: "perception_nonlinear",
    label: "Perception-only nonlinearity",
    description:
      "Arrival-like: knowledge or experiential order is non-linear without physical time travel. Causality of matter may remain ordinary.",
    pastMutability: "perception_only",
    createsBranches: false,
    allowsBootstrap: true,
    paradoxHandling: "ignore_or_unspecified",
    constraints: [
      "No physical departure/arrival required",
      "observation / reveal events carry future knowledge",
    ],
    paramsNotes: "May mixin bootstrap_ontological for gifted knowledge.",
  },
];

export const RULE_SET_BY_ID: ReadonlyMap<string, RuleSet> = new Map(
  RULE_SETS.map((r) => [r.id, r]),
);

export function getRuleSet(id: string): RuleSet {
  const r = RULE_SET_BY_ID.get(id);
  if (!r) throw new Error(`Unknown rule set id: ${id}`);
  return r;
}

export function assertRuleSetsValid(): void {
  for (const r of RULE_SETS) {
    RuleSetSchema.parse(r);
  }
}
