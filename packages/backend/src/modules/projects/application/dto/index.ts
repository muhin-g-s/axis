import type { ProjectId } from "../../domain/value-objects/id";
import type { ProjectName } from "../../domain/value-objects/name";
import type { UserId } from "../../domain/value-objects/user-id";
import type { WorkspaceId } from "../../domain/value-objects/workspace-id";

export interface CreateProjectCommand {
	readonly actorUserId: UserId,
  readonly name: ProjectName,
  readonly workspaceId: WorkspaceId,
}

export interface RenameProjectCommand {
	readonly actorUserId: UserId,
	readonly workspaceId: WorkspaceId,
	readonly id: ProjectId,
	readonly newName: ProjectName,
}

export interface DeleteProjectCommand {
	readonly actorUserId: UserId,
	readonly workspaceId: WorkspaceId,
	readonly id: ProjectId,
}

export interface GetProjectQuery {
	readonly actorUserId: UserId,
	readonly workspaceId: WorkspaceId,
	readonly id: ProjectId
}

export interface GetProjectsByWorkspaceQuery {
	readonly actorUserId: UserId,
	readonly workspaceId: WorkspaceId,
}
