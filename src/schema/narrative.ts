import { z } from "zod";
import {
  ContinuityRoleSchema,
  EntropyDirectionSchema,
  IdSchema,
  IdentityRelationKindSchema,
  OrderingKindSchema,
} from "./common.js";
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

/**
 * Agent with optional identity-continuity fields for bootstrap / multi-self /
 * counterpart / iteration stories.
 */
export const AgentSchema = z
  .object({
    id: IdSchema,
    label: z.string().min(1),
    /** Shared continuum key linking older/younger/bootstrap/counterpart selves */
    identityGroup: z.string().min(1).optional(),
    continuityRole: ContinuityRoleSchema.optional(),
    /** Home world for this agent instance */
    homeWorldRef: IdSchema.optional(),
    /** Prior agent id this instance continues from */
    continuedFrom: IdSchema.optional(),
    /** Next agent id this instance continues as */
    continuesAs: IdSchema.optional(),
    /** Iteration / loop ordinal when relevant */
    iterationIndex: z.number().int().nonnegative().optional(),
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
  "loop_exit",
  "branch_fork",
  "branch_prune",
  "collapse",
  "contact",
  "bootstrap_origin",
  "reveal",
  "inversion",
  "checkpoint",
  "other",
]);

export const EventAtSchema = z
  .object({
    worldRef: IdSchema,
    timeLabel: z.string().optional(),
  })
  .strict();

/**
 * Typed optional event extensions — stable names, schema-validated.
 * Prefer these over ad-hoc keys so visual engines and comparators stay consistent.
 */
export const EventPayloadSchema = z
  .object({
    // Travel parameters
    travelMode: z
      .enum([
        "machine",
        "turnstile",
        "wormhole",
        "quantum",
        "perception",
        "body_swap",
        "blood_reset",
        "cave_portal",
        "box",
        "other",
      ])
      .optional(),
    travelDelta: z.string().optional(),
    originTimeLabel: z.string().optional(),
    destinationTimeLabel: z.string().optional(),

    // Entropy / inversion (Tenet)
    entropy: EntropyDirectionSchema.optional(),
    inverted: z.boolean().optional(),
    turnstileId: z.string().optional(),
    pincerRole: z
      .enum(["red_forward", "blue_inverted", "teaching", "war", "solo"])
      .optional(),
    freeportId: z.string().optional(),

    // Primer-style boxes / failsafes
    boxId: z.string().optional(),
    failsafeId: z.string().optional(),
    boxDuration: z.string().optional(),

    // Worldlines / attractors (Steins;Gate)
    worldlineId: z.string().optional(),
    attractorFieldId: z.string().optional(),
    divergenceMagnitude: z.number().optional(),
    readingSteiner: z.boolean().optional(),

    // Artifacts (Algorithm, jet engine, bootstrap objects)
    artifactId: z.string().optional(),
    artifactKind: z
      .enum([
        "algorithm",
        "jet_engine",
        "book",
        "device",
        "stone",
        "cpu",
        "other",
      ])
      .optional(),
    algorithmPiece: z.number().int().min(1).max(9).optional(),

    // TVA / bureaucratic prune
    pruneAuthority: z.string().optional(),
    nexusEvent: z.boolean().optional(),
    sacredTimeline: z.boolean().optional(),
    variantId: z.string().optional(),

    // Return-by-Death / checkpoints / loops
    checkpointId: z.string().optional(),
    checkpointEventId: IdSchema.optional(),
    iteration: z.number().int().nonnegative().optional(),
    memoryRetained: z.boolean().optional(),
    exitCondition: z.string().optional(),

    // Bootstrap / identity notes
    bootstrapEntity: z.string().optional(),
    identityNote: z.string().optional(),

    // Narrative signals / perception helpers
    signal: z.string().optional(),
    perceptionMode: z.string().optional(),
    exitFailed: z.boolean().optional(),
    observerContinuity: z.boolean().optional(),

    // Free-text helpers (still named / stable)
    note: z.string().optional(),
    tags: z.array(z.string().min(1)).optional(),
  })
  .strict()
  .superRefine((payload, ctx) => {
    if (
      (payload.entropy === "forward" && payload.inverted === true) ||
      (payload.entropy === "inverted" && payload.inverted === false)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["inverted"],
        message: `inverted=${payload.inverted} contradicts entropy="${payload.entropy}"`,
      });
    }
  });

