import { NonEmptyStringSchema } from "@backend/libs/primitives";

export const PriorityNameSchema = NonEmptyStringSchema;
export type PriorityName = typeof PriorityNameSchema.infer;