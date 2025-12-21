import { relations } from "drizzle-orm";
import { labels } from "../tables/labels";
import { projects } from "../tables/projects";
import { issueLabels } from "../tables/issue-labels";

export const labelsRelations = relations(labels, ({ one, many }) => ({
  project: one(projects, {
    fields: [labels.projectId],
    references: [projects.id],
  }),
  issues: many(issueLabels),
}));