import { Result } from "@backend/libs/result";
import type { IssueReadRepository, IssueWriteRepository } from "../../domain/repositories";
import { type IssueDomainError, createUserNotWorkspaceMemberError, createCannotModifyDeletedIssueError, createAssigneeNotFoundError } from "../../domain/errors";
import type { WorkspaceMembershipChecker } from "../../domain/services/permission-checker";
import type { ExistChecker } from "../../domain/services/exist-checker";
import type { UserId } from "../../domain/value-objects/user-id";
import { assignIssueToUser, isDeleted } from "../../domain/entities";
import type { Timestamp } from "@backend/libs/primitives";
import type { AssignIssueToUserCommand } from "../dto";

export class AssignIssueToUserHandler {
  constructor(
    private readonly writeRepo: IssueWriteRepository,
    private readonly readRepo: IssueReadRepository,
    private readonly workspacePermissionChecker: WorkspaceMembershipChecker,
    private readonly existChecker: ExistChecker<UserId>,
    private readonly now: () => Timestamp,
  ) {}

  async handle({actorUserId, issueId, workspaceId, assigneeId}: AssignIssueToUserCommand): Promise<Result<void, IssueDomainError>> {
    const [isMemberResult, isExistResult] = await Promise.all([
			this.workspacePermissionChecker.isMember(actorUserId, workspaceId),
			// TODO сделать проверку в других юзкейсах тоже
			this.existChecker.exists(actorUserId, workspaceId),
		]);

		if (!isMemberResult.ok) {
			return isMemberResult;
		}
		if (!isMemberResult.value) {
			return Result.err(
				createUserNotWorkspaceMemberError(actorUserId, workspaceId),
			);
		}

		if (!isExistResult.ok) {
			return isExistResult;
		}

		if (!isExistResult.value) {
			return Result.err(createAssigneeNotFoundError(actorUserId));
		}

    const issue = await this.readRepo.findById(issueId);
    if (!issue.ok) {
      return issue;
    }

    if (isDeleted(issue.value)) {
      return Result.err(createCannotModifyDeletedIssueError(issueId));
    }

    const updatedIssue = assignIssueToUser(issue.value, assigneeId, this.now());

    return await this.writeRepo.save(updatedIssue);
  }
}
