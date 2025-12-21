import type { Version } from '@backend/libs/primitives';
import type { Result } from '@backend/libs/result';
import type { Project } from '../entities';
import type { ProjectId } from '../value-objects/id';
import type { ProjectDomainError } from '../errors';

export interface ProjectWriteRepository {
  save(project: Project, expectedVersion: Version): Promise<Result<void, ProjectDomainError>>;

  delete(id: ProjectId): Promise<Result<void, ProjectDomainError>>;
}
