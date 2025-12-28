import { createId, createIdSchema, fromStringFactory } from "@backend/libs/id";

const brand = 'ProjectId';

type Brand = typeof brand;

export const ProjectIdSchema = createIdSchema(brand);

export type ProjectId = typeof ProjectIdSchema.infer;

export function createProjectId(): ProjectId {
  return createId<Brand>();
}

export const projectIdFromString = fromStringFactory(ProjectIdSchema);
