import { createId, createIdSchema } from "@backend/libs/id";

const brand = 'PriorityId';
type Brand = typeof brand;

export const PriorityIdSchema = createIdSchema(brand);
export type PriorityId = typeof PriorityIdSchema.infer;

export function createPriorityId(): PriorityId {
	return createId<Brand>();
}