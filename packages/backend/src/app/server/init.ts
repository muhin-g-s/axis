import { initTRPC } from "@trpc/server";
import { type Container } from "../di";

export interface Context {
	container: Container
}

export function createContext(container: Container): Context {
  return {
    container
  };
}

export const t = initTRPC
	.context<Context>()
	.create();

export const publicProcedure = t.procedure;
