# Overview

This is an Automated Time & Space Complexity Analyzer that takes user code (Python, Java, C++, JavaScript), runs it safely in a sandbox environment, analyzes time and space complexity, detects performance issues, and produces interactive reports with recommendations. The system uses a full-stack architecture with React frontend, Express.js backend, and PostgreSQL database to provide real-time code analysis and visualization.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite for build tooling
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **Styling**: TailwindCSS with CSS variables for theming support
- **State Management**: TanStack Query for server state management and React hooks for local state
- **Code Editor**: Monaco Editor integration for rich code editing experience
- **Charts**: Chart.js for runtime and memory usage visualizations
- **Routing**: Wouter for lightweight client-side routing

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **API Design**: RESTful API with structured error handling and request logging
- **Code Execution**: Sandbox executor service for safe code execution with configurable timeouts and memory limits
- **Analysis Engine**: Code analyzer service that processes execution results and determines complexity patterns
- **Storage Layer**: Abstracted storage interface with in-memory implementation (designed for future database integration)

## Data Storage
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Single `analyses` table storing code, language, execution results, complexity analysis, and recommendations
- **Connection**: Connection pooling with @neondatabase/serverless for optimal performance

## Code Execution Sandbox
- **Isolation**: Temporary file system with process spawning for secure code execution
- **Language Support**: Python, JavaScript, Java, and C++ with appropriate compilers/interpreters
- **Safety Measures**: Configurable timeouts (5s default), memory limits (1GB), and automatic cleanup
- **Input Generation**: Automated test case generation with varying input sizes for complexity analysis

## Complexity Analysis System
- **Pattern Detection**: Statistical analysis of runtime vs input size relationships to determine Big O notation
- **Algorithm Classification**: Automatic detection of common algorithm patterns (sorting, searching, etc.)
- **Performance Profiling**: Memory usage tracking and execution time measurement across multiple input sizes
- **Warning System**: Identification of potential infinite loops, inefficient patterns, and performance bottlenecks

## Recommendation Engine
- **Learning Resources**: Curated links to educational content based on detected algorithm types
- **Performance Suggestions**: Actionable recommendations for code optimization
- **Best Practices**: Language-specific coding guidelines and efficiency tips

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle Kit**: Database migration and schema management tools

## UI Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **shadcn/ui**: Pre-built component library built on Radix UI primitives
- **Lucide React**: Icon library for consistent iconography
- **TailwindCSS**: Utility-first CSS framework with custom design tokens

## Development Tools
- **Monaco Editor**: VSCode-like code editor for the browser via CDN
- **Chart.js**: Data visualization library loaded via CDN for performance charts
- **TanStack Query**: Powerful data synchronization for React applications

## Build and Development
- **Vite**: Fast build tool with HMR and TypeScript support
- **Replit Integration**: Development environment integration with runtime error overlay and cartographer plugins
- **esbuild**: Fast JavaScript bundler for production builds

## Runtime and Execution
- **Node.js Modules**: Process management, file system operations, and temporary directory handling
- **Language Runtimes**: Support for Python, Node.js, Java (OpenJDK), and C++ (GCC) compilation and execution