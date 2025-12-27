# Module Standardization Guide

This document provides a comprehensive guide for creating new modules in the backend, based on the reference implementation of the projects module.

## Table of Contents
- [Module Structure](#module-structure)
- [Value Objects](#value-objects)
- [Domain Entities](#domain-entities)
- [Ports (Cross-Module Interfaces)](#ports-cross-module-interfaces)
- [Services](#services)
- [Error Handling](#error-handling)
- [Repositories](#repositories)
- [Command and Query Handlers](#command-and-query-handlers)
- [Infrastructure Layers](#infrastructure-layers)
- [Library Components Usage](#library-components-usage)
- [Database Schema Correspondence](#database-schema-correspondence)

## Module Structure

Each module follows the clean architecture pattern with distinct layers:

```
modules/
├── [module-name]/
│   ├── application/
│   │   ├── dto/
│   │   └── handlers/
│   ├── domain/
│   │   ├── entities/
│   │   ├── errors/
│   │   ├── ports/          # Cross-module interfaces
│   │   ├── repositories/
│   │   └── services/       # Domain services
│   │   └── value-objects/
│   └── infrastructure/
│       ├── persistence/
│       └── services/       # Infrastructure implementations of domain services
```

### Layer Responsibilities:
- **Application**: Defines use cases and orchestrates domain operations
- **Domain**: Contains business logic and entities (the core of the application)
- **Infrastructure**: Handles technical concerns like persistence and external services

## Value Objects

Value objects represent immutable concepts with identity based on their properties rather than unique identifiers.

### Structure Pattern:
```typescript
// domain/value-objects/[name].ts
import { createId, createIdSchema, fromStringFactory } from "@backend/libs/id";
// OR import from "@backend/libs/primitives";

const brand = '[EntityName]Id'; // For entity IDs
type Brand = typeof brand;

export const [EntityName]IdSchema = createIdSchema(brand); // For entity IDs
// OR export const [EntityName]NameSchema = NonEmptyStringSchema; // For value objects

export type [EntityName]Id = typeof [EntityName]IdSchema.infer; // For entity IDs
// OR export type [EntityName]Name = typeof [EntityName]NameSchema.infer; // For value objects

// For entity IDs:
export function create[EntityName]Id(): [EntityName]Id {
	return createId<Brand>();
}

export const [entityName]IdFromString = fromStringFactory([EntityName]IdSchema);
```

### Real Example from Projects Module:
```typescript
// domain/value-objects/id.ts
import { createId, createIdSchema, fromStringFactory } from "@backend/libs/id";

const brand = 'ProjectId';

type Brand = typeof brand;

export const ProjectIdSchema = createIdSchema(brand);

export type ProjectId = typeof ProjectIdSchema.infer;

export function createProjectId(): ProjectId {
  return createId<Brand>();
}

export const projectIdFromString = fromStringFactory(ProjectIdSchema);

// domain/value-objects/name.ts
import { NonEmptyStringSchema } from "@backend/libs/primitives";
import type { Result } from "@backend/libs/result";
import { createInvalidProjectNameError, type InvalidProjectNameError } from "../errors";
import { validate } from "@backend/libs/validation";

export const ProjectNameSchema = NonEmptyStringSchema

export type ProjectName = typeof ProjectNameSchema.infer;

export function projectNameFromString(name: string): Result<ProjectName, InvalidProjectNameError> {
	return validate<ProjectName, InvalidProjectNameError>(
		ProjectNameSchema,
		name,
		() => createInvalidProjectNameError(name)
	);
}
```

### Available Primitives from @backend/libs/primitives:
- `EmailSchema` and `Email` - Validated email addresses
- `PositiveIntSchema` and `PositiveInt` - Integers greater than zero
- `NonNegativeIntSchema` and `NonNegativeInt` - Integers greater than or equal to zero
- `NonEmptyStringSchema` and `NonEmptyString` - Strings with minimum length of 1
- `TimestampSchema` and `Timestamp` - Unix timestamps
- `VersionSchema` and `Version` - Version numbers

### Handling:
- Value objects are validated at creation using arktype schemas
- They use branded types to prevent mixing values of different types
- They are immutable and passed by value rather than reference
- For ID value objects, always include a `fromStringFactory` function to convert string values back to typed IDs
- For value objects with validation requirements, include validation functions that return Results

## Domain Entities

Entities have unique identities and contain business logic.

### Structure Pattern:
```typescript
// domain/entities/index.ts
import { type } from 'arktype';
// Import value object schemas
import { [EntityName]IdSchema, type [EntityName]Id } from '../value-objects/id';
import { [Property]Schema, type [Property] } from '../value-objects/[property]';
// Import primitive schemas
import { TimestampSchema, VersionSchema, type Timestamp } from '@backend/libs/primitives';
import { createVersion, incVersion } from '@backend/libs/version';

// Define entity schema
export const [EntityName]Schema = type({
	id: [EntityName]IdSchema,
	property: [Property]Schema,
	// ... other properties
	createdAt: TimestampSchema,
	updatedAt: TimestampSchema,
	deletedAt: TimestampSchema.optional(),
	version: VersionSchema
});

export type [EntityName] = typeof [EntityName]Schema.infer;

// Creation function
export function create[EntityName](
	id: [EntityName]Id,
	property: [Property],
	now: Timestamp,
): [EntityName] {
	return {
		id,
		property,
		createdAt: now,
		updatedAt: now,
		version: createVersion(),
	};
}

// Business logic functions
export function update[EntityName](
	entity: [EntityName],
	newValue: [Property],
	now: Timestamp
): [EntityName] {
	if (entity.property === newValue) {
		return entity;
	}

	return { ...entity, property: newValue, updatedAt: now, version: incVersion(entity.version) };
}
```

### Real Example from Projects Module:
```typescript
// domain/entities/index.ts
import { type } from 'arktype';
import { ProjectIdSchema, type ProjectId } from '../value-objects/id';
import { ProjectNameSchema, type ProjectName } from '../value-objects/name';
import { WorkspaceIdSchema, type WorkspaceId } from '../value-objects/workspace-id';
import { TimestampSchema, VersionSchema, type Timestamp } from '@backend/libs/primitives';
import { createVersion, incVersion } from '@backend/libs/version';

export const ProjectSchema = type({
  id: ProjectIdSchema,
  name: ProjectNameSchema,
  workspaceId: WorkspaceIdSchema,
	createdAt: TimestampSchema,
	updatedAt: TimestampSchema,
  deletedAt: TimestampSchema.optional(),
  version: VersionSchema
})

export type Project = typeof ProjectSchema.infer

export function createProject(
  id: ProjectId,
  name: ProjectName,
  workspaceId: WorkspaceId,
  now: Timestamp,
): Project {
  return {
    id,
    name,
    workspaceId,
    createdAt: now,
    updatedAt: now,
    version: createVersion(),
  };
}

export function rename(
  project: Project,
  name: ProjectName,
  now: Timestamp
): Project {
  if (project.name === name) {
    return project;
  }

  return { ...project, name, updatedAt: now, version: incVersion(project.version) };
}
```

### Key Features:
- Entities follow functional programming patterns (immutable updates)
- Version management using optimistic locking pattern
- Consistent timestamp handling
- Soft delete support with `deletedAt` field

## Ports (Cross-Module Interfaces)

Ports define interfaces that allow modules to depend on abstractions from other modules without tight coupling.

### Structure Pattern:
```typescript
// domain/ports/index.ts
import type { Result } from "@backend/libs/result";
import type { UserId } from "../value-objects/user-id";
import type { [RelatedEntity]Id } from "../value-objects/[related-entity]-id";
import type { UnexpectedDatabaseError } from "@backend/libs/error";

export interface [RelatedEntity]Checker {
  is[RelatedEntity](userId: UserId, [relatedEntity]Id: [RelatedEntity]Id): Promise<Result<boolean, UnexpectedDatabaseError>>;
}
```

### Key Features:
- Ports are located in the `domain/ports/` directory
- They define interfaces that modules can depend on
- Used to avoid circular dependencies between modules
- Usually checked by other modules to validate permissions or relationships

## Services

Domain services contain business logic that doesn't belong to a specific entity, such as permission checking or complex business operations that span multiple entities.

### Structure Pattern:
```typescript
// domain/services/[service-name].ts
import type { Result } from "@backend/libs/result";
import type { UserId } from "../value-objects/user-id";
import type { [RelatedEntity]Id } from "../value-objects/[related-entity]-id";
import type { [EntityName]DomainError } from "../errors";

export interface I[EntityName]PermissionChecker {
  canCreate[EntityName](userId: UserId, [relatedEntity]Id: [RelatedEntity]Id): Promise<Result<void, [EntityName]DomainError>>;
  canDelete[EntityName](userId: UserId, [relatedEntity]Id: [RelatedEntity]Id): Promise<Result<void, [EntityName]DomainError>>;
  canModify[EntityName](userId: UserId, [relatedEntity]Id: [RelatedEntity]Id): Promise<Result<void, [EntityName]DomainError>>;
  canView[EntityName](userId: UserId, [relatedEntity]Id: [RelatedEntity]Id): Promise<Result<void, [EntityName]DomainError>>;
}
```

### Infrastructure Implementation:
```typescript
// infrastructure/services/[service-name].ts
import { Result } from "@backend/libs/result";
import {
  createCannotAccess[EntityName]Error,
  createCannotCreate[EntityName]Error,
  createCannotDelete[EntityName]Error,
  createCannotModify[EntityName]Error,
  createCannotView[EntityName]Error,
  isCannotAccess[EntityName]Error,
  type [EntityName]DomainError
} from "../../domain/errors";
import type { I[EntityName]PermissionChecker } from "../../domain/services/[service-name]";
import type { UserId } from "../../domain/value-objects/user-id";
import type { [RelatedEntity]Id } from "../../domain/value-objects/[related-entity]-id";
import type { [RelatedEntity]Checker } from "@backend/modules/[related-module]/domain/ports";

export class [EntityName]PermissionChecker implements I[EntityName]PermissionChecker {
  constructor(private readonly [relatedEntity]Checker: [RelatedEntity]Checker) {}

  private async check[RelatedEntity](
    userId: UserId,
    [relatedEntity]Id: [RelatedEntity]Id
  ): Promise<Result<void, [EntityName]DomainError>> {
    const [relatedEntity]Result = await this.[relatedEntity]Checker.is[RelatedEntity](userId, [relatedEntity]Id);

    if (![relatedEntity]Result.ok) {
      return [relatedEntity]Result;
    }

    if (![relatedEntity]Result.value) {
      return Result.err(createCannotAccess[EntityName]Error(userId));
    }

    return Result.ok(undefined);
  }

  async canCreate[EntityName](userId: UserId, [relatedEntity]Id: [RelatedEntity]Id): Promise<Result<void, [EntityName]DomainError>> {
    return Result
      .mapErr(
        await this.check[RelatedEntity](userId, [relatedEntity]Id),
        err => isCannotAccess[EntityName]Error(err)
          ? createCannotCreate[EntityName]Error(userId)
          : err
      );
  }

  // Similar implementations for canDelete, canModify, canView
}
```

### Key Features:
- Services are located in `domain/services/` directory
- Infrastructure implementations are in `infrastructure/services/`
- Often depend on ports from other modules to check permissions
- Used for cross-cutting concerns like authorization

### Real Example from Projects Module:
```typescript
// domain/services/project-permission-checker.ts
import type { Result } from "@backend/libs/result";
import type { UserId } from "../value-objects/user-id";
import type { WorkspaceId } from "../value-objects/workspace-id";
import type { ProjectDomainError } from "../errors";

export interface IProjectPermissionChecker {
  canCreateProject(userId: UserId, workspaceId: WorkspaceId): Promise<Result<void, ProjectDomainError>>;
	canDeleteProject(userId: UserId, workspaceId: WorkspaceId): Promise<Result<void, ProjectDomainError>>;
	canModifyProject(userId: UserId, workspaceId: WorkspaceId): Promise<Result<void, ProjectDomainError>>;
	canViewProject(userId: UserId, workspaceId: WorkspaceId): Promise<Result<void, ProjectDomainError>>;
}

// infrastructure/services/project-permission-checker.ts
import { Result } from "@backend/libs/result";
import {
	createCannotAccessProjectError,
	createCannotCreateProjectError,
	createCannotDeleteProjectError,
	createCannotModifyProjectError,
	createCannotViewProjectError,
	isCannotAccessProjectError,
	type ProjectDomainError
} from "../../domain/errors";
import type { IProjectPermissionChecker } from "../../domain/services/project-permission-checker";
import type { UserId } from "../../domain/value-objects/user-id";
import type { WorkspaceId } from "../../domain/value-objects/workspace-id";
import type { WorkspaceMembershipChecker } from "@backend/modules/workspaces/domain/ports";

export class ProjectPermissionChecker implements IProjectPermissionChecker {
    constructor(private readonly membershipChecker: WorkspaceMembershipChecker) {}

    private async checkMembership(
        userId: UserId,
        workspaceId: WorkspaceId
    ): Promise<Result<void, ProjectDomainError>> {
        const isMemberResult = await this.membershipChecker.isMember(userId, workspaceId);

        if (!isMemberResult.ok) {
            return isMemberResult
        }

        if (!isMemberResult.value) {
            return Result.err(createCannotAccessProjectError(userId));
        }

        return Result.ok(undefined);
    }

    async canCreateProject(userId: UserId, workspaceId: WorkspaceId): Promise<Result<void, ProjectDomainError>> {
			return Result
				.mapErr(
					await this.checkMembership(userId, workspaceId),
					err => isCannotAccessProjectError(err)
						? createCannotCreateProjectError(userId)
						: err
					);
    }

    async canDeleteProject(userId: UserId, workspaceId: WorkspaceId): Promise<Result<void, ProjectDomainError>> {
			return Result
				.mapErr(
					await this.checkMembership(userId, workspaceId),
					err => isCannotAccessProjectError(err)
						? createCannotDeleteProjectError(userId)
						: err
					);
    }

    async canModifyProject(userId: UserId, workspaceId: WorkspaceId): Promise<Result<void, ProjectDomainError>> {
			return Result
				.mapErr(
					await this.checkMembership(userId, workspaceId),
					err => isCannotAccessProjectError(err)
						? createCannotModifyProjectError(userId)
						: err
					);
    }

    async canViewProject(userId: UserId, workspaceId: WorkspaceId): Promise<Result<void, ProjectDomainError>> {
			return Result
				.mapErr(
					await this.checkMembership(userId, workspaceId),
					err => isCannotAccessProjectError(err)
						? createCannotViewProjectError(userId)
						: err
					);
    }
}
```

### Structure Pattern:
```typescript
// domain/entities/index.ts
import { type } from 'arktype';
// Import value object schemas
import { [EntityName]IdSchema, type [EntityName]Id } from '../value-objects/id';
import { [Property]Schema, type [Property] } from '../value-objects/[property]';
// Import primitive schemas
import { TimestampSchema, VersionSchema, type Timestamp } from '@backend/libs/primitives';
import { createVersion, incVersion } from '@backend/libs/version';

// Define entity schema
export const [EntityName]Schema = type({
	id: [EntityName]IdSchema,
	property: [Property]Schema,
	// ... other properties
	createdAt: TimestampSchema,
	updatedAt: TimestampSchema,
	deletedAt: TimestampSchema.optional(),
	version: VersionSchema
});

export type [EntityName] = typeof [EntityName]Schema.infer;

// Creation function
export function create[EntityName](
	id: [EntityName]Id,
	property: [Property],
	now: Timestamp,
): [EntityName] {
	return {
		id,
		property,
		createdAt: now,
		updatedAt: now,
		version: createVersion(),
	};
}

// Business logic functions
export function update[EntityName](
	entity: [EntityName],
	newValue: [Property],
	now: Timestamp
): [EntityName] {
	if (entity.property === newValue) {
		return entity;
	}

	return { ...entity, property: newValue, updatedAt: now, version: incVersion(entity.version) };
}
```

### Key Features:
- Entities follow functional programming patterns (immutable updates)
- Version management using optimistic locking pattern
- Consistent timestamp handling
- Soft delete support with `deletedAt` field

## Error Handling

Domain errors are classified using tagged unions with specific error types and creators.

### Structure Pattern:
```typescript
// domain/errors/index.ts
interface Base[EntityName]Error {
	readonly message: string;
}

interface [EntityName]NotFoundError extends Base[EntityName]Error {
	readonly type: '[ENTITY_NAME]_NOT_FOUND';
	readonly [entityName]Id: string;
}

interface Invalid[EntityName][Property]Error extends Base[EntityName]Error {
	readonly type: 'INVALID_[ENTITY_NAME]_[PROPERTY]';
	readonly invalidValue: string;
}

// Common error types for all entities:
interface OptimisticLockError extends Base[EntityName]Error {
	readonly type: 'OPTIMISTIC_LOCK_ERROR';
	readonly [entityName]Id: string;
}

interface CannotModifyDeleted[EntityName]Error extends Base[EntityName]Error {
	readonly type: '[ENTITY_NAME]_CANNOT_MODIFY_DELETED';
	readonly [entityName]Id: string;
}

// Permission-related errors:
export interface CannotCreate[EntityName]Error extends Base[EntityName]Error {
	readonly type: 'CANNOT_CREATE_[ENTITY_NAME]';
	readonly userId: string;
}

export interface CannotDelete[EntityName]Error extends Base[EntityName]Error {
	readonly type: 'CANNOT_DELETE_[ENTITY_NAME]';
	readonly userId: string;
}

export interface CannotModify[EntityName]Error extends Base[EntityName]Error {
	readonly type: 'CANNOT_MODIFY_[ENTITY_NAME]';
	readonly userId: string;
}

export interface CannotView[EntityName]Error extends Base[EntityName]Error {
	readonly type: 'CANNOT_VIEW_[ENTITY_NAME]';
	readonly userId: string;
}

export interface CannotAccess[EntityName]Error extends Base[EntityName]Error {
	readonly type: 'CANNOT_ACCESS_[ENTITY_NAME]';
	readonly userId: string;
}

export interface InvalidObjectInDatabaseError extends Base[EntityName]Error {
	readonly type: 'INVALID_OBJECT_IN_DATABASE';
	readonly object: unknown;
	readonly schemaName: string;
	readonly reason: string;
}

export interface UnexpectedDatabaseError extends Base[EntityName]Error {
	readonly type: 'UNEXPECTED_DATABASE_ERROR';
	readonly error: unknown;
}

export type [EntityName]DomainError =
	| [EntityName]NotFoundError
	| Invalid[EntityName][Property]Error
	| OptimisticLockError
	| CannotModifyDeleted[EntityName]Error
	| CannotCreate[EntityName]Error
	| CannotDelete[EntityName]Error
	| CannotModify[EntityName]Error
	| CannotView[EntityName]Error
	| CannotAccess[EntityName]Error
	| InvalidObjectInDatabaseError
	| UnexpectedDatabaseError;

### Real Example from Projects Module:
```typescript
// domain/errors/index.ts
import type { DomainError } from "@backend/libs/error";

interface BaseProjectError {
  readonly message: string;
}

export interface ProjectNotFoundError extends BaseProjectError {
  readonly type: 'PROJECT_NOT_FOUND';
  readonly projectId: string;
}

export interface InvalidProjectNameError extends BaseProjectError {
  readonly type: 'INVALID_PROJECT_NAME';
  readonly invalidName: string;
}

export interface OptimisticLockError extends BaseProjectError {
  readonly type: 'OPTIMISTIC_LOCK_ERROR';
  readonly projectId: string;
}

export interface CannotModifyDeletedProjectError extends BaseProjectError {
  readonly type: 'CANNOT_MODIFY_DELETED_PROJECT';
  readonly projectId: string;
}

export interface CannotCreateProjectError extends BaseProjectError {
	readonly type: 'CANNOT_CREATE_PROJECT';
	readonly userId: string;
}

export interface CannotDeleteProjectError extends BaseProjectError {
	readonly type: 'CANNOT_DELETE_PROJECT';
	readonly userId: string;
}

export interface CannotModifyProjectError extends BaseProjectError {
	readonly type: 'CANNOT_MODIFY_PROJECT';
	readonly userId: string;
}

export interface CannotViewProjectError extends BaseProjectError {
	readonly type: 'CANNOT_VIEW_PROJECT';
	readonly userId: string;
}

export interface CannotAccessProjectError extends BaseProjectError {
	readonly type: 'CANNOT_ACCESS_PROJECT';
	readonly userId: string;
}

export type ProjectDomainError = DomainError<
  | ProjectNotFoundError
  | InvalidProjectNameError
  | OptimisticLockError
  | CannotModifyDeletedProjectError
  | CannotCreateProjectError
  | CannotDeleteProjectError
  | CannotModifyProjectError
  | CannotViewProjectError
  | CannotAccessProjectError
>


export const createProjectNotFoundError = (projectId: string): ProjectNotFoundError => ({
  type: 'PROJECT_NOT_FOUND',
  message: `Project with ID ${projectId} not found`,
  projectId,
});

export const createInvalidProjectNameError = (invalidName: string): InvalidProjectNameError => ({
  type: 'INVALID_PROJECT_NAME',
  message: `Invalid project name: "${invalidName}"`,
  invalidName,
});

export const createOptimisticLockError = (projectId: string): OptimisticLockError => ({
  type: 'OPTIMISTIC_LOCK_ERROR',
  message: `Optimistic lock error: project ${projectId} was concurrently modified`,
  projectId,
});

export const createCannotModifyDeletedProjectError = (projectId: string): CannotModifyDeletedProjectError => ({
  type: 'CANNOT_MODIFY_DELETED_PROJECT',
  message: `Cannot modify project ${projectId} because it has been marked as deleted`,
  projectId,
});


export const createCannotCreateProjectError = (userId: string): CannotCreateProjectError => ({
	type: 'CANNOT_CREATE_PROJECT',
	message: `Cannot create project because user ${userId} is not a member of any workspace`,
	userId,
});

export const createCannotDeleteProjectError = (userId: string): CannotDeleteProjectError => ({
	type: 'CANNOT_DELETE_PROJECT',
	message: `Cannot delete project because user ${userId} is not a member of any workspace`,
	userId,
});

export const createCannotModifyProjectError = (userId: string): CannotModifyProjectError => ({
	type: 'CANNOT_MODIFY_PROJECT',
	message: `Cannot modify project because user ${userId} is not a member of any workspace`,
	userId,
});

export const createCannotViewProjectError = (userId: string): CannotViewProjectError => ({
	type: 'CANNOT_VIEW_PROJECT',
	message: `Cannot view project because user ${userId} is not a member of any workspace`,
	userId,
});

export const createCannotAccessProjectError = (userId: string): CannotAccessProjectError => ({
	type: 'CANNOT_ACCESS_PROJECT',
	message: `Cannot access project because user ${userId} is not a member of any workspace`,
	userId,
});

export const isProjectNotFoundError = (
  error: ProjectDomainError
): error is ProjectNotFoundError => error.type === 'PROJECT_NOT_FOUND';

export const isInvalidProjectNameError = (
  error: ProjectDomainError
): error is InvalidProjectNameError => error.type === 'INVALID_PROJECT_NAME';

export const isOptimisticLockError = (
  error: ProjectDomainError
): error is OptimisticLockError => error.type === 'OPTIMISTIC_LOCK_ERROR';

export const isCannotModifyDeletedProjectError = (
  error: ProjectDomainError
): error is CannotModifyDeletedProjectError => error.type === 'CANNOT_MODIFY_DELETED_PROJECT';

export const isCannotCreateProjectError = (
	error: ProjectDomainError
): error is CannotCreateProjectError => error.type === 'CANNOT_CREATE_PROJECT';

export const isCannotDeleteProjectError = (
	error: ProjectDomainError
): error is CannotDeleteProjectError => error.type === 'CANNOT_DELETE_PROJECT';

export const isCannotModifyProjectError = (
	error: ProjectDomainError
): error is CannotModifyProjectError => error.type === 'CANNOT_MODIFY_PROJECT';

export const isCannotViewProjectError = (
	error: ProjectDomainError
): error is CannotViewProjectError => error.type === 'CANNOT_VIEW_PROJECT';

export const isCannotAccessProjectError = (
	error: ProjectDomainError
): error is CannotAccessProjectError => error.type === 'CANNOT_ACCESS_PROJECT';
```

### Error Creators:
```typescript
export const create[EntityName]NotFoundError = ([entityName]Id: string): [EntityName]NotFoundError => ({
	type: '[ENTITY_NAME]_NOT_FOUND',
	message: `[EntityName] with ID ${[entityName]Id} not found`,
	[entityName]Id,
});

export const createInvalid[EntityName][Property]Error = (invalidValue: string): Invalid[EntityName][Property]Error => ({
	type: 'INVALID_[ENTITY_NAME]_[PROPERTY]',
	message: `Invalid [entityName] [property]: "${invalidValue}"`,
	invalidValue,
});

export const createCannotCreate[EntityName]Error = (userId: string): CannotCreate[EntityName]Error => ({
	type: 'CANNOT_CREATE_[ENTITY_NAME]',
	message: `User ${userId} cannot create [EntityName]`,
	userId,
});

export const createCannotDelete[EntityName]Error = (userId: string): CannotDelete[EntityName]Error => ({
	type: 'CANNOT_DELETE_[ENTITY_NAME]',
	message: `User ${userId} cannot delete [EntityName]`,
	userId,
});

export const createCannotModify[EntityName]Error = (userId: string): CannotModify[EntityName]Error => ({
	type: 'CANNOT_MODIFY_[ENTITY_NAME]',
	message: `User ${userId} cannot modify [EntityName]`,
	userId,
});

export const createCannotView[EntityName]Error = (userId: string): CannotView[EntityName]Error => ({
	type: 'CANNOT_VIEW_[ENTITY_NAME]',
	message: `User ${userId} cannot view [EntityName]`,
	userId,
});

export const createCannotAccess[EntityName]Error = (userId: string): CannotAccess[EntityName]Error => ({
	type: 'CANNOT_ACCESS_[ENTITY_NAME]',
	message: `User ${userId} cannot access [EntityName]`,
	userId,
});

// Similar creators for other error types
```

### Error Type Guards:
```typescript
export const is[EntityName]NotFoundError = (
	error: [EntityName]DomainError
): error is [EntityName]NotFoundError => error.type === '[ENTITY_NAME]_NOT_FOUND';

export const isCannotCreate[EntityName]Error = (
	error: [EntityName]DomainError
): error is CannotCreate[EntityName]Error => error.type === 'CANNOT_CREATE_[ENTITY_NAME]';

export const isCannotDelete[EntityName]Error = (
	error: [EntityName]DomainError
): error is CannotDelete[EntityName]Error => error.type === 'CANNOT_DELETE_[ENTITY_NAME]';

export const isCannotModify[EntityName]Error = (
	error: [EntityName]DomainError
): error is CannotModify[EntityName]Error => error.type === 'CANNOT_MODIFY_[ENTITY_NAME]';

export const isCannotView[EntityName]Error = (
	error: [EntityName]DomainError
): error is CannotView[EntityName]Error => error.type === 'CANNOT_VIEW_[ENTITY_NAME]';

export const isCannotAccess[EntityName]Error = (
	error: [EntityName]DomainError
): error is CannotAccess[EntityName]Error => error.type === 'CANNOT_ACCESS_[ENTITY_NAME]';

// Similar guards for other error types
```

### Error Handling Patterns:
- Errors are immutable and carry context about what went wrong
- Specific error types allow for appropriate downstream handling
- Type guards enable type-safe error inspection

## Repositories

Repository interfaces define boundaries between domain and infrastructure layers.

### Read Repository:
```typescript
// domain/repositories/read.ts
import { type Result } from '@backend/libs/result';
import type { [EntityName] } from '../entities';
import type { [EntityName]Id } from '../value-objects/id';
import type { [RelatedEntity]Id } from '../value-objects/[related-entity]-id';
import type { [EntityName]DomainError } from '../errors';

export interface [EntityName]ReadRepository {
	findById(id: [EntityName]Id): Promise<Result<[EntityName], [EntityName]DomainError>>;
	findAllBy[RelatedEntity]?(id: [RelatedEntity]Id): Promise<Result<[EntityName][], [EntityName]DomainError>>
}
```

### Write Repository:
```typescript
// domain/repositories/write.ts
import type { Version } from '@backend/libs/primitives';
import type { Result } from '@backend/libs/result';
import type { [EntityName] } from '../entities';
import type { [EntityName]Id } from '../value-objects/id';
import type { [EntityName]DomainError } from '../errors';

export interface [EntityName]WriteRepository {
	save([entityName]: [EntityName], expectedVersion: Version): Promise<Result<void, [EntityName]DomainError>>;
	delete(id: [EntityName]Id): Promise<Result<void, [EntityName]DomainError>>;
}
```

### Unit of Work:
```typescript
// domain/repositories/unit-of-work.ts
import type { [EntityName]WriteRepository } from "./write";

export interface UnitOfWork {
	[entityNames]: [EntityName]WriteRepository; // Each entity gets its own repo in UoW
	commit(): Promise<void>;
	rollback(): Promise<void>;
	run<T>(fn: (uow: this) => Promise<T>): Promise<T>;
}
```

### Real Example from Projects Module:
```typescript
// domain/repositories/read.ts
import { type Result } from '@backend/libs/result';
import type { Project } from '../entities';
import type { ProjectId } from '../value-objects/id';
import type { WorkspaceId } from '../value-objects/workspace-id';
import type { ProjectDomainError } from '../errors';

export interface ProjectReadRepository {
  findById(id: ProjectId): Promise<Result<Project, ProjectDomainError>>;
	findAllByWorkspace(id: WorkspaceId): Promise<Result<Project[], ProjectDomainError>>
}

// domain/repositories/write.ts
import type { Version } from '@backend/libs/primitives';
import type { Result } from '@backend/libs/result';
import type { Project } from '../entities';
import type { ProjectId } from '../value-objects/id';
import type { ProjectDomainError } from '../errors';

export interface ProjectWriteRepository {
  save(project: Project, expectedVersion: Version): Promise<Result<void, ProjectDomainError>>;

  delete(id: ProjectId): Promise<Result<void, ProjectDomainError>>;
}

// domain/repositories/unit-of-work.ts
import type { ProjectWriteRepository } from "./write";

export interface UnitOfWork {
	projects: ProjectWriteRepository;
  commit(): Promise<void>;
  rollback(): Promise<void>;
	run<T>(fn: (uow: this) => Promise<T>): Promise<T>;
}
```

### Infrastructure Implementation:
Repository implementations are located in `infrastructure/persistence/` and handle database interactions.

## Command and Query Handlers

Handlers implement use cases defined in the application layer.

### Command Handler Pattern:
```typescript
// application/handlers/create-[entity].ts
import { Result } from "@backend/libs/result";
import type { Timestamp } from "@backend/libs/primitives";
import { type [EntityName], create[EntityName] } from "../../domain/entities";
import type { [EntityName]WriteRepository } from "../../domain/repositories/write";
import type { Create[EntityName]Command } from "../dto";
import type { [EntityName]DomainError } from "../../domain/errors";
import type { I[EntityName]PermissionChecker } from "../../domain/services/[entity-name]-permission-checker";

export class Create[EntityName]Handler {
	constructor(
		private readonly writeRepo: [EntityName]WriteRepository,
		private readonly [entityName]PermissionChecker: I[EntityName]PermissionChecker,
		private readonly now: () => Timestamp,
	) {}

	async handle(command: Create[EntityName]Command): Promise<Result<[EntityName], [EntityName]DomainError>> {
		const canCreate[EntityName]Result = await this.[entityName]PermissionChecker.canCreate[EntityName](command.actorUserId, command.[relatedEntity]Id);
		if (!canCreate[EntityName]Result.ok) {
			return canCreate[EntityName]Result;
		}

		const [entityName] = create[EntityName](
			command.id,
			command.property,
			this.now(),
		);

		const saveResult = await this.writeRepo.save([entityName], [entityName].version);

		if (!saveResult.ok) {
			return Result.err(saveResult.error);
		}

		return Result.ok([entityName]);
	}
}
```

### Query Handler Pattern:
```typescript
// application/handlers/get-[entity].ts
import { type Result } from "@backend/libs/result";
import type { [EntityName] } from "../../domain/entities";
import type { [EntityName]ReadRepository } from "../../domain/repositories/read";
import type { Get[EntityName]Query } from "../dto";
import type { [EntityName]DomainError } from "../../domain/errors";
import type { I[EntityName]PermissionChecker } from "../../domain/services/[entity-name]-permission-checker";

export class Get[EntityName]Handler {
	constructor(
		private readonly readRepo: [EntityName]ReadRepository,
		private readonly [entityName]PermissionChecker: I[EntityName]PermissionChecker,
	) {}

	async handle(query: Get[EntityName]Query): Promise<Result<[EntityName] | null, [EntityName]DomainError>> {
		const canView[EntityName]Result = await this.[entityName]PermissionChecker.canView[EntityName](query.actorUserId, query.[relatedEntity]Id);
		if (!canView[EntityName]Result.ok) {
			return canView[EntityName]Result;
		}

		return this.readRepo.findById(query.id);
	}
}
```

### Update Handler with Unit of Work:
```typescript
// application/handlers/update-[entity].ts
import { Result } from "@backend/libs/result";
import type { Timestamp } from "@backend/libs/primitives";
import type { [EntityName]ReadRepository } from "../../domain/repositories/read";
import type { UnitOfWork } from "../../domain/repositories/unit-of-work";
import type { Update[EntityName]Command } from "../dto";
import { update[EntityName] } from "../../domain/entities";
import { createCannotModifyDeleted[EntityName]Error } from "../../domain/errors";
import type { [EntityName]DomainError } from "../../domain/errors";
import type { I[EntityName]PermissionChecker } from "../../domain/services/[entity-name]-permission-checker";

export class Update[EntityName]Handler {
	constructor(
		private readonly readRepo: [EntityName]ReadRepository,
		private readonly uow: UnitOfWork,
		private readonly [entityName]PermissionChecker: I[EntityName]PermissionChecker,
		private readonly now: () => Timestamp,
	) {}

	async handle(command: Update[EntityName]Command): Promise<Result<void, [EntityName]DomainError>> {
		const canModify[EntityName]Result = await this.[entityName]PermissionChecker.canModify[EntityName](command.actorUserId, command.[relatedEntity]Id);
		if (!canModify[EntityName]Result.ok) {
			return canModify[EntityName]Result;
		}

		const result = await this.uow.run(async (uow) => {
			const findResult = await this.readRepo.findById(command.id);
			if (!findResult.ok) {
				return Result.err(findResult.error);
			}

			const [entityName] = findResult.value;

			if ([entityName].deletedAt !== undefined) {
				return Result.err(createCannotModifyDeleted[EntityName]Error(command.id));
			}

			const updated[EntityName] = update[EntityName]([entityName], command.newValue, this.now());

			const saveResult = await uow.[entityNames].save(updated[EntityName], [entityName].version);
			if (!saveResult.ok) {
				return Result.err(saveResult.error);
			}

			return Result.ok(undefined);
		});

		return result;
	}
}
```

### Data Transfer Objects:
```typescript
// application/dto/index.ts
import type { [EntityName]Id } from "../../domain/value-objects/id";
import type { [EntityName][Property] } from "../../domain/value-objects/[property]";
import type { UserId } from "../../domain/value-objects/user-id";  // For actor identification
// Import other related entity IDs if needed
import type { [RelatedEntity]Id } from "../../domain/value-objects/[related-entity]-id";

export interface Create[EntityName]Command {
	readonly actorUserId: UserId,      // The user performing the action
	readonly property: [EntityName][Property],
	readonly [relatedEntity]Id: [RelatedEntity]Id, // if applicable
}

export interface Update[EntityName]Command {
	readonly actorUserId: UserId,      // The user performing the action
	readonly [relatedEntity]Id: [RelatedEntity]Id, // To verify permissions
	readonly id: [EntityName]Id,
	readonly newValue: [EntityName][Property],
}

export interface Delete[EntityName]Command {
	readonly actorUserId: UserId,      // The user performing the action
	readonly [relatedEntity]Id: [RelatedEntity]Id, // To verify permissions
	readonly id: [EntityName]Id,
}

export interface Get[EntityName]Query {
	readonly actorUserId: UserId,      // The user performing the action
	readonly [relatedEntity]Id: [RelatedEntity]Id, // To verify permissions
	readonly id: [EntityName]Id
}

export interface Get[EntityNames]By[RelatedEntity]Query {
	readonly actorUserId: UserId,      // The user performing the action
	readonly [relatedEntity]Id: [RelatedEntity]Id, // To verify permissions
}

// Add query interfaces as needed based on use cases
```

### Real Example from Projects Module:
```typescript
// application/dto/index.ts
import type { ProjectId } from "../../domain/value-objects/id";
import type { ProjectName } from "../../domain/value-objects/name";
import type { UserId } from "../../domain/value-objects/user-id";
import type { WorkspaceId } from "../../domain/value-objects/workspace-id";

export interface CreateProjectCommand {
	readonly actorUserId: UserId,
  readonly name: ProjectName,
  readonly workspaceId: WorkspaceId,
}

export interface RenameProjectCommand {
	readonly actorUserId: UserId,
	readonly workspaceId: WorkspaceId,
	readonly id: ProjectId,
	readonly newName: ProjectName,
}

export interface DeleteProjectCommand {
	readonly actorUserId: UserId,
	readonly workspaceId: WorkspaceId,
	readonly id: ProjectId,
}

export interface GetProjectQuery {
	readonly actorUserId: UserId,
	readonly workspaceId: WorkspaceId,
	readonly id: ProjectId
}

export interface GetProjectsByWorkspaceQuery {
	readonly actorUserId: UserId,
	readonly workspaceId: WorkspaceId,
}

// application/handlers/create.ts
import { Result } from "@backend/libs/result";
import type { Timestamp } from "@backend/libs/primitives";
import { type Project, createProject } from "../../domain/entities";
import type { ProjectWriteRepository } from "../../domain/repositories/write";
import type { CreateProjectCommand } from "../dto";
import {
	type ProjectDomainError
} from "../../domain/errors";
import { createProjectId } from "../../domain/value-objects/id";
import type { IProjectPermissionChecker } from "../../domain/services/project-permission-checker";

export class CreateProjectHandler {
  constructor(
    private readonly writeRepo: ProjectWriteRepository,
		private readonly projectPermissionChecker: IProjectPermissionChecker,
    private readonly now: () => Timestamp,
  ) {}

  async handle({actorUserId, workspaceId, name}: CreateProjectCommand): Promise<Result<Project, ProjectDomainError>> {
		const canCreateProjectResult = await this.projectPermissionChecker.canCreateProject(actorUserId, workspaceId);
		if (!canCreateProjectResult.ok) {
			return canCreateProjectResult
		}

    const project = createProject(
      createProjectId(),
      name,
      workspaceId,
      this.now(),
    );

    const saveResult = await this.writeRepo.save(project, project.version);

    if (!saveResult.ok) {
      return Result.err(saveResult.error);
    }

    return Result.ok(project);
  }
}

// application/handlers/delete.ts
import { type Result } from "@backend/libs/result";
import type { ProjectWriteRepository } from "../../domain/repositories/write";
import type { DeleteProjectCommand } from "../dto";
import type { ProjectDomainError } from "../../domain/errors";
import type { IProjectPermissionChecker } from "../../domain/services/project-permission-checker";

export class DeleteProjectHandler {
  constructor(
    private readonly writeRepo: ProjectWriteRepository,
		private readonly projectPermissionChecker: IProjectPermissionChecker,
  ) {}

  async handle({actorUserId, id, workspaceId}: DeleteProjectCommand): Promise<Result<void, ProjectDomainError>> {
		const canDeleteProjectResult = await this.projectPermissionChecker.canDeleteProject(actorUserId, workspaceId);
		if (!canDeleteProjectResult.ok) {
			return canDeleteProjectResult
		}

    return this.writeRepo.delete(id);
  }
}

// application/handlers/get-project.ts
import { type Result } from "@backend/libs/result";
import type { Project } from "../../domain/entities";
import type { ProjectReadRepository } from "../../domain/repositories/read";
import type { GetProjectQuery } from "../dto";
import type { ProjectDomainError } from "../../domain/errors";
import type { IProjectPermissionChecker } from "../../domain/services/project-permission-checker";

export class GetProjectHandler {
  constructor(
		private readonly readRepo: ProjectReadRepository,
		private readonly projectPermissionChecker: IProjectPermissionChecker,
	) {}

  async handle({actorUserId, workspaceId, id}: GetProjectQuery): Promise<Result<Project | null, ProjectDomainError>> {
		const canDeleteProjectResult = await this.projectPermissionChecker.canViewProject(actorUserId, workspaceId);
		if (!canDeleteProjectResult.ok) {
			return canDeleteProjectResult
		}

    return this.readRepo.findById(id);
  }
}

// application/handlers/get-projects-by-workspace.ts
import { type Result } from "@backend/libs/result";
import type { Project } from "../../domain/entities";
import type { ProjectReadRepository } from "../../domain/repositories/read";
import type { GetProjectsByWorkspaceQuery } from "../dto";
import type { ProjectDomainError } from "../../domain/errors";
import type { IProjectPermissionChecker } from "../../domain/services/project-permission-checker";

export class GetProjectsByWorkspaceHandler {
  constructor(
		private readonly readRepo: ProjectReadRepository,
		private readonly projectPermissionChecker: IProjectPermissionChecker,
	) {}

  async handle({actorUserId, workspaceId}: GetProjectsByWorkspaceQuery): Promise<Result<Project[], ProjectDomainError>> {
		const canDeleteProjectResult = await this.projectPermissionChecker.canViewProject(actorUserId, workspaceId);
		if (!canDeleteProjectResult.ok) {
			return canDeleteProjectResult
		}

    return this.readRepo.findAllByWorkspace(workspaceId);
  }
}

// application/handlers/rename.ts
import { Result } from "@backend/libs/result";
import type { Timestamp } from "@backend/libs/primitives";
import type { ProjectReadRepository } from "../../domain/repositories/read";
import type { UnitOfWork } from "../../domain/repositories/unit-of-work";
import type { RenameProjectCommand } from "../dto";
import { rename } from "../../domain/entities";
import { createCannotModifyDeletedProjectError } from "../../domain/errors";
import type { ProjectDomainError } from "../../domain/errors";
import type { IProjectPermissionChecker } from "../../domain/services/project-permission-checker";

export class RenameProjectHandler {
  constructor(
    private readonly readRepo: ProjectReadRepository,
    private readonly uow: UnitOfWork,
		private readonly projectPermissionChecker: IProjectPermissionChecker,
    private readonly now: () => Timestamp,
  ) {}

  async handle({actorUserId, workspaceId, id, newName}: RenameProjectCommand): Promise<Result<void, ProjectDomainError>> {
		const canDeleteProjectResult = await this.projectPermissionChecker.canViewProject(actorUserId, workspaceId);
		if (!canDeleteProjectResult.ok) {
			return canDeleteProjectResult
		}

    const result = await this.uow.run(async (uow) => {
      const findResult = await this.readRepo.findById(id);
      if (!findResult.ok) {
        return Result.err(findResult.error);
      }

      const project = findResult.value;

			if (project.deletedAt !== undefined) {
				return Result.err(createCannotModifyDeletedProjectError(id));
			}

      const updatedProject = rename(project, newName, this.now());

      const saveResult = await uow.projects.save(updatedProject, project.version);
      if (!saveResult.ok) {
        return Result.err(saveResult.error);
      }

      return Result.ok(undefined);
    });

    return result;
  }
}
```

## Infrastructure Layers

### Persistence Implementations

#### Read Repository Implementation:
```typescript
// infrastructure/persistence/read.ts
import { eq } from 'drizzle-orm';
import { Result } from '@backend/libs/result';
import type { DbClient } from '@backend/app/db/connector';
import { [table] } from '@backend/app/db/schema';

import { [EntityName]Schema, type [EntityName] } from '../../domain/entities';
import type { [EntityName]Id } from '../../domain/value-objects/id';
import type { [RelatedEntity]Id } from '../../domain/value-objects/[related-entity]-id';
import type { [EntityName]ReadRepository } from '../../domain/repositories/read';
import {
	createInvalidObjectInDatabaseError,
	create[EntityName]NotFoundError,
	type [EntityName]DomainError,
	type InvalidObjectInDatabaseError,
	createUnexpectedDatabaseError
} from '../../domain/errors';
import { validate } from '@backend/libs/validation';

export class Drizzle[EntityName]ReadRepository implements [EntityName]ReadRepository {
	constructor(private readonly db: DbClient) {}

	async findById(id: [EntityName]Id): Promise<Result<[EntityName], [EntityName]DomainError>> {
		try {
			const result = await this.db
				.select()
				.from([table])
				.where(eq([table].id, id))
				.limit(1);

			const [[entityName]] = result;

			if ([entityName] == undefined) {
				return Result.err(create[EntityName]NotFoundError(id));
			}

			const validated[EntityName] = validate<[EntityName], InvalidObjectInDatabaseError>(
				[EntityName]Schema,
				[entityName],
				msg => createInvalidObjectInDatabaseError([entityName], '[EntityName]Schema', msg)
			);

			return validated[EntityName];
		} catch (error) {
			return Result.err(createUnexpectedDatabaseError(error));
		}
	}

	async findAllBy[RelatedEntity](id: [RelatedEntity]Id): Promise<Result<[EntityName][], [EntityName]DomainError>> {
		try {
			const res = await this.db
				.select()
				.from([table])
				.where(eq([table].[relatedEntity]Id, id));

			for (const [entityName] of res) {
				const validated[EntityName] = validate<[EntityName], InvalidObjectInDatabaseError>(
					[EntityName]Schema,
					[entityName],
					msg => createInvalidObjectInDatabaseError([entityName], '[EntityName]Schema', msg)
				);

				if (!validated[EntityName].ok) {
					return Result.err(validated[EntityName].error);
				}
			}

			return Result.ok(res as [EntityName][]);
		} catch (error) {
			return Result.err(createUnexpectedDatabaseError(error));
		}
	}
}
```

#### Write Repository Implementation:
```typescript
// infrastructure/persistence/write.ts
import { and, eq } from 'drizzle-orm';
import { Result } from '@backend/libs/result';
import type { DbClient } from '@backend/app/db/connector';
import { [table] } from '@backend/app/db/schema';

import type { [EntityName] } from '../../domain/entities';
import type { [EntityName]Id } from '../../domain/value-objects/id';
import type { [EntityName]WriteRepository } from '../../domain/repositories/write';
import type { Version } from '@backend/libs/primitives';
import { createOptimisticLockError, createUnexpectedDatabaseError, type [EntityName]DomainError } from '../../domain/errors';

export class Drizzle[EntityName]WriteRepository implements [EntityName]WriteRepository {
	constructor(private readonly db: DbClient) {}

	async save([entityName]: [EntityName], expectedVersion: Version): Promise<Result<void, [EntityName]DomainError>> {
		try {
			const result = await this.db
				.update([table])
				.set({
					property: [entityName].property,
					[relatedEntity]Id: [entityName].[relatedEntity]Id,
					updatedAt: [entityName].updatedAt,
					deletedAt: [entityName].deletedAt ?? null,
					version: [entityName].version,
				})
				.where(
					and(
						eq([table].id, [entityName].id),
						eq([table].version, expectedVersion)
					)
				);

			if (result.changes === 0) {
				return Result.err(createOptimisticLockError([entityName].id));
			}

			return Result.ok(undefined);
		} catch (error) {
			return Result.err(createUnexpectedDatabaseError(error));
		}
	}

	async delete(id: [EntityName]Id): Promise<Result<void, [EntityName]DomainError>> {
		try {
			await this.db
				.delete([table])
				.where(eq([table].id, id));

			return Result.ok(undefined);
		} catch (error) {
			return Result.err(createUnexpectedDatabaseError(error));
		}
	}
}
```

#### Unit of Work Implementation:
```typescript
// infrastructure/persistence/unit-of-work.ts
import type { DbClient } from '@backend/app/db/connector';
import type { UnitOfWork } from '../../domain/repositories/unit-of-work';
import type { [EntityName]WriteRepository } from '../../domain/repositories/write';
import { Drizzle[EntityName]WriteRepository } from './write';

export class DrizzleUnitOfWork implements UnitOfWork {
	[entityNames]!: [EntityName]WriteRepository;

	constructor(private readonly db: DbClient) {}

	async run<T>(fn: (uow: this) => Promise<T>): Promise<T> {
		return this.db.transaction(async (tx) => {
			this.[entityNames] = new Drizzle[EntityName]WriteRepository(tx);

			return fn(this);
		});
	}

	async commit(): Promise<void> {
		// commit is handled automatically by drizzle transaction
	}

	rollback(): Promise<void> {
		throw new Error('Rollback is handled by transaction failure');
	}
}

### Real Example from Projects Module:
```typescript
// infrastructure/persistence/read.ts
import { eq } from 'drizzle-orm';
import { Result } from '@backend/libs/result';
import type { DbClient } from '@backend/app/db/connector';
import { projects } from '@backend/app/db/schema';

import { ProjectSchema, type Project } from '../../domain/entities';
import type { ProjectId } from '../../domain/value-objects/id';
import type { WorkspaceId } from '../../domain/value-objects/workspace-id';
import type { ProjectReadRepository } from '../../domain/repositories/read';
import {
	createProjectNotFoundError,
	type ProjectDomainError,
} from '../../domain/errors';
import {
	createInvalidObjectInDatabaseError,
	type InvalidObjectInDatabaseError,
	createUnexpectedDatabaseError
} from '@backend/libs/error';
import { validate } from '@backend/libs/validation';

export class DrizzleProjectReadRepository
  implements ProjectReadRepository {

  constructor(
    private readonly db: DbClient
  ) {}

  async findById(id: ProjectId): Promise<Result<Project, ProjectDomainError>> {
    try {
      const result = await this.db
        .select()
        .from(projects)
        .where(eq(projects.id, id))
        .limit(1);

      const [project] = result;

      if (project == undefined) {
        return Result.err(createProjectNotFoundError(id));
      }

      const validatedProject = validate<Project, InvalidObjectInDatabaseError>(
				ProjectSchema,
				project,
				msg => createInvalidObjectInDatabaseError(project, 'ProjectSchema', msg)
			);

			return validatedProject;
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }

  async findAllByWorkspace(
    workspaceId: WorkspaceId
  ): Promise<Result<Project[], ProjectDomainError>> {
    try {
      const res = await this.db
        .select()
        .from(projects)
        .where(eq(projects.workspaceId, workspaceId));

			for (const project of res) {
				const validatedProject = validate<Project, InvalidObjectInDatabaseError>(
					ProjectSchema,
					project,
					msg => createInvalidObjectInDatabaseError(project, 'ProjectSchema', msg)
				);

				if (!validatedProject.ok) {
					return Result.err(validatedProject.error);
				}
			}

      return Result.ok(res as Project[]);
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }
}

// infrastructure/persistence/write.ts
import { and, eq } from 'drizzle-orm';
import { Result } from '@backend/libs/result';
import type { DbClient } from '@backend/app/db/connector';
import { projects } from '@backend/app/db/schema';

import type { Project } from '../../domain/entities';
import type { ProjectId } from '../../domain/value-objects/id';
import type { ProjectWriteRepository } from '../../domain/repositories/write';
import type { Version } from '@backend/libs/primitives';
import { createOptimisticLockError, type ProjectDomainError } from '../../domain/errors';
import { createUnexpectedDatabaseError } from '@backend/libs/error';

export class DrizzleProjectWriteRepository
  implements ProjectWriteRepository {

  constructor(
    private readonly db: DbClient
  ) {}

  async save(project: Project, expectedVersion: Version): Promise<Result<void, ProjectDomainError>> {
		try{
			const result = await this.db
      .update(projects)
      .set({
        name: project.name,
        workspaceId: project.workspaceId,
        updatedAt: project.updatedAt,
        deletedAt: project.deletedAt ?? null,
        version: project.version,
      })
      .where(
        and(
          eq(projects.id, project.id),
          eq(projects.version, expectedVersion)
        )
      );

    if (result.changes === 0) {
      return Result.err(createOptimisticLockError(project.id));
    }

    return Result.ok(undefined);
		} catch (error) {
			return Result.err(createUnexpectedDatabaseError(error));
		}
  }

  async delete(id: ProjectId): Promise<Result<void, ProjectDomainError>> {
		try{
			// TODO: add soft delete
			await this.db
				.delete(projects)
				.where(eq(projects.id, id));

			return Result.ok(undefined);
		} catch (error) {
			return Result.err(createUnexpectedDatabaseError(error));
		}
  }
}

// infrastructure/persistence/unit-of-work.ts
import type { DbClient } from '@backend/app/db/connector';
import type { UnitOfWork } from '../../domain/repositories/unit-of-work';
import type { ProjectWriteRepository } from '../../domain/repositories/write';
import { DrizzleProjectWriteRepository } from './write';

export class DrizzleUnitOfWork implements UnitOfWork {
  projects!: ProjectWriteRepository;

  constructor(
    private readonly db: DbClient
  ) {}

  async run<T>(fn: (uow: this) => Promise<T>): Promise<T> {
    return this.db.transaction(async (tx) => {
      this.projects = new DrizzleProjectWriteRepository(tx);

      return fn(this);
    });
  }

  async commit(): Promise<void> {
    // commit выполняется автоматически
  }

  rollback(): Promise<void> {
    throw new Error('Rollback is handled by transaction failure');
  }
}
```

## Library Components Usage

### @src/libs/**
- **id.ts**: Provides UUID-based ID creation with branding for type safety
- **primitives.ts**: Defines common reusable value object schemas with type branding
- **result.ts**: Implements Result/Either pattern for error handling
- **validation.ts**: Wraps arktype validation with Result pattern
- **version.ts**: Provides version incrementing and comparison utilities for optimistic locking
- **error.ts**: Provides base error types and error creation utilities

### Key Usage Patterns:
- All IDs use branded UUIDs for type safety
- Validation occurs at domain boundaries using arktype schemas
- Error handling follows Result pattern with type safety
- Versioning supports optimistic locking patterns
- Functional programming approaches for entity updates
- Actor-based permission checking for security

## Database Schema Correspondence

The domain model corresponds directly to the database schema with these mappings:

Database Schema (`@src/app/db/schema/tables/[entity].ts`):
```typescript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from 'uuid';
import { [relatedEntity] } from "./[relatedEntity]"; // Foreign key tables

export const [tableName] = sqliteTable("[tableName]", {
	id: text("id").primaryKey().$defaultFn(uuidv4),           // Maps to [EntityName]Id value object
	property: text("property").notNull(),                     // Maps to [EntityName][Property] value object
	version: integer('version').notNull(),                    // Maps to Version primitive
	createdAt: integer("created_at").notNull(),               // Maps to Timestamp primitive
	updatedAt: integer("updated_at").notNull(),               // Maps to Timestamp primitive
	deletedAt: integer("deleted_at"),                         // Maps to optional Timestamp primitive
	[relatedEntity]Id: text("[relatedEntity]_id")             // Maps to [RelatedEntity]Id value object
		.notNull()
		.references(() => [relatedEntity].id),                   // Establishes foreign key relationship
});
```

Mapping correspondence:
- `id` → Entity's `id` field with [EntityName]Id type
- `property` → Entity's property field with corresponding value object type
- `version` → Entity's `version` field with Version type
- `created_at` → Entity's `createdAt` field with Timestamp type
- `updated_at` → Entity's `updatedAt` field with Timestamp type
- `deleted_at` → Entity's optional `deletedAt` field with optional Timestamp type
- `[relatedEntity]_id` → Entity's `[relatedEntity]Id` field with [RelatedEntity]Id type

Foreign key relationships are maintained through references to other table's ID fields, which align with the corresponding value object types in the domain model.

### Real Example from Projects Module:
```typescript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from 'uuid';
import { workspaces } from "./workspace"; // Foreign key table

export const projects = sqliteTable("projects", {
	id: text("id").primaryKey().$defaultFn(uuidv4),             // Maps to ProjectId value object
	name: text("name").notNull(),                               // Maps to ProjectName value object
	version: integer('version').notNull(),                      // Maps to Version primitive
	createdAt: integer("created_at").notNull(),                 // Maps to Timestamp primitive
	updatedAt: integer("updated_at").notNull(),                 // Maps to Timestamp primitive
	deletedAt: integer("deleted_at"),                           // Maps to optional Timestamp primitive
	workspaceId: text("workspace_id")                           // Maps to WorkspaceId value object
		.notNull()
		.references(() => workspaces.id),                        // Establishes foreign key relationship to workspace table
});
```

This schema corresponds directly to the Project entity with fields mapping exactly to the domain model properties.
