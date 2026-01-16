import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@backend';
import { getConfig } from '../config';

const conf = getConfig();

const client = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: conf.api.baseUrl,
		}),
	],
});


export const api = {
	login: client.login.mutate
} as const

export type api = typeof api;
