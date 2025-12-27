import type { LabelName } from "../../domain/value-objects/label-name";
import type { PriorityLevel } from "../../domain/value-objects/priority-level";
import type { PriorityName } from "../../domain/value-objects/priority-name";
import type { StatusName } from "../../domain/value-objects/status-name";
import type { StatusOrder } from "../../domain/value-objects/status-order";
import type { UserId } from "../../domain/value-objects/user-id";
import type { WorkspaceId } from "../../domain/value-objects/workspace-id";

export interface CreateLabelCommand {
	readonly actorUserId: UserId,
	readonly name: LabelName,
	readonly workspaceId: WorkspaceId,
}

export interface CreatePriorityCommand {
	readonly actorUserId: UserId,
	readonly name: PriorityName,
	readonly level: PriorityLevel,
	readonly workspaceId: WorkspaceId,
}

export interface CreateStatusCommand {
	readonly actorUserId: UserId,
	readonly name: StatusName,
	readonly order: StatusOrder,
	readonly workspaceId: WorkspaceId,
}

export interface GetLabelsByWorkspaceQuery {
	readonly actorUserId: UserId,
	readonly workspaceId: WorkspaceId,
}

export interface GetPrioritiesByWorkspaceQuery {
	readonly actorUserId: UserId,
	readonly workspaceId: WorkspaceId,
}

export interface GetStatusesByWorkspaceQuery {
	readonly actorUserId: UserId,
	readonly workspaceId: WorkspaceId,
}
