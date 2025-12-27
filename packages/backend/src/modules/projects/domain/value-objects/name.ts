import { NonEmptyStringSchema } from "@backend/libs/primitives";
import type { Result } from "@backend/libs/result";
import { createInvalidProjectNameError, type InvalidProjectNameError } from "../errors";
import { validate } from "@backend/libs/validation";

export const ProjectNameSchema = NonEmptyStringSchema

export type ProjectName = typeof ProjectNameSchema.infer;

export function projectNameFromString(name: string): Result<ProjectName, InvalidProjectNameError> {
	return validate<ProjectName, InvalidProjectNameError>(
		ProjectNameSchema,
		name,
		() => createInvalidProjectNameError(name)
	);
}
