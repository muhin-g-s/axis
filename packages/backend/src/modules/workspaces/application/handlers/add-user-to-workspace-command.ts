import type { Timestamp } from "@backend/libs/primitives";
import { Result } from "@backend/libs/result";
import { createNotPermissionToAddNewUseError, createWorkspaceUserAlreadyExistsError, type WorkspaceDomainError } from "../../domain/errors";
import { type WorkspaceUser, canAddNewMember, createWorkspaceUser } from "../../domain/entities/workspace-user";
import type { AddUserToWorkspaceCommand } from "../dto";
import type { WorkspaceReadRepository } from "../../domain/repositories/read";
import type { WorkspaceWriteRepository } from "../../domain/repositories/write";

export class AddUserToWorkspaceHandler {
  constructor(
    private readonly writeRepo: WorkspaceWriteRepository,
    private readonly readRepo: WorkspaceReadRepository,
    private readonly now: () => Timestamp,
  ) {}

  async handle({ newUserId, workspaceId, role, actorUserId}: AddUserToWorkspaceCommand): Promise<Result<WorkspaceUser, WorkspaceDomainError>> {
    const [actorUserResult, existingWorkspaceUserResult] = await Promise.all([
			this.readRepo.findByUserIdAndWorkspaceId(actorUserId, workspaceId),
			this.readRepo.findByUserIdAndWorkspaceId(newUserId, workspaceId),
		]);

		if (!actorUserResult.ok) {
			return actorUserResult;
		}

		const actorUser = actorUserResult.value;

		if (!canAddNewMember(actorUser)) {
			return Result.err(createNotPermissionToAddNewUseError(newUserId, workspaceId));
		}

		if (existingWorkspaceUserResult.ok) {
			return Result.err(createWorkspaceUserAlreadyExistsError(newUserId, workspaceId));
		}

    const now = this.now();
    const workspaceUser = createWorkspaceUser(
      newUserId,
      workspaceId,
      role,
      now
    );

    const saveResult = await this.writeRepo.saveWorkspaceUser(workspaceUser);

    return saveResult.ok
      ? Result.ok(workspaceUser)
      : Result.err(saveResult.error);
  }
}
