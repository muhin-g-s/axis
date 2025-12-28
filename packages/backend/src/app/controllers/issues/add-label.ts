import { type } from "arktype";
import { InvalidIdFormatErrorToTRPC, type Request } from "@backend/libs/trpc";
import { Result } from "@backend/libs/result";
import type { AddLabelToIssueHandler } from "@backend/modules/issues/application/handlers/add-label";
import { mapErr } from "./error";
import type { AuthContext } from "@backend/app/server/init";
import { userIdFromString } from "@backend/modules/issues/domain/value-objects/user-id";
import { workspaceIdFromString } from "@backend/modules/issues/domain/value-objects/workspace-id";
import { issueIdFromString } from "@backend/modules/issues/domain/value-objects/id";
import { labelIdFromString } from "@backend/modules/issues/domain/value-objects/label-id";

export const inputAddLabelToIssueSchema = type({
  issueId: 'string',
  workspaceId: 'string',
  labelId: 'string',
});

type InputAddLabelToIssue = typeof inputAddLabelToIssueSchema.infer;

export interface OutputAddLabelToIssue {
  success: boolean;
}

export class AddLabelToIssueController {
  constructor(
    private readonly usecase: AddLabelToIssueHandler,
  ) {}

  async handler({ input, ctx }: Request<InputAddLabelToIssue, AuthContext>): Promise<OutputAddLabelToIssue> {
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

    const labelIdVo = Result.unwrapOrThrow(
      labelIdFromString(input.labelId),
      InvalidIdFormatErrorToTRPC
    );

    const command = {
      actorUserId,
      workspaceId: workspaceIdVo,
      issueId: issueIdVo,
      labelId: labelIdVo,
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