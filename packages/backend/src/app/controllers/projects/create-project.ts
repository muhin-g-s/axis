import { type } from "arktype";
import { InvalidIdFormatErrorToTRPC, type Request } from "@backend/libs/trpc";
import { Result } from "@backend/libs/result";
import type { CreateProjectHandler } from "@backend/modules/projects/application/handlers/create";
import { projectNameFromString, ProjectNameSchema } from "@backend/modules/projects/domain/value-objects/name";
import { InvalidProjectNameErrorToTRPC, mapErr } from "./error";
import type { AuthContext } from "@backend/app/server/init";
import { userIdFromString } from "@backend/modules/projects/domain/value-objects/user-id";
import { workspaceIdFromString } from "@backend/modules/projects/domain/value-objects/workspace-id";

export const inputCreateProjectSchema = type({
  name: ProjectNameSchema,
  workspaceId: 'string',
});

type InputCreateProject = typeof inputCreateProjectSchema.infer;

export interface OutputCreateProject {
  id: string;
  workspaceId: string;
  name: string;
}

export class CreateProjectController {
  constructor(
    private readonly usecase: CreateProjectHandler,
  ) {}

  async handler({ input, ctx }: Request<InputCreateProject, AuthContext>): Promise<OutputCreateProject> {
    const actorUserId = Result.unwrapOrThrow(
      userIdFromString(ctx.user?.id ?? ""),
      InvalidIdFormatErrorToTRPC
    );

    const workspaceIdVo = Result.unwrapOrThrow(
      workspaceIdFromString(input.workspaceId),
      InvalidIdFormatErrorToTRPC
    );

    const projectNameVo = Result.unwrapOrThrow(
      projectNameFromString(input.name),
      InvalidProjectNameErrorToTRPC
    );

    const command = {
      actorUserId: actorUserId,
      name: projectNameVo,
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
