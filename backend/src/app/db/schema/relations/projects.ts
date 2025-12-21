import { relations } from "drizzle-orm";
import { projects } from "../tables/projects";
import { workspaces } from "../tables/workspaces";
import { issues } from "../tables/issues";
import { statuses } from "../tables/statuses";
import { priorities } from "../tables/priorities";
import { labels } from "../tables/labels";

export const projectsRelations = relations(projects, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [projects.workspaceId],
    references: [workspaces.id],
  }),
  issues: many(issues),
  statuses: many(statuses),
  priorities: many(priorities),
  labels: many(labels),
}));