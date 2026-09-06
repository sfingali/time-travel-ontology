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
    const categories = [
      "worlds",
      "agents",
      "events",
      "edges",
      "interventions",
    ] as const;
    const allIds = new Map<string, string>();
    for (const category of categories) {
      const seen = new Set<string>();
      data[category].forEach((node, index) => {
        const first = allIds.get(node.id);
        if (seen.has(node.id)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [category, index, "id"],
            message: `Duplicate ID "${node.id}" within ${category}; first used at ${first}`,
          });
        } else if (first !== undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [category, index, "id"],
            message: `Duplicate ID "${node.id}" across categories; first used at ${first}`,
          });
        }
        seen.add(node.id);
        if (first === undefined) {
          allIds.set(node.id, `${category}.${index}.id`);
        }
      });
    }

    const checkUniqueRules = (
      ids: string[],
      field: "ruleSetIds" | "mixinRuleSetIds",
    ) => {
      const seen = new Set<string>();
      ids.forEach((id, index) => {
        if (seen.has(id)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field, index],
            message: `Duplicate rule ID "${id}" in ${field}`,
          });
        }
        seen.add(id);
      });
      return seen;
    };

    const activeRules = checkUniqueRules(data.ruleSetIds, "ruleSetIds");
    if (data.mixinRuleSetIds !== undefined) {
      checkUniqueRules(data.mixinRuleSetIds, "mixinRuleSetIds");
      const declaredRules = new Set([
        data.primaryRuleSetId,
        ...data.mixinRuleSetIds,
      ]);
      data.ruleSetIds.forEach((id, index) => {
        if (!declaredRules.has(id)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["ruleSetIds", index],
            message: `Active rule "${id}" must be primary or listed in explicit mixinRuleSetIds`,
          });
        }
      });
    }

    const worldIds = new Set(data.worlds.map((w) => w.id));
    const agentIds = new Set(data.agents.map((a) => a.id));
    const eventIds = new Set(data.events.map((e) => e.id));
    const eventsById = new Map(data.events.map((e) => [e.id, e]));

    if (!activeRules.has(data.primaryRuleSetId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `primaryRuleSetId "${data.primaryRuleSetId}" must be listed in ruleSetIds`,
        path: ["primaryRuleSetId"],
      });
    }

    if (data.mixinRuleSetIds !== undefined) {
      for (const mid of data.mixinRuleSetIds) {
        if (mid === data.primaryRuleSetId) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `mixinRuleSetIds must not include primaryRuleSetId "${mid}"`,
            path: ["mixinRuleSetIds"],
          });
        }
        if (!activeRules.has(mid)) {
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
      const checkpointRef = e.payload?.checkpointEventId;
      if (checkpointRef !== undefined) {
        const target = eventsById.get(checkpointRef);
        if (target === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Event ${e.id} payload.checkpointEventId unknown: ${checkpointRef}`,
            path: ["events", data.events.indexOf(e), "payload", "checkpointEventId"],
          });
        } else if (
          target.type !== "checkpoint" &&
          target.type !== "loop_reset" &&
          target.type !== "death"
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Event ${e.id} checkpointEventId "${checkpointRef}" must reference a checkpoint, loop_reset, or death event; found ${target.type}`,
            path: ["events", data.events.indexOf(e), "payload", "checkpointEventId"],
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
