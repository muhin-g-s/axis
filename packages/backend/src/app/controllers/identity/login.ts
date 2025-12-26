import { type } from "arktype";
import { type Request } from "@backend/libs/trpc";
import { Result } from "@backend/libs/result";
import type { LoginUserHandler } from "@backend/modules/identity/application/commands/login-user-command";
import { createEmail } from "@backend/modules/identity/domain/value-objects/email";
import { createPassword } from "@backend/modules/identity/domain/value-objects/password";
import { InvalidEmailErrorToTRPC, InvalidPasswordErrorToTRPC, mapErr } from "./error";

export const inputLoginSchema = type({
	email: 'string',
	password: 'string',
});

type InputLogin = typeof inputLoginSchema.infer

export interface OutputLogin {
	id: string;
	username: string;
	email: string;
}

export class LoginController {
	constructor(private readonly usecase: LoginUserHandler) {}
	async handler({ input }: Request<InputLogin>): Promise<OutputLogin> {
		const emailVo = Result.unwrapOrThrow(createEmail(input.email), InvalidEmailErrorToTRPC);
		const passwordVo = Result.unwrapOrThrow(createPassword(input.password), InvalidPasswordErrorToTRPC);

		const command = {
			email: emailVo,
			password: passwordVo,
		};

		const { id, username, email } = Result.unwrapOrThrow(
			await this.usecase.handle(command),
			mapErr
		);

		return {
			id,
			username,
			email
		};
	}
}
