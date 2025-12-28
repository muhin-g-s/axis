import { eq } from 'drizzle-orm';
import { Result } from '@backend/libs/result';
import type { DbClient } from '@backend/app/db/connector';
import { issues } from '@backend/app/db/schema';

import type { Issue } from '../../domain/entities';
import type { IssueId } from '../../domain/value-objects/id';
import type { IssueWriteRepository } from '../../domain/repositories';
import { type IssueDomainError } from '../../domain/errors';
import { createUnexpectedDatabaseError } from '@backend/libs/error';

export class DrizzleIssueWriteRepository implements IssueWriteRepository {
  constructor(private readonly db: DbClient) {}

  async save(issue: Issue): Promise<Result<void, IssueDomainError>> {
		try {
			await this.db
				.update(issues)
				.set({
					projectId: issue.projectId,
					title: issue.title,
					description: issue.description,
					statusId: issue.statusId ?? null,
					priorityId: issue.priorityId ?? null,
					assigneeId: issue.assigneeId ?? null,
					uniqueIdentifier: issue.uniqueIdentifier,
					updatedAt: issue.updatedAt,
					deletedAt: issue.deletedAt ?? null,
				})
				.where(eq(issues.id, issue.id));

			return Result.ok(undefined);
		} catch (error) {
			return Result.err(createUnexpectedDatabaseError(error));
		}
	}

  async delete(id: IssueId): Promise<Result<void, IssueDomainError>> {
    try {
      // TODO: add soft delete
      await this.db.delete(issues).where(eq(issues.id, id));
      return Result.ok(undefined);
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }
}
