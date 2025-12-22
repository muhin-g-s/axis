import type { Result } from "@backend/libs/result";
import type { IdentityDomainError } from "../errors";

export interface PasswordHasher {
  hash(plain: string): Promise<Result<string, IdentityDomainError>>;

  verify(plain: string, hash: string): Promise<Result<boolean, IdentityDomainError>>;
}
