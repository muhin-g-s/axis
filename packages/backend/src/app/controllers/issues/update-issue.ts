import { type } from "arktype";
import { InvalidIdFormatErrorToTRPC, type Request } from "@backend/libs/trpc";
import { Result } from "@backend/libs/result";
import type { UpdateIssueHandler } from "@backend/modules/issues/application/handlers/update-issue";
import { issueTitleFromString } from "@backend/modules/issues/domain/value-objects/title";
import { issueDescriptionFromString } from "@backend/modules/issues/domain/value-objects/description";
import { InvalidIssueTitleErrorToTRPC, InvalidIssueDescriptionErrorToTRPC, mapErr } from "./error";
import type { AuthContext } from "@backend/app/server/init";
import { userIdFromString } from "@backend/modules/issues/domain/value-objects/user-id";
import { workspaceIdFromString } from "@backend/modules/issues/domain/value-objects/workspace-id";
import { issueIdFromString } from "@backend/modules/issues/domain/value-objects/id";

export const inputUpdateIssueSchema = type({
  issueId: 'string',
  workspaceId: 'string',
  title: 'string?',
  description: 'string?',
});

type InputUpdateIssue = typeof inputUpdateIssueSchema.infer;

export interface OutputUpdateIssue {
  success: boolean;
}

export class UpdateIssueController {
  constructor(
    private readonly usecase: UpdateIssueHandler,
  ) {}

  async handler({ input, ctx }: Request<InputUpdateIssue, AuthContext>): Promise<OutputUpdateIssue> {
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

    const titleVo = input.title !== undefined
			? Result.unwrapOrThrow(
				issueTitleFromString(input.title),
				InvalidIssueTitleErrorToTRPC
			) : null;

    const descriptionVo = input.description !== undefined
			? Result.unwrapOrThrow(
				issueDescriptionFromString(input.description),
				InvalidIssueDescriptionErrorToTRPC
			) : null;

    const command = {
      actorUserId,
      workspaceId: workspaceIdVo,
      issueId: issueIdVo,
      title: titleVo,
      description: descriptionVo,
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
