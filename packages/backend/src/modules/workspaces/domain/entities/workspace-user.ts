import { type } from 'arktype';
import { UserIdSchema, type UserId } from '../value-objects/user-id';
import { WorkspaceIdSchema, type WorkspaceId } from '../value-objects/workspace-id';
import { isAdmin, RoleSchema, type UserRole } from '../value-objects/role';
import { TimestampSchema, type Timestamp } from '@backend/libs/primitives';

export const WorkspaceUserSchema = type({
  userId: UserIdSchema,
  workspaceId: WorkspaceIdSchema,
  role: RoleSchema,
  assignedAt: TimestampSchema,
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
  };
}

export function canAddNewMember(workspaceUser: WorkspaceUser): boolean {
	return isAdmin(workspaceUser.role);
}
