import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from 'uuid';
import { workspaces } from "./workspaces";

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey().$defaultFn(uuidv4),
  name: text("name").notNull(),
	version: integer('version').notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
	deletedAt: integer("deleted_at"),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id),
});
