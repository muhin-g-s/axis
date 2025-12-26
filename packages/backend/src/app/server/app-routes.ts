import { inputLoginSchema } from "../controllers/identity/login";
import { inputRegisterSchema } from "../controllers/identity/register";
import { t, publicProcedure } from "./init";

export type AppRouter = typeof appRouter;

export const appRouter = t.router({
	login: publicProcedure
		.input(inputLoginSchema)
		.query(req => req.ctx.container.login.handler(req)),
	register: publicProcedure
		.input(inputRegisterSchema)
		.mutation(req => req.ctx.container.register.handler(req)),
});
