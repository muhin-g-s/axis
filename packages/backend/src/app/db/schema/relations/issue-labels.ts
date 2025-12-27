import { relations } from "drizzle-orm";
import { issueLabels } from "../tables/issue-labels";
import { issues } from "../tables/issues";
import { workspaceLabels } from "../tables/workspace-labels";

export const issueLabelsRelations = relations(issueLabels, ({ one }) => ({
  issue: one(issues, {
    fields: [issueLabels.issueId],
    references: [issues.id],
  }),
  label: one(workspaceLabels, {
    fields: [issueLabels.labelId],
    references: [workspaceLabels.id],
  }),
}));
