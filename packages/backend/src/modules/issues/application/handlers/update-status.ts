import { Result } from "@backend/libs/result";
import type { Timestamp } from "@backend/libs/primitives";
import type {
  IssueReadRepository,
  IssueWriteRepository,
} from "../../domain/repositories";
import type { UpdateIssueStatusCommand } from "../dto";
import {
  type IssueDomainError,
  createUserNotWorkspaceMemberError,
  createStatusNotFoundError,
  createCannotModifyDeletedIssueError,
} from "../../domain/errors";
import type { WorkspaceMembershipChecker } from "../../domain/services/permission-checker";
import type { ExistChecker } from "../../domain/services/exist-checker";
import type { StatusId } from "../../domain/value-objects/status-id";
import { isDeleted, updateIssueStatus } from "../../domain/entities";

export class UpdateIssueStatusHandler {
  constructor(
    private readonly writeRepo: IssueWriteRepository,
    private readonly readRepo: IssueReadRepository,
    private readonly workspacePermissionChecker: WorkspaceMembershipChecker,
    private readonly existChecker: ExistChecker<StatusId>,
    private readonly now: () => Timestamp,
  ) {}

  async handle({
    actorUserId,
    issueId,
    statusId,
    workspaceId,
  }: UpdateIssueStatusCommand): Promise<Result<void, IssueDomainError>> {

    const [isMemberResult, isExistResult] = await Promise.all([
      this.workspacePermissionChecker.isMember(actorUserId, workspaceId),
      this.existChecker.exists(statusId, workspaceId),
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
      return Result.err(createStatusNotFoundError(statusId));
    }

    const issueResult = await this.readRepo.findById(issueId);
    if (!issueResult.ok) {
      return issueResult;
    }

    let issue = issueResult.value;

    if (isDeleted(issue)) {
      return Result.err(
        createCannotModifyDeletedIssueError(issueId),
      );
    }

    issue = updateIssueStatus(issue, statusId, this.now());

    return this.writeRepo.save(issue);
  }
}
