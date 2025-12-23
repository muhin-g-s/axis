import { eq } from 'drizzle-orm';
import { Result } from '@backend/libs/result';
import type { DbClient } from '@backend/app/db/connector';
import { workspacePriorities } from '@backend/app/db/schema/tables/workspace-priorities';

import { PrioritySchema, type Priority } from '../../domain/entities/priority';
import type { PriorityId } from '../../domain/value-objects/priority-id';
import type { WorkspaceId } from '../../domain/value-objects/workspace-id';
import type { IPriorityRepository } from '../../domain/repositories/priority';

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

export class DrizzlePriorityRepository implements IPriorityRepository {

  constructor(
    private readonly db: DbClient
  ) {}

  async create(
    priority: Priority
  ): Promise<Result<void, WorkspaceConfigurationDomainError>> {
    try {
      await this.db.insert(workspacePriorities).values({
        id: priority.id,
        workspaceId: priority.workspaceId,
        name: priority.name,
        level: priority.level,
      });

      return Result.ok(undefined);
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }

  async findById(
    id: PriorityId
  ): Promise<Result<Priority, WorkspaceConfigurationDomainError>> {
    try {
      const result = await this.db
        .select()
        .from(workspacePriorities)
        .where(eq(workspacePriorities.id, id))
        .limit(1);

      const [priority] = result;

      if (priority == undefined) {
        return Result.err(createEntityNotFoundError('priority', 'id'));
      }

      const validatedPriority = validate<Priority, InvalidObjectInDatabaseError>(
        PrioritySchema,
        priority,
        msg =>
          createInvalidObjectInDatabaseError(
            priority,
            'PrioritySchema',
            msg
          )
      );

      return validatedPriority;
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }

  async findByWorkspaceId(
    workspaceId: WorkspaceId
  ): Promise<Result<Priority[], WorkspaceConfigurationDomainError>> {
    try {
      const result = await this.db
        .select()
        .from(workspacePriorities)
        .where(eq(workspacePriorities.workspaceId, workspaceId));

      for (const priority of result) {
        const validatedPriority = validate<Priority, InvalidObjectInDatabaseError>(
          PrioritySchema,
          priority,
          msg =>
            createInvalidObjectInDatabaseError(
              priority,
              'PrioritySchema',
              msg
            )
        );

        if (!validatedPriority.ok) {
          return Result.err(validatedPriority.error);
        }
      }

      return Result.ok(result as Priority[]);
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }
}
