import { initTRPC } from "@trpc/server";
import { type Container } from "../di";
import type { IncomingMessage, ServerResponse } from "http";
import { parseBearerToken } from "../service/jwt/interface";
import { Result } from "@backend/libs/result";
import { createUnauthorizedErr } from "@backend/libs/trpc";

export interface ContextHttp {
	req: IncomingMessage;
  res: ServerResponse;
}

interface ContextDI {
	container: Container
}

export interface Context extends ContextHttp, ContextDI {}

export function createContext(
  opts: {
    req: IncomingMessage;
    res: ServerResponse;
  },
  container: Container
): Context {
  return {
    req: opts.req,
    res: opts.res,
    container,
  };
}

export interface AuthContext extends Context {
  user?: {
    id: string;
    email: string;
  };
}

export const t = initTRPC
	.context<Context>()
	.create();

const authMiddleware = t.middleware(({ ctx, next }) => {
  const token = Result.unwrapOrThrow(
		parseBearerToken(ctx.req.headers.authorization),
		() => createUnauthorizedErr()
	);

  const payload = Result.unwrapOrThrow(
		ctx.container.jwt.verify(token),
		() => createUnauthorizedErr()
	);

  return next({
    ctx: {
      ...ctx,
      user: {
        id: payload.subId,
      },
    },
  });
});


export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(authMiddleware);
