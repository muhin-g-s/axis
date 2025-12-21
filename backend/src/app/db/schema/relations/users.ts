import { relations } from "drizzle-orm";
import { users } from "../tables/users";
import { workspaces } from "../tables/workspaces";
import { issues } from "../tables/issues";
import { workspaceUsers } from "../tables/workspace-users";

export const usersRelations = relations(users, ({ many }) => ({
  ownedWorkspaces: many(workspaces, { relationName: "owner" }),
  workspaces: many(workspaceUsers),
  assignedIssues: many(issues, { relationName: "assignee" }),
}));