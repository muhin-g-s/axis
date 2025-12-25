import type { ServerResponse } from "http";
import type { Container } from "../di";

export class InfraRoutes {
	constructor(private readonly container: Container) {}

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
