import { Router as Wouter, useLocation, matchRoute, useRouter } from "wouter-preact";
import { routes } from "./routes";

export function Router() {
	const [location] = useLocation();
	const { parser } = useRouter();

	const activeRoute = routes
		.map(route => {
			const [isMatched, params] = matchRoute(
				parser,
				route.path,
				location,
				false
			);

			if (isMatched) {
				return [route, params ] as const;
			}

			return undefined;
		})
		.find(r => r !== undefined);

	if (!activeRoute) { return <div>404</div>; }

	const [route] = activeRoute;

	return (
		<Wouter>
			<route.layout>
				<route.component />
			</route.layout>
		</Wouter>
	);
}
