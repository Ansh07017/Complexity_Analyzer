# Overview

The Complexity Analyzer is an educational web application designed to help students and developers learn about algorithm complexity through interactive visualizations. The application provides hands-on demonstrations of sorting algorithms, searching algorithms, graph algorithms, and dynamic programming concepts with real-time complexity analysis and step-by-step breakdowns.

The application features a comprehensive dashboard for algorithm selection, enhanced sorting visualizations with detailed metrics, interactive searching demonstrations, graph algorithm visualizations including BFS/DFS/Dijkstra, and real-world examples that connect algorithms to everyday applications like GPS navigation and social media.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The application uses a modern React-based architecture with TypeScript for type safety. The frontend is built with Vite as the build tool and development server, providing fast hot module replacement and optimized builds. The component architecture follows a modular approach with reusable UI components built on top of Radix UI primitives.

**State Management**: Uses TanStack Query (React Query) for server state management and caching, with local component state for UI interactions and animation controls.

**Routing**: Implements client-side routing using Wouter, a lightweight routing library that provides navigation between different algorithm visualization pages.

**Styling**: Employs Tailwind CSS with a custom design system using CSS variables for theming. The styling approach uses Shadcn/ui components which provide consistent, accessible UI components with proper keyboard navigation and screen reader support.

**Animation System**: Custom animation hooks manage algorithm visualization state, including play/pause controls, speed adjustment, and step-by-step execution tracking.

## Backend Architecture

The backend follows a REST API pattern built with Express.js and TypeScript. The server architecture separates concerns between routing, business logic, and data storage.

**API Structure**: RESTful endpoints for algorithm management including CRUD operations for algorithms and algorithm sessions. Routes are organized by resource type with proper HTTP methods and status codes.

**Storage Layer**: Implements an abstraction layer with both in-memory storage for development and database support for production. The storage interface allows for easy swapping between different storage backends.

**Development Setup**: Integrated with Vite in development mode for hot module replacement and unified development experience.

## Data Storage Solutions

**Database**: Configured to use PostgreSQL with Drizzle ORM for type-safe database operations. The database schema includes tables for algorithms, algorithm sessions, and user progress tracking.

**Schema Design**: 
- Algorithms table stores algorithm metadata including name, category, complexity metrics, and implementation details
- Algorithm sessions track user interactions, progress, and performance metrics
- JSON fields store flexible data like algorithm steps and execution metrics

**Development Storage**: In-memory storage with seeded data for development and testing, allowing the application to run without database setup during development.

## Authentication and Authorization

The application is designed as a public educational tool without authentication requirements. Users can access all algorithm visualizations and examples without creating accounts, making it immediately accessible for learning purposes.

## Component Architecture

**Page Components**: Each algorithm category (sorting, searching, graph) has dedicated page components that orchestrate the visualization experience.

**Visualization Components**: Specialized components for each algorithm type handle the interactive demonstrations, animation controls, and real-time feedback.

**Shared UI Components**: A comprehensive component library based on Radix UI primitives provides consistent, accessible interface elements across all pages.

**Animation Controls**: Reusable control components manage playback, speed adjustment, and step navigation across different algorithm visualizations.

# External Dependencies

## Database and ORM
- **Neon Database**: Cloud PostgreSQL database service for production data storage
- **Drizzle ORM**: Type-safe ORM for database operations with schema migration support
- **Drizzle Kit**: Database toolkit for schema management and migrations

## Frontend Libraries
- **React**: Core UI library with hooks for state management and component lifecycle
- **TanStack Query**: Server state management with caching, background updates, and optimistic updates
- **Wouter**: Lightweight client-side routing library for navigation
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Radix UI**: Headless component library providing accessible UI primitives

## UI Component System
- **Shadcn/ui**: Pre-built component library with consistent design system
- **Lucide React**: Icon library with comprehensive set of modern icons
- **Class Variance Authority**: Utility for managing component variants and conditional styles

## Development Tools
- **Vite**: Build tool and development server with fast hot module replacement
- **TypeScript**: Static typing for improved developer experience and code reliability
- **ESBuild**: Fast bundler for production builds

## Animation and Visualization
- **Embla Carousel**: Carousel component for algorithm comparison views
- **React Hook Form**: Form state management with validation
- **Date-fns**: Date manipulation utilities for session tracking

## Production Infrastructure
- **Express.js**: Node.js web framework for API server
- **Connect-pg-simple**: PostgreSQL session store for Express sessions