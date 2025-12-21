import { relations } from "drizzle-orm";
import { workspaceUsers } from "../tables/workspace-users";
import { workspaces } from "../tables/workspaces";
import { users } from "../tables/users";

export const workspaceUsersRelations = relations(workspaceUsers, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceUsers.workspaceId],
    references: [workspaces.id],
  }),
  user: one(users, {
    fields: [workspaceUsers.userId],
    references: [users.id],
  }),
}));