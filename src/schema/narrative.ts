import { z } from "zod";
import { IdSchema } from "./common.js";
import { WorldDescriptorSchema } from "./topology.js";

export const MediumSchema = z.enum([
  "film",
  "tv",
  "novel",
  "short_story",
  "game",
  "comic",
  "other",
]);

export const StoryMetaSchema = z
  .object({
    id: IdSchema,
    title: z.string().min(1),
    year: z.number().int().optional(),
    medium: MediumSchema,
    sources: z.array(z.string().min(1)).optional(),
  })
  .strict();

export const AgentSchema = z
  .object({
    id: IdSchema,
    label: z.string().min(1),
    identityGroup: z.string().min(1).optional(),
    notes: z.string().optional(),
  })
  .strict();

export const EventTypeSchema = z.enum([
  "ordinary",
  "departure",
  "arrival",
  "intervention",
  "observation",
  "death",
  "birth",
  "loop_reset",
  "branch_fork",
  "branch_prune",
  "collapse",
  "contact",
  "bootstrap_origin",
  "reveal",
  "other",
]);

export const EventAtSchema = z
  .object({
    worldRef: IdSchema,
    timeLabel: z.string().optional(),
  })
  .strict();

export const EventSchema = z
  .object({
    id: IdSchema,
    type: EventTypeSchema,
    label: z.string().min(1),
    at: EventAtSchema,
    agents: z.array(IdSchema).optional(),
    payload: z.record(z.unknown()).optional(),
  })
  .strict();

export const EdgeKindSchema = z.enum([
  "causal",
  "temporal",
  "identity",
  "world_relation",
  "intervention",
]);

export const EdgeSchema = z
  .object({
    id: IdSchema,
    kind: EdgeKindSchema,
    from: IdSchema,
    to: IdSchema,
    label: z.string().optional(),
    relation: z
      .enum([
        "forksFrom",
        "mergesInto",
        "correspondsTo",
        "prunes",
        "nestsWithin",
        "attractsToward",
        "collapsesInto",
        "mirrors",
        "supersedes",
      ])
      .optional(),
  })
  .strict();

export const RuleEffectSchema = z
  .object({
    ruleSetId: IdSchema,
    effect: z.string().min(1),
  })
  .strict();

export const InterventionSchema = z
  .object({
    id: IdSchema,
    eventId: IdSchema,
    ruleEffects: z.array(RuleEffectSchema).min(1),
    notes: z.string().optional(),
  })
  .strict();

export const OutcomeSchema = z
  .object({
    summary: z.string().min(1),
    endWorldRefs: z.array(IdSchema).min(1),
  })
  .strict();

export type StoryMeta = z.infer<typeof StoryMetaSchema>;
export type Agent = z.infer<typeof AgentSchema>;
export type Event = z.infer<typeof EventSchema>;
export type Edge = z.infer<typeof EdgeSchema>;
export type Intervention = z.infer<typeof InterventionSchema>;
export type Outcome = z.infer<typeof OutcomeSchema>;

export { WorldDescriptorSchema };
