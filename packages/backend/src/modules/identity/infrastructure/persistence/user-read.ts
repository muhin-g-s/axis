import { eq } from 'drizzle-orm';
import { Result } from '@backend/libs/result';
import type { DbClient } from '@backend/app/db/connector';
import { users } from '@backend/app/db/schema';
import { UserSchema, type User } from '../../domain/entities/user';
import type { UserId } from '../../domain/value-objects/user-id';
import type { Email } from '../../domain/value-objects/email';
import type { UserReadRepository } from '../../domain/repositories/user-read';
import { validate } from '@backend/libs/validation';
import { createInvalidObjectInDatabaseError, createUnexpectedDatabaseError, type InvalidObjectInDatabaseError } from '@backend/libs/error';
import { type IdentityDomainError, createUserNotFoundError } from '../../domain/errors';

export class DrizzleUserReadRepository implements UserReadRepository {
  constructor(private readonly db: DbClient) {}

  async findById(id: UserId): Promise<Result<User, IdentityDomainError>> {
    try {
      const userRecord = await this.db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      if (userRecord.length === 0) {
        return Result.err(createUserNotFoundError(id));
      }

      const validatedUser = validate<User, InvalidObjectInDatabaseError>(
				UserSchema,
				userRecord[0],
				msg => createInvalidObjectInDatabaseError(userRecord, 'UserSchema', msg)
			);

      return validatedUser;
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }

  async findByEmail(email: Email): Promise<Result<User, IdentityDomainError>> {
    try {
      const userRecord = await this.db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (userRecord.length === 0) {
        return Result.err(createUserNotFoundError(email));
      }

      const validatedUser = validate<User, InvalidObjectInDatabaseError>(
				UserSchema,
				userRecord[0],
				msg => createInvalidObjectInDatabaseError(userRecord, 'UserSchema', msg)
			);

      return validatedUser;
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }
}
