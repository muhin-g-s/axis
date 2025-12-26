import { type } from "arktype";
import { InvalidIdFormatErrorToTRPC, type Request } from "@backend/libs/trpc";
import { Result } from "@backend/libs/result";
import type { CreateWorkspaceHandler } from "@backend/modules/workspaces/application/handlers/create-workspace-handler";
import { NonEmptyStringSchema } from "@backend/libs/primitives";
import { mapErr } from "./error";
import type { AuthContext } from "@backend/app/server/init";
import { userIdFromString } from "@backend/modules/workspaces/domain/value-objects/user-id";
import { workspaceNameFromString } from "@backend/modules/workspaces/domain/value-objects/workspace-name";

export const inputCreateWorkspaceSchema = type({
  name: NonEmptyStringSchema,
});

type InputCreateWorkspace = typeof inputCreateWorkspaceSchema.infer;

export interface OutputCreateWorkspace {
  workspaceId: string;
  name: string;
}

export class CreateWorkspaceController {
  constructor(private readonly usecase: CreateWorkspaceHandler) {}

  async handler({
    input,
    ctx,
  }: Request<InputCreateWorkspace, AuthContext>): Promise<OutputCreateWorkspace> {
    const userIdVo = Result.unwrapOrThrow(
      userIdFromString(ctx.user?.id ?? ""),
      InvalidIdFormatErrorToTRPC
    );

    const workspaceNameVo = Result.unwrapOrThrow(
      workspaceNameFromString(input.name),
      mapErr
    );

    const command = {
      userId: userIdVo,
      name: workspaceNameVo,
    };

    const result = Result.unwrapOrThrow(
      await this.usecase.handle(command),
      mapErr
    );

    return {
      workspaceId: result.id,
      name: result.name,
    };
  }
}
