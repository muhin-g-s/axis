import { Result } from "@backend/libs/result";
import type { GetUserWorkspacesQuery, UserWorkspace } from "../dto";
import type { WorkspaceDomainError } from "../../domain/errors";
import type { WorkspaceReadRepository } from "../../domain/repositories/read";

export class GetUserWorkspacesHandler {
  constructor(private readonly readRepo: WorkspaceReadRepository) {}

  async handle(query: GetUserWorkspacesQuery): Promise<Result<UserWorkspace[], WorkspaceDomainError>> {
    const result = await this.readRepo.findWorkspaceUsersByUserId(query.userId);

    if (!result.ok) {
      return result;
    }

    const workspaceUsers = result.value;

    const workspacesResult = await Promise.all(
      workspaceUsers
				.map(async (workspaceUser) => {
					const workspaceResult = await this.readRepo.findById(workspaceUser.workspaceId);
					if (!workspaceResult.ok) {
						return null;
					}

					const workspace = workspaceResult.value;
					return {
						workspaceId: workspace.id,
						name: workspace.name,
						role: workspaceUser.role,
        };
      })
    );

    const validWorkspaces = workspacesResult.filter((ws): ws is UserWorkspace => ws !== null);

    return Result.ok(validWorkspaces);
  }
}
