# Technology Stack

## Frontend Framework
- **Preact** (`^10.27.2`)
  - Fast 3kB alternative to React with the same modern API
  - Provides excellent performance with minimal bundle size
  - Compatible with React ecosystem through compatibility aliases

## UI Framework
- **Chakra UI** (`^3.30.0`)
  - Accessible and composable component library
  - Built-in dark mode support
  - Component theming and customization
  - Accessible by default (WAI-ARIA compliant)

## State Management
- **@preact/signals** (`2.5.1`)
  - Reactive state management library for Preact
  - Provides efficient fine-grained reactivity
  - Simple API for managing application state

## Routing
- **wouter-preact** (`^3.8.1`)
  - Minimalist router for Preact
  - Hooks-first API
  - Tree-shaking friendly (only imports what you use)

## Styling
- **Panda CSS** (`^1.7.2`)
  - Type-safe CSS-in-JS framework
  - Generates atomic CSS at build time
  - Provides style props and recipes
  - Themeable and responsive design utilities

## API Communication
- **tRPC** (`^11.8.1`)
  - End-to-end typesafe API for TypeScript
  - Enables type-safe communication between frontend and backend
  - Provides autocompletion and refactoring safety

## Theming & Utilities
- **next-themes** (`^0.4.6`)
  - React/Preact theming provider
  - Handles dark/light mode switching
  - Respects system preferences
  - Provides theme context

## Icons
- **react-icons** (`^5.5.0`)
  - Popular icon library with various icon packs
  - Tree-shakable (imports only used icons)
  - Compatible with Preact through React compatibility layer

## Build Tools
- **Vite** (using `rolldown-vite@7.2.5`)
  - Next-generation frontend tooling
  - Fast development server with hot module replacement
  - Optimized builds with tree shaking
  - Using Rolldown as a drop-in replacement for Rollup (Rust-based for better performance)

## Development Dependencies
- **TypeScript** (`~5.9.3`)
  - Static type checking
  - Modern JavaScript features with compilation
  - Enhanced IDE support

- **@preact/preset-vite**
  - Vite preset for Preact projects
  - Optimized build configuration for Preact

- **@types/node**
  - TypeScript type definitions for Node.js APIs

- **oxlint**
  - Fast JavaScript/TypeScript linter
  - Alternative to ESLint with better performance

## Aliases & Compatibility
The project uses the following path aliases:
- `@` maps to `src/` directory
- `react` maps to `preact/compat`
- `react-dom` maps to `preact/compat`
- `react/jsx-runtime` maps to `preact/jsx-runtime`

This allows using React-compatible libraries and tools with Preact while maintaining a clean import structure.