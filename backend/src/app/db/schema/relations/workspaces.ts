import { relations } from "drizzle-orm";
import { workspaces } from "../tables/workspaces";
import { users } from "../tables/users";
import { workspaceUsers } from "../tables/workspace-users";
import { projects } from "../tables/projects";

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  owner: one(users, {
    fields: [workspaces.ownerId],
    references: [users.id],
    relationName: "owner",
  }),
  users: many(workspaceUsers),
  projects: many(projects),
}));