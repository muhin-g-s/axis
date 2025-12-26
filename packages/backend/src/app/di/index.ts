import { LoginUserHandler } from "@backend/modules/identity/application/commands/login-user-command";
import { LoginController } from "../controllers/identity/login";
import { BcryptPasswordHasher } from "@backend/modules/identity/infrastructure/service/password-hasher";
import { DrizzleUserReadRepository } from "@backend/modules/identity/infrastructure/persistence/user-read";
import { db } from "../db/connector";
import type { JwtService } from "../service/jwt/interface";
import { JwtServiceMock } from "../service/jwt/mock";

export interface Identity {
	login: LoginController
	jwt: JwtService
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

	const jwt = new JwtServiceMock();

	return {
		login: new LoginController(loginUserHandlerUc, jwt),
		jwt,
	};
}
