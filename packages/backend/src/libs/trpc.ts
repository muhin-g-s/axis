import { TRPCError } from "@trpc/server";
import {
	isUnexpectedDatabaseError,
	isUnexpectedError,
	isInvalidObjectInDatabaseError,
	type InvalidObjectInDatabaseError,
	type NotDomainSpecificError,
	type UnexpectedDatabaseError,
	type UnexpectedError,
	isInvalidIdFormatError,
	type InvalidIdFormatError,
} from "./error";
import { match } from "ts-pattern";

export interface Request<Input extends object, Ctx = unknown> {
	ctx: Ctx;
	input: Input;
	signal: AbortSignal | undefined;
	path: string;
}

export function createUnauthorizedErr(): TRPCError {
	return new TRPCError({ code: "UNAUTHORIZED" });
}

export function createUnexpectedErr(msg: string, cause?: unknown): TRPCError {
	return new TRPCError({
		code: 'INTERNAL_SERVER_ERROR',
		message: msg,
		cause: cause
	});
}

export function createTRPCError(code: TRPCError['code'], err: { message: string, reason?: unknown }, causeField?: unknown): TRPCError {
	return new TRPCError({
		code,
		message: err.message,
		cause: causeField ?? err.reason
	});
}

export function createBadRequestError(err: { message: string, reason?: unknown }): TRPCError {
	return createTRPCError('BAD_REQUEST', err);
}

export function createNotFoundError(err: { message: string }, causeField?: unknown): TRPCError {
	return new TRPCError({
		code: 'NOT_FOUND',
		message: err.message,
		cause: causeField
	});
}

export function createConflictError(err: { message: string }, causeField?: unknown): TRPCError {
	return new TRPCError({
		code: 'CONFLICT',
		message: err.message,
		cause: causeField
	});
}

export function createForbiddenError(err: { message: string }, causeField?: unknown): TRPCError {
	return new TRPCError({
		code: 'FORBIDDEN',
		message: err.message,
		cause: causeField
	});
}

export function createUnauthorizedError(err: { message: string }, causeField?: unknown): TRPCError {
	return new TRPCError({
		code: 'UNAUTHORIZED',
		message: err.message,
		cause: causeField
	});
}

export function notDomainErrorToTRPC(err: NotDomainSpecificError): TRPCError {
	return match(err)
		.when(isInvalidObjectInDatabaseError, InvalidObjectInDatabaseErrorToTRPC)
		.when(isUnexpectedDatabaseError, UnexpectedDatabaseErrorToTRPC)
		.when(isUnexpectedError, UnexpectedErrorToTRPC)
		.when(isInvalidIdFormatError, InvalidIdFormatErrorToTRPC)
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

export function InvalidIdFormatErrorToTRPC(err: InvalidIdFormatError): TRPCError {
	return new TRPCError({
		code: 'BAD_REQUEST',
		message: err.message,
		cause: err.reason,
	});
}

function UnexpectedErrorToTRPC(err: UnexpectedError): TRPCError {
	return createUnexpectedErr(err.message, err.error);
}
