import { type } from 'arktype';
import { ProjectIdSchema, type ProjectId } from '../value-objects/id';
import { ProjectNameSchema, type ProjectName } from '../value-objects/name';
import { WorkspaceIdSchema, type WorkspaceId } from '../value-objects/workspace-id';
import { TimestampSchema, VersionSchema, type Timestamp } from '@backend/libs/primitives';
import { createVersion, incVersion } from '@backend/libs/version';

export const ProjectSchema = type({
  id: ProjectIdSchema,
  name: ProjectNameSchema,
  workspaceId: WorkspaceIdSchema,
	createdAt: TimestampSchema,
	updatedAt: TimestampSchema,
  deletedAt: TimestampSchema.optional(),
  version: VersionSchema
})

export type Project = typeof ProjectSchema.infer

export function createProject(
  id: ProjectId,
  name: ProjectName,
  workspaceId: WorkspaceId,
  now: Timestamp,
): Project {
  return {
    id,
    name,
    workspaceId,
    createdAt: now,
    updatedAt: now,
    version: createVersion(),
  };
}

export function rename(
  project: Project,
  name: ProjectName,
  now: Timestamp
): Project {
  if (project.name === name) {
    return project;
  }

  return { ...project, name, updatedAt: now, version: incVersion(project.version) };
}

export function deleteProject(project: Project, now: Timestamp): Project {
  return { ...project, deletedAt: now, version: incVersion(project.version) };
}
