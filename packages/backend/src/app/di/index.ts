import { LoginUserHandler } from "@backend/modules/identity/application/commands/login-user-command";
import { RegisterUserHandler } from "@backend/modules/identity/application/commands/register-user-command";
import { LoginController } from "../controllers/identity/login";
import { RegisterController } from "../controllers/identity/register";
import { CreateWorkspaceController } from "../controllers/workspaces/create-workspace";
import { GetUserWorkspacesController } from "../controllers/workspaces/get-user-workspaces";
import { AddUserToWorkspaceController } from "../controllers/workspaces/add-user-to-workspace";
import { CreateProjectController } from "../controllers/projects/create-project";
import { DeleteProjectController } from "../controllers/projects/delete-project";
import { GetProjectController } from "../controllers/projects/get-project";
import { GetProjectsByWorkspaceController } from "../controllers/projects/get-projects-by-workspace";
import { RenameProjectController } from "../controllers/projects/rename-project";
import { CreateLabelController } from "../controllers/workspace-configuration/create-label";
import { CreatePriorityController } from "../controllers/workspace-configuration/create-priority";
import { CreateStatusController } from "../controllers/workspace-configuration/create-status";
import { GetLabelsByWorkspaceController } from "../controllers/workspace-configuration/get-labels-by-workspace";
import { GetPrioritiesByWorkspaceController } from "../controllers/workspace-configuration/get-priorities-by-workspace";
import { GetStatusesByWorkspaceController } from "../controllers/workspace-configuration/get-statuses-by-workspace";
import { AddLabelToIssueController } from "../controllers/issues/add-label";
import { AssignIssueController } from "../controllers/issues/assign";
import { CreateIssueController } from "../controllers/issues/create";
import { DeleteIssueController } from "../controllers/issues/delete";
import { GetIssueController } from "../controllers/issues/get-issue";
import { GetProjectIssuesController } from "../controllers/issues/get-project-issues";
import { UpdateIssueController } from "../controllers/issues/update-issue";
import { UpdateIssuePriorityController } from "../controllers/issues/update-priority";
import { UpdateIssueStatusController } from "../controllers/issues/update-status";
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
import { CreateProjectHandler } from "@backend/modules/projects/application/handlers/create";
import { DeleteProjectHandler } from "@backend/modules/projects/application/handlers/delete";
import { GetProjectHandler } from "@backend/modules/projects/application/handlers/get-project";
import { GetProjectsByWorkspaceHandler } from "@backend/modules/projects/application/handlers/get-projects-by-workspace";
import { RenameProjectHandler } from "@backend/modules/projects/application/handlers/rename";
import { DrizzleProjectWriteRepository } from "@backend/modules/projects/infrastructure/persistence/write";
import { DrizzleProjectReadRepository } from "@backend/modules/projects/infrastructure/persistence/read";
import { ProjectPermissionChecker } from "@backend/modules/projects/infrastructure/services/project-permission-checker";
import { CreateLabelHandler } from "@backend/modules/workspace-configuration/application/handlers/create-label";
import { CreatePriorityHandler } from "@backend/modules/workspace-configuration/application/handlers/create-priority";
import { CreateStatusHandler } from "@backend/modules/workspace-configuration/application/handlers/create-status.handler";
import { GetLabelsByWorkspaceHandler } from "@backend/modules/workspace-configuration/application/handlers/get-labels-by-workspace";
import { GetPrioritiesByWorkspaceHandler } from "@backend/modules/workspace-configuration/application/handlers/get-priorities-by-workspace";
import { GetStatusesByWorkspaceHandler } from "@backend/modules/workspace-configuration/application/handlers/get-statuses-by-workspace";
import { DrizzleLabelRepository } from "@backend/modules/workspace-configuration/infrastructure/persistence/label";
import { DrizzlePriorityRepository } from "@backend/modules/workspace-configuration/infrastructure/persistence/priority";
import { DrizzleStatusRepository } from "@backend/modules/workspace-configuration/infrastructure/persistence/status";
import { WorkspaceConfigurationPermissionChecker } from "@backend/modules/workspace-configuration/infrastructure/service/workspace-configuration-permission-checker";
import { AddLabelToIssueHandler } from "@backend/modules/issues/application/handlers/add-label";
import { AssignIssueToUserHandler } from "@backend/modules/issues/application/handlers/assign";
import { CreateIssueHandler } from "@backend/modules/issues/application/handlers/create";
import { DeleteIssueHandler } from "@backend/modules/issues/application/handlers/delete";
import { GetIssueHandler } from "@backend/modules/issues/application/handlers/get-issue";
import { GetProjectIssuesHandler } from "@backend/modules/issues/application/handlers/get-project-issues";
import { UpdateIssueHandler } from "@backend/modules/issues/application/handlers/update-issue";
import { UpdateIssuePriorityHandler } from "@backend/modules/issues/application/handlers/update-priority";
import { UpdateIssueStatusHandler } from "@backend/modules/issues/application/handlers/update-status";
import { DrizzleIssueReadRepository } from "@backend/modules/issues/infrastructure/persistence/read";
import { DrizzleIssueWriteRepository } from "@backend/modules/issues/infrastructure/persistence/write";
import { DrizzleWorkspaceMembershipChecker } from "@backend/modules/workspaces/infrastructure/service";
import { DrizzleProjectUnitOfWork } from "@backend/modules/projects/infrastructure/persistence/unit-of-work";
import { LabelExistChecker } from "@backend/modules/issues/infrastructure/service/label-exist-checker";
import { PriorityExistChecker } from "@backend/modules/issues/infrastructure/service/priority-exist-checker";
import { DrizzleUserExistChecker } from "@backend/modules/issues/infrastructure/service/user-exist-checker";
import { StatusExistChecker } from "@backend/modules/issues/infrastructure/service/status-exist-checker";
import { ProjectExistChecker } from "@backend/modules/issues/infrastructure/service/project-exist-checker";

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

