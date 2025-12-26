import { Result } from "@backend/libs/result";
import type { JwtPayload, JwtService } from "./interface";

export class JwtServiceMock implements JwtService {
	sign(payload: JwtPayload): string {
		return `token-${payload.subId}`;
	}

	verify(token: string): Result<JwtPayload, void> {
		if (!token.startsWith("token-")) {
			return Result.err(undefined)
		}
		return Result.ok({
			subId: token.replace("token-", ""),
		})
	}
}
