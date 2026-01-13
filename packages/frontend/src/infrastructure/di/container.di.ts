import { type AuthSession, authSession } from "../auth/session.service";
import { HttpClient, type IHttpClient } from "../network/http.client";

export interface Container {
	httpClient: IHttpClient;
	authSession: AuthSession;
}

export function createContainer(): Container {
	return {
    httpClient: new HttpClient(),
    authSession,
  };
}
