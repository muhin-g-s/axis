import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from 'uuid';
import { workspaces } from "./workspaces";

export const workspacePriorities = sqliteTable("workspace_priorities", {
  id: text("id").primaryKey().$defaultFn(uuidv4),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id),
  name: text("name").notNull(),
  level: integer("level").notNull(),
});
