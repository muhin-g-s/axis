import { LoginUserHandler } from "@backend/modules/identity/application/commands/login-user-command";
import { RegisterUserHandler } from "@backend/modules/identity/application/commands/register-user-command";
import { LoginController } from "../controllers/identity/login";
import { RegisterController } from "../controllers/identity/register";
import { BcryptPasswordHasher } from "@backend/modules/identity/infrastructure/service/password-hasher";
import { DrizzleUserReadRepository } from "@backend/modules/identity/infrastructure/persistence/user-read";
import { DrizzleUserWriteRepository } from "@backend/modules/identity/infrastructure/persistence/user-write";
import { db } from "../db/connector";
import type { JwtService } from "../service/jwt/interface";
import { JwtServiceMock } from "../service/jwt/mock";
import { getUnixTimestampNow } from "@backend/libs/time";

export interface Identity {
	login: LoginController
	register: RegisterController
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
	const userWriteRepo = new DrizzleUserWriteRepository(db);

	const loginUserHandlerUc = new LoginUserHandler(userReadRepo, passwordHasher);
	const registerUserHandlerUc = new RegisterUserHandler(
		userWriteRepo,
		userReadRepo,
		passwordHasher,
		getUnixTimestampNow
	);

	const jwt = new JwtServiceMock();

	return {
		login: new LoginController(loginUserHandlerUc, jwt),
		register: new RegisterController(registerUserHandlerUc),
		jwt,
	};
}
