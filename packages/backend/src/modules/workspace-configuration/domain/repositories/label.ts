import type { Result } from '@backend/libs/result';
import type { Label } from '../entities/label';
import type { LabelId } from '../value-objects/label-id';
import type { WorkspaceId } from '../value-objects/workspace-id';
import type { WorkspaceConfigurationDomainError } from '../errors';

export interface ILabelRepository {
  create(label: Label): Promise<Result<void, WorkspaceConfigurationDomainError>>;

  findById(id: LabelId): Promise<Result<Label, WorkspaceConfigurationDomainError>>;

  findByWorkspaceId(workspaceId: WorkspaceId): Promise<Result<Label[], WorkspaceConfigurationDomainError>>;
}
