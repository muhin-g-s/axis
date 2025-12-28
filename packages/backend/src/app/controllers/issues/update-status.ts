import { type } from "arktype";
import { InvalidIdFormatErrorToTRPC, type Request } from "@backend/libs/trpc";
import { Result } from "@backend/libs/result";
import type { UpdateIssueStatusHandler } from "@backend/modules/issues/application/handlers/update-status";
import { mapErr } from "./error";
import type { AuthContext } from "@backend/app/server/init";
import { userIdFromString } from "@backend/modules/issues/domain/value-objects/user-id";
import { workspaceIdFromString } from "@backend/modules/issues/domain/value-objects/workspace-id";
import { issueIdFromString } from "@backend/modules/issues/domain/value-objects/id";
import { statusIdFromString } from "@backend/modules/issues/domain/value-objects/status-id";

export const inputUpdateIssueStatusSchema = type({
  issueId: 'string',
  workspaceId: 'string',
  statusId: 'string',
});

type InputUpdateIssueStatus = typeof inputUpdateIssueStatusSchema.infer;

export interface OutputUpdateIssueStatus {
  success: boolean;
}

export class UpdateIssueStatusController {
  constructor(
    private readonly usecase: UpdateIssueStatusHandler,
  ) {}

  async handler({ input, ctx }: Request<InputUpdateIssueStatus, AuthContext>): Promise<OutputUpdateIssueStatus> {
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

    const statusIdVo = Result.unwrapOrThrow(
      statusIdFromString(input.statusId),
      InvalidIdFormatErrorToTRPC
    );

    const command = {
      actorUserId,
      workspaceId: workspaceIdVo,
      issueId: issueIdVo,
      statusId: statusIdVo,
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