import { relations } from "drizzle-orm";
import { statuses } from "../tables/statuses";
import { projects } from "../tables/projects";

export const statusesRelations = relations(statuses, ({ one }) => ({
  project: one(projects, {
    fields: [statuses.projectId],
    references: [projects.id],
  }),
}));