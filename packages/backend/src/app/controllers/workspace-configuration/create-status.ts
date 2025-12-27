import { type } from "arktype";
import { InvalidIdFormatErrorToTRPC, type Request } from "@backend/libs/trpc";
import { Result } from "@backend/libs/result";
import type { CreateStatusHandler } from "@backend/modules/workspace-configuration/application/handlers/create-status.handler";
import { createStatusName } from "@backend/modules/workspace-configuration/domain/value-objects/status-name";
import { createStatusOrder } from "@backend/modules/workspace-configuration/domain/value-objects/status-order";
import { InvalidStatusNameErrorToTRPC, InvalidStatusOrderErrorToTRPC, mapErr } from "./error";
import type { AuthContext } from "@backend/app/server/init";
import { userIdFromString } from "@backend/modules/workspace-configuration/domain/value-objects/user-id";
import { workspaceIdFromString } from "@backend/modules/workspace-configuration/domain/value-objects/workspace-id";

export const inputCreateStatusSchema = type({
  name: 'string',
  order: 'number',
  workspaceId: 'string',
});

type InputCreateStatus = typeof inputCreateStatusSchema.infer;

export interface OutputCreateStatus {
  id: string;
  workspaceId: string;
  name: string;
  order: number;
}

export class CreateStatusController {
  constructor(
    private readonly usecase: CreateStatusHandler,
  ) {}

  async handler({ input, ctx }: Request<InputCreateStatus, AuthContext>): Promise<OutputCreateStatus> {
    const actorUserId = Result.unwrapOrThrow(
      userIdFromString(ctx.user?.id ?? ""),
      InvalidIdFormatErrorToTRPC
    );

    const workspaceIdVo = Result.unwrapOrThrow(
      workspaceIdFromString(input.workspaceId),
      InvalidIdFormatErrorToTRPC
    );

    const statusNameVo = Result.unwrapOrThrow(
      createStatusName(input.name),
      InvalidStatusNameErrorToTRPC
    );

    const statusOrderVo = Result.unwrapOrThrow(
      createStatusOrder(input.order),
      InvalidStatusOrderErrorToTRPC
    );

    const command = {
      actorUserId: actorUserId,
      name: statusNameVo,
      order: statusOrderVo,
      workspaceId: workspaceIdVo,
    };

    const result = Result.unwrapOrThrow(
      await this.usecase.handle(command),
      mapErr
    );

    return {
      id: result.id,
      workspaceId: result.workspaceId,
      name: result.name,
      order: result.order,
    };
  }
}
