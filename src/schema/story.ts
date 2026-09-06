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
 *
 * Rule mixing:
 * - `primaryRuleSetId` (required) — dominant law
 * - `mixinRuleSetIds` (optional) — secondary laws that color the encoding
 * - `ruleSetIds` — full active set; must include primary and every mixin
 *
 * See docs/COMPATIBILITY.md for coherent vs tension mixes.
 */
export const StoryEncodingSchema = z
  .object({
    meta: StoryMetaSchema,
    /** Catalogue rule set ids — include primary + mixins */
    ruleSetIds: z.array(IdSchema).min(1),
    /** Dominant law; must appear in ruleSetIds */
    primaryRuleSetId: IdSchema,
    /**
     * Secondary laws mixed into the encoding.
     * Each must appear in ruleSetIds and must not equal primaryRuleSetId.
     * If omitted, consumers may treat ruleSetIds \ {primary} as mixins.
     */
    mixinRuleSetIds: z.array(IdSchema).optional(),
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

    if (!data.ruleSetIds.includes(data.primaryRuleSetId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `primaryRuleSetId "${data.primaryRuleSetId}" must be listed in ruleSetIds`,
        path: ["primaryRuleSetId"],
      });
    }

    if (data.mixinRuleSetIds) {
      for (const mid of data.mixinRuleSetIds) {
        if (mid === data.primaryRuleSetId) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `mixinRuleSetIds must not include primaryRuleSetId "${mid}"`,
            path: ["mixinRuleSetIds"],
          });
        }
        if (!data.ruleSetIds.includes(mid)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `mixinRuleSetId "${mid}" must be listed in ruleSetIds`,
            path: ["mixinRuleSetIds"],
          });
        }
      }
    }

    for (const w of data.worlds) {
      if (w.kind === "timeline") {
        if (w.originWorldRef && !worldIds.has(w.originWorldRef)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Timeline ${w.id} originWorldRef unknown: ${w.originWorldRef}`,
            path: ["worlds"],
          });
        }
      } else if (w.kind === "branch") {
        if (w.parentRef && !worldIds.has(w.parentRef)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Branch ${w.id} parentRef unknown: ${w.parentRef}`,
            path: ["worlds"],
          });
        }
        if (w.nestsWithinRef && !worldIds.has(w.nestsWithinRef)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Branch ${w.id} nestsWithinRef unknown: ${w.nestsWithinRef}`,
            path: ["worlds"],
          });
        }
      } else if (w.kind === "parallel_world") {
        if (w.originWorldRef && !worldIds.has(w.originWorldRef)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `ParallelWorld ${w.id} originWorldRef unknown: ${w.originWorldRef}`,
            path: ["worlds"],
          });
        }
        if (w.mirrorOf && !worldIds.has(w.mirrorOf)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `ParallelWorld ${w.id} mirrorOf unknown: ${w.mirrorOf}`,
            path: ["worlds"],
          });
        }
        for (const entry of w.correspondenceMap ?? []) {
          if (!worldIds.has(entry.remoteWorldRef)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `ParallelWorld ${w.id} correspondenceMap remoteWorldRef unknown: ${entry.remoteWorldRef}`,
              path: ["worlds"],
            });
          }
        }
      }
    }

    for (const a of data.agents) {
      if (a.homeWorldRef && !worldIds.has(a.homeWorldRef)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Agent ${a.id} homeWorldRef unknown: ${a.homeWorldRef}`,
          path: ["agents"],
        });
      }
      if (a.continuedFrom && !agentIds.has(a.continuedFrom)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Agent ${a.id} continuedFrom unknown: ${a.continuedFrom}`,
          path: ["agents"],
        });
      }
      if (a.continuesAs && !agentIds.has(a.continuesAs)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Agent ${a.id} continuesAs unknown: ${a.continuesAs}`,
          path: ["agents"],
        });
      }
    }

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
      if (e.payload?.checkpointEventId && !eventIds.has(e.payload.checkpointEventId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Event ${e.id} payload.checkpointEventId unknown: ${e.payload.checkpointEventId}`,
          path: ["events"],
        });
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
