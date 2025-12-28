import { Result } from '@backend/libs/result';
import type { DbClient } from '@backend/app/db/connector';
import type { IssueUnitOfWork } from '../../domain/repositories';
import type { IssueDomainError } from '../../domain/errors';
import { createUnexpectedDatabaseError } from '@backend/libs/error';
import { DrizzleIssueWriteRepository } from './write';

export class DrizzleIssueUnitOfWork implements IssueUnitOfWork {
  issues!: DrizzleIssueWriteRepository;

  constructor(
    private readonly db: DbClient
  ) {}

  async run<T>(fn: (uow: this) => Promise<Result<T, IssueDomainError>>): Promise<Result<T, IssueDomainError>> {
    try {
      return await this.db.transaction(async (tx) => {
        this.issues = new DrizzleIssueWriteRepository(tx);
        return fn(this);
      });
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }

  async commit(): Promise<void> {
    // commit выполняется автоматически
  }

  rollback(): Promise<void> {
    throw new Error('Rollback is handled by transaction failure');
  }
}
