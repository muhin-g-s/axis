import { Result } from "@backend/libs/result";
import type { IssueReadRepository, IssueWriteRepository } from "../../domain/repositories";
import type { AddLabelToIssueCommand } from "../dto";
import { type
	IssueDomainError,
	createCannotModifyDeletedIssueError,
	createLabelNotFoundError,
	createUserNotWorkspaceMemberError
} from "../../domain/errors";
import type { WorkspaceMembershipChecker } from "../../domain/services/permission-checker";
import type { ExistChecker } from "../../domain/services/exist-checker";
import type { LabelId } from "../../domain/value-objects/label-id";
import { addLabelToIssue, isDeleted } from "../../domain/entities";
import type { Timestamp } from "@backend/libs/primitives";

export class AddLabelToIssueHandler {
  constructor(
    private readonly writeRepo: IssueWriteRepository,
		private readonly readRepo: IssueReadRepository,
    private readonly workspacePermissionChecker: WorkspaceMembershipChecker,
		private readonly existChecker: ExistChecker<LabelId>,
		private readonly now: () => Timestamp
  ) {}

  async handle({actorUserId, issueId, labelId, workspaceId}: AddLabelToIssueCommand): Promise<Result<void, IssueDomainError>> {
    const [isMemberResult, isExistResult] = await Promise.all([
        this.workspacePermissionChecker.isMember(actorUserId, workspaceId),
        this.existChecker.exists(labelId, workspaceId)
    ]);

    if (!isMemberResult.ok) {
        return isMemberResult;
    }
    if (!isMemberResult.value) {
        return Result.err(createUserNotWorkspaceMemberError(actorUserId, workspaceId));
    }

    if (!isExistResult.ok) {
        return isExistResult;
    }
    if (!isExistResult.value) {
        return Result.err(createLabelNotFoundError(labelId));
    }

    const issueResult = await this.readRepo.findById(issueId);
		if (!issueResult.ok) {
			return issueResult;
		}

		let issue = issueResult.value;

		if(isDeleted(issue)) {
			return Result.err(createCannotModifyDeletedIssueError(issueId));
		}

		issue = addLabelToIssue(issue, labelId, this.now());

		await this.writeRepo.save(issue);

		return Result.ok(undefined);
  }
}
