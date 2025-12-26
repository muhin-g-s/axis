import { type } from "arktype";
import { type Request } from "@backend/libs/trpc";
import { Result } from "@backend/libs/result";
import type { RegisterUserHandler } from "@backend/modules/identity/application/commands/register-user-command";
import { createEmail } from "@backend/modules/identity/domain/value-objects/email";
import { createPassword } from "@backend/modules/identity/domain/value-objects/password";
import { createUsername } from "@backend/modules/identity/domain/value-objects/username";
import { InvalidEmailErrorToTRPC, InvalidPasswordErrorToTRPC, InvalidUsernameErrorToTRPC, mapErr } from "./error";

export const inputRegisterSchema = type({
	email: 'string',
	password: 'string',
	username: 'string',
});

type InputRegister = typeof inputRegisterSchema.infer

export interface OutputRegister {
	id: string;
	username: string;
	email: string;
}

export class RegisterController {
	constructor(
		private readonly usecase: RegisterUserHandler,
	) {}

	async handler({ input }: Request<InputRegister>): Promise<OutputRegister> {
		const emailVo = Result.unwrapOrThrow(createEmail(input.email), InvalidEmailErrorToTRPC);
		const passwordVo = Result.unwrapOrThrow(createPassword(input.password), InvalidPasswordErrorToTRPC);
		const usernameVo = Result.unwrapOrThrow(createUsername(input.username), InvalidUsernameErrorToTRPC);

		const command = {
			email: emailVo,
			password: passwordVo,
			username: usernameVo,
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
