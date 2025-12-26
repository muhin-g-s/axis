import { NonEmptyStringSchema } from '@backend/libs/primitives';
import type { Result } from '@backend/libs/result';
import { createInvalidWorkspaceNameError, type InvalidWorkspaceNameError } from '../errors';
import { validate } from '@backend/libs/validation';

export const WorkspaceNameSchema = NonEmptyStringSchema;

export type WorkspaceName = typeof WorkspaceNameSchema.infer;

export function workspaceNameFromString(name: string): Result<WorkspaceName, InvalidWorkspaceNameError> {
	return validate<WorkspaceName, InvalidWorkspaceNameError>(
		WorkspaceNameSchema,
		name,
		msg => createInvalidWorkspaceNameError(name, msg)
	);
}
