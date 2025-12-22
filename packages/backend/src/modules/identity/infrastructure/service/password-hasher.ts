import bcrypt from 'bcrypt';
import type { PasswordHasher } from '../../domain/port/password-hasher';
import { Result } from '@backend/libs/result';
import { createUnexpectedError, type IdentityDomainError } from '../../domain/errors';

export class BcryptPasswordHasher implements PasswordHasher {
  constructor(private readonly saltRounds: number) {}

  async hash(plain: string): Promise<Result<string, IdentityDomainError>> {
		try {
			const res = await bcrypt.hash(plain, this.saltRounds);
			return Result.ok(res);
		} catch (error) {
			return Result.err(createUnexpectedError(error));
		}
  }

  async verify(plain: string, hash: string): Promise<Result<boolean, IdentityDomainError>> {
		try {
			const res = await bcrypt.compare(plain, hash);
			return Result.ok(res);
		} catch (error) {
			return Result.err(createUnexpectedError(error));
		}
  }
}
