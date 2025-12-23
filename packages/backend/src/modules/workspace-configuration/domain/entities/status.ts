import { type } from 'arktype';
import { StatusIdSchema, type StatusId } from "../value-objects/status-id";
import { WorkspaceIdSchema, type WorkspaceId } from "../value-objects/workspace-id";
import { StatusNameSchema, type StatusName } from "../value-objects/status-name";
import { StatusOrderSchema, type StatusOrder } from "../value-objects/status-order";

export const StatusSchema = type({
	id: StatusIdSchema,
	workspaceId: WorkspaceIdSchema,
	name: StatusNameSchema,
	order: StatusOrderSchema,
})

export type Status = typeof StatusSchema.infer;

export function createStatus(
  id: StatusId,
  workspaceId: WorkspaceId,
  name: StatusName,
  order: StatusOrder
): Status {
  return {
    id,
    workspaceId,
    name,
    order,
  };
}
