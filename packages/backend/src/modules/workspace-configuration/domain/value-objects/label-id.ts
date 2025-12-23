import { createId, createIdSchema } from "@backend/libs/id";

const brand = 'LabelId';
type Brand = typeof brand;

export const LabelIdSchema = createIdSchema(brand);
export type LabelId = typeof LabelIdSchema.infer;

export function createLabelId(): LabelId {
	return createId<Brand>();
}