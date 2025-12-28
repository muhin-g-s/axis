import { type } from "arktype";
import { InvalidIdFormatErrorToTRPC, type Request } from "@backend/libs/trpc";
import { Result } from "@backend/libs/result";
import type { CreateIssueHandler } from "@backend/modules/issues/application/handlers/create";
import { issueTitleFromString } from "@backend/modules/issues/domain/value-objects/title";
import { issueDescriptionFromString } from "@backend/modules/issues/domain/value-objects/description";
import { InvalidIssueTitleErrorToTRPC, InvalidIssueDescriptionErrorToTRPC, mapErr } from "./error";
import type { AuthContext } from "@backend/app/server/init";
import { userIdFromString } from "@backend/modules/issues/domain/value-objects/user-id";
import { workspaceIdFromString } from "@backend/modules/issues/domain/value-objects/workspace-id";
import { projectIdFromString } from "@backend/modules/issues/domain/value-objects/project-id";

export const inputCreateIssueSchema = type({
  projectId: 'string',
  workspaceId: 'string',
  title: 'string',
  description: 'string',
});

type InputCreateIssue = typeof inputCreateIssueSchema.infer;

export interface OutputCreateIssue {
  id: string;
  projectId: string;
  title: string;
  description: string;
  statusId: string | null;
  priorityId: string | null;
  assigneeId: string | null;
  createdAt: number;
  updatedAt: number;
}

export class CreateIssueController {
  constructor(
    private readonly usecase: CreateIssueHandler,
  ) {}

  async handler({ input, ctx }: Request<InputCreateIssue, AuthContext>): Promise<OutputCreateIssue> {
    const actorUserId = Result.unwrapOrThrow(
      userIdFromString(ctx.user?.id ?? ""),
      InvalidIdFormatErrorToTRPC
    );

    const workspaceIdVo = Result.unwrapOrThrow(
      workspaceIdFromString(input.workspaceId),
      InvalidIdFormatErrorToTRPC
    );

    const projectIdVo = Result.unwrapOrThrow(
      projectIdFromString(input.projectId),
      InvalidIdFormatErrorToTRPC
    );

    const titleVo = Result.unwrapOrThrow(
      issueTitleFromString(input.title),
      InvalidIssueTitleErrorToTRPC
    );

    const descriptionVo = Result.unwrapOrThrow(
      issueDescriptionFromString(input.description),
      InvalidIssueDescriptionErrorToTRPC
    );

    const command = {
      actorUserId,
      workspaceId: workspaceIdVo,
      projectId: projectIdVo,
      title: titleVo,
      description: descriptionVo,
    };

    const result = Result.unwrapOrThrow(
      await this.usecase.handle(command),
      mapErr
    );

    return {
      id: result.id,
      projectId: result.projectId,
      title: result.title,
      description: result.description,
      statusId: result.statusId ?? null,
      priorityId: result.priorityId ?? null,
      assigneeId: result.assigneeId ?? null,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }
}
