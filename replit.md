# AI4CKD Medical Management Platform

## Overview

AI4CKD is a full-stack web application designed for managing Chronic Kidney Disease (CKD) patients. The system provides comprehensive patient management, consultation tracking, alert monitoring, and PDF report generation capabilities. Built with a modern React frontend and Express.js backend, it uses PostgreSQL for data persistence and includes real-time alert notifications.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom medical theme variables
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless connection
- **API Design**: RESTful API with JSON responses
- **File Generation**: PDFKit for PDF report generation
- **Session Management**: Connect-pg-simple for PostgreSQL session storage

### Project Structure
- `client/` - React frontend application
- `server/` - Express.js backend API
- `shared/` - Shared TypeScript types and database schema
- `migrations/` - Database migration files

## Key Components

### Database Schema (shared/schema.ts)
- **Patients**: Core patient information with CKD staging
- **Consultations**: Medical consultation records with vital signs
- **Alerts**: System-generated alerts based on configurable thresholds
- **Alert Configurations**: Customizable alert thresholds per patient

### Core Services
- **Alert Service**: Automatically generates alerts based on consultation data and configured thresholds
- **PDF Service**: Generates comprehensive patient reports with consultation history
- **Storage Service**: Database abstraction layer for all CRUD operations

### Frontend Components
- **Dashboard**: Real-time overview with statistics and active alerts
- **Patient Management**: Patient forms with edit capabilities
- **Consultation Forms**: Medical data input with real-time alert validation
- **PDF Preview**: Report generation and download functionality

## Data Flow

1. **Patient Registration**: Create patient records with medical history and CKD staging
2. **Consultation Entry**: Input vital signs and clinical notes during patient visits
3. **Alert Generation**: System automatically evaluates consultation data against thresholds
4. **Alert Management**: Healthcare providers can acknowledge and resolve alerts
5. **Report Generation**: PDF reports compiled from patient data and consultation history

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless connection
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: UI component primitives
- **react-hook-form**: Form handling and validation
- **pdfkit**: PDF document generation
- **zod**: Runtime type validation

### Development Tools
- **TypeScript**: Type safety across the entire stack
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Utility-first styling framework
- **ESBuild**: Backend bundling for production

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with hot module replacement
- Node.js server with tsx for TypeScript execution
- PostgreSQL database connection via Neon serverless

### Production Build
- Frontend: Vite builds static assets to `dist/public`
- Backend: ESBuild bundles server code to `dist/index.js`
- Single Node.js process serves both API and static files
- Database migrations applied via `drizzle-kit push`

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment mode (development/production)
- Session secrets and other sensitive data via environment variables

The application follows a monorepo structure with shared TypeScript types, enabling type safety across the frontend-backend boundary. The medical theme and alert system are specifically designed for healthcare workflows, with real-time updates and comprehensive patient tracking capabilities.