export interface Projects {
	createProject: CreateProjectController
	deleteProject: DeleteProjectController
	getProject: GetProjectController
	getProjectsByWorkspace: GetProjectsByWorkspaceController
	renameProject: RenameProjectController
}

export interface WorkspaceConfiguration {
	createLabel: CreateLabelController
	createPriority: CreatePriorityController
	createStatus: CreateStatusController
	getLabelsByWorkspace: GetLabelsByWorkspaceController
	getPrioritiesByWorkspace: GetPrioritiesByWorkspaceController
	getStatusesByWorkspace: GetStatusesByWorkspaceController
}

export interface Issues {
	addLabelToIssue: AddLabelToIssueController
	assignIssue: AssignIssueController
	createIssue: CreateIssueController
	deleteIssue: DeleteIssueController
	getIssue: GetIssueController
	getProjectIssues: GetProjectIssuesController
	updateIssue: UpdateIssueController
	updateIssuePriority: UpdateIssuePriorityController
	updateIssueStatus: UpdateIssueStatusController
}

export interface Container extends Identity, Workspaces, Projects, WorkspaceConfiguration, Issues {}

export function createContainer(): Container {
	const identity = createIdentity();
	const workspaces = createWorkspaces();
	const projects = createProjects();
	const workspaceConfiguration = createWorkspaceConfiguration();
	const issues = createIssues();

  return {
		...identity,
		...workspaces,
		...projects,
		...workspaceConfiguration,
		...issues
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

function createProjects(): Projects {
	const projectReadRepo = new DrizzleProjectReadRepository(db);
	const projectWriteRepo = new DrizzleProjectWriteRepository(db);
	const membershipChecker = new DrizzleWorkspaceMembershipChecker(db);
	const projectPermissionChecker = new ProjectPermissionChecker(membershipChecker);
	const uow = new DrizzleProjectUnitOfWork(db);

	const createProjectHandler = new CreateProjectHandler(projectWriteRepo, projectPermissionChecker, getUnixTimestampNow);
	const deleteProjectHandler = new DeleteProjectHandler(projectWriteRepo, projectPermissionChecker);
	const getProjectHandler = new GetProjectHandler(projectReadRepo, projectPermissionChecker);
	const getProjectsByWorkspaceHandler = new GetProjectsByWorkspaceHandler(projectReadRepo, projectPermissionChecker);
	const renameProjectHandler = new RenameProjectHandler(projectReadRepo, uow, projectPermissionChecker, getUnixTimestampNow);

	return {
		createProject: new CreateProjectController(createProjectHandler),
		deleteProject: new DeleteProjectController(deleteProjectHandler),
		getProject: new GetProjectController(getProjectHandler),
		getProjectsByWorkspace: new GetProjectsByWorkspaceController(getProjectsByWorkspaceHandler),
		renameProject: new RenameProjectController(renameProjectHandler),
	};
}

function createWorkspaceConfiguration(): WorkspaceConfiguration {
	const membershipChecker = new DrizzleWorkspaceMembershipChecker(db);

	const labelRepo = new DrizzleLabelRepository(db);
	const priorityRepo = new DrizzlePriorityRepository(db);
	const statusRepo = new DrizzleStatusRepository(db);
	const workspaceConfigPermissionChecker = new WorkspaceConfigurationPermissionChecker(membershipChecker);

	const createLabelHandler = new CreateLabelHandler(labelRepo, workspaceConfigPermissionChecker);
	const createPriorityHandler = new CreatePriorityHandler(priorityRepo, workspaceConfigPermissionChecker);
	const createStatusHandler = new CreateStatusHandler(statusRepo, workspaceConfigPermissionChecker);
	const getLabelsByWorkspaceHandler = new GetLabelsByWorkspaceHandler(labelRepo, workspaceConfigPermissionChecker);
	const getPrioritiesByWorkspaceHandler = new GetPrioritiesByWorkspaceHandler(priorityRepo, workspaceConfigPermissionChecker);
	const getStatusesByWorkspaceHandler = new GetStatusesByWorkspaceHandler(statusRepo, workspaceConfigPermissionChecker);

	return {
		createLabel: new CreateLabelController(createLabelHandler),
		createPriority: new CreatePriorityController(createPriorityHandler),
		createStatus: new CreateStatusController(createStatusHandler),
		getLabelsByWorkspace: new GetLabelsByWorkspaceController(getLabelsByWorkspaceHandler),
		getPrioritiesByWorkspace: new GetPrioritiesByWorkspaceController(getPrioritiesByWorkspaceHandler),
		getStatusesByWorkspace: new GetStatusesByWorkspaceController(getStatusesByWorkspaceHandler),
	};
}

function createIssues(): Issues {
	const membershipChecker = new DrizzleWorkspaceMembershipChecker(db);

	const issueReadRepo = new DrizzleIssueReadRepository(db);
	const issueWriteRepo = new DrizzleIssueWriteRepository(db);

	const labelExistChecker = new LabelExistChecker(db);
	const priorityExistChecker = new PriorityExistChecker(db);
	const projectExistChecker = new ProjectExistChecker(db);
	const statusExistChecker = new StatusExistChecker(db);
	const userExistChecker = new DrizzleUserExistChecker(db);

	const addLabelToIssueHandler = new AddLabelToIssueHandler(issueWriteRepo, issueReadRepo, membershipChecker, labelExistChecker, getUnixTimestampNow);
	const assignIssueToUserHandler = new AssignIssueToUserHandler(issueWriteRepo, issueReadRepo, membershipChecker, userExistChecker, getUnixTimestampNow);
	const createIssueHandler = new CreateIssueHandler(issueWriteRepo, issueReadRepo, membershipChecker, projectExistChecker, getUnixTimestampNow);
	const deleteIssueHandler = new DeleteIssueHandler(issueWriteRepo, issueReadRepo, membershipChecker, getUnixTimestampNow);
	const getIssueHandler = new GetIssueHandler(issueReadRepo, membershipChecker);
	const getProjectIssuesHandler = new GetProjectIssuesHandler(issueReadRepo, membershipChecker);
	const updateIssueHandler = new UpdateIssueHandler(issueWriteRepo, issueReadRepo, membershipChecker, getUnixTimestampNow);
	const updateIssuePriorityHandler = new UpdateIssuePriorityHandler(issueWriteRepo, issueReadRepo, membershipChecker, priorityExistChecker, getUnixTimestampNow);
	const updateIssueStatusHandler = new UpdateIssueStatusHandler(issueWriteRepo, issueReadRepo, membershipChecker, statusExistChecker, getUnixTimestampNow);

	return {
		addLabelToIssue: new AddLabelToIssueController(addLabelToIssueHandler),
		assignIssue: new AssignIssueController(assignIssueToUserHandler),
		createIssue: new CreateIssueController(createIssueHandler),
		deleteIssue: new DeleteIssueController(deleteIssueHandler),
		getIssue: new GetIssueController(getIssueHandler),
		getProjectIssues: new GetProjectIssuesController(getProjectIssuesHandler),
		updateIssue: new UpdateIssueController(updateIssueHandler),
		updateIssuePriority: new UpdateIssuePriorityController(updateIssuePriorityHandler),
		updateIssueStatus: new UpdateIssueStatusController(updateIssueStatusHandler),
	};
}
