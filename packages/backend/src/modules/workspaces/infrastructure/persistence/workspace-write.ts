import { eq } from 'drizzle-orm';
import { Result } from '@backend/libs/result';
import type { DbClient } from '@backend/app/db/connector';
import { workspaces, workspaceUsers } from '@backend/app/db/schema';

import type { Workspace } from '../../domain/entities/workspace';
import type { WorkspaceId } from '../../domain/value-objects/workspace-id';
import type { WorkspaceUser } from '../../domain/entities/workspace-user';
import type { WorkspaceWriteRepository } from '../../domain/repositories/write';
import {
  createUnexpectedDatabaseError,
  type WorkspaceDomainError,
} from '../../domain/errors';

export class DrizzleWorkspaceWriteRepository implements WorkspaceWriteRepository {
  constructor(private readonly db: DbClient) {}

  async saveWorkspace(workspace: Workspace): Promise<Result<void, WorkspaceDomainError>> {
		try {
			await this.db
				.insert(workspaces)
				.values({
					id: workspace.id,
					name: workspace.name,
					ownerId: workspace.ownerId,
					createdAt: workspace.createdAt,
					updatedAt: workspace.updatedAt,
					deletedAt: workspace.deletedAt ?? null,
				})
				.onConflictDoUpdate({
					target: workspaces.id,
					set: {
						name: workspace.name,
						ownerId: workspace.ownerId,
						updatedAt: workspace.updatedAt,
						deletedAt: workspace.deletedAt ?? null,
					},
				});

			return Result.ok(undefined);
		} catch (error) {
			return Result.err(createUnexpectedDatabaseError(error));
		}
	}

  async saveWorkspaceUser(workspaceUser: WorkspaceUser): Promise<Result<void, WorkspaceDomainError>> {
		try {
			await this.db
				.insert(workspaceUsers)
				.values({
					workspaceId: workspaceUser.workspaceId,
					userId: workspaceUser.userId,
					role: workspaceUser.role,
				})
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

  async deleteWorkspace(id: WorkspaceId): Promise<Result<void, WorkspaceDomainError>> {
    try {
      await this.db
        .delete(workspaces)
        .where(eq(workspaces.id, id));

      return Result.ok(undefined);
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }
}
