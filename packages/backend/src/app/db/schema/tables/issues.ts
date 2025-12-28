import { sqliteTable, text, numeric, integer } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from 'uuid';
import { projects } from "./projects";
import { users } from "./users";
import { workspaceStatuses } from "./workspace-statuses";
import { workspacePriorities } from "./workspace-priorities";
import { workspaceLabels } from "./workspace-labels";

export const issues = sqliteTable("issues", {
  id: text("id").primaryKey().$defaultFn(uuidv4),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id),
  title: text("title").notNull(),
  description: text("description"),
  statusId: text("status_id").references(() => workspaceStatuses.id),
  priorityId: text("priority_id").references(() => workspacePriorities.id),
	labelId: text("label_id").references(() => workspaceLabels.id),
  estimate: numeric("estimate"),
  assigneeId: text("assignee_id").references(() => users.id),
  uniqueIdentifier: text("unique_identifier").notNull().unique(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
	deletedAt: integer("deleted_at"),
});
