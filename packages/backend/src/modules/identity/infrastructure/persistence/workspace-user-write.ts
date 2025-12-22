import { eq, and } from 'drizzle-orm';
import { Result } from '@backend/libs/result';
import type { DbClient } from '@backend/app/db/connector';
import type { WorkspaceUser } from '../../domain/entities/workspace-user';
import type { WorkspaceUserWriteRepository } from '../../domain/repositories/workspace-user-write';
import type { UserId } from '../../domain/value-objects/user-id';
import type { WorkspaceId } from '../../domain/value-objects/workspace-id';
import type { IdentityDomainError } from '../../domain/errors';
import { createUnexpectedDatabaseError } from '../../domain/errors';
import { workspaceUsers } from '@backend/app/db/schema';

export class DrizzleWorkspaceUserWriteRepository implements WorkspaceUserWriteRepository {
  constructor(private readonly db: DbClient) {}

  async save(workspaceUser: WorkspaceUser): Promise<Result<void, IdentityDomainError>> {
    try {
      await this.db
        .insert(workspaceUsers)
        .values(workspaceUser)
        .onConflictDoUpdate({
          target: [workspaceUsers.workspaceId, workspaceUsers.userId],
          set: {
            role: workspaceUser.role,
          },
        });

      return Result.ok(undefined);
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }

  async delete(userId: UserId, workspaceId: WorkspaceId): Promise<Result<void, IdentityDomainError>> {
    try {
      await this.db
        .delete(workspaceUsers)
        .where(
          and(
            eq(workspaceUsers.userId, userId),
            eq(workspaceUsers.workspaceId, workspaceId)
          )
        );

      return Result.ok(undefined);
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }
}
