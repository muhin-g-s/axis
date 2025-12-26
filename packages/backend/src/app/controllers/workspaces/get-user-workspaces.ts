import { type } from "arktype";
import { InvalidIdFormatErrorToTRPC, type Request } from "@backend/libs/trpc";
import { Result } from "@backend/libs/result";
import type { GetUserWorkspacesHandler } from "@backend/modules/workspaces/application/handlers/get-user-workspaces-handler";
import type { UserWorkspace } from "@backend/modules/workspaces/application/dto";
import { mapErr } from "./error";
import type { AuthContext } from "@backend/app/server/init";
import { userIdFromString } from "@backend/modules/workspaces/domain/value-objects/user-id";

export const inputGetUserWorkspacesSchema = type({});

type InputGetUserWorkspaces = typeof inputGetUserWorkspacesSchema.infer;

export interface OutputGetUserWorkspaces {
  workspaces: UserWorkspace[];
}

export class GetUserWorkspacesController {
  constructor(
    private readonly usecase: GetUserWorkspacesHandler,
  ) {}

  async handler({ ctx }: Request<InputGetUserWorkspaces, AuthContext>): Promise<OutputGetUserWorkspaces> {
		const userIdVo = Result.unwrapOrThrow(
			userIdFromString(ctx.user?.id ?? ""),
			InvalidIdFormatErrorToTRPC
		);

		const workspaces = Result.unwrapOrThrow(
      await this.usecase.handle({ userId: userIdVo }),
      mapErr
    );

    return {
      workspaces,
    };
  }
}
