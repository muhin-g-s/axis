import { PositiveIntSchema } from "@backend/libs/primitives";

export const StatusOrderSchema = PositiveIntSchema;
export type StatusOrder = typeof StatusOrderSchema.infer;