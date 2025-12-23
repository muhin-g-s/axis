import type { Email } from "../../domain/value-objects/email";
import type { Password } from "../../domain/value-objects/password";
import type { Username } from "../../domain/value-objects/username";

export interface LoginUserCommand {
	readonly email: Email;
	readonly password: Password;
}

export interface RegisterUserCommand {
  readonly email: Email;
  readonly password: Password;
  readonly username: Username;
}
