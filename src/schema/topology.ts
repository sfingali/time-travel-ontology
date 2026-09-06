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
]);

/** Base fields shared by all world descriptors */
const WorldBase = {
  id: IdSchema,
  label: z.string().min(1),
  description: z.string().optional(),
};

export const TimelineSchema = z
  .object({
    ...WorldBase,
    kind: z.literal("timeline"),
    /** Optional era / span label for visual engines */
    spanLabel: z.string().optional(),
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
  })
  .strict();

export const ParallelWorldSchema = z
  .object({
    ...WorldBase,
    kind: z.literal("parallel_world"),
    /** Correspondence key linking twin/counterpart worlds */
    correspondenceKey: z.string().optional(),
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
