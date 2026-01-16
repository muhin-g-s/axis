import type { ServerResponse } from "http";

export class InfraRoutes {

	health(res: ServerResponse): void {
		res.statusCode = 200;
		res.end();
	}

	live(res: ServerResponse): void {
		res.statusCode = 200;
		res.end();
	}

	ready(res: ServerResponse): void {
		res.statusCode = 200;
		res.end();
	}
}
