import { createContainer } from "./app/di";
import { createServer } from "./app/server";

const container = createContainer();
createServer(container);

export type { AppRouter } from "./app/server/app-routes";
