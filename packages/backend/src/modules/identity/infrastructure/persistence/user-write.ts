import { eq } from 'drizzle-orm';
import { Result } from '@backend/libs/result';
import type { DbClient } from '@backend/app/db/connector';
import { users } from '@backend/app/db/schema';
import {
	type IdentityDomainError
} from '@backend/modules/identity/domain/errors';
import type { User } from '@backend/modules/identity/domain/entities/user';
import type { UserWriteRepository } from '@backend/modules/identity/domain/repositories/user-write';
import type { UserId } from '@backend/modules/identity/domain/value-objects/user-id';
import { getUnixTimestampNow } from '@backend/libs/time';
import { createUnexpectedDatabaseError } from '@backend/libs/error';

export class DrizzleUserWriteRepository implements UserWriteRepository {
  constructor(private readonly db: DbClient) {}

  async save(user: User): Promise<Result<void, IdentityDomainError>> {
    try {
      await this.db
        .insert(users)
        .values(user)
        .onConflictDoUpdate({
          target: users.id,
          set: {
            username: user.username,
            email: user.email,
            passwordHash: user.passwordHash,
            updatedAt: user.updatedAt,
            deletedAt: user.deletedAt ?? null,
          },
        });

      return Result.ok(undefined);
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }

  async delete(id: UserId): Promise<Result<void, IdentityDomainError>> {
    try {
      await this.db
        .update(users)
        .set({ deletedAt: getUnixTimestampNow() })
        .where(eq(users.id, id));

      return Result.ok(undefined);
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }
}
