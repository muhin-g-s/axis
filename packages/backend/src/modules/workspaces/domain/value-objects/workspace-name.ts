import { NonEmptyStringSchema } from '@backend/libs/primitives';

export const WorkspaceNameSchema = NonEmptyStringSchema;

export type WorkspaceName = typeof WorkspaceNameSchema.infer;
