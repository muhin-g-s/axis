import { and, desc, eq } from 'drizzle-orm';
import { Result } from '@backend/libs/result';
import type { DbClient } from '@backend/app/db/connector';
import { issues } from '@backend/app/db/schema';
import { createInvalidObjectInDatabaseError, createUnexpectedDatabaseError, type InvalidObjectInDatabaseError } from '@backend/libs/error';
import { IssueSchema, type Issue } from '../../domain/entities';
import type { IssueId } from '../../domain/value-objects/id';
import type { IssueReadRepository } from '../../domain/repositories';
import { createIssueNotFoundError, type IssueDomainError } from '../../domain/errors';
import type { LabelId } from '../../domain/value-objects/label-id';
import type { PriorityId } from '../../domain/value-objects/priority-id';
import type { ProjectId } from '../../domain/value-objects/project-id';
import type { StatusId } from '../../domain/value-objects/status-id';
import { validate } from '@backend/libs/validation';

export class DrizzleIssueReadRepository
  implements IssueReadRepository {

  constructor(
    private readonly db: DbClient
  ) {}

	async findLastAddedIssue(
    projectId: ProjectId
  ): Promise<Result<Issue, IssueDomainError>> {
    try {
      const result = await this.db
        .select()
        .from(issues)
        .where(eq(issues.projectId, projectId))
        .orderBy(desc(issues.createdAt))
        .limit(1);

      if (result.length === 0) {
        return Result.err(createIssueNotFoundError(projectId));
      }

      const issueRaw = result[0];
      const validatedIssue = validate<Issue, IssueDomainError>(
        IssueSchema,
        issueRaw,
        (msg) => createUnexpectedDatabaseError(msg)
      );

      return validatedIssue;
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }

  async findById(id: IssueId): Promise<Result<Issue, IssueDomainError>> {
    try {
      const result = await this.db
        .select()
        .from(issues)
        .where(eq(issues.id, id))
        .limit(1);

      if (result.length === 0) {
        return Result.err(createIssueNotFoundError(id));
      }

      const issue = result[0];
			if (issue === undefined) {
				return Result.err(createIssueNotFoundError(id));
			}

			const validatedLabel = validate<Issue, InvalidObjectInDatabaseError>(
				IssueSchema,
				issue,
				msg =>
					createInvalidObjectInDatabaseError(
						issue,
						'IssueSchema',
						msg
					)
			);

      return validatedLabel
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }

  async findByProjectId(projectId: ProjectId): Promise<Result<Issue[], IssueDomainError>> {
    try {
      const results = await this.db
        .select()
        .from(issues)
        .where(eq(issues.projectId, projectId));

			const res: Issue[] = []

			for (const issue of results) {
				const validatedLabel = validate<Issue, InvalidObjectInDatabaseError>(
					IssueSchema,
					issue,
					msg =>
						createInvalidObjectInDatabaseError(
							issue,
							'IssueSchema',
							msg
						)
				);

				if (!validatedLabel.ok) {
					return Result.err(validatedLabel.error);
				}

				res.push(validatedLabel.value)
			}

			return Result.ok(res);
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }

  async findByProjectWithFilters(
		projectId: ProjectId,
		statusId?: StatusId,
		priorityId?: PriorityId,
		labelIds?: LabelId[]
	): Promise<Result<Issue[], IssueDomainError>> {
		try {
			const conditions = [eq(issues.projectId, projectId)];

			if (statusId !== undefined) {
				conditions.push(eq(issues.statusId, statusId));
			}

			if (priorityId !== undefined) {
				conditions.push(eq(issues.priorityId, priorityId));
			}

			if (labelIds?.length === 1) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				conditions.push(eq(issues.labelId, labelIds[0]!));
			}

			const rows = await this.db
				.select()
				.from(issues)
				.where(and(...conditions))
				.orderBy(issues.id);

			const res: Issue[] = [];

			for (const row of rows) {
				const validated = validate<Issue, InvalidObjectInDatabaseError>(
					IssueSchema,
					row,
					msg =>
						createInvalidObjectInDatabaseError(
							row,
							'IssueSchema',
							msg
						)
				);

				if (!validated.ok) {
					return Result.err(validated.error);
				}

				res.push(validated.value);
			}

			if ((labelIds != null) && labelIds.length > 1) {
				return Result.ok(
					res.filter(issue => labelIds.every(l => issue.label === l))
				);
			}

			return Result.ok(res);
		} catch (error) {
			return Result.err(createUnexpectedDatabaseError(error));
		}
	}
}
