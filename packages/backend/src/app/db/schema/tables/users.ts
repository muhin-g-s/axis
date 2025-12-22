import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from 'uuid';

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(uuidv4),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
	deletedAt: integer("deleted_at"),
});
