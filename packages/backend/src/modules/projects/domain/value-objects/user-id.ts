import { createIdSchema } from '@backend/libs/id';

const brand = 'UserId';

export const UserIdSchema = createIdSchema(brand);

export type UserId = typeof UserIdSchema.infer;
