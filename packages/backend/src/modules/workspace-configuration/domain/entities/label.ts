import { type } from 'arktype';
import { LabelIdSchema, type LabelId } from "../value-objects/label-id";
import { WorkspaceIdSchema, type WorkspaceId } from "../value-objects/workspace-id";
import { LabelNameSchema, type LabelName } from "../value-objects/label-name";

export const LabelSchema = type({
	id: LabelIdSchema,
	workspaceId: WorkspaceIdSchema,
	name: LabelNameSchema,
});

export type Label = typeof LabelSchema.infer;

export function createLabel(
  id: LabelId,
  workspaceId: WorkspaceId,
  name: LabelName
): Label {
  return {
    id,
    workspaceId,
    name,
  };
}
