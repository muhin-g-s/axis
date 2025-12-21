import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from 'uuid';
import { users } from "./users";

export const workspaces = sqliteTable("workspaces", {
  id: text("id").primaryKey().$defaultFn(uuidv4),
  name: text("name").notNull(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id),
});