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

export type Id = z.infer<typeof IdSchema>;
export type PastMutability = z.infer<typeof PastMutabilitySchema>;
export type ParadoxHandling = z.infer<typeof ParadoxHandlingSchema>;
