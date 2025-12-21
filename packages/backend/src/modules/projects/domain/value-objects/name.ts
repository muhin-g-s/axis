import { NonEmptyStringSchema } from "@backend/libs/primitives";

export const ProjectNameSchema = NonEmptyStringSchema

export type ProjectName = typeof ProjectNameSchema.infer;
