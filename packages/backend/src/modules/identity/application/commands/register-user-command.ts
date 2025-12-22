import { Result } from '@backend/libs/result';
import type { User } from '../../domain/entities/user';
import type { UserWriteRepository } from '../../domain/repositories/user-write';
import { createUserAlreadyExistsError, type IdentityDomainError } from '../../domain/errors';
import type { Timestamp } from '@backend/libs/primitives';
import { createUser } from '../../domain/entities/user';
import { createUserId } from '../../domain/value-objects/user-id';
import type { RegisterUserCommand } from '../dto';
import type { PasswordHasher } from '../../domain/port/password-hasher';
import type { UserReadRepository } from '../../domain/repositories/user-read';
import { createPasswordFromHash } from '../../domain/value-objects/password';

export class RegisterUserHandler {
  constructor(
    private readonly userWriteRepo: UserWriteRepository,
		private readonly userReadRepo: UserReadRepository,
		private readonly passwordHasher: PasswordHasher,
    private readonly now: () => Timestamp,
  ) {}

  async handle(
    { email, password, username }: RegisterUserCommand
  ): Promise<Result<User, IdentityDomainError>> {
		const userResult = await this.userReadRepo.findByEmail(email);
		if (userResult.ok) {
			return Result.err(createUserAlreadyExistsError(email));
		}

		const passwordHashResult = await this.passwordHasher.hash(password);
		if (!passwordHashResult.ok) {
			return Result.err(passwordHashResult.error);
		}

		const passwordHash = passwordHashResult.value;

    const user = createUser(
      createUserId(),
      username,
      email,
      createPasswordFromHash(passwordHash),
      this.now(),
    );

    const saveResult = await this.userWriteRepo.save(user);
    if (!saveResult.ok) {
      return Result.err(saveResult.error);
    }

    return Result.ok(user);
  }
}
