# Controller Development Guide

This document provides a comprehensive guide for creating new controllers in the backend application, following the established patterns and architecture.

## Table of Contents
- [Overview](#overview)
- [Controller Structure](#controller-structure)
- [Creating a New Controller](#creating-a-new-controller)
- [Input Validation](#input-validation)
- [Error Handling](#error-handling)
- [Integrating with Use Cases](#integrating-with-use-cases)
- [Router Updates](#router-updates)
- [DI Container Integration](#di-container-integration)
- [Best Practices](#best-practices)

## Overview

Controllers serve as the entry points for HTTP requests and are responsible for:
- Validating input data
- Orchestrating use case execution
- Handling errors appropriately
- Formatting and returning responses

## Controller Structure

A typical controller follows this pattern:

```typescript
import { type } from "arktype";
import { createUnexpectedErr, type Request } from "@backend/libs/trpc";
import { Result } from "@backend/libs/result";
import type { UseCaseHandler } from "@backend/modules/[module]/application/[handler]";
import { createValueObject } from "@backend/modules/[module]/domain/value-objects/[value-object]";
import { SpecificErrorToTRPC, mapErr } from "./error";
import type { ContextHttp } from "@backend/app/server/init";

export const inputSchema = type({
	// Define input fields here
});

type InputType = typeof inputSchema.infer

export interface OutputType {
	// Define output fields here
}

export class ControllerName {
	constructor(
		private readonly usecase: UseCaseHandler,
		// Additional dependencies
	) {}
	
	async handler({ input, ctx }: Request<InputType, ContextHttp>): Promise<OutputType> {
		// Implementation here
		return {
			// Return output
		};
	}
}
```

## Creating a New Controller

### Step 1: Define Input Schema

Create a validation schema for the incoming request data:

```typescript
export const inputSchema = type({
	email: 'string',
	password: 'string',
	// Add other fields as needed
});
```

### Step 2: Define Input and Output Types

```typescript
type InputType = typeof inputSchema.infer

export interface OutputType {
	id: string;
	username: string;
	email: string;
}
```

### Step 3: Create the Controller Class

```typescript
export class ControllerName {
	constructor(
		private readonly usecase: UseCaseHandler,
		// Inject dependencies
	) {}
	
	async handler({ input, ctx }: Request<InputType, ContextHttp>): Promise<OutputType> {
		// Validate and create value objects
		const emailVo = Result.unwrapOrThrow(
			createEmail(input.email), 
			InvalidEmailErrorToTRPC
		);
		const passwordVo = Result.unwrapOrThrow(
			createPassword(input.password), 
			InvalidPasswordErrorToTRPC
		);

		// Prepare command object
		const command = {
			email: emailVo,
			password: passwordVo,
		};

		// Execute use case
		const result = Result.unwrapOrThrow(
			await this.usecase.handle(command),
			mapErr
		);

		return {
			id: result.id,
			username: result.username,
			email: result.email
		};
	}
}
```

### Step 4: Handle Special Cases (e.g., Authentication Headers)

For controllers that need to set headers (like authentication tokens):

```typescript
// In login controller example
const accessToken = this.jwtService.sign({ subId: id });

const bearer = Result.unwrapOrThrow(
	buildBearerAuthorization(accessToken),
	() => createUnexpectedErr("incorrect token")
);

ctx.res.setHeader("Authorization", bearer);
```

## Input Validation

### Using Arktype for Input Validation

All input should be validated using arktype schemas:

```typescript
import { type } from "arktype";

export const inputSchema = type({
	fieldName: 'string',
	optionalField: 'string?',
	numericField: 'number'
});
```

### Validating Value Objects

Validate domain value objects using the `Result.unwrapOrThrow` pattern:

```typescript
const emailVo = Result.unwrapOrThrow(
	createEmail(input.email), 
	InvalidEmailErrorToTRPC
);
```

## Error Handling

### Error Mapping

Map domain errors to appropriate HTTP responses in a separate error file:

```typescript
// error.ts
export const InvalidEmailErrorToTRPC = () => TRPCError({
	code: "BAD_REQUEST",
	message: "Invalid email format"
});

export const mapErr = (err: DomainError) => {
	// Map different error types to appropriate TRPC errors
};
```

### Unwrapping Results Safely

Always use `Result.unwrapOrThrow` with appropriate error mappers:

```typescript
const result = Result.unwrapOrThrow(
	await this.usecase.handle(command),
	mapErr
);
```

## Integrating with Use Cases

Controllers should depend on application layer handlers (use cases) rather than domain services directly:

```typescript
constructor(
	private readonly usecase: LoginUserHandler, // Application layer handler
	private readonly jwtService: JwtService     // Infrastructure service
) {}
```

### Example: Complete Integration

```typescript
async handler({ input, ctx }: Request<InputLogin, ContextHttp>): Promise<OutputLogin> {
	// 1. Validate inputs
	const emailVo = Result.unwrapOrThrow(createEmail(input.email), InvalidEmailErrorToTRPC);
	const passwordVo = Result.unwrapOrThrow(createPassword(input.password), InvalidPasswordErrorToTRPC);

	// 2. Prepare command
	const command = {
		email: emailVo,
		password: passwordVo,
	};

	// 3. Execute use case
	const { id, username, email } = Result.unwrapOrThrow(
		await this.usecase.handle(command),
		mapErr
	);

	// 4. Format and return response
	return {
		id,
		username,
		email
	};
}
```

## Router Updates

### Registering the Controller in Router

Controllers need to be registered in the app-routes file (`src/app/server/app-routes.ts`):

```typescript
import { inputLoginSchema } from "../controllers/identity/login";
import { t, publicProcedure } from "./init";

export type AppRouter = typeof appRouter;

export const appRouter = t.router({
	login: publicProcedure
		.input(inputLoginSchema)
		.query(req => req.ctx.container.login.handler(req)),
});
```

### Using Procedures

- Use `publicProcedure` for endpoints that don't require authentication
- Use `protectedProcedure` for endpoints that require authentication
- Always specify input validation schema
- Access controllers through the DI container using `req.ctx.container.[controllerName]`

## DI Container Integration

### Registering Controllers in the DI Container

Controllers must be registered in the DI container to be resolved. This is done in `src/app/di/index.ts`:

```typescript
import { LoginUserHandler } from "@backend/modules/identity/application/commands/login-user-command";
import { LoginController } from "../controllers/identity/login";
import { BcryptPasswordHasher } from "@backend/modules/identity/infrastructure/service/password-hasher";
import { DrizzleUserReadRepository } from "@backend/modules/identity/infrastructure/persistence/user-read";
import { db } from "../db/connector";
import type { JwtService } from "../service/jwt/interface";
import { JwtServiceMock } from "../service/jwt/mock";

export interface Identity {
	login: LoginController
	jwt: JwtService
}

export type Container = Identity;

export function createContainer(): Container {
	const identity = createIdentity();

  return {
		...identity
  };
}

function createIdentity(): Identity {
	const passwordHasher = new BcryptPasswordHasher(10);

	const userReadRepo = new DrizzleUserReadRepository(db);

	const loginUserHandlerUc = new LoginUserHandler(userReadRepo, passwordHasher);

	const jwt = new JwtServiceMock();

	return {
		login: new LoginController(loginUserHandlerUc, jwt),
		jwt,
	};
}
```

### Container Interface Definition

Define the container interface to specify what controllers and services are available:

```typescript
export interface Identity {
	login: LoginController
	jwt: JwtService
}

export type Container = Identity;
```

### Dependency Injection Pattern

The DI container creates instances with all required dependencies:

```typescript
// In the container creation function
return {
	login: new LoginController(loginUserHandlerUc, jwt), // Controller with its dependencies
	jwt,
};
```

### Complete Example: Login Use Case

Let's walk through the complete login flow implementation:

#### 1. Controller Definition (`src/app/controllers/identity/login.ts`)
```typescript
import { type } from "arktype";
import { createUnexpectedErr, type Request } from "@backend/libs/trpc";
import { Result } from "@backend/libs/result";
import type { LoginUserHandler } from "@backend/modules/identity/application/commands/login-user-command";
import { createEmail } from "@backend/modules/identity/domain/value-objects/email";
import { createPassword } from "@backend/modules/identity/domain/value-objects/password";
import { InvalidEmailErrorToTRPC, InvalidPasswordErrorToTRPC, mapErr } from "./error";
import { buildBearerAuthorization, type JwtService } from "@backend/app/service/jwt/interface";
import type { ContextHttp } from "@backend/app/server/init";

export const inputLoginSchema = type({
	email: 'string',
	password: 'string',
});

type InputLogin = typeof inputLoginSchema.infer

export interface OutputLogin {
	id: string;
	username: string;
	email: string;
}

export class LoginController {
	constructor(
		private readonly usecase: LoginUserHandler,
		private readonly jwtService: JwtService
	) {}
	async handler({ input, ctx }: Request<InputLogin, ContextHttp>): Promise<OutputLogin> {
		const emailVo = Result.unwrapOrThrow(createEmail(input.email), InvalidEmailErrorToTRPC);
		const passwordVo = Result.unwrapOrThrow(createPassword(input.password), InvalidPasswordErrorToTRPC);

		const command = {
			email: emailVo,
			password: passwordVo,
		};

		const { id, username, email } = Result.unwrapOrThrow(
			await this.usecase.handle(command),
			mapErr
		);

		const accessToken = this.jwtService.sign({ subId: id });

		const bearer = Result.unwrapOrThrow(
			buildBearerAuthorization(accessToken),
			() => createUnexpectedErr("incorrect token")
		);

		ctx.res.setHeader("Authorization", bearer);

		return {
			id,
			username,
			email
		};
	}
}
```

#### 2. Router Registration (`src/app/server/app-routes.ts`)
```typescript
import { inputLoginSchema } from "../controllers/identity/login";
import { t, publicProcedure } from "./init";

export type AppRouter = typeof appRouter;

export const appRouter = t.router({
	login: publicProcedure
		.input(inputLoginSchema)
		.query(req => req.ctx.container.login.handler(req)),
});
```

#### 3. DI Container Registration (`src/app/di/index.ts`)
```typescript
// In the createIdentity function:
return {
	login: new LoginController(loginUserHandlerUc, jwt), // Controller with its dependencies
	jwt,
};
```

## Best Practices

### 1. Keep Controllers Thin

Controllers should only handle the orchestration between HTTP layer and application layer. Business logic should be in use cases (application layer) or domain services.

### 2. Consistent Error Handling

Always use the `Result` type and `Result.unwrapOrThrow` pattern with appropriate error mappers.

### 3. Input Validation

Validate all inputs using arktype schemas before passing them to value object constructors.

### 4. Follow Naming Conventions

- Controller files: `kebab-case` (e.g., `create-project.ts`)
- Controller classes: `PascalCase` with domain prefix (e.g., `CreateProjectController`)
- Input schemas: `camelCase` with controller name (e.g., `inputCreateProjectSchema`)

### 5. Type Safety

- Always type input and output explicitly
- Use domain value objects instead of primitive types in commands
- Use TypeScript interfaces for complex output types

### 6. Dependency Injection

- All dependencies should be injected through the constructor
- Avoid creating dependencies directly in controllers
- Use the DI container for all dependency resolution