import { type } from "arktype";
import { InvalidIdFormatErrorToTRPC, type Request } from "@backend/libs/trpc";
import { Result } from "@backend/libs/result";
import type { GetLabelsByWorkspaceHandler } from "@backend/modules/workspace-configuration/application/handlers/get-labels-by-workspace";
import { mapErr } from "./error";
import type { AuthContext } from "@backend/app/server/init";
import { userIdFromString } from "@backend/modules/workspaces/domain/value-objects/user-id";
import { workspaceIdFromString } from "@backend/modules/workspaces/domain/value-objects/workspace-id";

export const inputGetLabelsByWorkspaceSchema = type({
  workspaceId: 'string',
});

type InputGetLabelsByWorkspace = typeof inputGetLabelsByWorkspaceSchema.infer;

export interface OutputGetLabelsByWorkspace {
  labels: {
    id: string;
    name: string;
    workspaceId: string;
  }[];
}

export class GetLabelsByWorkspaceController {
  constructor(
    private readonly usecase: GetLabelsByWorkspaceHandler,
  ) {}

  async handler({ input, ctx }: Request<InputGetLabelsByWorkspace, AuthContext>): Promise<OutputGetLabelsByWorkspace> {
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
      labels: result.map(label => ({
        id: label.id,
        name: label.name,
        workspaceId: label.workspaceId,
      })),
    };
  }
}
