import { createId, createIdSchema, fromStringFactory } from "@backend/libs/id";

const brand = 'WorkspaceId';
type Brand = typeof brand;

export const WorkspaceIdSchema = createIdSchema(brand);
export type WorkspaceId = typeof WorkspaceIdSchema.infer;

export function createWorkspaceId(): WorkspaceId {
	return createId<Brand>();
}

export const workspaceIdFromString = fromStringFactory(WorkspaceIdSchema);
