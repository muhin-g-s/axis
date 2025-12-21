import { relations } from "drizzle-orm";
import { issueLabels } from "../tables/issue-labels";
import { issues } from "../tables/issues";
import { labels } from "../tables/labels";

export const issueLabelsRelations = relations(issueLabels, ({ one }) => ({
  issue: one(issues, {
    fields: [issueLabels.issueId],
    references: [issues.id],
  }),
  label: one(labels, {
    fields: [issueLabels.labelId],
    references: [labels.id],
  }),
}));