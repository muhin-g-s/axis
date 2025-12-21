import type { Project } from '../entities';
import type { ProjectId } from '../value-objects/id';
import type { WorkspaceId } from '../value-objects/workspace-id';

export interface ProjectReadRepository {
  findById(id: ProjectId): Promise<Project | null>;
	findAllByWorkspace(id: WorkspaceId): Promise<Project[]>
}
