import { NonEmptyStringSchema } from "@backend/libs/primitives";

export const LabelNameSchema = NonEmptyStringSchema;
export type LabelName = typeof LabelNameSchema.infer;