import type { Timestamp } from "@backend/libs/primitives";
import { Result } from "@backend/libs/result";
import { createWorkspaceUserAlreadyExistsError, type IdentityDomainError } from "../../domain/errors";
import { type WorkspaceUser, createWorkspaceUser } from "../../domain/entities/workspace-user";
import type { WorkspaceUserReadRepository } from "../../domain/repositories/workspace-user-read";
import type { WorkspaceUserWriteRepository } from "../../domain/repositories/workspace-user-write";
import type { AddUserToWorkspaceCommand } from "../dto";


export class AddUserToWorkspaceHandler {
  constructor(
    private readonly writeRepo: WorkspaceUserWriteRepository,
    private readonly readRepo: WorkspaceUserReadRepository,
    private readonly now: () => Timestamp,
  ) {}

  async handle({ userId, workspaceId, role}: AddUserToWorkspaceCommand): Promise<Result<WorkspaceUser, IdentityDomainError>> {
    const existingWorkspaceUser = await this.readRepo.findByUserIdAndWorkspaceId(userId, workspaceId);
    if (existingWorkspaceUser.ok) {
      return Result.err(createWorkspaceUserAlreadyExistsError(userId, workspaceId));
    }

    const now = this.now();
    const workspaceUser = createWorkspaceUser(
      userId,
      workspaceId,
      role,
      now
    );

    const saveResult = await this.writeRepo.save(workspaceUser);

    return saveResult.ok
      ? Result.ok(workspaceUser)
      : Result.err(saveResult.error);
  }
}
