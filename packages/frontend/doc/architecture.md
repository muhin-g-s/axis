# Project Architecture Documentation

## Technology Stack

### Core Frameworks and Libraries
- **Preact**: A fast 3kB alternative to React with the same modern API
- **Chakra UI**: A simple, modular and accessible component library for React/Preact
- **wouter**: A minimalist router for Preact with hooks-first API
- **@preact/signals**: Reactive state management for Preact applications

### Build Tools & Development
- **Vite**: Next generation frontend tooling for fast development
- **Rolldown**: Drop-in replacement for Rollup written in Rust (used via vite override)
- **Panda CSS**: Type-safe CSS-in-JS framework for styling
- **TypeScript**: Typed superset of JavaScript for enhanced developer experience

### State Management & APIs
- **tRPC**: End-to-end typesafe APIs
- **next-themes**: React/Preact theming provider for dark mode

## Architectural Principles

### 1. Component-Based Architecture
The application follows a component-based architecture where UI elements are organized as reusable, composable components. The project leverages Preact's lightweight virtual DOM implementation while maintaining compatibility with React ecosystem libraries through aliases.

### 2. Modular Design
The application is structured using feature modules that encapsulate related functionality. Each module contains its own components, utilities, and potentially state management, promoting separation of concerns and maintainability.

### 3. Composition over Inheritance
The architecture emphasizes component composition to build complex UIs from simpler building blocks. Chakra UI's composition-friendly design supports this approach.

### 4. Type Safety
TypeScript is used throughout the codebase to provide compile-time type checking, ensuring better code quality and preventing common runtime errors.

### 5. Performance Optimization
- Lazy loading: Routes and components are loaded on-demand using Preact's lazy loading capabilities
- Tree shaking: Unused code is automatically excluded from the bundle
- Minimal dependencies: Careful selection of lightweight libraries

## Practices Used in Project

### 1. Code Organization
- **Modular structure**: Code is organized into modules, pages, and shared components
- **Consistent file naming**: Following conventions like `*.tsx` for components and `*.ts` for utilities
- **Alias imports**: Using `@` alias to reference `src/` directory for clean import paths

### 2. UI Development
- **Design System**: Utilizing Chakra UI for consistent and accessible UI components
- **CSS-in-JS**: Panda CSS for type-safe styling with theme support
- **Responsive Design**: Mobile-first approach with responsive styling

### 3. Development Practices
- **Strict Type Checking**: TypeScript with strict configuration
- **Code Formatting**: Consistent formatting via build tools
- **ESLint Integration**: Code quality enforced through linter
- **Modular Routing**: Dynamic routes with lazy loading

### 4. State Management
- **Reactive State**: Using @preact/signals for efficient state updates
- **Context Pattern**: Provider pattern for global state management
- **Component State**: Local state management within components

### 5. Theming
- **Dark/Light Mode**: Support for system preference-based theming
- **Theme Provider**: Centralized theme management via next-themes

## Module Structure

The project follows a modular architecture with the following key structural patterns:

### `src/app/`
- **Purpose**: Application root and configuration
- **Contents**:
  - `app.tsx`: Root application component with providers
  - `main.tsx`: Entry point that renders the App component
  - `providers.tsx`: Global context providers
  - `router.tsx`: Application routing configuration

### `src/modules/`
- **Purpose**: Feature modules with related components and logic
- **Current modules**:
  - **identity**: Authentication and user identity management
    - `base`: Shared UI components (forms, buttons, fields)
    - `login`: Login-specific components
    - `registration`: Registration-specific components
  - **layout**: Application layout components

### `src/pages/`
- **Purpose**: Route-level components
- **Structure**:
  - Individual directories for each page
  - Follows route naming conventions
  - Typically contains a main `page.tsx` file

### `src/shared/`
- **Purpose**: Reusable components and utilities across the application
- **Subdirectories**:
  - **navigation**: Routing and navigation components
  - **ui**: Shared UI components and styling utilities

### `src/shared/ui/`
- **Purpose**: Shared UI components and styling system
- **Contents**:
  - Pre-built components using Chakra UI
  - Theming and color mode providers
  - Panda CSS styled-system (auto-generated)
  - Reusable UI patterns

### `src/shared/navigation/`
- **Purpose**: Routing infrastructure
- **Key files**:
  - `navigation.ts`: Route definitions and lazy loading configuration
  - `layout-route.tsx`: Layout route component
  - `async-route.tsx`: Asynchronous route handling

### Module Naming Convention
Each module follows the pattern:
```
module-name/
├── ui/                 # Presentational components
├── lib/                # Module-specific utilities
├── types.ts            # Type definitions
└── index.ts            # Public API exports
```

This architecture promotes:
- **Separation of concerns**: Each module handles a specific domain
- **Encapsulation**: Module internals are hidden, public API is exported via index.ts
- **Reusability**: Modules can be independently developed and tested
- **Maintainability**: Changes in one module don't affect others
