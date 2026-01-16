import http from 'http';
import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import { appRouter } from '@backend/app/server/app-routes';
import { createContext } from '@backend/app/server/init';
import { match } from 'ts-pattern';
import type { Container } from '../di';
import { InfraRoutes } from './infra-routes';

const basePath = '/trpc/';

export function createServer(container: Container): void {
	const trpcHandler = createHTTPHandler({
		router: appRouter,
		createContext: ({ req, res }) => createContext({ req, res }, container),
		basePath,
	});

	const infraHandler = new InfraRoutes();

	const server = http.createServer(
		(req, res) => {
			match(req.url)
				.with('/health', () => { infraHandler.health(res) })
				.with('/live', () => { infraHandler.live(res) })
				.with('/ready', () => { infraHandler.ready(res) })
				.when(() => req.url?.startsWith(basePath), () => { trpcHandler(req, res) })
				.otherwise(() => {
					res.statusCode = 404;
					res.end();
				});
		},
	);

	server.listen(3001);

	console.log(`🚀 Server ready at http://localhost:3001`);
}
