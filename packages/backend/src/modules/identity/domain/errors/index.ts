import type { DomainError } from "@backend/libs/error";

interface BaseUserError {
  readonly message: string;
}

export interface UserNotFoundError extends BaseUserError {
  readonly type: 'USER_NOT_FOUND';
  readonly email?: string;
}

export interface InvalidEmailError extends BaseUserError {
	readonly type: 'INVALID_EMAIL';
	readonly email: string;
	readonly reason: string;
}

export interface InvalidCredentialsError extends BaseUserError {
  readonly type: 'INVALID_CREDENTIALS';
}

export interface UserAlreadyExistsError extends BaseUserError {
  readonly type: 'USER_ALREADY_EXISTS';
  readonly identifier: string;
}

export interface InvalidPasswordError extends BaseUserError {
	readonly type: 'INVALID_PASSWORD';
	readonly invalidPassword: string;
	readonly reason: string;
}

export interface InvalidUsernameError extends BaseUserError {
	readonly type: 'INVALID_USERNAME';
	readonly username: string;
	readonly reason: string;
}

export interface UserHasBeenDeletedError extends BaseUserError {
	readonly type: 'USER_HAS_BEEN_DELETED';
	readonly email: string;
}

export type IdentityDomainError = DomainError<
	| UserNotFoundError
  | InvalidCredentialsError
  | UserAlreadyExistsError
	| InvalidEmailError
	| InvalidPasswordError
	| InvalidUsernameError
	| UserHasBeenDeletedError
>

export const createUserNotFoundError = (
  email?: string
): UserNotFoundError => ({
  type: 'USER_NOT_FOUND',
  message: email !== undefined
    ? `User with email ${email} not found`
    : 'User not found',
  ...(email !== undefined ? { email } : {}),
});

export const createInvalidCredentialsError = (): InvalidCredentialsError => ({
  type: 'INVALID_CREDENTIALS',
  message: 'Invalid credentials',
});

export const createUserAlreadyExistsError = (
  identifier: string
): UserAlreadyExistsError => ({
  type: 'USER_ALREADY_EXISTS',
  message: `User with identifier ${identifier} already exists`,
  identifier,
});

export const createInvalidEmailError = (email: string, reason: string): InvalidEmailError => ({
	type: 'INVALID_EMAIL',
	message: `Invalid email ${email}`,
	email,
	reason
});

export const createInvalidPasswordError = (invalidPassword: string, reason: string): InvalidPasswordError => ({
	type: 'INVALID_PASSWORD',
	message: `Invalid password ${invalidPassword}`,
	invalidPassword,
	reason
});

export const createInvalidUsernameError = (username: string, reason: string): InvalidUsernameError => ({
	type: 'INVALID_USERNAME',
	message: `Invalid username ${username}`,
	username,
	reason
});

export const createUserHasBeenDeletedError = (email: string): UserHasBeenDeletedError => ({
	type: 'USER_HAS_BEEN_DELETED',
	message: `User with email ${email} has been deleted`,
	email,
});

export const isUserNotFoundError = (
  error: IdentityDomainError
): error is UserNotFoundError =>
  error.type === 'USER_NOT_FOUND';

export const isInvalidCredentialsError = (
  error: IdentityDomainError
): error is InvalidCredentialsError =>
  error.type === 'INVALID_CREDENTIALS';

export const isUserAlreadyExistsError = (
  error: IdentityDomainError
): error is UserAlreadyExistsError =>
  error.type === 'USER_ALREADY_EXISTS';

export const isInvalidEmailError = (
	error: IdentityDomainError
): error is InvalidEmailError => error.type === 'INVALID_EMAIL';

export const isInvalidPasswordError = (
	error: IdentityDomainError
): error is InvalidPasswordError => error.type === 'INVALID_PASSWORD';

export const isInvalidUsernameError = (
	error: IdentityDomainError
): error is InvalidUsernameError => error.type === 'INVALID_USERNAME';

export const isUserHasBeenDeletedError = (
	error: IdentityDomainError
): error is UserHasBeenDeletedError => error.type === 'USER_HAS_BEEN_DELETED';
