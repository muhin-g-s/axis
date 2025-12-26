import { LoginUserHandler } from "@backend/modules/identity/application/commands/login-user-command";
import { RegisterUserHandler } from "@backend/modules/identity/application/commands/register-user-command";
import { LoginController } from "../controllers/identity/login";
import { RegisterController } from "../controllers/identity/register";
import { CreateWorkspaceController } from "../controllers/workspaces/create-workspace";
import { GetUserWorkspacesController } from "../controllers/workspaces/get-user-workspaces";
import { AddUserToWorkspaceController } from "../controllers/workspaces/add-user-to-workspace";
import { BcryptPasswordHasher } from "@backend/modules/identity/infrastructure/service/password-hasher";
import { DrizzleUserReadRepository } from "@backend/modules/identity/infrastructure/persistence/user-read";
import { DrizzleUserWriteRepository } from "@backend/modules/identity/infrastructure/persistence/user-write";
import { db } from "../db/connector";
import type { JwtService } from "../service/jwt/interface";
import { JwtServiceMock } from "../service/jwt/mock";
import { getUnixTimestampNow } from "@backend/libs/time";
import { CreateWorkspaceHandler } from "@backend/modules/workspaces/application/handlers/create-workspace-handler";
import { GetUserWorkspacesHandler } from "@backend/modules/workspaces/application/handlers/get-user-workspaces-handler";
import { AddUserToWorkspaceHandler } from "@backend/modules/workspaces/application/handlers/add-user-to-workspace-command";
import { DrizzleWorkspaceWriteRepository } from "@backend/modules/workspaces/infrastructure/persistence/workspace-write";
import { DrizzleWorkspaceReadRepository } from "@backend/modules/workspaces/infrastructure/persistence/workspace-read";
import { DrizzleUnitOfWork } from "@backend/modules/workspaces/infrastructure/persistence/unit-of-work";

export interface Identity {
	login: LoginController
	register: RegisterController
	jwt: JwtService
}

export interface Workspaces {
	createWorkspace: CreateWorkspaceController
	getUserWorkspaces: GetUserWorkspacesController
	addUserToWorkspace: AddUserToWorkspaceController
}

export interface Container extends Identity, Workspaces {}

export function createContainer(): Container {
	const identity = createIdentity();
	const workspaces = createWorkspaces();

  return {
		...identity,
		...workspaces
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

function createWorkspaces(): Workspaces {
	const workspaceReadRepo = new DrizzleWorkspaceReadRepository(db);
	const workspaceWriteRepo = new DrizzleWorkspaceWriteRepository(db);
	const uow = new DrizzleUnitOfWork(db);

	const createWorkspaceHandler = new CreateWorkspaceHandler(uow, getUnixTimestampNow);
	const getUserWorkspacesHandler = new GetUserWorkspacesHandler(workspaceReadRepo);
	const addUserToWorkspaceHandler = new AddUserToWorkspaceHandler(workspaceWriteRepo, workspaceReadRepo, getUnixTimestampNow);

	return {
		createWorkspace: new CreateWorkspaceController(createWorkspaceHandler),
		getUserWorkspaces: new GetUserWorkspacesController(getUserWorkspacesHandler),
		addUserToWorkspace: new AddUserToWorkspaceController(addUserToWorkspaceHandler),
	};
}
