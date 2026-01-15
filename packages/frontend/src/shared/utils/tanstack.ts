import { type UseMutationResult } from "@tanstack/react-query";

export type MutationResult<Req, Res = void> = UseMutationResult<Res, unknown, Req>
