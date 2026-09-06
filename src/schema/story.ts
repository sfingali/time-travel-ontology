import { z } from "zod";
import { IdSchema } from "./common.js";
import {
  AgentSchema,
  EdgeSchema,
  EventSchema,
  InterventionSchema,
  OutcomeSchema,
  StoryMetaSchema,
} from "./narrative.js";
import { WorldDescriptorSchema } from "./topology.js";

/**
 * Root encoding for one story / plotline under chosen rule sets + topology.
 * Unknown keys are rejected so encodings stay comparable across the corpus.
 */
export const StoryEncodingSchema = z
  .object({
    meta: StoryMetaSchema,
    /** Catalogue rule set ids — first is primary; rest are mixins */
    ruleSetIds: z.array(IdSchema).min(1),
    topologyPatternId: IdSchema,
    worlds: z.array(WorldDescriptorSchema).min(1),
    agents: z.array(AgentSchema).default([]),
    events: z.array(EventSchema).min(1),
    edges: z.array(EdgeSchema).default([]),
    interventions: z.array(InterventionSchema).default([]),
    outcome: OutcomeSchema,
  })
  .strict()
  .superRefine((data, ctx) => {
    const worldIds = new Set(data.worlds.map((w) => w.id));
    const agentIds = new Set(data.agents.map((a) => a.id));
    const eventIds = new Set(data.events.map((e) => e.id));

    for (const e of data.events) {
      if (!worldIds.has(e.at.worldRef)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Event ${e.id} references unknown worldRef ${e.at.worldRef}`,
          path: ["events"],
        });
      }
      for (const a of e.agents ?? []) {
        if (!agentIds.has(a)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Event ${e.id} references unknown agent ${a}`,
            path: ["events"],
          });
        }
      }
    }

    for (const edge of data.edges) {
      const known =
        worldIds.has(edge.from) ||
        eventIds.has(edge.from) ||
        agentIds.has(edge.from);
      const knownTo =
        worldIds.has(edge.to) ||
        eventIds.has(edge.to) ||
        agentIds.has(edge.to);
      if (!known) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Edge ${edge.id} from-ref unknown: ${edge.from}`,
          path: ["edges"],
        });
      }
      if (!knownTo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Edge ${edge.id} to-ref unknown: ${edge.to}`,
          path: ["edges"],
        });
      }
    }

    for (const iv of data.interventions) {
      if (!eventIds.has(iv.eventId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Intervention ${iv.id} references unknown event ${iv.eventId}`,
          path: ["interventions"],
        });
      }
    }

    for (const ref of data.outcome.endWorldRefs) {
      if (!worldIds.has(ref)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Outcome endWorldRef unknown: ${ref}`,
          path: ["outcome", "endWorldRefs"],
        });
      }
    }
  });

export type StoryEncoding = z.infer<typeof StoryEncodingSchema>;
