import { type } from "arktype";
import { InvalidIdFormatErrorToTRPC, type Request } from "@backend/libs/trpc";
import { Result } from "@backend/libs/result";
import type { UpdateIssuePriorityHandler } from "@backend/modules/issues/application/handlers/update-priority";
import { mapErr } from "./error";
import type { AuthContext } from "@backend/app/server/init";
import { userIdFromString } from "@backend/modules/issues/domain/value-objects/user-id";
import { workspaceIdFromString } from "@backend/modules/issues/domain/value-objects/workspace-id";
import { issueIdFromString } from "@backend/modules/issues/domain/value-objects/id";
import { priorityIdFromString } from "@backend/modules/issues/domain/value-objects/priority-id";

export const inputUpdateIssuePrioritySchema = type({
  issueId: 'string',
  workspaceId: 'string',
  priorityId: 'string',
});

type InputUpdateIssuePriority = typeof inputUpdateIssuePrioritySchema.infer;

export interface OutputUpdateIssuePriority {
  success: boolean;
}

export class UpdateIssuePriorityController {
  constructor(
    private readonly usecase: UpdateIssuePriorityHandler,
  ) {}

  async handler({ input, ctx }: Request<InputUpdateIssuePriority, AuthContext>): Promise<OutputUpdateIssuePriority> {
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

    const priorityIdVo = Result.unwrapOrThrow(
      priorityIdFromString(input.priorityId),
      InvalidIdFormatErrorToTRPC
    );

    const command = {
      actorUserId,
      workspaceId: workspaceIdVo,
      issueId: issueIdVo,
      priorityId: priorityIdVo,
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