import type { DbClient } from '@backend/app/db/connector';
import type { UnitOfWork } from '../../domain/repositories/unit-of-work';
import type { WorkspaceWriteRepository } from '../../domain/repositories/write';
import { DrizzleWorkspaceWriteRepository } from './workspace-write';

export class DrizzleUnitOfWork implements UnitOfWork {
  workspaces!: WorkspaceWriteRepository;

  constructor(
		private readonly db: DbClient,
	) {}

  async run<T>(fn: (uow: this) => Promise<T>): Promise<T> {
    return this.db.transaction(async (tx) => {
      this.workspaces = new DrizzleWorkspaceWriteRepository(tx);

      return fn(this);
    });
  }

  async commit(): Promise<void> {
		// commit выполняется автоматически
  }

  rollback(): Promise<void> {
    throw new Error('Rollback is handled by transaction failure');
  }
}
