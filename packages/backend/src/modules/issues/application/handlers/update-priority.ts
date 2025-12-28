import { Result } from "@backend/libs/result";
import type { IssueReadRepository, IssueWriteRepository } from "../../domain/repositories";
import type { UpdateIssuePriorityCommand } from "../dto";
import {
  type IssueDomainError,
  createUserNotWorkspaceMemberError,
  createPriorityNotFoundError,
	createCannotModifyDeletedIssueError,
} from "../../domain/errors";
import type { WorkspaceMembershipChecker } from "../../domain/services/permission-checker";
import type { ExistChecker } from "../../domain/services/exist-checker";
import type { PriorityId } from "../../domain/value-objects/priority-id";
import { isDeleted, updateIssuePriority } from "../../domain/entities";
import type { Timestamp } from "@backend/libs/primitives";

export class UpdateIssuePriorityHandler {
  constructor(
    private readonly writeRepo: IssueWriteRepository,
		private readonly readRepo: IssueReadRepository,
    private readonly workspacePermissionChecker: WorkspaceMembershipChecker,
    private readonly existChecker: ExistChecker<PriorityId>,
		private readonly now: () => Timestamp,
  ) {}

  async handle({
    actorUserId,
    issueId,
    priorityId,
    workspaceId,
  }: UpdateIssuePriorityCommand): Promise<Result<void, IssueDomainError>> {
    const [isMemberResult, isExistResult] = await Promise.all([
      this.workspacePermissionChecker.isMember(actorUserId, workspaceId),
      this.existChecker.exists(priorityId, workspaceId),
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
      return Result.err(createPriorityNotFoundError(priorityId));
    }

		const issueResult = await this.readRepo.findById(issueId);
		if (!issueResult.ok) {
			return issueResult;
		}

		let issue = issueResult.value;

		if(isDeleted(issue)) {
			Result.err(createCannotModifyDeletedIssueError(issueId));
		}

		issue = updateIssuePriority(issue, priorityId, this.now());

    const saveResult = await this.writeRepo.save(issue);

    return saveResult;
  }
}
