import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from 'uuid';
import { workspaces } from "./workspaces";

export const workspaceLabels = sqliteTable("workspace_labels", {
  id: text("id").primaryKey().$defaultFn(uuidv4),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id),
  name: text("name").notNull(),
});
