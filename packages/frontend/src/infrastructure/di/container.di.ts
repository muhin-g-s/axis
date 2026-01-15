import { type AuthSession, authSession } from "../auth/session.service";
import { HttpClient, type IHttpClient } from "../network/http.client";
import { api } from "../network/trpc";

export interface Container {
	httpClient: IHttpClient;
	api: api;
	authSession: AuthSession;
}

export function createContainer(): Container {
	return {
    httpClient: new HttpClient(),
    api,
    authSession,
  };
}
