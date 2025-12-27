import { relations } from "drizzle-orm";
import { projects } from "../tables/projects";
import { workspaces } from "../tables/workspaces";
import { issues } from "../tables/issues";

export const projectsRelations = relations(projects, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [projects.workspaceId],
    references: [workspaces.id],
  }),
  issues: many(issues),
}));
