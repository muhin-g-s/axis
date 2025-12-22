import { type Result } from '@backend/libs/result';
import { type User } from '../entities/user';
import { type UserId } from '../value-objects/user-id';
import { type Email } from '../value-objects/email';
import type { IdentityDomainError } from '../errors';

export interface UserReadRepository {
  findById(id: UserId): Promise<Result<User, IdentityDomainError>>;
  findByEmail(email: Email): Promise<Result<User, IdentityDomainError>>;
}
