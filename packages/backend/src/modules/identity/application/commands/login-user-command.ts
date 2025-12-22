import { Result } from '@backend/libs/result';
import type { User } from '../../domain/entities/user';
import type { UserReadRepository } from '../../domain/repositories/user-read';
import type { IdentityDomainError } from '../../domain/errors';
import { createInvalidCredentialsError, createUserHasBeenDeletedError } from '../../domain/errors';
import type { PasswordHasher } from '../../domain/port/password-hasher';
import type { LoginUserCommand } from '../dto';

export class LoginUserHandler {
  constructor(
    private readonly userReadRepo: UserReadRepository,
		private readonly passwordHasher: PasswordHasher,
  ) {}

  async handle({email, password}: LoginUserCommand): Promise<Result<User, IdentityDomainError>> {
    const userResult = await this.userReadRepo.findByEmail(email);
    if (!userResult.ok) {
      return Result.err(userResult.error);
    }

    const user = userResult.value;

    if (user.deletedAt !== undefined) {
      return Result.err(createUserHasBeenDeletedError(email));
    }

    const isValidResult = await this.passwordHasher.verify(password, user.passwordHash);
		if (!isValidResult.ok) {
			return Result.err(isValidResult.error);
		}

		const isValid = isValidResult.value;
    if (!isValid) {
      return Result.err(createInvalidCredentialsError());
    }

    return Result.ok(user);
  }
}
