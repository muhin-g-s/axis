import { Result } from "@backend/libs/result";
import type { Timestamp } from "@backend/libs/primitives";
import type { IssueReadRepository, IssueWriteRepository } from "../../domain/repositories";
import { type IssueDomainError, createUserNotWorkspaceMemberError, createCannotModifyDeletedIssueError } from "../../domain/errors";
import type { WorkspaceMembershipChecker } from "../../domain/services/permission-checker";
import { deleteIssue, isDeleted } from "../../domain/entities";
import type { DeleteIssueCommand } from "../dto";

export class DeleteIssueHandler {
  constructor(
    private readonly writeRepo: IssueWriteRepository,
    private readonly readRepo: IssueReadRepository,
    private readonly workspacePermissionChecker: WorkspaceMembershipChecker,
    private readonly now: () => Timestamp,
  ) {}

  async handle({actorUserId, issueId, workspaceId}: DeleteIssueCommand): Promise<Result<void, IssueDomainError>> {
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

    if (isDeleted(issue.value)) {
      return Result.err(createCannotModifyDeletedIssueError(issueId));
    }

    const deletedIssue = deleteIssue(issue.value, this.now());
    return await this.writeRepo.delete(deletedIssue.id);
  }
}
