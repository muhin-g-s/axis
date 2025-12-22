import { type } from 'arktype';
import { UserIdSchema, type UserId } from '../value-objects/user-id';
import { UsernameSchema, type Username } from '../value-objects/username';
import { EmailSchema, type Email } from '../value-objects/email';
import { PasswordHashSchema, type PasswordHash } from '../value-objects/password';
import { TimestampSchema, VersionSchema, type Timestamp, type Version } from '@backend/libs/primitives';
import { createVersion, incVersion } from '@backend/libs/version';

export const UserSchema = type({
  id: UserIdSchema,
  username: UsernameSchema,
  email: EmailSchema,
  passwordHash: PasswordHashSchema,
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
  deletedAt: TimestampSchema.optional(),
  version: VersionSchema,
});

export type User = typeof UserSchema.infer;

export function createUser(
  id: UserId,
  username: Username,
  email: Email,
  passwordHash: PasswordHash,
  now: Timestamp,
): User {
  return {
    id,
    username,
    email,
    passwordHash,
    createdAt: now,
    updatedAt: now,
    version: createVersion(),
  };
}

export function restoreUser(
  id: UserId,
  username: Username,
  email: Email,
  passwordHash: PasswordHash,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  version: Version,
  deletedAt?: Timestamp,
): User {
  return {
    id,
    username,
    email,
    passwordHash,
    createdAt,
    updatedAt,
    version,
		...(deletedAt !== undefined ? { email } : {}),
  };
}

export function changeUsername(
  user: User,
  username: Username,
  now: Timestamp,
): User {
  if (user.username === username) {
    return user;
  }

  return {
    ...user,
    username,
    updatedAt: now,
    version: incVersion(user.version),
  };
}

export function changeEmail(
  user: User,
  email: Email,
  now: Timestamp,
): User {
  if (user.email === email) {
    return user;
  }

  return {
    ...user,
    email,
    updatedAt: now,
    version: incVersion(user.version),
  };
}

export function changePasswordHash(
  user: User,
  passwordHash: PasswordHash,
  now: Timestamp,
): User {
  if (user.passwordHash === passwordHash) {
    return user;
  }

  return {
    ...user,
    passwordHash,
    updatedAt: now,
    version: incVersion(user.version),
  };
}

export function deleteUser(
  user: User,
  now: Timestamp,
): User {
  if (user.deletedAt !== undefined) {
    return user;
  }

  return {
    ...user,
    deletedAt: now,
    updatedAt: now,
    version: incVersion(user.version),
  };
}
