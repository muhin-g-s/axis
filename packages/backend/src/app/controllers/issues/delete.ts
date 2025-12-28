import { type } from "arktype";
import { InvalidIdFormatErrorToTRPC, type Request } from "@backend/libs/trpc";
import { Result } from "@backend/libs/result";
import type { DeleteIssueHandler } from "@backend/modules/issues/application/handlers/delete";
import { mapErr } from "./error";
import type { AuthContext } from "@backend/app/server/init";
import { userIdFromString } from "@backend/modules/issues/domain/value-objects/user-id";
import { workspaceIdFromString } from "@backend/modules/issues/domain/value-objects/workspace-id";
import { issueIdFromString } from "@backend/modules/issues/domain/value-objects/id";

export const inputDeleteIssueSchema = type({
  issueId: 'string',
  workspaceId: 'string',
});

type InputDeleteIssue = typeof inputDeleteIssueSchema.infer;

export interface OutputDeleteIssue {
  success: boolean;
}

export class DeleteIssueController {
  constructor(
    private readonly usecase: DeleteIssueHandler,
  ) {}

  async handler({ input, ctx }: Request<InputDeleteIssue, AuthContext>): Promise<OutputDeleteIssue> {
    const actorUserId = Result.unwrapOrThrow(
      userIdFromString(ctx.user?.id ?? ""),
      InvalidIdFormatErrorToTRPC
    );

    const workspaceIdVo = Result.unwrapOrThrow(
      workspaceIdFromString(input.workspaceId),
      InvalidIdFormatErrorToTRPC
    );

    const issueIdVo = Result.unwrapOrThrow(
      issueIdFromString(input.issueId),
      InvalidIdFormatErrorToTRPC
    );

    const command = {
      actorUserId,
      workspaceId: workspaceIdVo,
      issueId: issueIdVo,
    };

    Result.unwrapOrThrow(
      await this.usecase.handle(command),
      mapErr
    );

    return {
      success: true,
    };
  }
}