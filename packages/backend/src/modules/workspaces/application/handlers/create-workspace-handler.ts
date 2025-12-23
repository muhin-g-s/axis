import { Result } from "@backend/libs/result";
import type { Timestamp } from "@backend/libs/primitives";
import type { CreateWorkspaceCommand } from "../dto";
import { type Workspace, createWorkspace } from "../../domain/entities/workspace";
import { createWorkspaceUser } from "../../domain/entities/workspace-user";
import type { WorkspaceDomainError } from "../../domain/errors";
import type { UnitOfWork } from "../../domain/repositories/unit-of-work";
import { createWorkspaceId } from "../../domain/value-objects/workspace-id";
import { UserRole } from "../../domain/value-objects/role";

export class CreateWorkspaceHandler {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly now: () => Timestamp,
  ) {}

  async handle({ userId, name}: CreateWorkspaceCommand): Promise<Result<Workspace, WorkspaceDomainError>> {
    const timestamp = this.now();

    const workspace = createWorkspace(
      createWorkspaceId(),
      name,
      userId,
      timestamp,
    );

    const workspaceUser = createWorkspaceUser(
			userId,
      workspace.id,
      UserRole.Admin,
      timestamp
    );

    const result = await this.uow.run(async uow => {
     const [workspaceSaveResult, workspaceUserSaveResult] = await Promise.all([
				uow.workspaces.saveWorkspace(workspace),
				uow.workspaces.saveWorkspaceUser(workspaceUser),
			]);

			if (!workspaceSaveResult.ok) {
				return Result.err(workspaceSaveResult.error);
			}

			if (!workspaceUserSaveResult.ok) {
				return Result.err(workspaceUserSaveResult.error);
			}

			return Result.ok(workspace);
    });

    return result;
  }
}
