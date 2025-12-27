import { createId, createIdSchema, fromStringFactory } from '@backend/libs/id';

const brand = 'UserId';

type Brand = typeof brand;

export const UserIdSchema = createIdSchema(brand);

export type UserId = typeof UserIdSchema.infer;

export function createUserId(): UserId {
	return createId<Brand>();
}

export const userIdFromString = fromStringFactory(UserIdSchema);
