import { NonEmptyStringSchema } from "@backend/libs/primitives";
import type { Result } from "@backend/libs/result";
import { validate } from "@backend/libs/validation";
import { createInvalidIssueDescriptionError, type InvalidIssueDescriptionError } from "../errors";

export const IssueDescriptionSchema = NonEmptyStringSchema

export type IssueDescription = typeof IssueDescriptionSchema.infer;

export function issueDescriptionFromString(description: string): Result<IssueDescription, InvalidIssueDescriptionError> {
	return validate<IssueDescription, InvalidIssueDescriptionError>(
		IssueDescriptionSchema,
		description,
		() => createInvalidIssueDescriptionError(description)
	);
}
