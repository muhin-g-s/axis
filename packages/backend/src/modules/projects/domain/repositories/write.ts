import type { Version } from '@backend/libs/primitives';
import type { Project } from '../entities';
import type { ProjectId } from '../value-objects/id';

export interface ProjectWriteRepository {
  save(project: Project, expectedVersion: Version): Promise<void>;

  delete(id: ProjectId): Promise<void>;
}
