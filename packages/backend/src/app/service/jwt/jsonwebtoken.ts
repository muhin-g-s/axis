import jwt from "jsonwebtoken";
import type { JwtPayload, JwtService } from "./interface";
import { Result } from "@backend/libs/result";

export class JwtServiceImpl implements JwtService {
  constructor(
    private readonly secret: string,
  ) {}

  sign(payload: JwtPayload): string {
    return jwt.sign(payload, this.secret);
  }

  verify(token: string): Result<JwtPayload, void> {
		try {
			const res = jwt.verify(token, this.secret) as JwtPayload;
			return Result.ok(res);
		} catch {
			return Result.err(undefined)
		}
  }
}
