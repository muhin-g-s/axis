import { Result } from "@backend/libs/result";
import {
  createCannotAccessWorkspaceConfigurationError,
  createCannotCreateWorkspaceConfigurationError,
  createCannotModifyWorkspaceConfigurationError,
  createCannotViewWorkspaceConfigurationError,
  isCannotAccessWorkspaceConfigurationError,
  type WorkspaceConfigurationDomainError
} from "../../domain/errors";
import type { IWorkspaceConfigurationPermissionChecker } from "../../domain/services/workspace-configuration-permission-checker";
import type { UserId } from "../../domain/value-objects/user-id";
import type { WorkspaceId } from "../../domain/value-objects/workspace-id";
import type { WorkspaceMembershipChecker } from "@backend/modules/workspaces/domain/ports";

export class WorkspaceConfigurationPermissionChecker
  implements IWorkspaceConfigurationPermissionChecker {

  constructor(
    private readonly membershipChecker: WorkspaceMembershipChecker
  ) {}

  private async checkMembership(
    userId: UserId,
    workspaceId: WorkspaceId
  ): Promise<Result<void, WorkspaceConfigurationDomainError>> {

    const isMemberResult = await this.membershipChecker.isMember(
      userId,
      workspaceId
    );

    if (!isMemberResult.ok) {
      return isMemberResult;
    }

    if (!isMemberResult.value) {
      return Result.err(
        createCannotAccessWorkspaceConfigurationError(userId)
      );
    }

    return Result.ok(undefined);
  }

  async canCreate(
    userId: UserId,
    workspaceId: WorkspaceId
  ): Promise<Result<void, WorkspaceConfigurationDomainError>> {
    return Result.mapErr(
      await this.checkMembership(userId, workspaceId),
      err =>
        isCannotAccessWorkspaceConfigurationError(err)
          ? createCannotCreateWorkspaceConfigurationError(userId)
          : err
    );
  }

  async canModify(
    userId: UserId,
    workspaceId: WorkspaceId
  ): Promise<Result<void, WorkspaceConfigurationDomainError>> {
    return Result.mapErr(
      await this.checkMembership(userId, workspaceId),
      err =>
        isCannotAccessWorkspaceConfigurationError(err)
          ? createCannotModifyWorkspaceConfigurationError(userId)
          : err
    );
  }

  async canView(
    userId: UserId,
    workspaceId: WorkspaceId
  ): Promise<Result<void, WorkspaceConfigurationDomainError>> {
    return Result.mapErr(
      await this.checkMembership(userId, workspaceId),
      err =>
        isCannotAccessWorkspaceConfigurationError(err)
          ? createCannotViewWorkspaceConfigurationError(userId)
          : err
    );
  }
}
