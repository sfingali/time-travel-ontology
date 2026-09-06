import { z } from "zod";
import {
  IdSchema,
  ParadoxHandlingSchema,
  PastMutabilitySchema,
} from "./common.js";

/** Named reusable fictional-physics / law variant */
export const RuleSetSchema = z
  .object({
    id: IdSchema,
    label: z.string().min(1),
    description: z.string().min(1),
    pastMutability: PastMutabilitySchema,
    createsBranches: z.boolean(),
    allowsBootstrap: z.boolean(),
    paradoxHandling: ParadoxHandlingSchema,
    constraints: z.array(z.string().min(1)).default([]),
    /** Free-form notes for optional numeric / structural params */
    paramsNotes: z.string().optional(),
    /** Optional structured params (story-specific knobs) */
    params: z.record(z.unknown()).optional(),
  })
  .strict();

export type RuleSet = z.infer<typeof RuleSetSchema>;

export const RuleSetIdSchema = IdSchema;
