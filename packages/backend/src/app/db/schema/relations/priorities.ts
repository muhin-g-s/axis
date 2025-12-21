import { relations } from "drizzle-orm";
import { priorities } from "../tables/priorities";
import { projects } from "../tables/projects";

export const prioritiesRelations = relations(priorities, ({ one }) => ({
  project: one(projects, {
    fields: [priorities.projectId],
    references: [projects.id],
  }),
}));