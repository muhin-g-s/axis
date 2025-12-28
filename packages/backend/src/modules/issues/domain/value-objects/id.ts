import { createId, createIdSchema, fromStringFactory } from "@backend/libs/id";

const brand = 'IssueId';

type Brand = typeof brand;

export const IssueIdSchema = createIdSchema(brand);

export type IssueId = typeof IssueIdSchema.infer;

export function createIssueId(): IssueId {
  return createId<Brand>();
}

export const issueIdFromString = fromStringFactory(IssueIdSchema);
