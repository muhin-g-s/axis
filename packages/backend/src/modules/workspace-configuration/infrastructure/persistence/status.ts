import { eq } from 'drizzle-orm';
import { Result } from '@backend/libs/result';
import type { DbClient } from '@backend/app/db/connector';
import { workspaceStatuses } from '@backend/app/db/schema/tables/workspace-statuses';

import { StatusSchema, type Status } from '../../domain/entities/status';
import type { StatusId } from '../../domain/value-objects/status-id';
import type { WorkspaceId } from '../../domain/value-objects/workspace-id';
import type { IStatusRepository } from '../../domain/repositories/status';

import {
  createEntityNotFoundError,
  type WorkspaceConfigurationDomainError,
} from '../../domain/errors';

import {
  createInvalidObjectInDatabaseError,
  createUnexpectedDatabaseError,
  type InvalidObjectInDatabaseError,
} from '@backend/libs/error';

import { validate } from '@backend/libs/validation';

export class DrizzleStatusRepository implements IStatusRepository {

  constructor(
    private readonly db: DbClient
  ) {}

  async create(
    status: Status
  ): Promise<Result<void, WorkspaceConfigurationDomainError>> {
    try {
      await this.db.insert(workspaceStatuses).values({
        id: status.id,
        workspaceId: status.workspaceId,
        name: status.name,
        order: status.order,
      });

      return Result.ok(undefined);
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }

  async findById(
    id: StatusId
  ): Promise<Result<Status, WorkspaceConfigurationDomainError>> {
    try {
      const result = await this.db
        .select()
        .from(workspaceStatuses)
        .where(eq(workspaceStatuses.id, id))
        .limit(1);

      const [status] = result;

      if (status == undefined) {
        return Result.err(createEntityNotFoundError('status', 'id'));
      }

      const validatedStatus = validate<Status, InvalidObjectInDatabaseError>(
        StatusSchema,
        status,
        msg =>
          createInvalidObjectInDatabaseError(
            status,
            'StatusSchema',
            msg
          )
      );

      return validatedStatus;
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }

  async findByWorkspaceId(
    workspaceId: WorkspaceId
  ): Promise<Result<Status[], WorkspaceConfigurationDomainError>> {
    try {
      const result = await this.db
        .select()
        .from(workspaceStatuses)
        .where(eq(workspaceStatuses.workspaceId, workspaceId));

      for (const status of result) {
        const validatedStatus = validate<Status, InvalidObjectInDatabaseError>(
          StatusSchema,
          status,
          msg =>
            createInvalidObjectInDatabaseError(
              status,
              'StatusSchema',
              msg
            )
        );

        if (!validatedStatus.ok) {
          return Result.err(validatedStatus.error);
        }
      }

      return Result.ok(result as Status[]);
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }
}
