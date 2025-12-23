import { type } from 'arktype';
import { PriorityIdSchema, type PriorityId } from "../value-objects/priority-id";
import { WorkspaceIdSchema, type WorkspaceId } from "../value-objects/workspace-id";
import { PriorityNameSchema, type PriorityName } from "../value-objects/priority-name";
import { PriorityLevelSchema, type PriorityLevel } from "../value-objects/priority-level";

export const PrioritySchema = type({
	id: PriorityIdSchema,
	workspaceId: WorkspaceIdSchema,
	name: PriorityNameSchema,
	level: PriorityLevelSchema,
});

export type Priority = typeof PrioritySchema.infer;

export function createPriority(
  id: PriorityId,
  workspaceId: WorkspaceId,
  name: PriorityName,
  level: PriorityLevel
): Priority {
  return {
    id,
    workspaceId,
    name,
    level,
  };
}
