import { eq, sql } from "drizzle-orm";
import type { DbClient } from "@backend/app/db/connector";
import { projects } from "@backend/app/db/schema";

export class TestRepo {
  constructor(private readonly db: DbClient) {}

  async exists(id: string): Promise<boolean> {
    const result = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(projects)
      .where(eq(projects.id, id));

    const count = result[0]?.count;
    return count !== undefined ? count > 0 : false;
  }
}