import { relations } from "drizzle-orm";
import { workspaceStatuses } from "../tables/workspace-statuses";
import { workspaces } from "../tables/workspaces";

export const workspaceStatusesRelations = relations(workspaceStatuses, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceStatuses.workspaceId],
    references: [workspaces.id],
  }),
}));