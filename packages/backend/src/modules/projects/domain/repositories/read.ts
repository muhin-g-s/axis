import { type Result } from '@backend/libs/result';
import type { Project } from '../entities';
import type { ProjectId } from '../value-objects/id';
import type { WorkspaceId } from '../value-objects/workspace-id';
import type { ProjectDomainError } from '../errors';

export interface ProjectReadRepository {
  findById(id: ProjectId): Promise<Result<Project, ProjectDomainError>>;
	findAllByWorkspace(id: WorkspaceId): Promise<Result<Project[], ProjectDomainError>>
}
