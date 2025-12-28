import { type } from "arktype";
import { InvalidIdFormatErrorToTRPC, type Request } from "@backend/libs/trpc";
import { Result } from "@backend/libs/result";
import type { GetIssueHandler } from "@backend/modules/issues/application/handlers/get-issue";
import { mapErr } from "./error";
import type { AuthContext } from "@backend/app/server/init";
import { userIdFromString } from "@backend/modules/issues/domain/value-objects/user-id";
import { workspaceIdFromString } from "@backend/modules/issues/domain/value-objects/workspace-id";
import { issueIdFromString } from "@backend/modules/issues/domain/value-objects/id";

export const inputGetIssueSchema = type({
  issueId: 'string',
  workspaceId: 'string',
});

type InputGetIssue = typeof inputGetIssueSchema.infer;

export interface OutputGetIssue {
  id: string;
  projectId: string;
  workspaceId: string;
  title: string;
  description: string;
  statusId: string | null;
  priorityId: string | null;
  assigneeId: string | null;
  createdAt: number;
  updatedAt: number;
  deletedAt: number | null;
}

export class GetIssueController {
  constructor(
    private readonly usecase: GetIssueHandler,
  ) {}

  async handler({ input, ctx }: Request<InputGetIssue, AuthContext>): Promise<OutputGetIssue> {
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

    const query = {
      actorUserId,
      workspaceId: workspaceIdVo,
      issueId: issueIdVo,
    };

    const issue = Result.unwrapOrThrow(
      await this.usecase.handle(query),
      mapErr
    );

    return {
      id: issue.id,
      projectId: issue.projectId,
      workspaceId: workspaceIdVo,
      title: issue.title,
      description: issue.description,
      statusId: issue.statusId ?? null,
      priorityId: issue.priorityId ?? null,
      assigneeId: issue.assigneeId ?? null,
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt,
      deletedAt: issue.deletedAt ?? null,
    };
  }
}
