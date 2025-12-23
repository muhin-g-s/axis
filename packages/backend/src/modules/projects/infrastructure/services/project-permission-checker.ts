import { Result } from "@backend/libs/result";
import {
	createCannotAccessProjectError,
	createCannotCreateProjectError,
	createCannotDeleteProjectError,
	createCannotModifyProjectError,
	createCannotViewProjectError,
	createUnexpectedError,
	isCannotAccessProjectError,
	type ProjectDomainError
} from "../../domain/errors";
import type { IProjectPermissionChecker } from "../../domain/services/project-permission-checker";
import type { UserId } from "../../domain/value-objects/user-id";
import type { WorkspaceId } from "../../domain/value-objects/workspace-id";
import type { WorkspaceMembershipChecker } from "@backend/modules/workspaces/domain/ports";

export class ProjectPermissionChecker implements IProjectPermissionChecker {
    constructor(private readonly membershipChecker: WorkspaceMembershipChecker) {}

    private async checkMembership(
        userId: UserId,
        workspaceId: WorkspaceId
    ): Promise<Result<void, ProjectDomainError>> {
        const isMemberResult = await this.membershipChecker.isMember(userId, workspaceId);

        if (!isMemberResult.ok) {
            return Result.err(createUnexpectedError(isMemberResult.error));
        }

        if (!isMemberResult.value) {
            return Result.err(createCannotAccessProjectError(userId));
        }

        return Result.ok(undefined);
    }

    async canCreateProject(userId: UserId, workspaceId: WorkspaceId): Promise<Result<void, ProjectDomainError>> {
			return Result
				.mapErr(
					await this.checkMembership(userId, workspaceId),
					err => isCannotAccessProjectError(err)
						? createCannotCreateProjectError(userId)
						: err
					);
    }

    async canDeleteProject(userId: UserId, workspaceId: WorkspaceId): Promise<Result<void, ProjectDomainError>> {
			return Result
				.mapErr(
					await this.checkMembership(userId, workspaceId),
					err => isCannotAccessProjectError(err)
						? createCannotDeleteProjectError(userId)
						: err
					);
    }

    async canModifyProject(userId: UserId, workspaceId: WorkspaceId): Promise<Result<void, ProjectDomainError>> {
			return Result
				.mapErr(
					await this.checkMembership(userId, workspaceId),
					err => isCannotAccessProjectError(err)
						? createCannotModifyProjectError(userId)
						: err
					);
    }

    async canViewProject(userId: UserId, workspaceId: WorkspaceId): Promise<Result<void, ProjectDomainError>> {
			return Result
				.mapErr(
					await this.checkMembership(userId, workspaceId),
					err => isCannotAccessProjectError(err)
						? createCannotViewProjectError(userId)
						: err
					);
    }
}
