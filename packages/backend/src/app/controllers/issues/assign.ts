import { type } from "arktype";
import { InvalidIdFormatErrorToTRPC, type Request } from "@backend/libs/trpc";
import { Result } from "@backend/libs/result";
import type { AssignIssueToUserHandler } from "@backend/modules/issues/application/handlers/assign";
import { mapErr } from "./error";
import type { AuthContext } from "@backend/app/server/init";
import { userIdFromString } from "@backend/modules/issues/domain/value-objects/user-id";
import { workspaceIdFromString } from "@backend/modules/issues/domain/value-objects/workspace-id";
import { issueIdFromString } from "@backend/modules/issues/domain/value-objects/id";

export const inputAssignIssueSchema = type({
  issueId: 'string',
  workspaceId: 'string',
  assigneeId: 'string',
});

type InputAssignIssue = typeof inputAssignIssueSchema.infer;

export interface OutputAssignIssue {
  success: boolean;
}

export class AssignIssueController {
  constructor(
    private readonly usecase: AssignIssueToUserHandler,
  ) {}

  async handler({ input, ctx }: Request<InputAssignIssue, AuthContext>): Promise<OutputAssignIssue> {
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

    const assigneeIdVo = Result.unwrapOrThrow(
			userIdFromString(input.assigneeId),
			InvalidIdFormatErrorToTRPC
		)

    const command = {
      actorUserId,
      workspaceId: workspaceIdVo,
      issueId: issueIdVo,
      assigneeId: assigneeIdVo,
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
