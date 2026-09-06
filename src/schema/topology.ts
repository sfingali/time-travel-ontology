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
    /** Divergence point label */
    forkLabel: z.string().optional(),
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
