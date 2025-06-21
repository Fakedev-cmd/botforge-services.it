# BotForge - AI Solutions Platform

## Overview

BotForge is a modern full-stack web application designed as an AI solutions marketplace. The platform allows users to browse and purchase AI-powered products, submit reviews, stay updated with company news, and access comprehensive support services. Built with a React frontend and Express backend, it provides a complete business management system with user authentication, product management, order processing, and customer support functionality.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Shadcn/ui component library built on Radix UI
- **Styling**: Tailwind CSS with CSS variables for theming
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Authentication**: Custom authentication with bcrypt password hashing
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful API with JSON responses

### Data Storage Solutions
- **Primary Database**: PostgreSQL hosted on Neon serverless platform
- **ORM**: Drizzle ORM with schema-first approach
- **Migration Management**: Drizzle Kit for database migrations
- **Connection Pooling**: Built-in connection pooling via Neon

## Key Components

### Database Schema
The application uses a comprehensive relational database schema with the following main entities:

- **Users**: Customer and admin accounts with role-based access
- **Products**: AI solution catalog with features and pricing
- **Orders**: Purchase tracking and order management
- **Reviews**: Customer feedback and rating system
- **Updates**: Company announcements and feature updates
- **Tickets**: Customer support ticket system
- **Ticket Messages**: Support conversation threads
- **Password Change Requests**: Secure password reset functionality

### Authentication System
- Role-based access control (customer/admin)
- Secure password hashing with bcrypt
- Session-based authentication
- Protected routes with middleware
- Admin-only functionality access control

### Product Management
- Product catalog with categories and features
- Pricing management with decimal precision
- Product status management (active/inactive)
- Feature listing for each product

### Order Processing
- Order creation and status tracking
- User-product relationship management
- Order history and tracking
- Status updates (pending, development, delivered)

### Support System
- Multi-priority ticket system
- Categorized support requests
- Ticket conversation threads
- Status tracking and management

### Review System
- Star rating system (1-5 scale)
- Customer feedback collection
- Review display and management

## Data Flow

1. **Client Requests**: Frontend makes API calls using TanStack Query
2. **Authentication**: Express middleware validates sessions
3. **Route Handling**: Express routes process requests with validation
4. **Database Operations**: Drizzle ORM handles database interactions
5. **Response Processing**: Structured JSON responses sent to client
6. **UI Updates**: React components re-render with new data

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React with comprehensive Radix UI components
- **Form Management**: React Hook Form with Zod schema validation
- **HTTP Client**: Fetch API with custom wrapper functions
- **Date Handling**: date-fns for date formatting and manipulation
- **Icons**: Lucide React for consistent iconography

### Backend Dependencies
- **Database**: Neon PostgreSQL serverless database
- **ORM**: Drizzle ORM with PostgreSQL adapter
- **Security**: bcrypt for password hashing
- **Session Storage**: connect-pg-simple for PostgreSQL session storage
- **WebSocket**: ws library for Neon database connections

### Development Dependencies
- **Build Tools**: Vite, esbuild for production builds
- **TypeScript**: Full TypeScript support across frontend and backend
- **Development Tools**: tsx for TypeScript execution, Replit integration

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Database**: PostgreSQL 16 module
- **Development Server**: Vite dev server with hot module replacement
- **Backend Server**: Express server with TypeScript execution via tsx

### Production Deployment
- **Build Process**: Two-stage build (Vite for frontend, esbuild for backend)
- **Deployment Target**: Replit Autoscale for automatic scaling
- **Static Assets**: Vite builds frontend to dist/public directory
- **Server Bundle**: esbuild creates optimized Node.js bundle
- **Port Configuration**: Express serves on port 5000, external port 80

### Environment Configuration
- **Environment Variables**: DATABASE_URL for PostgreSQL connection
- **Module System**: ES modules throughout the application
- **File Structure**: Separate client, server, and shared directories

## Changelog

- June 21, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.