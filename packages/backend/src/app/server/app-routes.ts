import { inputLoginSchema } from "../controllers/identity/login";
import { inputRegisterSchema } from "../controllers/identity/register";
import { inputCreateWorkspaceSchema } from "../controllers/workspaces/create-workspace";
import { inputGetUserWorkspacesSchema } from "../controllers/workspaces/get-user-workspaces";
import { inputAddUserToWorkspaceSchema } from "../controllers/workspaces/add-user-to-workspace";
import { inputCreateProjectSchema } from "../controllers/projects/create-project";
import { inputDeleteProjectSchema } from "../controllers/projects/delete-project";
import { inputGetProjectSchema } from "../controllers/projects/get-project";
import { inputGetProjectsByWorkspaceSchema } from "../controllers/projects/get-projects-by-workspace";
import { inputRenameProjectSchema } from "../controllers/projects/rename-project";
import { inputCreateLabelSchema } from "../controllers/workspace-configuration/create-label";
import { inputCreatePrioritySchema } from "../controllers/workspace-configuration/create-priority";
import { inputCreateStatusSchema } from "../controllers/workspace-configuration/create-status";
import { inputGetLabelsByWorkspaceSchema } from "../controllers/workspace-configuration/get-labels-by-workspace";
import { inputGetPrioritiesByWorkspaceSchema } from "../controllers/workspace-configuration/get-priorities-by-workspace";
import { inputGetStatusesByWorkspaceSchema } from "../controllers/workspace-configuration/get-statuses-by-workspace";
import { inputAddLabelToIssueSchema } from "../controllers/issues/add-label";
import { inputAssignIssueSchema } from "../controllers/issues/assign";
import { inputCreateIssueSchema } from "../controllers/issues/create";
import { inputDeleteIssueSchema } from "../controllers/issues/delete";
import { inputGetIssueSchema } from "../controllers/issues/get-issue";
import { inputGetProjectIssuesSchema } from "../controllers/issues/get-project-issues";
import { inputUpdateIssueSchema } from "../controllers/issues/update-issue";
import { inputUpdateIssuePrioritySchema } from "../controllers/issues/update-priority";
import { inputUpdateIssueStatusSchema } from "../controllers/issues/update-status";
import { t, publicProcedure, protectedProcedure } from "./init";

export type AppRouter = typeof appRouter;

export const appRouter = t.router({
	login: publicProcedure
		.input(inputLoginSchema)
		.mutation(req => req.ctx.container.login.handler(req)),
	register: publicProcedure
		.input(inputRegisterSchema)
		.mutation(req => req.ctx.container.register.handler(req)),

	createWorkspace: protectedProcedure
		.input(inputCreateWorkspaceSchema)
		.mutation(req => req.ctx.container.createWorkspace.handler(req)),
	getUserWorkspaces: protectedProcedure
		.input(inputGetUserWorkspacesSchema)
		.query(req => req.ctx.container.getUserWorkspaces.handler(req)),
	addUserToWorkspace: protectedProcedure
		.input(inputAddUserToWorkspaceSchema)
		.mutation(req => req.ctx.container.addUserToWorkspace.handler(req)),

	createProject: protectedProcedure
		.input(inputCreateProjectSchema)
		.mutation(req => req.ctx.container.createProject.handler(req)),
	deleteProject: protectedProcedure
		.input(inputDeleteProjectSchema)
		.mutation(req => req.ctx.container.deleteProject.handler(req)),
	getProject: protectedProcedure
		.input(inputGetProjectSchema)
		.query(req => req.ctx.container.getProject.handler(req)),
	getProjectsByWorkspace: protectedProcedure
		.input(inputGetProjectsByWorkspaceSchema)
		.query(req => req.ctx.container.getProjectsByWorkspace.handler(req)),
	renameProject: protectedProcedure
		.input(inputRenameProjectSchema)
		.mutation(req => req.ctx.container.renameProject.handler(req)),

	// Workspace Configuration routes
	createLabel: protectedProcedure
		.input(inputCreateLabelSchema)
		.mutation(req => req.ctx.container.createLabel.handler(req)),
	createPriority: protectedProcedure
		.input(inputCreatePrioritySchema)
		.mutation(req => req.ctx.container.createPriority.handler(req)),
	createStatus: protectedProcedure
		.input(inputCreateStatusSchema)
		.mutation(req => req.ctx.container.createStatus.handler(req)),
	getLabelsByWorkspace: protectedProcedure
		.input(inputGetLabelsByWorkspaceSchema)
		.query(req => req.ctx.container.getLabelsByWorkspace.handler(req)),
	getPrioritiesByWorkspace: protectedProcedure
		.input(inputGetPrioritiesByWorkspaceSchema)
		.query(req => req.ctx.container.getPrioritiesByWorkspace.handler(req)),
	getStatusesByWorkspace: protectedProcedure
		.input(inputGetStatusesByWorkspaceSchema)
		.query(req => req.ctx.container.getStatusesByWorkspace.handler(req)),

	// Issues routes
	addLabelToIssue: protectedProcedure
		.input(inputAddLabelToIssueSchema)
		.mutation(req => req.ctx.container.addLabelToIssue.handler(req)),
	assignIssue: protectedProcedure
		.input(inputAssignIssueSchema)
		.mutation(req => req.ctx.container.assignIssue.handler(req)),
	createIssue: protectedProcedure
		.input(inputCreateIssueSchema)
		.mutation(req => req.ctx.container.createIssue.handler(req)),
	deleteIssue: protectedProcedure
		.input(inputDeleteIssueSchema)
		.mutation(req => req.ctx.container.deleteIssue.handler(req)),
	getIssue: protectedProcedure
		.input(inputGetIssueSchema)
		.query(req => req.ctx.container.getIssue.handler(req)),
	getProjectIssues: protectedProcedure
		.input(inputGetProjectIssuesSchema)
		.query(req => req.ctx.container.getProjectIssues.handler(req)),
	updateIssue: protectedProcedure
		.input(inputUpdateIssueSchema)
		.mutation(req => req.ctx.container.updateIssue.handler(req)),
	updateIssuePriority: protectedProcedure
		.input(inputUpdateIssuePrioritySchema)
		.mutation(req => req.ctx.container.updateIssuePriority.handler(req)),
	updateIssueStatus: protectedProcedure
		.input(inputUpdateIssueStatusSchema)
		.mutation(req => req.ctx.container.updateIssueStatus.handler(req)),
});
