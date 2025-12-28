/* eslint-disable @typescript-eslint/unbound-method */
import { Result } from "@backend/libs/result";
import type { Timestamp } from "@backend/libs/primitives";
import { type Issue, createIssue } from "../../domain/entities";
import type { IssueReadRepository, IssueWriteRepository } from "../../domain/repositories";
import type { CreateIssueCommand } from "../dto";
import {
	createProjectNotFoundError,
	createUserNotWorkspaceMemberError,
	isIssueNotFoundError,
	type IssueDomainError
} from "../../domain/errors";
import type { WorkspaceMembershipChecker } from "../../domain/services/permission-checker";
import type { ExistChecker } from "../../domain/services/exist-checker";
import type { ProjectId } from "../../domain/value-objects/project-id";
import { createIssueId } from "../../domain/value-objects/id";
import { createFirstUniqueIdentifier, createNextUniqueIdentifier, type UniqueIdentifier } from "../../domain/value-objects/unique-identifier";
import { match } from "ts-pattern";
import { pipe } from "@backend/libs/pipe";

export class CreateIssueHandler {
  constructor(
    private readonly writeRepo: IssueWriteRepository,
		private readonly readRepo: IssueReadRepository,
    private readonly workspacePermissionChecker: WorkspaceMembershipChecker,
		private readonly existChecker: ExistChecker<ProjectId>,
    private readonly now: () => Timestamp,
  ) {}

  async handle(command: CreateIssueCommand): Promise<Result<Issue, IssueDomainError>> {
    const [isMemberResult, isExistResult] = await Promise.all([
						this.workspacePermissionChecker.isMember(command.actorUserId, command.workspaceId),
						this.existChecker.exists(command.projectId, command.workspaceId)
		]);

		if (!isMemberResult.ok) {
				return isMemberResult;
		}
		if (!isMemberResult.value) {
				return Result.err(createUserNotWorkspaceMemberError(command.actorUserId, command.workspaceId));
		}

		if (!isExistResult.ok) {
				return isExistResult;
		}
		if (!isExistResult.value) {
				return Result.err(createProjectNotFoundError(command.projectId));
		}


		const lastAddedIssueResult = await this.readRepo.findLastAddedIssue(command.projectId);

		const issueCreator = (uniqueIdentifier: UniqueIdentifier): Issue => createIssue(
			createIssueId(),
			command.projectId,
			command.title,
			command.description,
			uniqueIdentifier,
			this.now(),
		)

		const issueResult = match(lastAddedIssueResult)
			.with(
				{ ok: true },
				({value: lastAddedIssue}) =>
					pipe(
						createNextUniqueIdentifier(lastAddedIssue.uniqueIdentifier),
						issueCreator,
						Result.ok
					)
			)
		  .with(
				{ ok: false },
				({ error }) =>
					isIssueNotFoundError(error)
					? pipe(
							createFirstUniqueIdentifier(),
							issueCreator,
							Result.ok
					)
					: Result.err(error),
			)
			.exhaustive();

		if (!issueResult.ok) {
			return issueResult;
		}

		const issue = issueResult.value;

		await this.writeRepo.save(issue);

    return Result.ok(issue);
  }
}
