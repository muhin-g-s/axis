import type { ProjectWriteRepository } from "./write";

export interface UnitOfWork {
	projects: ProjectWriteRepository;
  commit(): Promise<void>;
  rollback(): Promise<void>;
	run<T>(fn: (uow: this) => Promise<T>): Promise<T>;
}
