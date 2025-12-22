import { type } from 'arktype';
import { validate } from '@backend/libs/validation';
import { type Result } from '@backend/libs/result';
import { createInvalidEmailError, type InvalidEmailError } from '../errors';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const EmailSchema = type('string')
.narrow((s, ctx) => {
  if (!emailRegex.test(s)) {
    ctx.mustBe('a valid email address');
    return false;
  }
  if (s.length > 255) {
    ctx.mustBe('less than 255 characters');
    return false;
  }
  return true;
})
.brand('email');

export type Email = typeof EmailSchema.infer;

export function createEmail(email: string): Result<Email, InvalidEmailError> {
	return validate<Email, InvalidEmailError>(EmailSchema, email, msg => createInvalidEmailError(email, msg));
}

export function emailEquals(a: Email, b: Email): boolean {
	return a === b;
}
