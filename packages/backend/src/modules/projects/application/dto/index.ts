import type { ProjectId } from "../../domain/value-objects/id";
import type { ProjectName } from "../../domain/value-objects/name";
import type { WorkspaceId } from "../../domain/value-objects/workspace-id";

export interface CreateProjectCommand {
  readonly id: ProjectId,
  readonly name: ProjectName,
  readonly workspaceId: WorkspaceId,
}

export interface RenameProjectCommand {
	readonly id: ProjectId,
	readonly newName: ProjectName,
}

export interface DeleteProjectCommand {
	readonly id: ProjectId,
}

export interface GetProjectQuery {
	readonly id: ProjectId
}

export interface GetProjectsByWorkspaceQuery {
	readonly id: WorkspaceId
}
