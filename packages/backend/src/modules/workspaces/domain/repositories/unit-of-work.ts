import type { WorkspaceWriteRepository } from "./write";

export interface UnitOfWork {
  workspaces: WorkspaceWriteRepository;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  run<T>(fn: (uow: this) => Promise<T>): Promise<T>;
}