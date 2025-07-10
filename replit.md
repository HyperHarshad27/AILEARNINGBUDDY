# Domestika AI Learning Assistant

## Overview

This is a full-stack AI-powered learning assistant for creative learners that provides personalized course recommendations, interactive chat support, and project feedback. The application is built using a modern TypeScript stack with React frontend, Express.js backend, PostgreSQL database via Drizzle ORM, and OpenAI integration for AI capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with clear separation between client, server, and shared components:

- **Frontend**: React with TypeScript using Vite for development and building
- **Backend**: Express.js server with TypeScript 
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **AI Integration**: OpenAI GPT-4 for chat assistance and project feedback
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Session Management**: Express sessions with PostgreSQL store

## Key Components

### Frontend Architecture (`client/`)
- **React Router**: Using Wouter for lightweight client-side routing
- **Component Structure**: Modular UI components with shadcn/ui primitives
- **Pages**: Landing, onboarding flow, and main dashboard
- **State Management**: React Query for API state, localStorage for user preferences
- **Styling**: Tailwind CSS with custom Domestika brand colors and design system

### Backend Architecture (`server/`)
- **Express Server**: RESTful API with middleware for logging and error handling
- **Routes**: Organized API endpoints for profiles, chat, feedback, and learning paths
- **Storage Layer**: Abstracted storage interface for database operations
- **AI Integration**: OpenAI client for chat completions and feedback generation

### Database Schema (`shared/schema.ts`)
- **Users**: Basic user authentication structure
- **User Profiles**: Skill levels, interests, goals, and time commitments
- **Courses**: Course catalog with metadata and categorization
- **Learning Paths**: Personalized course sequences with progress tracking
- **Chat Messages**: Conversation history between users and AI assistant
- **Feedback Requests**: Project submissions and AI-generated feedback

### Shared Types (`shared/`)
- **Schema Definitions**: Drizzle table definitions with Zod validation
- **Type Safety**: Shared TypeScript interfaces between client and server
- **Validation**: Input validation schemas using drizzle-zod

## Data Flow

1. **User Onboarding**: Multi-step form collecting skill level, interests, goals, and time commitment
2. **Profile Creation**: User preferences stored in database and used for personalization
3. **Chat Interaction**: Real-time chat with AI assistant using user profile context
4. **Learning Path Generation**: AI-generated course recommendations based on user profile
5. **Project Feedback**: Users submit project descriptions/images for AI analysis and suggestions
6. **Progress Tracking**: Course completion and learning path advancement

## External Dependencies

### Core Framework Dependencies
- **React 18**: Frontend framework with hooks and modern patterns
- **Express**: Node.js web framework for API server
- **TypeScript**: Type safety across the entire stack
- **Vite**: Fast development server and build tool

### Database & ORM
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **Drizzle-Zod**: Schema validation integration

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives (@radix-ui/*)
- **Lucide React**: Icon library
- **shadcn/ui**: Pre-built component library

### AI & External Services
- **OpenAI**: GPT-4 integration for chat and feedback
- **TanStack Query**: Server state management and caching

### Development Tools
- **ESBuild**: Fast JavaScript bundler for server-side code
- **PostCSS**: CSS processing with Tailwind
- **Replit Plugins**: Development environment integration

## Deployment Strategy

### Development Environment
- **Vite Dev Server**: Frontend development with HMR
- **TSX**: TypeScript execution for server development
- **Database Migrations**: Drizzle Kit for schema management

### Production Build
- **Frontend**: Vite build to static assets in `dist/public`
- **Backend**: ESBuild bundle to `dist/index.js`
- **Environment Variables**: Database URL and OpenAI API key required
- **Session Storage**: PostgreSQL-backed sessions with connect-pg-simple

### Database Setup
- **Schema Location**: `shared/schema.ts`
- **Migrations**: Generated in `migrations/` directory
- **Connection**: Uses DATABASE_URL environment variable
- **Session Store**: Integrated with Express sessions for user authentication

The application is designed to be deployed on platforms that support Node.js with PostgreSQL, with particular optimization for Replit's environment including development banner integration and runtime error overlays.