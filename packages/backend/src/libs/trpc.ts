import { TRPCError } from "@trpc/server";
import {
	isUnexpectedDatabaseError,
	isUnexpectedError,
	isInvalidObjectInDatabaseError,
	type InvalidObjectInDatabaseError,
	type NotDomainSpecificError,
	type UnexpectedDatabaseError,
	type UnexpectedError,
} from "./error";
import { match } from "ts-pattern";

export interface Request<Input extends Record<string, unknown>, Ctx = unknown> {
	ctx: Ctx;
	input: Input;
	signal: AbortSignal | undefined;
	path: string;
}

export function notDomainErrorToTRPC(err: NotDomainSpecificError): TRPCError {
	return match(err)
		.when(isInvalidObjectInDatabaseError, InvalidObjectInDatabaseErrorToTRPC)
		.when(isUnexpectedDatabaseError, UnexpectedDatabaseErrorToTRPC)
		.when(isUnexpectedError, UnexpectedErrorToTRPC)
		.exhaustive();
}

function InvalidObjectInDatabaseErrorToTRPC(
	err: InvalidObjectInDatabaseError,
): TRPCError {
	return new TRPCError({
		code: 'INTERNAL_SERVER_ERROR',
		message: err.message,
		cause: {
			schemaName: err.schemaName,
			reason: err.reason,
			object: err.object,
		},
	});
}

function UnexpectedDatabaseErrorToTRPC(
	err: UnexpectedDatabaseError,
): TRPCError {
	return new TRPCError({
		code: 'INTERNAL_SERVER_ERROR',
		message: err.message,
		cause: err.error,
	});
}

function UnexpectedErrorToTRPC(err: UnexpectedError): TRPCError {
	return new TRPCError({
		code: 'INTERNAL_SERVER_ERROR',
		message: err.message,
		cause: err.error,
	});
}
