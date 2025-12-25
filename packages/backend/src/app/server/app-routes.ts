import { inputTestSchema } from "../controllers/test";
import { t, publicProcedure } from "./init";

export type AppRouter = typeof appRouter;

export const appRouter = t.router({
	test: publicProcedure
		.input(inputTestSchema)
		.query(req => req.ctx.container.testController.handler(req)),
});
