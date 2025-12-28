import { type } from "arktype";
import { InvalidIdFormatErrorToTRPC, type Request } from "@backend/libs/trpc";
import { Result } from "@backend/libs/result";
import type { GetProjectIssuesHandler } from "@backend/modules/issues/application/handlers/get-project-issues";
import { mapErr } from "./error";
import type { AuthContext } from "@backend/app/server/init";
import { userIdFromString } from "@backend/modules/issues/domain/value-objects/user-id";
import { workspaceIdFromString } from "@backend/modules/issues/domain/value-objects/workspace-id";
import { projectIdFromString } from "@backend/modules/issues/domain/value-objects/project-id";
import { statusIdFromString } from "@backend/modules/issues/domain/value-objects/status-id";
import { priorityIdFromString } from "@backend/modules/issues/domain/value-objects/priority-id";
import { labelIdFromString } from "@backend/modules/issues/domain/value-objects/label-id";

export const inputGetProjectIssuesSchema = type({
  projectId: 'string',
  workspaceId: 'string',
  statusId: 'string?',
  priorityId: 'string?',
  labelIds: 'string[]?',
});

type InputGetProjectIssues = typeof inputGetProjectIssuesSchema.infer;

export interface OutputGetProjectIssues {
  issues: {
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
  }[];
}

export class GetProjectIssuesController {
  constructor(
    private readonly usecase: GetProjectIssuesHandler,
  ) {}

  async handler({ input, ctx }: Request<InputGetProjectIssues, AuthContext>): Promise<OutputGetProjectIssues> {
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

    const query = {
      actorUserId,
      workspaceId: workspaceIdVo,
      projectId: projectIdVo,
			...(
				input.statusId !== undefined
				&& {
					statusId: Result.unwrapOrThrow(
						statusIdFromString(input.statusId),
						InvalidIdFormatErrorToTRPC
					)
				}
			),
			...(
				input.priorityId !== undefined
			 	&& {
					priorityId: Result.unwrapOrThrow(
						priorityIdFromString(input.priorityId),
						InvalidIdFormatErrorToTRPC
					)
				}
			),
			...(
				input.labelIds !== undefined
				&& {
					labelIds: input.labelIds
						.map(id =>
							Result.unwrapOrThrow(
								labelIdFromString(id),
								InvalidIdFormatErrorToTRPC
							)
						)
				}
			),
    };

    const issues = Result.unwrapOrThrow(
      await this.usecase.handle(query),
      mapErr
    );

    return {
      issues: issues.map(issue => ({
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
      })),
    };
  }
}
