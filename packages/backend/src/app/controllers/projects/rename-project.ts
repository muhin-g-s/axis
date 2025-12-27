import { type } from "arktype";
import { InvalidIdFormatErrorToTRPC, type Request } from "@backend/libs/trpc";
import { Result } from "@backend/libs/result";
import type { RenameProjectHandler } from "@backend/modules/projects/application/handlers/rename";
import { projectNameFromString, ProjectNameSchema } from "@backend/modules/projects/domain/value-objects/name";
import { InvalidProjectNameErrorToTRPC, mapErr } from "./error";
import type { AuthContext } from "@backend/app/server/init";
import { userIdFromString } from "@backend/modules/projects/domain/value-objects/user-id";
import { workspaceIdFromString } from "@backend/modules/projects/domain/value-objects/workspace-id";
import { projectIdFromString } from "@backend/modules/projects/domain/value-objects/id";

export const inputRenameProjectSchema = type({
  projectId: 'string',
  workspaceId: 'string',
  newName: ProjectNameSchema,
});

type InputRenameProject = typeof inputRenameProjectSchema.infer;

export interface OutputRenameProject {
  success: boolean;
}

export class RenameProjectController {
  constructor(
    private readonly usecase: RenameProjectHandler,
  ) {}

  async handler({ input, ctx }: Request<InputRenameProject, AuthContext>): Promise<OutputRenameProject> {
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

    const newNameVo = Result.unwrapOrThrow(
      projectNameFromString(input.newName),
      InvalidProjectNameErrorToTRPC
    );

    const command = {
      actorUserId: actorUserId,
      workspaceId: workspaceIdVo,
      id: projectIdVo,
      newName: newNameVo,
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
