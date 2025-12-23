import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from 'uuid';
import { workspaces } from "./workspaces";

export const workspaceStatuses = sqliteTable("workspace_statuses", {
  id: text("id").primaryKey().$defaultFn(uuidv4),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id),
  name: text("name").notNull(),
  order: integer("order").notNull(),
});