/** Modeling granularity of an event/edge: atomic detail, a summary of others, or unspecified. */
export const AbstractionLevelSchema = z.enum(["atomic", "summary", "unspecified"]);

/** Review status of a semantic dimension (Astra: missing entry = UNKNOWN). */
export const SemanticReviewStatusSchema = z.enum(["INCOMPLETE", "DRAFT", "REVIEWED"]);

/** Which semantic dimension a review entry addresses. */
export const SemanticReviewDimensionSchema = z.enum([
  "topology",
  "branch_origin",
  "rule_composition",
  "event_identity",
  "edge_identity",
  "world_placement",
  "relation_semantics",
  "mechanism_completeness",
]);

/** What a review entry targets. */
export const SemanticReviewTargetSchema = z.union([
  z.object({ kind: z.literal("story") }),
  z.object({ kind: z.enum(["world", "event", "edge"]), id: IdSchema }),
]);

/** A reviewable incomplete/draft/evidence statement, not a correctness claim. */
export const SemanticReviewEntrySchema = z
  .object({
    target: SemanticReviewTargetSchema,
    dimension: SemanticReviewDimensionSchema,
    status: SemanticReviewStatusSchema,
    note: z.string().min(1),
    evidence: z.array(z.string()).optional(),
  })
  .strict();

export const EventSchema = z
  .object({
    id: IdSchema,
    type: EventTypeSchema,
    label: z.string().min(1),
    at: EventAtSchema,
    agents: z.array(IdSchema).optional(),
    payload: EventPayloadSchema.optional(),
    /** This event asserts the same semantic occurrence as the target (same granularity). */
    duplicateOf: IdSchema.optional(),
    /** This event summarizes the listed events; it does not assert identity with them. */
    summaryOf: z.array(IdSchema).optional(),
    /** Declared modeling granularity only; does not establish equivalence. */
    abstractionLevel: AbstractionLevelSchema.optional(),
  })
  .strict();

export const EdgeKindSchema = z.enum([
  "causal",
  "temporal",
  "identity",
  "world_relation",
  "intervention",
  /** Kinship link (parenthood, siblinghood) between two distinct agents. */
  "family",
]);

export const EdgeSchema = z
  .object({
    id: IdSchema,
    kind: EdgeKindSchema,
    from: IdSchema,
    to: IdSchema,
    label: z.string().optional(),
    /** World-relation kind (forksFrom, mirrors, …). */
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
        "originatesFrom",
      ])
      .optional(),
    /** Meaning of an identity link between two agents (design decision #1). */
    identityRelation: IdentityRelationKindSchema.optional(),
    /** Which sense of "before/after" a temporal/causal edge expresses (#5). */
    orderKind: OrderingKindSchema.optional(),
    /** This edge asserts the same semantic connection as the target (same granularity). */
    duplicateOf: IdSchema.optional(),
    /** This edge summarizes the listed edges; it does not assert identity with them. */
    summaryOf: z.array(IdSchema).optional(),
    /** Declared modeling granularity only; does not establish equivalence. */
    abstractionLevel: AbstractionLevelSchema.optional(),
  })
  .strict();

export const RuleEffectSchema = z
  .object({
    ruleSetId: IdSchema,
    effect: z.string().min(1),
    /** When a rule effect applies (e.g. "outside_the_knot"): formalises the
     *  scope of an effect that would not follow from the rule's default law. */
    scope: z.string().min(1).optional(),
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
export type EventPayload = z.infer<typeof EventPayloadSchema>;
export type Edge = z.infer<typeof EdgeSchema>;
export type Intervention = z.infer<typeof InterventionSchema>;
export type Outcome = z.infer<typeof OutcomeSchema>;

export { WorldDescriptorSchema };
