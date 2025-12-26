import { LoginUserHandler } from "@backend/modules/identity/application/commands/login-user-command";
import { LoginController } from "../controllers/identity/login";
import { BcryptPasswordHasher } from "@backend/modules/identity/infrastructure/service/password-hasher";
import { DrizzleUserReadRepository } from "@backend/modules/identity/infrastructure/persistence/user-read";
import { db } from "../db/connector";

interface Identity {
	login: LoginController
}

export type Container = Identity;

export function createContainer(): Container {
	const identity = createIdentity();

  return {
		...identity
  };
}

function createIdentity(): Identity {
	const passwordHasher = new BcryptPasswordHasher(10);

	const userReadRepo = new DrizzleUserReadRepository(db);

	const loginUserHandlerUc = new LoginUserHandler(userReadRepo, passwordHasher);

	return {
		login: new LoginController(loginUserHandlerUc),
	};
}
