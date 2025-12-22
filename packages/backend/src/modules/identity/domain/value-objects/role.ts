import { type } from 'arktype';
import { validate } from '@backend/libs/validation';
import { type Result } from '@backend/libs/result';
import { createInvalidRoleError, type InvalidRoleError } from '../errors';

export const UserRole = {
  Member : 'member',
  Admin : 'admin',
} as const ;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const RoleSchema = type("'member' | 'admin'");

export function createRole(
  role: string
): Result<UserRole, InvalidRoleError> {
  return validate<UserRole, InvalidRoleError>(
    RoleSchema,
    role,
    msg => createInvalidRoleError(role, msg)
  );
}


export function isMember(role: UserRole): boolean {
	return role === 'member';
}

export function isAdmin(role: UserRole): boolean {
	return role === 'admin';
}
