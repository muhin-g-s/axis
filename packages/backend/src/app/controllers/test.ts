import type { Request } from "@backend/libs/trpc";
import { type } from "arktype";

export const inputTestSchema = type({ name: 'string' });

type InputTest = typeof inputTestSchema.infer

export class TestController {
	handler({ input }: Request<InputTest>): { greeting: string } {
		return {
			greeting: `hello ${input.name}`,
		};
	}
}
