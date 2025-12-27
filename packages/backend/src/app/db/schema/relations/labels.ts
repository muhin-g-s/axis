import { relations } from "drizzle-orm";
import { workspaceLabels } from "../tables/workspace-labels";
import { workspaces } from "../tables/workspaces";
import { issueLabels } from "../tables/issue-labels";

export const workspaceLabelsRelations = relations(workspaceLabels, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [workspaceLabels.workspaceId],
    references: [workspaces.id],
  }),
  issues: many(issueLabels),
}));