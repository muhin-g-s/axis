import { NonEmptyStringSchema } from "@backend/libs/primitives";

export const StatusNameSchema = NonEmptyStringSchema;
export type StatusName = typeof StatusNameSchema.infer;