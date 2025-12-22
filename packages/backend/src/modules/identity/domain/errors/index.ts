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

export interface WorkspaceUserAlreadyExistsError extends BaseUserError {
  readonly type: 'WORKSPACE_USER_ALREADY_EXISTS';
  readonly userId: string;
  readonly workspaceId: string;
}

export interface InvalidPasswordError extends BaseUserError {
	readonly type: 'INVALID_PASSWORD';
	readonly invalidPassword: string;
	readonly reason: string;
}

export interface InvalidRoleError extends BaseUserError {
	readonly type: 'INVALID_ROLE';
	readonly role: string;
	readonly reason: string;
}

export interface InvalidUsernameError extends BaseUserError {
	readonly type: 'INVALID_USERNAME';
	readonly username: string;
	readonly reason: string;
}

export interface InvalidObjectInDatabaseError extends BaseUserError {
	readonly type: 'INVALID_OBJECT_IN_DATABASE';
	readonly object: unknown;
	readonly schemaName: string;
	readonly reason: string;
}

export interface UnexpectedDatabaseError extends BaseUserError {
	readonly type: 'UNEXPECTED_DATABASE_ERROR';
	readonly error: unknown;
}

export type IdentityDomainError =
  | UserNotFoundError
  | InvalidCredentialsError
  | UserAlreadyExistsError
  | WorkspaceUserAlreadyExistsError
	| InvalidEmailError
	| InvalidPasswordError
	| InvalidRoleError
	| InvalidUsernameError
	| InvalidObjectInDatabaseError
	| UnexpectedDatabaseError;

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

export const createWorkspaceUserAlreadyExistsError = (
  userId: string,
  workspaceId: string
): WorkspaceUserAlreadyExistsError => ({
  type: 'WORKSPACE_USER_ALREADY_EXISTS',
  message: `User ${userId} is already added to workspace ${workspaceId}`,
  userId,
  workspaceId,
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

export const createInvalidRoleError = (role: string, reason: string): InvalidRoleError => ({
	type: 'INVALID_ROLE',
	message: `Invalid role ${role}`,
	role,
	reason
});

export const createInvalidUsernameError = (username: string, reason: string): InvalidUsernameError => ({
	type: 'INVALID_USERNAME',
	message: `Invalid username ${username}`,
	username,
	reason
});

export const createInvalidObjectInDatabaseError = (object: unknown, schemaName: string, reason: string): InvalidObjectInDatabaseError => ({
	type: 'INVALID_OBJECT_IN_DATABASE',
	message: `Invalid object in database: ${JSON.stringify(object)}, schema: ${schemaName}`,
	object,
	schemaName,
	reason
});

export const createUnexpectedDatabaseError = (error: unknown): UnexpectedDatabaseError => ({
	type: 'UNEXPECTED_DATABASE_ERROR',
	message: 'Unexpected database error',
	error,
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

export const isWorkspaceUserAlreadyExistsError = (
  error: IdentityDomainError
): error is WorkspaceUserAlreadyExistsError =>
  error.type === 'WORKSPACE_USER_ALREADY_EXISTS';

export const isInvalidEmailError = (
	error: IdentityDomainError
): error is InvalidEmailError => error.type === 'INVALID_EMAIL';

export const isInvalidPasswordError = (
	error: IdentityDomainError
): error is InvalidPasswordError => error.type === 'INVALID_PASSWORD';

export const isInvalidRoleError = (
	error: IdentityDomainError
): error is InvalidRoleError => error.type === 'INVALID_ROLE';

export const isInvalidUsernameError = (
	error: IdentityDomainError
): error is InvalidUsernameError => error.type === 'INVALID_USERNAME';

export const isInvalidObjectInDatabaseError = (
	error: IdentityDomainError
): error is InvalidObjectInDatabaseError => error.type === 'INVALID_OBJECT_IN_DATABASE';

export const isUnexpectedDatabaseError = (
	error: IdentityDomainError
): error is UnexpectedDatabaseError =>
	error.type === 'UNEXPECTED_DATABASE_ERROR';
