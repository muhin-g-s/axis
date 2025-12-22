import { type } from 'arktype';
import { validate } from '@backend/libs/validation';
import { type Result } from '@backend/libs/result';
import { createInvalidPasswordError, type InvalidPasswordError } from '../errors';

export const PasswordSchema = type('string')
  .narrow((s, ctx) => {
    if (s.length < 6) {
      ctx.mustBe('at least 6 characters long');
      return false;
    }
    if (s.length > 128) {
      ctx.mustBe('no more than 128 characters long');
      return false;
    }
    return true;
  })
  .brand('password');

export const PasswordHashSchema = type('string').brand('passwordHash');

export type Password = typeof PasswordSchema.infer;
export type PasswordHash = typeof PasswordHashSchema.infer;

export function createPassword(
  value: string
): Result<Password, InvalidPasswordError> {
  return validate<Password, InvalidPasswordError>(
    PasswordSchema,
    value,
    msg => createInvalidPasswordError(value, msg)
  );
}

export function createPasswordFromHash(hash: string): PasswordHash {
  return hash as PasswordHash;
}

export function passwordEquals(a: Password, b: Password): boolean {
  return a === b;
}

export function passwordHashEquals(a: PasswordHash, b: PasswordHash): boolean {
  return a === b;
}
