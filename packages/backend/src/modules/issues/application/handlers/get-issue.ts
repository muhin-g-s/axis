import { Result } from "@backend/libs/result";
import type { IssueReadRepository } from "../../domain/repositories";
import { createUserNotWorkspaceMemberError, type IssueDomainError } from "../../domain/errors";
import type { WorkspaceMembershipChecker } from "../../domain/services/permission-checker";
import type { Issue } from "../../domain/entities";
import type { GetIssueQuery } from "../dto";

export class GetIssueHandler {
  constructor(
    private readonly readRepo: IssueReadRepository,
    private readonly workspacePermissionChecker: WorkspaceMembershipChecker,
  ) {}

  async handle({actorUserId, issueId, workspaceId}: GetIssueQuery): Promise<Result<Issue, IssueDomainError>> {
    const isMemberResult = await this.workspacePermissionChecker.isMember(actorUserId, workspaceId);
    if (!isMemberResult.ok) {
      return isMemberResult;
    }
    if (!isMemberResult.value) {
      return Result.err(createUserNotWorkspaceMemberError(actorUserId, workspaceId));
    }

    const issue = await this.readRepo.findById(issueId);

    if (!issue.ok) {
      return issue;
    }

    return issue;
  }
}
