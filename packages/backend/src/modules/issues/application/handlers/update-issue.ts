import { match, P } from "ts-pattern";
import { Result } from "@backend/libs/result";
import type { Timestamp } from "@backend/libs/primitives";
import { pipe } from "@backend/libs/pipe";
import type { IssueReadRepository, IssueWriteRepository } from "../../domain/repositories";
import { type IssueDomainError, createUserNotWorkspaceMemberError, createCannotModifyDeletedIssueError } from "../../domain/errors";
import type { WorkspaceMembershipChecker } from "../../domain/services/permission-checker";
import { isDeleted, updateIssueDescription, updateIssueTitle } from "../../domain/entities";
import type { UpdateIssueCommand } from "../dto";

export class UpdateIssueHandler {
  constructor(
    private readonly writeRepo: IssueWriteRepository,
    private readonly readRepo: IssueReadRepository,
    private readonly workspacePermissionChecker: WorkspaceMembershipChecker,
    private readonly now: () => Timestamp,
  ) {}

  async handle(command: UpdateIssueCommand): Promise<Result<void, IssueDomainError>> {
    const isMemberResult = await this.workspacePermissionChecker.isMember(command.actorUserId, command.workspaceId);
    if (!isMemberResult.ok) {
      return isMemberResult;
    }
    if (!isMemberResult.value) {
      return Result.err(createUserNotWorkspaceMemberError(command.actorUserId, command.workspaceId));
    }

    const issue = await this.readRepo.findById(command.issueId);
    if (!issue.ok) {
      return issue;
    }

    if (isDeleted(issue.value)) {
      return Result.err(createCannotModifyDeletedIssueError(command.issueId));
    }

		const updatedIssue = match(command)
			.with(
				{ title: null, description: null },
				() => issue.value
			)
			.with(
				{ title: null, description: P.not(null) },
				c => updateIssueDescription(issue.value, c.description, this.now())
			)
			.with(
				{ description: null, title: P.not(null) },
				c => updateIssueTitle(issue.value, c.title, this.now())
			)
			.with(
				{ title: P.not(null), description: P.not(null) },
				c => pipe(
					issue.value,
					i => updateIssueTitle(i, c.title, this.now()),
					i => updateIssueDescription(i, c.description, this.now())
				)
			)
			.exhaustive()

    if (updatedIssue.updatedAt === issue.value.updatedAt) {
      return Result.ok(undefined);
    }

    return await this.writeRepo.save(updatedIssue);
  }
}
