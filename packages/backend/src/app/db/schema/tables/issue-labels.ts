import { sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core";
import { issues } from "./issues";
import { workspaceLabels } from "./workspace-labels";

export const issueLabels = sqliteTable(
  "issue_labels",
  {
    issueId: text("issue_id")
      .notNull()
      .references(() => issues.id),
    labelId: text("label_id")
      .notNull()
      .references(() => workspaceLabels.id),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.issueId, table.labelId],
    }),
  })
);