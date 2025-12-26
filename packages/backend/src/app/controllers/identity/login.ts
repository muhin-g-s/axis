import { type } from "arktype";
import { createUnexpectedErr, type Request } from "@backend/libs/trpc";
import { Result } from "@backend/libs/result";
import type { LoginUserHandler } from "@backend/modules/identity/application/commands/login-user-command";
import { createEmail } from "@backend/modules/identity/domain/value-objects/email";
import { createPassword } from "@backend/modules/identity/domain/value-objects/password";
import { InvalidEmailErrorToTRPC, InvalidPasswordErrorToTRPC, mapErr } from "./error";
import { buildBearerAuthorization, type JwtService } from "@backend/app/service/jwt/interface";
import type { ContextHttp } from "@backend/app/server/init";

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
	constructor(
		private readonly usecase: LoginUserHandler,
		private readonly jwtService: JwtService
	) {}
	async handler({ input, ctx }: Request<InputLogin, ContextHttp>): Promise<OutputLogin> {
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

		const accessToken = this.jwtService.sign({ subId: id });

		const bearer = Result.unwrapOrThrow(
			buildBearerAuthorization(accessToken),
			() => createUnexpectedErr("incorrect token")
		);

		ctx.res.setHeader("Authorization", bearer);

		return {
			id,
			username,
			email
		};
	}
}
