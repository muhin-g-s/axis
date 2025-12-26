import { Result } from "@backend/libs/result";

export interface JwtPayload {
  subId: string;
}

export interface JwtService {
  sign(payload: JwtPayload): string;
  verify(token: string): Result<JwtPayload, void>;
}

export function parseBearerToken(
  header: string | undefined
): Result<string, void> {
  if (header === undefined || header.trim() === "") {
    return Result.err(undefined);
  }

  const parts = header.split(" ");

  if (parts.length !== 2) {
    return Result.err(undefined);
  }

  const [scheme, token] = parts;

  if (scheme !== "Bearer") {
    return Result.err(undefined);
  }

  if (token === undefined || token.trim() === "") {
    return Result.err(undefined);
  }

  return Result.ok(token);
}

export function buildBearerAuthorization(
  token: string
): Result<string, void> {
  if (token.trim() === "") {
		return Result.err(undefined);
  }

  if (token.includes(" ")) {
    return Result.err(undefined);
  }

  return {
    ok: true,
    value: `Bearer ${token}`,
  };
}
