import { isNotDomainSpecificError } from "@backend/libs/error";
import {
  notDomainErrorToTRPC,
  createBadRequestError,
  createNotFoundError,
  createConflictError,
  createUnauthorizedError
} from "@backend/libs/trpc";
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
import type { TRPCError } from "@trpc/server";
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
	return createBadRequestError(err);
}

export function InvalidPasswordErrorToTRPC(err: InvalidPasswordError): TRPCError {
	return createBadRequestError(err);
}

function UserNotFoundErrorToTRPC(err: UserNotFoundError): TRPCError {
	return createNotFoundError(err, err.email);
}

function InvalidCredentialsErrorToTRPC(
	err: InvalidCredentialsError,
): TRPCError {
	return createUnauthorizedError(err);
}

function UserAlreadyExistsErrorToTRPC(
	err: UserAlreadyExistsError,
): TRPCError {
	return createConflictError(err, err.identifier);
}

export function InvalidUsernameErrorToTRPC(
	err: InvalidUsernameError,
): TRPCError {
	return createBadRequestError(err);
}

function UserHasBeenDeletedErrorToTRPC(
	err: UserHasBeenDeletedError,
): TRPCError {
	return createConflictError(err, err.email);
}
