import { createId, createIdSchema, fromStringFactory, type IdSchema } from "@backend/libs/id";

const brand = 'WorkspaceId';

type Brand = typeof brand;

export const WorkspaceIdSchema: IdSchema<Brand> = createIdSchema(brand);

export type WorkspaceId = typeof WorkspaceIdSchema.infer;

export function createWorkspaceIdId(): WorkspaceId {
  return createId<Brand>();
}

export const workspaceIdFromString = fromStringFactory(WorkspaceIdSchema);
