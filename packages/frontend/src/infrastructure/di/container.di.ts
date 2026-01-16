import { type AuthSession, authSession } from "../auth/session.service";
import { api } from "../network/trpc";

export interface Container {
	api: api;
	authSession: AuthSession;
}

export function createContainer(): Container {
	return {
    api,
    authSession,
  };
}
