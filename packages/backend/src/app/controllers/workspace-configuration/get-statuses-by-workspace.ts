import { type } from "arktype";
import { InvalidIdFormatErrorToTRPC, type Request } from "@backend/libs/trpc";
import { Result } from "@backend/libs/result";
import type { GetStatusesByWorkspaceHandler } from "@backend/modules/workspace-configuration/application/handlers/get-statuses-by-workspace";
import { mapErr } from "./error";
import type { AuthContext } from "@backend/app/server/init";
import { userIdFromString } from "@backend/modules/workspaces/domain/value-objects/user-id";
import { workspaceIdFromString } from "@backend/modules/workspaces/domain/value-objects/workspace-id";

export const inputGetStatusesByWorkspaceSchema = type({
  workspaceId: 'string',
});

type InputGetStatusesByWorkspace = typeof inputGetStatusesByWorkspaceSchema.infer;

export interface OutputGetStatusesByWorkspace {
  statuses: {
    id: string;
    name: string;
    order: number;
    workspaceId: string;
  }[];
}

export class GetStatusesByWorkspaceController {
  constructor(
    private readonly usecase: GetStatusesByWorkspaceHandler,
  ) {}

  async handler({ input, ctx }: Request<InputGetStatusesByWorkspace, AuthContext>): Promise<OutputGetStatusesByWorkspace> {
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
      statuses: result.map(status => ({
        id: status.id,
        name: status.name,
        order: status.order,
        workspaceId: status.workspaceId,
      })),
    };
  }
}
