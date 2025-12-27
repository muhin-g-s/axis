import { type } from "arktype";
import { InvalidIdFormatErrorToTRPC, type Request } from "@backend/libs/trpc";
import { Result } from "@backend/libs/result";
import type { CreatePriorityHandler } from "@backend/modules/workspace-configuration/application/handlers/create-priority";
import { createPriorityName } from "@backend/modules/workspace-configuration/domain/value-objects/priority-name";
import { createPriorityLevel } from "@backend/modules/workspace-configuration/domain/value-objects/priority-level";
import { InvalidPriorityNameErrorToTRPC, InvalidPriorityLevelErrorToTRPC, mapErr } from "./error";
import type { AuthContext } from "@backend/app/server/init";
import { userIdFromString } from "@backend/modules/workspace-configuration/domain/value-objects/user-id";
import { workspaceIdFromString } from "@backend/modules/workspace-configuration/domain/value-objects/workspace-id";

export const inputCreatePrioritySchema = type({
  name: 'string',
  level: 'number',
  workspaceId: 'string',
});

type InputCreatePriority = typeof inputCreatePrioritySchema.infer;

export interface OutputCreatePriority {
  id: string;
  workspaceId: string;
  name: string;
  level: number;
}

export class CreatePriorityController {
  constructor(
    private readonly usecase: CreatePriorityHandler,
  ) {}

  async handler({ input, ctx }: Request<InputCreatePriority, AuthContext>): Promise<OutputCreatePriority> {
    const actorUserId = Result.unwrapOrThrow(
      userIdFromString(ctx.user?.id ?? ""),
      InvalidIdFormatErrorToTRPC
    );

    const workspaceIdVo = Result.unwrapOrThrow(
      workspaceIdFromString(input.workspaceId),
      InvalidIdFormatErrorToTRPC
    );

    const priorityNameVo = Result.unwrapOrThrow(
      createPriorityName(input.name),
      InvalidPriorityNameErrorToTRPC
    );

    const priorityLevelVo = Result.unwrapOrThrow(
      createPriorityLevel(input.level),
      InvalidPriorityLevelErrorToTRPC
    );

    const command = {
      actorUserId: actorUserId,
      name: priorityNameVo,
      level: priorityLevelVo,
      workspaceId: workspaceIdVo,
    };

    const result = Result.unwrapOrThrow(
      await this.usecase.handle(command),
      mapErr
    );

    return {
      id: result.id,
      workspaceId: result.workspaceId,
      name: result.name,
      level: result.level,
    };
  }
}
