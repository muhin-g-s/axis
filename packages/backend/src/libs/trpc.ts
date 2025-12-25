export interface Request<Input extends Record<string, unknown>, Ctx = unknown> {
	ctx: Ctx;
	input: Input;
	signal: AbortSignal | undefined;
	path: string;
}
