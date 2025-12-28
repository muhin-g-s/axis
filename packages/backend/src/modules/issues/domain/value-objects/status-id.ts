import { createId, createIdSchema, fromStringFactory } from "@backend/libs/id";

const brand = 'StatusId';
type Brand = typeof brand;

export const StatusIdSchema = createIdSchema(brand);
export type StatusId = typeof StatusIdSchema.infer;

export function createStatusId(): StatusId {
	return createId<Brand>();
}

export const statusIdFromString = fromStringFactory(StatusIdSchema);