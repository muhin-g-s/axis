import { type } from "arktype";
import { InvalidIdFormatErrorToTRPC, type Request } from "@backend/libs/trpc";
import { Result } from "@backend/libs/result";
import type { GetProjectsByWorkspaceHandler } from "@backend/modules/projects/application/handlers/get-projects-by-workspace";
import { mapErr } from "./error";
import type { AuthContext } from "@backend/app/server/init";
import { userIdFromString } from "@backend/modules/projects/domain/value-objects/user-id";
import { workspaceIdFromString } from "@backend/modules/projects/domain/value-objects/workspace-id";

export const inputGetProjectsByWorkspaceSchema = type({
  workspaceId: 'string',
});

type InputGetProjectsByWorkspace = typeof inputGetProjectsByWorkspaceSchema.infer;

export interface OutputGetProjectsByWorkspace {
  projects: {
    id: string;
    workspaceId: string;
    name: string;
    createdAt: number;
    updatedAt: number;
    deletedAt: number | null;
  }[];
}

export class GetProjectsByWorkspaceController {
  constructor(
    private readonly usecase: GetProjectsByWorkspaceHandler,
  ) {}

  async handler({ input, ctx }: Request<InputGetProjectsByWorkspace, AuthContext>): Promise<OutputGetProjectsByWorkspace> {
    const actorUserId = Result.unwrapOrThrow(
      userIdFromString(ctx.user?.id ?? ""),
      InvalidIdFormatErrorToTRPC
    );

    const workspaceIdVo = Result.unwrapOrThrow(
      workspaceIdFromString(input.workspaceId),
      InvalidIdFormatErrorToTRPC
    );

    const command = {
      actorUserId: actorUserId,
      workspaceId: workspaceIdVo,
    };

    const projects = Result.unwrapOrThrow(
      await this.usecase.handle(command),
      mapErr
    );

    return {
      projects: projects.map(p => ({
        id: p.id,
        workspaceId: p.workspaceId,
        name: p.name,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        deletedAt: p.deletedAt ?? null,
      })),
    };
  }
}
