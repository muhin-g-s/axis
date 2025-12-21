import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from 'uuid';
import { projects } from "./projects";

export const statuses = sqliteTable("statuses", {
  id: text("id").primaryKey().$defaultFn(uuidv4),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id),
  name: text("name").notNull(),
  isDefault: integer("is_default", { mode: "boolean" }).notNull().$defaultFn(() => false),
});