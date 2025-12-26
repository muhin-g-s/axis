import { inputLoginSchema } from "../controllers/identity/login";
import { inputRegisterSchema } from "../controllers/identity/register";
import { inputCreateWorkspaceSchema } from "../controllers/workspaces/create-workspace";
import { inputGetUserWorkspacesSchema } from "../controllers/workspaces/get-user-workspaces";
import { inputAddUserToWorkspaceSchema } from "../controllers/workspaces/add-user-to-workspace";
import { t, publicProcedure, protectedProcedure } from "./init";

export type AppRouter = typeof appRouter;

export const appRouter = t.router({
	login: publicProcedure
		.input(inputLoginSchema)
		.query(req => req.ctx.container.login.handler(req)),
	register: publicProcedure
		.input(inputRegisterSchema)
		.mutation(req => req.ctx.container.register.handler(req)),

	// Workspace routes
	createWorkspace: protectedProcedure
		.input(inputCreateWorkspaceSchema)
		.mutation(req => req.ctx.container.createWorkspace.handler(req)),
	getUserWorkspaces: protectedProcedure
		.input(inputGetUserWorkspacesSchema)
		.query(req => req.ctx.container.getUserWorkspaces.handler(req)),
	addUserToWorkspace: protectedProcedure
		.input(inputAddUserToWorkspaceSchema)
		.mutation(req => req.ctx.container.addUserToWorkspace.handler(req)),
});
