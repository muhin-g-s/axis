import { eq, and } from 'drizzle-orm';
import { Result } from '@backend/libs/result';
import type { DbClient } from '@backend/app/db/connector';
import { WorkspaceUserSchema, type WorkspaceUser } from '../../domain/entities/workspace-user';
import type { WorkspaceUserReadRepository } from '../../domain/repositories/workspace-user-read';
import type { UserId } from '../../domain/value-objects/user-id';
import type { WorkspaceId } from '../../domain/value-objects/workspace-id';
import type { IdentityDomainError, InvalidObjectInDatabaseError } from '../../domain/errors';
import { createInvalidObjectInDatabaseError, createUnexpectedDatabaseError, createWorkspaceUserNotFoundError } from '../../domain/errors';
import { workspaceUsers } from '@backend/app/db/schema';
import { validate } from '@backend/libs/validation';

export class DrizzleWorkspaceUserReadRepository implements WorkspaceUserReadRepository {
  constructor(private readonly db: DbClient) {}

  async findByUserIdAndWorkspaceId(
    userId: UserId,
    workspaceId: WorkspaceId
  ): Promise<Result<WorkspaceUser, IdentityDomainError>> {
    try {
      const workspaceUserRecord = await this.db
        .select()
        .from(workspaceUsers)
        .where(
          and(
            eq(workspaceUsers.userId, userId),
            eq(workspaceUsers.workspaceId, workspaceId)
          )
        )
        .limit(1);

      if (workspaceUserRecord.length === 0) {
        return Result.err(createWorkspaceUserNotFoundError(userId, workspaceId));
      }

			const validatedUser = validate<WorkspaceUser, InvalidObjectInDatabaseError>(
				WorkspaceUserSchema,
				workspaceUserRecord[0],
				msg => createInvalidObjectInDatabaseError(workspaceUserRecord[0], 'WorkspaceUserSchema', msg)
			);

			return validatedUser;
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }
}
