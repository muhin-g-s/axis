import { type } from "arktype";
import { InvalidIdFormatErrorToTRPC, type Request } from "@backend/libs/trpc";
import { Result } from "@backend/libs/result";
import type { GetProjectHandler } from "@backend/modules/projects/application/handlers/get-project";
import { mapErr } from "./error";
import type { AuthContext } from "@backend/app/server/init";
import { userIdFromString } from "@backend/modules/projects/domain/value-objects/user-id";
import { workspaceIdFromString } from "@backend/modules/projects/domain/value-objects/workspace-id";
import { projectIdFromString } from "@backend/modules/projects/domain/value-objects/id";

export const inputGetProjectSchema = type({
  projectId: 'string',
  workspaceId: 'string',
});

type InputGetProject = typeof inputGetProjectSchema.infer;

export interface OutputGetProject {
  id: string;
  workspaceId: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  deletedAt: number | null;
}

export class GetProjectController {
  constructor(
    private readonly usecase: GetProjectHandler,
  ) {}

  async handler({ input, ctx }: Request<InputGetProject, AuthContext>): Promise<OutputGetProject> {
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

    const command = {
      actorUserId: actorUserId,
      workspaceId: workspaceIdVo,
      id: projectIdVo,
    };

    const result = Result.unwrapOrThrow(
      await this.usecase.handle(command),
      mapErr
    );

    if (result === null) {
      throw new Error('Project not found');
    }

    return {
      id: result.id,
      workspaceId: result.workspaceId,
      name: result.name,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      deletedAt: result.deletedAt ?? null,
    };
  }
}
