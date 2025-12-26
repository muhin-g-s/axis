import { inputLoginSchema } from "../controllers/identity/login";
import { t, publicProcedure } from "./init";

export type AppRouter = typeof appRouter;

export const appRouter = t.router({
	login: publicProcedure
		.input(inputLoginSchema)
		.query(req => req.ctx.container.login.handler(req)),
});
