import type { Result } from '@backend/libs/result';
import type { User } from '../entities/user';
import type { UserId } from '../value-objects/user-id';
import type { IdentityDomainError } from '../errors';

export interface UserWriteRepository {
  save(user: User): Promise<Result<void, IdentityDomainError>>;
  delete(id: UserId): Promise<Result<void, IdentityDomainError>>;
}
