import { NonEmptyStringSchema } from "@backend/libs/primitives";
import type { Result } from "@backend/libs/result";
import { validate } from "@backend/libs/validation";
import { createInvalidIssueTitleError, type InvalidIssueTitleError } from "../errors";

export const IssueTitleSchema = NonEmptyStringSchema

export type IssueTitle = typeof IssueTitleSchema.infer;

export function issueTitleFromString(title: string): Result<IssueTitle, InvalidIssueTitleError> {
	return validate<IssueTitle, InvalidIssueTitleError>(
		IssueTitleSchema,
		title,
		() => createInvalidIssueTitleError(title)
	);
}