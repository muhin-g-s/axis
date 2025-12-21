import { relations } from "drizzle-orm";
import { issues } from "../tables/issues";
import { projects } from "../tables/projects";
import { users } from "../tables/users";
import { issueLabels } from "../tables/issue-labels";

export const issuesRelations = relations(issues, ({ one, many }) => ({
  project: one(projects, {
    fields: [issues.projectId],
    references: [projects.id],
  }),
  assignee: one(users, {
    fields: [issues.assigneeId],
    references: [users.id],
    relationName: "assignee",
  }),
  labels: many(issueLabels),
}));