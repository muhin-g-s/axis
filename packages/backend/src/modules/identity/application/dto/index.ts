import type { Email } from "../../domain/value-objects/email";
import type { Password } from "../../domain/value-objects/password";
import type { UserRole } from "../../domain/value-objects/role";
import type { UserId } from "../../domain/value-objects/user-id";
import type { Username } from "../../domain/value-objects/username";
import type { WorkspaceId } from "../../domain/value-objects/workspace-id";

export interface AddUserToWorkspaceCommand {
	readonly userId: UserId;
	readonly workspaceId: WorkspaceId;
	readonly role: UserRole;
}

export interface LoginUserCommand {
	readonly email: Email;
	readonly password: Password;
}

export interface RegisterUserCommand {
  readonly email: Email;
  readonly password: Password;
  readonly username: Username;
}
