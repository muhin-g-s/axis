import { relations } from "drizzle-orm";
import { workspacePriorities } from "../tables/workspace-priorities";
import { workspaces } from "../tables/workspaces";

export const workspacePrioritiesRelations = relations(workspacePriorities, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspacePriorities.workspaceId],
    references: [workspaces.id],
  }),
}));