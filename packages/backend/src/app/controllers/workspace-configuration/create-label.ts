import { type } from "arktype";
import { InvalidIdFormatErrorToTRPC, type Request } from "@backend/libs/trpc";
import { Result } from "@backend/libs/result";
import type { CreateLabelHandler } from "@backend/modules/workspace-configuration/application/handlers/create-label";
import { createLabelName } from "@backend/modules/workspace-configuration/domain/value-objects/label-name";
import { InvalidLabelNameErrorToTRPC, mapErr } from "./error";
import type { AuthContext } from "@backend/app/server/init";
import { userIdFromString } from "@backend/modules/workspaces/domain/value-objects/user-id";
import { workspaceIdFromString } from "@backend/modules/workspaces/domain/value-objects/workspace-id";

export const inputCreateLabelSchema = type({
  name: 'string',
  workspaceId: 'string',
});

type InputCreateLabel = typeof inputCreateLabelSchema.infer;

export interface OutputCreateLabel {
  id: string;
  workspaceId: string;
  name: string;
}

export class CreateLabelController {
  constructor(
    private readonly usecase: CreateLabelHandler,
  ) {}

  async handler({ input, ctx }: Request<InputCreateLabel, AuthContext>): Promise<OutputCreateLabel> {
    const actorUserId = Result.unwrapOrThrow(
      userIdFromString(ctx.user?.id ?? ""),
      InvalidIdFormatErrorToTRPC
    );

    const workspaceIdVo = Result.unwrapOrThrow(
      workspaceIdFromString(input.workspaceId),
      InvalidIdFormatErrorToTRPC
    );

    const labelNameVo = Result.unwrapOrThrow(
      createLabelName(input.name),
      InvalidLabelNameErrorToTRPC
    );

    const command = {
      actorUserId: actorUserId,
      name: labelNameVo,
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
    };
  }
}