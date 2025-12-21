import { sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core";
import { workspaces } from "./workspaces";
import { users } from "./users";

export const workspaceUsers = sqliteTable(
  "workspace_users",
  {
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    role: text("role").notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.workspaceId, table.userId],
    }),
  })
);