import { z } from "zod";
import { IdSchema } from "./common.js";

export const WorldKindSchema = z.enum(["timeline", "branch", "parallel_world"]);

export const WorldRelationKindSchema = z.enum([
  "forksFrom",
  "mergesInto",
  "correspondsTo",
  "prunes",
  "nestsWithin",
  "attractsToward",
  "collapsesInto",
  "mirrors",
  "supersedes",
  "originatesFrom",
  /** A traveller crosses from the source world into the target world.
   *  Distinct from mergesInto: the two histories do NOT combine — both keep
   *  running independently, and only the traveller transfers. */
  "joinsInto",
]);

/** Correspondence entry linking entities/keys across parallel worlds */
export const CorrespondenceEntrySchema = z
  .object({
    localKey: z.string().min(1),
    remoteWorldRef: IdSchema,
    remoteKey: z.string().min(1),
    notes: z.string().optional(),
  })
  .strict();

/** Base fields shared by all world descriptors */
const WorldBase = {
  id: IdSchema,
  label: z.string().min(1),
  description: z.string().optional(),
  /** Optional attractor / convergence field this world participates in */
  attractorFieldId: z.string().min(1).optional(),
  /**
   * True when this world was already running independently before any
   * traveller entered it — it is NOT the product of a split in this story.
   *
   * This is a positive claim about origin, and it is what separates
   * "there is no fork" from "the fork point is unknown". A branch left
   * without a forkEventRef says the latter; preExisting says the former.
   * Renderers draw a pre-existing world as a full-length lane with an entry
   * marker, not as a lane that begins where the traveller arrives.
   */
  preExisting: z.boolean().optional(),
};

export const TimelineSchema = z
  .object({
    ...WorldBase,
    kind: z.literal("timeline"),
    /** Optional era / span label for visual engines */
    spanLabel: z.string().optional(),
    /** Link to origin world that this derived timeline stems from (Dark) */
    originWorldRef: IdSchema.optional(),
    /** True when this timeline is the pre-knot / origin continuum */
    isOriginWorld: z.boolean().optional(),
  })
  .strict();

export const BranchSchema = z
  .object({
    ...WorldBase,
    kind: z.literal("branch"),
    /** Parent world this branch forked from */
    parentRef: IdSchema.optional(),
    /** Event at which the branch diverged from its parent (design decision #2) */
    forkEventRef: IdSchema.optional(),
    /** Divergence point label */
    forkLabel: z.string().optional(),
    /** True when the branch is a draft whose fork point is not yet pinned down (#2) */
    draft: z.boolean().optional(),
    /** Declared completeness of the branch origin (Astra review rec #3): missing = UNKNOWN.
     *  A COMPLETE assertion lacking origin evidence is an advisory INCOMPLETE, not a rejection. */
    branchSpecification: z.enum(["INCOMPLETE", "DRAFT", "COMPLETE"]).optional(),
    pruned: z.boolean().optional(),
    /** Nesting parent for tangent bubbles (distinct from fork parentRef) */
    nestsWithinRef: IdSchema.optional(),
    /** Deadline / condition label for tangent collapse */
    collapseDeadline: z.string().optional(),
    /** Authority that may prune this branch (TVA, etc.) */
    pruneAuthority: z.string().optional(),
    /** Steins;Gate-style worldline identifier */
    worldlineId: z.string().optional(),
    /** True when this branch is a temporary tangent universe */
    tangent: z.boolean().optional(),
  })
  .strict();

export const ParallelWorldSchema = z
  .object({
    ...WorldBase,
    kind: z.literal("parallel_world"),
    /** Correspondence key linking twin/counterpart worlds */
    correspondenceKey: z.string().optional(),
    /** Structured correspondence map for visual engines */
    correspondenceMap: z.array(CorrespondenceEntrySchema).optional(),
    /** Optional origin continuum this parallel overlay derives from */
    originWorldRef: IdSchema.optional(),
    /** Convenience: primary mirror twin world ref */
    mirrorOf: IdSchema.optional(),
  })
  .strict();

export const WorldDescriptorSchema = z.discriminatedUnion("kind", [
  TimelineSchema,
  BranchSchema,
  ParallelWorldSchema,
]);

export const TopologyPatternSchema = z
  .object({
    id: IdSchema,
    label: z.string().min(1),
    description: z.string().min(1),
    /** Expected world kinds this pattern typically uses */
    typicalWorldKinds: z.array(WorldKindSchema).min(1),
    /** Typical relation kinds among worlds */
    typicalRelations: z.array(WorldRelationKindSchema).default([]),
    notes: z.string().optional(),
  })
  .strict();

export type Timeline = z.infer<typeof TimelineSchema>;
export type Branch = z.infer<typeof BranchSchema>;
export type ParallelWorld = z.infer<typeof ParallelWorldSchema>;
export type WorldDescriptor = z.infer<typeof WorldDescriptorSchema>;
export type TopologyPattern = z.infer<typeof TopologyPatternSchema>;
export type WorldRelationKind = z.infer<typeof WorldRelationKindSchema>;
export type CorrespondenceEntry = z.infer<typeof CorrespondenceEntrySchema>;
