import type { Result } from "@backend/libs/result";
import { validate } from "@backend/libs/validation";
import { createInvalidIssueTitleError, type InvalidIssueTitleError } from "../errors";
import { type } from "arktype";

const NonNegativeIntSchema = type('number.integer >= 0');

export const UniqueIdentifierSchema = type(`"issue-${NonNegativeIntSchema.infer}"`);

export type UniqueIdentifier = typeof UniqueIdentifierSchema.infer;

export function uniqueIdentifierFromString(identifier: string): Result<UniqueIdentifier, InvalidIssueTitleError> {
	return validate<UniqueIdentifier, InvalidIssueTitleError>(
		UniqueIdentifierSchema,
		identifier,
		() => createInvalidIssueTitleError(identifier)
	);
}

export function createFirstUniqueIdentifier(): UniqueIdentifier {
	return `issue-0`;
}

export function createNextUniqueIdentifier(prevent: UniqueIdentifier): UniqueIdentifier {
	const [_, number] = prevent.split('-');
	return `issue-${Number(number) + 1}`;
}
