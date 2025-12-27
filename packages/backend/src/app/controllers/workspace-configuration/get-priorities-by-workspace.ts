import { type } from "arktype";
import { InvalidIdFormatErrorToTRPC, type Request } from "@backend/libs/trpc";
import { Result } from "@backend/libs/result";
import type { GetPrioritiesByWorkspaceHandler } from "@backend/modules/workspace-configuration/application/handlers/get-priorities-by-workspace";
import { mapErr } from "./error";
import type { AuthContext } from "@backend/app/server/init";
import { userIdFromString } from "@backend/modules/workspace-configuration/domain/value-objects/user-id";
import { workspaceIdFromString } from "@backend/modules/workspace-configuration/domain/value-objects/workspace-id";

export const inputGetPrioritiesByWorkspaceSchema = type({
  workspaceId: 'string',
});

type InputGetPrioritiesByWorkspace = typeof inputGetPrioritiesByWorkspaceSchema.infer;

export interface OutputGetPrioritiesByWorkspace {
  priorities: {
    id: string;
    name: string;
    level: number;
    workspaceId: string;
  }[];
}

export class GetPrioritiesByWorkspaceController {
  constructor(
    private readonly usecase: GetPrioritiesByWorkspaceHandler,
  ) {}

  async handler({ input, ctx }: Request<InputGetPrioritiesByWorkspace, AuthContext>): Promise<OutputGetPrioritiesByWorkspace> {
    const actorUserId = Result.unwrapOrThrow(
      userIdFromString(ctx.user?.id ?? ""),
      InvalidIdFormatErrorToTRPC
    );

    const workspaceIdVo = Result.unwrapOrThrow(
      workspaceIdFromString(input.workspaceId),
      InvalidIdFormatErrorToTRPC
    );

    const command = {
      actorUserId: actorUserId,
      workspaceId: workspaceIdVo,
    };

    const result = Result.unwrapOrThrow(
      await this.usecase.handle(command),
      mapErr
    );

    return {
      priorities: result.map(priority => ({
        id: priority.id,
        name: priority.name,
        level: priority.level,
        workspaceId: priority.workspaceId,
      })),
    };
  }
}
