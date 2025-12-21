import { eq, sql } from "drizzle-orm";
import { DbClient } from "../../../../../app/db/connector";
import { projects } from "../../../../../app/db/schema";

export class TestRepo {
  constructor(private readonly db: DbClient) {}

  async exists(id: string): Promise<boolean> {
    const result = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(projects)
      .where(eq(projects.id, id));

    return result[0].count > 0;
  }
}