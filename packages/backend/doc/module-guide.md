# Module Standardization Guide

This document provides a comprehensive guide for creating new modules in the backend, based on the reference implementation of the projects module.

## Table of Contents
- [Module Structure](#module-structure)
- [Value Objects](#value-objects)
- [Domain Entities](#domain-entities)
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
│   │   ├── repositories/
│   │   └── value-objects/
│   └── infrastructure/
│       └── persistence/
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
import { createId, createIdSchema } from "@backend/libs/id";
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
	| InvalidObjectInDatabaseError
	| UnexpectedDatabaseError;
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

// Similar creators for other error types
```

### Error Type Guards:
```typescript
export const is[EntityName]NotFoundError = (
	error: [EntityName]DomainError
): error is [EntityName]NotFoundError => error.type === '[ENTITY_NAME]_NOT_FOUND';

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
import type { [EntityName]DomainError } from '../errors';

export interface [EntityName]ReadRepository {
	findById(id: [EntityName]Id): Promise<Result<[EntityName], [EntityName]DomainError>>;
	// Add other query methods as needed:
	// findAllBy[RelatedEntity]?(id: [RelatedEntity]Id): Promise<Result<[EntityName][], [EntityName]DomainError>>
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

export class Create[EntityName]Handler {
	constructor(
		private readonly writeRepo: [EntityName]WriteRepository,
		private readonly now: () => Timestamp,
	) {}

	async handle(command: Create[EntityName]Command): Promise<Result<[EntityName], [EntityName]DomainError>> {
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

export class Get[EntityName]Handler {
	constructor(private readonly readRepo: [EntityName]ReadRepository) {}

	async handle(query: Get[EntityName]Query): Promise<Result<[EntityName] | null, [EntityName]DomainError>> {
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

export class Update[EntityName]Handler {
	constructor(
		private readonly readRepo: [EntityName]ReadRepository,
		private readonly uow: UnitOfWork,
		private readonly now: () => Timestamp,
	) {}

	async handle(command: Update[EntityName]Command): Promise<Result<void, [EntityName]DomainError>> {
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
// Import other related entity IDs if needed
import type { [RelatedEntity]Id } from "../../domain/value-objects/[related-entity]-id";

export interface Create[EntityName]Command {
	readonly id: [EntityName]Id,
	readonly property: [EntityName][Property],
	readonly [relatedEntity]Id: [RelatedEntity]Id, // if applicable
}

export interface Update[EntityName]Command {
	readonly id: [EntityName]Id,
	readonly newValue: [EntityName][Property],
}

export interface Delete[EntityName]Command {
	readonly id: [EntityName]Id,
}

export interface Get[EntityName]Query {
	readonly id: [EntityName]Id
}

// Add query interfaces as needed based on use cases
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
```

## Library Components Usage

### @src/libs/**
- **id.ts**: Provides UUID-based ID creation with branding for type safety
- **primitives.ts**: Defines common reusable value object schemas with type branding
- **result.ts**: Implements Result/Either pattern for error handling
- **validation.ts**: Wraps arktype validation with Result pattern
- **version.ts**: Provides version incrementing and comparison utilities for optimistic locking

### Key Usage Patterns:
- All IDs use branded UUIDs for type safety
- Validation occurs at domain boundaries using arktype schemas
- Error handling follows Result pattern with type safety
- Versioning supports optimistic locking patterns
- Functional programming approaches for entity updates

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
