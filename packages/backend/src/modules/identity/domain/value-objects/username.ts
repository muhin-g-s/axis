import { type } from 'arktype';
import { validate } from '@backend/libs/validation';
import { type Result } from '@backend/libs/result';
import { createInvalidUsernameError, type InvalidUsernameError } from '../errors';

export const UsernameSchema = type('string')
  .narrow((s, ctx) => {
    if (s.length < 3) {
      ctx.mustBe('at least 3 characters long');
      return false;
    }
    if (s.length > 50) {
      ctx.mustBe('no more than 50 characters long');
      return false;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(s)) {
      ctx.mustBe('contain only letters, numbers, hyphens, and underscores');
      return false;
    }
    return true;
  })
  .brand('username');

export type Username = typeof UsernameSchema.infer;

export function createUsername(
  value: string
): Result<Username, InvalidUsernameError> {
  return validate<Username, InvalidUsernameError>(
    UsernameSchema,
    value,
    msg => createInvalidUsernameError(value, msg)
  );
}

