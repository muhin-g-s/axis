import { Result } from "@backend/libs/result";
import { type Priority, createPriority } from "../../domain/entities/priority";
import type { CreatePriorityCommand } from "../dto";
import {
  type WorkspaceConfigurationDomainError
} from "../../domain/errors";
import { createPriorityId } from "../../domain/value-objects/priority-id";
import type { IPriorityRepository } from "../../domain/repositories/priority";
import type { IWorkspaceConfigurationPermissionChecker } from "../../domain/services/workspace-configuration-permission-checker";

export class CreatePriorityHandler {
  constructor(
    private readonly writeRepo: IPriorityRepository,
    private readonly permissionChecker: IWorkspaceConfigurationPermissionChecker,
  ) {}

  async handle({ actorUserId, workspaceId, name, level }: CreatePriorityCommand): Promise<Result<Priority, WorkspaceConfigurationDomainError>> {
    const canCreateResult = await this.permissionChecker.canCreate(actorUserId, workspaceId);
    if (!canCreateResult.ok) {
      return canCreateResult;
    }

    const priority = createPriority(
      createPriorityId(),
      workspaceId,
      name,
      level
    );

    const saveResult = await this.writeRepo.create(priority);

    if (!saveResult.ok) {
      return Result.err(saveResult.error);
    }

    return Result.ok(priority);
  }
}
