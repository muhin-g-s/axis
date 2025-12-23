import { PositiveIntSchema } from "@backend/libs/primitives";

export const PriorityLevelSchema = PositiveIntSchema;
export type PriorityLevel = typeof PriorityLevelSchema.infer;