import { type } from 'arktype';
import { WorkspaceIdSchema, type WorkspaceId } from '../value-objects/workspace-id';
import { WorkspaceNameSchema, type WorkspaceName } from '../value-objects/workspace-name';
import { UserIdSchema, type UserId } from '@backend/modules/identity/domain/value-objects/user-id';
import { TimestampSchema, VersionSchema, type Timestamp } from '@backend/libs/primitives';
import { createVersion, incVersion } from '@backend/libs/version';

export const WorkspaceSchema = type({
  id: WorkspaceIdSchema,
  name: WorkspaceNameSchema,
  ownerId: UserIdSchema,
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
  deletedAt: TimestampSchema.optional(),
  version: VersionSchema
});

export type Workspace = typeof WorkspaceSchema.infer;

export function createWorkspace(
  id: WorkspaceId,
  name: WorkspaceName,
  ownerId: UserId,
  now: Timestamp,
): Workspace {
  return {
    id,
    name,
    ownerId,
    createdAt: now,
    updatedAt: now,
    version: createVersion(),
  };
}

export function updateWorkspaceName(
  workspace: Workspace,
  newName: WorkspaceName,
  now: Timestamp
): Workspace {
  if (workspace.name === newName) {
    return workspace;
  }

  return { ...workspace, name: newName, updatedAt: now, version: incVersion(workspace.version) };
}
