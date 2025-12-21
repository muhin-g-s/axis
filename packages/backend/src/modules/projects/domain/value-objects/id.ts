import { createId, createIdSchema } from "@backend/libs/id";

const brand = 'ProjectId';

type Brand = typeof brand;

export const ProjectIdSchema = createIdSchema(brand);

export type ProjectId = typeof ProjectIdSchema.infer;

export function createProjectId(): ProjectId {
  return createId<Brand>();
}