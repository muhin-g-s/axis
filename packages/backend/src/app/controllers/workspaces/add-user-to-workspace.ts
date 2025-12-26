import { type } from "arktype";
import { InvalidIdFormatErrorToTRPC, type Request } from "@backend/libs/trpc";
import { Result } from "@backend/libs/result";
import type { AddUserToWorkspaceHandler } from "@backend/modules/workspaces/application/handlers/add-user-to-workspace-command";
import { createRole, type UserRole } from "@backend/modules/workspaces/domain/value-objects/role";
import {
  InvalidRoleErrorToTRPC,
  mapErr
} from "./error";
import type { AuthContext } from "@backend/app/server/init";
import { userIdFromString } from "@backend/modules/workspaces/domain/value-objects/user-id";
import { workspaceIdFromString } from "@backend/modules/workspaces/domain/value-objects/workspace-id";

export const inputAddUserToWorkspaceSchema = type({
  newUserId: 'string',
  workspaceId: 'string',
  role: 'string',
});

type InputAddUserToWorkspace = typeof inputAddUserToWorkspaceSchema.infer;

export interface OutputAddUserToWorkspace {
  userId: string;
  workspaceId: string;
  role: string;
}

export class AddUserToWorkspaceController {
  constructor(
    private readonly usecase: AddUserToWorkspaceHandler,
  ) {}

  async handler({ input, ctx }: Request<InputAddUserToWorkspace, AuthContext>): Promise<OutputAddUserToWorkspace> {
    const roleVo = Result.unwrapOrThrow(
      createRole(input.role as UserRole),
      InvalidRoleErrorToTRPC
    );

		const newUserIdVo = Result.unwrapOrThrow(
			userIdFromString(input.newUserId),
			InvalidIdFormatErrorToTRPC
		)

		const actorUserId = Result.unwrapOrThrow(
			userIdFromString(((ctx.user?.id) ?? "")),
			InvalidIdFormatErrorToTRPC
		)

		const workspaceIdVo = Result.unwrapOrThrow(
			workspaceIdFromString(input.workspaceId),
			InvalidIdFormatErrorToTRPC
		)

    const command = {
      newUserId: newUserIdVo,
      actorUserId: actorUserId,
      workspaceId: workspaceIdVo,
      role: roleVo,
    };

    const result = Result.unwrapOrThrow(
      await this.usecase.handle(command),
      mapErr
    );

    return {
      userId: result.userId,
      workspaceId: result.workspaceId,
      role: result.role,
    };
  }
}
