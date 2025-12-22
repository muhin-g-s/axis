import { createId, createIdSchema, type IdSchema } from "@backend/libs/id";

const brand = 'WorkspaceId';

type Brand = typeof brand;

export const WorkspaceIdSchema: IdSchema<Brand> = createIdSchema(brand);

export type WorkspaceId = typeof WorkspaceIdSchema.infer;

export function createWorkspaceId(): WorkspaceId {
  return createId<Brand>();
}
