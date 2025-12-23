import { type } from 'arktype';
import { UserIdSchema, type UserId } from '../value-objects/user-id';
import { WorkspaceIdSchema, type WorkspaceId } from '../value-objects/workspace-id';
import { isAdmin, RoleSchema, type UserRole } from '../value-objects/role';
import { TimestampSchema, VersionSchema, type Timestamp } from '@backend/libs/primitives';
import { createVersion, incVersion } from '@backend/libs/version';

export const WorkspaceUserSchema = type({
  userId: UserIdSchema,
  workspaceId: WorkspaceIdSchema,
  role: RoleSchema,
  assignedAt: TimestampSchema,
  version: VersionSchema,
});

export type WorkspaceUser = typeof WorkspaceUserSchema.infer;

export function createWorkspaceUser(
  userId: UserId,
  workspaceId: WorkspaceId,
  role: UserRole,
  assignedAt: Timestamp,
): WorkspaceUser {
  return {
    userId,
    workspaceId,
    role,
    assignedAt,
    version: createVersion(),
  };
}

export function changeRole(
  workspaceUser: WorkspaceUser,
  newRole: UserRole
): WorkspaceUser {
  if (workspaceUser.role === newRole) {
    return workspaceUser;
  }

  return {
    ...workspaceUser,
    role: newRole,
    version: incVersion(workspaceUser.version),
  };
}

export function canAddNewMember(workspaceUser: WorkspaceUser): boolean {
	return isAdmin(workspaceUser.role);
}
