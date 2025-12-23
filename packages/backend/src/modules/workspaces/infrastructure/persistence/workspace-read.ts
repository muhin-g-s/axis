import type { DbClient } from "@backend/app/db/connector";
import { workspaces, workspaceUsers } from "@backend/app/db/schema";
import { Result } from "@backend/libs/result";
import { createInvalidObjectInDatabaseError, createUnexpectedDatabaseError, type InvalidObjectInDatabaseError } from "@backend/modules/identity/domain/errors";
import { eq } from "drizzle-orm";
import { type Workspace, WorkspaceSchema } from "../../domain/entities/workspace";
import { WorkspaceUserSchema, type WorkspaceUser } from "../../domain/entities/workspace-user";
import type { UserId } from "../../domain/value-objects/user-id";
import type { WorkspaceId } from "../../domain/value-objects/workspace-id";
import { validate } from "@backend/libs/validation";
import { type WorkspaceDomainError, createWorkspaceNotFoundError } from "../../domain/errors";
import type { WorkspaceReadRepository } from "../../domain/repositories/read";

interface WorkspaceUserQueryResult {
	workspaceId: string;
	userId: string;
	role: string;
}

export class DrizzleWorkspaceReadRepository implements WorkspaceReadRepository {
  constructor(private readonly db: DbClient) {}

  async findById(id: WorkspaceId): Promise<Result<Workspace, WorkspaceDomainError>> {
    try {
      const result = await this.db
        .select()
        .from(workspaces)
        .where(eq(workspaces.id, id))
        .limit(1);

      const [workspace] = result;

      if (workspace === undefined) {
        return Result.err(createWorkspaceNotFoundError(id));
      }

      const validatedWorkspace = validate<Workspace, InvalidObjectInDatabaseError>(
        WorkspaceSchema,
        workspace,
        msg => createInvalidObjectInDatabaseError(workspace, 'WorkspaceSchema', msg)
      );

      if (!validatedWorkspace.ok) {
        return Result.err(validatedWorkspace.error);
      }

      return Result.ok(validatedWorkspace.value);
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }

  async findWorkspaceUsersByUserId(userId: UserId): Promise<Result<WorkspaceUser[], WorkspaceDomainError>> {
    try {
      const results = await this.db
        .select()
        .from(workspaceUsers)
        .where(eq(workspaceUsers.userId, userId));

			return this.validateWorkspaceUsers(results);
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }

  async findWorkspaceUsersByWorkspaceId(workspaceId: WorkspaceId): Promise<Result<WorkspaceUser[], WorkspaceDomainError>> {
    try {
      const results = await this.db
        .select()
        .from(workspaceUsers)
        .where(eq(workspaceUsers.workspaceId, workspaceId));

			return this.validateWorkspaceUsers(results);
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }

	private validateWorkspaceUsers(workspaceUsers: WorkspaceUserQueryResult[]): Result<WorkspaceUser[], WorkspaceDomainError> {
		for (const workspaceUser of workspaceUsers) {
				const validatedWorkspaceUser = validate<WorkspaceUser, InvalidObjectInDatabaseError>(
          WorkspaceUserSchema,
          workspaceUser,
          msg => createInvalidObjectInDatabaseError(workspaceUser, 'WorkspaceUserSchema', msg)
        );

        if (!validatedWorkspaceUser.ok) {
          return Result.err(validatedWorkspaceUser.error);
        }
			}

		return Result.ok(workspaceUsers as WorkspaceUser[]);
	}
}
