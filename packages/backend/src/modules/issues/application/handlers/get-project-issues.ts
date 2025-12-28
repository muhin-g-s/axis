import { Result } from "@backend/libs/result";
import type { IssueReadRepository } from "../../domain/repositories";
import type { GetProjectIssuesQuery } from "../dto";
import { createUserNotWorkspaceMemberError, type IssueDomainError } from "../../domain/errors";
import type { Issue } from "../../domain/entities";
import type { WorkspaceMembershipChecker } from "../../domain/services/permission-checker";

export class GetProjectIssuesHandler {
  constructor(
    private readonly readRepo: IssueReadRepository,
   	private readonly workspacePermissionChecker: WorkspaceMembershipChecker,
  ) {}

  async handle(query: GetProjectIssuesQuery): Promise<Result<Issue[], IssueDomainError>> {
		const isMemberResult = await this.workspacePermissionChecker.isMember(query.actorUserId, query.workspaceId);
		if (!isMemberResult.ok) {
			return isMemberResult;
		}
		if (!isMemberResult.value) {
			return Result.err(createUserNotWorkspaceMemberError(query.actorUserId, query.workspaceId));
		}

    const issuesResult = await this.readRepo.findByProjectWithFilters(
      query.projectId,
      query.statusId,
      query.priorityId,
      query.labelIds
    );

    return issuesResult;
  }
}
