import { eq } from 'drizzle-orm';
import { Result } from '@backend/libs/result';
import type { DbClient } from '@backend/app/db/connector';
import { workspaceLabels } from '@backend/app/db/schema/tables/workspace-labels';

import { LabelSchema, type Label } from '../../domain/entities/label';
import type { LabelId } from '../../domain/value-objects/label-id';
import type { WorkspaceId } from '../../domain/value-objects/workspace-id';
import type { ILabelRepository } from '../../domain/repositories/label';

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

export class DrizzleLabelRepository implements ILabelRepository {

  constructor(
    private readonly db: DbClient
  ) {}

  async create(label: Label): Promise<Result<void, WorkspaceConfigurationDomainError>> {
    try {
      await this.db.insert(workspaceLabels).values({
        id: label.id,
        workspaceId: label.workspaceId,
        name: label.name,
      });

      return Result.ok(undefined);
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }

  async findById(
    id: LabelId
  ): Promise<Result<Label, WorkspaceConfigurationDomainError>> {
    try {
      const result = await this.db
        .select()
        .from(workspaceLabels)
        .where(eq(workspaceLabels.id, id))
        .limit(1);

      const [label] = result;

      if (label == undefined) {
        return Result.err(createEntityNotFoundError("label", "id"));
      }

      const validatedLabel = validate<Label, InvalidObjectInDatabaseError>(
        LabelSchema,
        label,
        msg =>
          createInvalidObjectInDatabaseError(
            label,
            'LabelSchema',
            msg
          )
      );

      return validatedLabel;
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }

  async findByWorkspaceId(
    workspaceId: WorkspaceId
  ): Promise<Result<Label[], WorkspaceConfigurationDomainError>> {
    try {
      const result = await this.db
        .select()
        .from(workspaceLabels)
        .where(eq(workspaceLabels.workspaceId, workspaceId));

      for (const label of result) {
        const validatedLabel = validate<Label, InvalidObjectInDatabaseError>(
          LabelSchema,
          label,
          msg =>
            createInvalidObjectInDatabaseError(
              label,
              'LabelSchema',
              msg
            )
        );

        if (!validatedLabel.ok) {
          return Result.err(validatedLabel.error);
        }
      }

      return Result.ok(result as Label[]);
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }
}
