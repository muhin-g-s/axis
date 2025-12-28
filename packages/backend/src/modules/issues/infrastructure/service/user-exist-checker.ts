import { eq } from 'drizzle-orm';
import type { DbClient } from '@backend/app/db/connector';
import { Result } from '@backend/libs/result';
import { createUnexpectedDatabaseError, type UnexpectedDatabaseError } from '@backend/libs/error';
import { users } from '@backend/app/db/schema/tables/users';
import type { UserId } from '../../domain/value-objects/user-id';
import type { ExistChecker } from '../../domain/services/exist-checker';

export class DrizzleUserExistChecker implements ExistChecker<UserId>  {
  constructor(private readonly db: DbClient) {}

  async exists(
    userId: UserId
  ): Promise<Result<boolean, UnexpectedDatabaseError>>  {
    try {
      const result = await this.db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      return Result.ok(result.length > 0);
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }
}
