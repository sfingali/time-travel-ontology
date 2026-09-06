import { z } from "zod";

/** Non-empty stable string identifier */
export const IdSchema = z.string().min(1).regex(/^[a-zA-Z0-9][a-zA-Z0-9_.\-]*$/);

export const PastMutabilitySchema = z.enum([
  "immutable",
  "mutable_overwrite",
  "mutable_branch",
  "perception_only",
  "conditional",
]);

export const ParadoxHandlingSchema = z.enum([
  "forbidden",
  "self_consistency",
  "overwrite",
  "branch",
  "prune",
  "collapse_tangent",
  "ignore_or_unspecified",
  "checkpoint_reset",
]);

/** Direction of thermodynamic / experiential arrow (Tenet-style) */
export const EntropyDirectionSchema = z.enum(["forward", "inverted", "mixed"]);

/** How an agent instance relates within an identity continuum */
export const ContinuityRoleSchema = z.enum([
  "primary",
  "older_self",
  "younger_self",
  "bootstrap_source",
  "bootstrap_sink",
  "counterpart",
  "variant",
  "iteration",
  "inverted_self",
  "observer_persistent",
  "other",
]);

/**
 * Meaning of a relationship between two agent records (Astra design decision #1).
 * Distinct from the world-relation `relation` enum:
 *  - personal_continuity: one person across time / inverted stages
 *  - counterpart: a related version in another world, NOT one continuous life
 *  - loop_iteration: an appearance in a loop; whether memory continues is separate
 *  - participation: an event participant, not an identity claim
 *  - other: unambiguous fallback requiring interpretation
 */
export const IdentityRelationKindSchema = z.enum([
  "personal_continuity",
  "counterpart",
  "loop_iteration",
  "participation",
  "other",
]);

/**
 * Which sense of "before/after" an ordering relation describes (design decision #5).
 * Chronological (within a frame), experienced (a named agent/journey), presentation
 * (a telling/edition), simultaneity (same frame, no direction), or unspecified.
 */
export const OrderingKindSchema = z.enum([
  "chronological",
  "experienced",
  "presentation",
  "simultaneity",
  "unspecified",
]);

export type Id = z.infer<typeof IdSchema>;
export type PastMutability = z.infer<typeof PastMutabilitySchema>;
export type ParadoxHandling = z.infer<typeof ParadoxHandlingSchema>;
export type EntropyDirection = z.infer<typeof EntropyDirectionSchema>;
export type ContinuityRole = z.infer<typeof ContinuityRoleSchema>;
