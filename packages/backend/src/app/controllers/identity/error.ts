import { isNotDomainSpecificError } from "@backend/libs/error";
import { notDomainErrorToTRPC } from "@backend/libs/trpc";
import {
	isInvalidCredentialsError,
	isInvalidEmailError,
	isInvalidPasswordError,
	isInvalidUsernameError,
	isUserAlreadyExistsError,
	isUserHasBeenDeletedError,
	isUserNotFoundError,
	type IdentityDomainError,
	type InvalidCredentialsError,
	type InvalidEmailError,
	type InvalidPasswordError,
	type InvalidUsernameError,
	type UserAlreadyExistsError,
	type UserHasBeenDeletedError,
	type UserNotFoundError,
} from "@backend/modules/identity/domain/errors";
import { TRPCError } from "@trpc/server";
import { match } from "ts-pattern";

export function mapErr(err: IdentityDomainError): TRPCError {
	return match(err)
		.when(isInvalidEmailError, InvalidEmailErrorToTRPC)
		.when(isInvalidPasswordError, InvalidPasswordErrorToTRPC)
		.when(isUserNotFoundError, UserNotFoundErrorToTRPC)
		.when(isInvalidCredentialsError, InvalidCredentialsErrorToTRPC)
		.when(isUserAlreadyExistsError, UserAlreadyExistsErrorToTRPC)
		.when(isUserHasBeenDeletedError, UserHasBeenDeletedErrorToTRPC)
		.when(isInvalidUsernameError, InvalidUsernameErrorToTRPC)
		.when(isNotDomainSpecificError, notDomainErrorToTRPC)
		.exhaustive();
}

export function InvalidEmailErrorToTRPC(err: InvalidEmailError): TRPCError {
	return new TRPCError({
		code: 'BAD_REQUEST',
		message: err.message,
		cause: err.reason,
	});
}

export function InvalidPasswordErrorToTRPC(err: InvalidPasswordError): TRPCError {
	return new TRPCError({
		code: 'BAD_REQUEST',
		message: err.message,
		cause: err.reason,
	});
}

function UserNotFoundErrorToTRPC(err: UserNotFoundError): TRPCError {
	return new TRPCError({
		code: 'NOT_FOUND',
		message: err.message,
		cause: err.email,
	});
}

function InvalidCredentialsErrorToTRPC(
	err: InvalidCredentialsError,
): TRPCError {
	return new TRPCError({
		code: 'UNAUTHORIZED',
		message: err.message,
	});
}

function UserAlreadyExistsErrorToTRPC(
	err: UserAlreadyExistsError,
): TRPCError {
	return new TRPCError({
		code: 'CONFLICT',
		message: err.message,
		cause: err.identifier,
	});
}

export function InvalidUsernameErrorToTRPC(
	err: InvalidUsernameError,
): TRPCError {
	return new TRPCError({
		code: 'BAD_REQUEST',
		message: err.message,
		cause: err.reason,
	});
}

function UserHasBeenDeletedErrorToTRPC(
	err: UserHasBeenDeletedError,
): TRPCError {
	return new TRPCError({
		code: 'CONFLICT',
		message: err.message,
		cause: err.email,
	});
}
