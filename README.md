# Nordic Marketplace

A modern, full-stack e-commerce marketplace built with React, Node.js, Express, TypeScript, and PostgreSQL. This project demonstrates production-ready architecture, security best practices, and scalable design patterns.

## 📑 Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
  - [High-Level Architecture](#high-level-architecture)
  - [Frontend Architecture](#frontend-architecture)
  - [Backend Architecture](#backend-architecture)
  - [Data Flow](#data-flow)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Security Considerations](#security-considerations)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Docker Deployment](#docker-deployment)
- [Testing Strategy](#testing-strategy)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Design Patterns & Best Practices](#design-patterns--best-practices)
- [Scalability & Performance](#scalability--performance)
- [Development Guidelines](#development-guidelines)

---

## Overview

Nordic Marketplace is a full-stack e-commerce platform featuring a React SPA frontend and a RESTful API backend. The application handles user authentication, product catalog management, shopping cart functionality and order processing. Futhermore, order tracking and admin dashboard is in progress.

### Highlights

- **Clean Architecture** - Separation of concerns with layered architecture
- **Secure by Design** - JWT authentication, input validation, and role-based access control
- **Feature-Sliced Design** - Modular frontend with domain-driven organization
- **Container-Ready** - Multi-stage Docker builds for development and production
- **Comprehensive Testing** - Unit and integration tests with isolated test databases
- **Performance Optimized** - Lazy loading, debounced API calls, and efficient state management

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     React SPA (Vite + TypeScript)                    │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │   │
│  │  │   Products  │  │    Auth     │  │    Cart     │  │   Orders   │ │   │
│  │  │   Feature   │  │   Feature   │  │   Feature   │  │   Feature  │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │   │
│  │                    ↓ Redux Toolkit (State Management) ↓             │   │
│  │                    ↓ Axios (HTTP Client + Interceptors) ↓           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTPS/REST
                                      ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                   Express.js (Node.js Runtime)                       │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │  Middleware: Auth → Role → Validation → Rate Limiting        │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │   │
│  │  │  Routes  │→ │Controllers│→ │ Services │→ │  Prisma  │           │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ Prisma ORM
                                      ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATA LAYER                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     PostgreSQL Database                              │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────┐  │   │
│  │  │  Users  │  │Products │  │ Orders  │  │OrderItem│  │ Category │  │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └──────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Frontend Architecture

The frontend follows a **Feature-Sliced Design** pattern combined with **Flux architecture** (via Redux Toolkit):

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                           │
│  Pages → Components → UI Components (shadcn/ui)                 │
├─────────────────────────────────────────────────────────────────┤
│                    STATE MANAGEMENT LAYER                        │
│  Redux Store → Slices → Thunks (Async Actions)                  │
├─────────────────────────────────────────────────────────────────┤
│                    DATA ACCESS LAYER                             │
│  Services → API Client → Axios Instance (with Interceptors)     │
└─────────────────────────────────────────────────────────────────┘
```

**Key Architectural Decisions:**

| Decision                  | Rationale                                                                    |
| ------------------------- | ---------------------------------------------------------------------------- |
| **Feature-Sliced Design** | Encapsulates domain logic (auth, products, cart, orders) for maintainability |
| **Redux Toolkit**         | Predictable state management with built-in immutability and DevTools support |
| **Async Thunks**          | Standardized async operations with automatic loading/error states            |
| **Axios Interceptors**    | Centralized auth token injection and 401 response handling                   |
| **Lazy Loading**          | Code-splitting for optimized initial bundle size                             |
| **Custom Hooks**          | Reusable logic abstraction (`useAuth`, `useProducts`, `useDebounce`)         |

### Backend Architecture

The backend implements a **Layered Architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────────┐
│                      ROUTES LAYER                               │
│  Define endpoints, apply middleware, delegate to controllers    │
├─────────────────────────────────────────────────────────────────┤
│                   CONTROLLERS LAYER                             │
│  HTTP request/response handling, input validation               │
├─────────────────────────────────────────────────────────────────┤
│                    SERVICES LAYER                               │
│  Business logic, orchestration, transaction management          │
├─────────────────────────────────────────────────────────────────┤
│                  DATA ACCESS LAYER                              │
│  Prisma ORM, database queries, entity mapping                   │
├─────────────────────────────────────────────────────────────────┤
│                   MIDDLEWARE LAYER                              │
│  Authentication, Authorization, Error Handling, Logging         │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Action → React Component → Dispatch Thunk → Service Call → Axios Request
                                                                      │
                         Redux State Update ← Thunk Fulfilled ←──────┘
                                                                      │
                                                    Express Route ←───┘
                                                         │
                                    Controller → Service → Prisma → PostgreSQL
```

---

## Key Features

### Frontend

- **React 19** with functional components and hooks
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for accessible, customizable UI components
- **Redux Toolkit** for predictable state management
- **Shopping Cart** with local state persistence
- **Product Search & Filtering** with debounced queries
- **Protected Routes** with auth-aware navigation
- **Code Splitting** via React.lazy() and Suspense

### Backend

- **JWT Authentication** with access/refresh token pattern
- **Role-Based Access Control** (USER/ADMIN)
- **Product Catalog** with category management
- **Order Processing** with status tracking (in progress)
- **Input Validation** using Zod schemas
- **Structured Logging** with Winston
- **Comprehensive Testing** (Unit & Integration)
- **Docker Support** for containerized deployment (later in AWS)

---

## Technology Stack

### Frontend

| Category         | Technology        | Purpose                               |
| ---------------- | ----------------- | ------------------------------------- |
| Framework        | React 19          | UI component library                  |
| Build Tool       | Vite 7            | Fast development and optimized builds |
| Language         | TypeScript 5.9    | Type safety and developer experience  |
| State Management | Redux Toolkit 2   | Predictable state container           |
| Routing          | React Router 7    | Client-side routing                   |
| HTTP Client      | Axios             | Promise-based HTTP requests           |
| Styling          | Tailwind CSS 4    | Utility-first CSS framework           |
| UI Components    | shadcn/ui + Radix | Accessible component primitives       |
| Icons            | Lucide React      | Consistent icon library               |

### Backend

| Category         | Technology         | Purpose                      |
| ---------------- | ------------------ | ---------------------------- |
| Runtime          | Node.js 20         | JavaScript runtime           |
| Framework        | Express.js 5       | Web application framework    |
| Language         | TypeScript         | Type safety                  |
| Database         | PostgreSQL 15      | Relational database          |
| ORM              | Prisma             | Type-safe database access    |
| Authentication   | JWT (jsonwebtoken) | Stateless authentication     |
| Password Hashing | bcrypt             | Secure password storage      |
| Validation       | Zod                | Runtime type validation      |
| Logging          | Winston            | Production-grade logging     |
| Testing          | Jest, Supertest    | Unit and integration testing |

### DevOps

| Category         | Technology     | Purpose                        |
| ---------------- | -------------- | ------------------------------ |
| Containerization | Docker         | Consistent environments        |
| Orchestration    | Docker Compose | Multi-container management     |
| Web Server       | Nginx          | Production static file serving |
| Database Admin   | pgAdmin        | Database management UI         |

---

## Security Considerations

### Authentication & Authorization

```
┌──────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                           │
├──────────────────────────────────────────────────────────────────┤
│  1. User submits credentials                                     │
│  2. Backend validates against hashed password (bcrypt, 12 rounds)│
│  3. Server issues JWT access token (short-lived) + refresh token │
│  4. Frontend stores access token in Redux state (memory-only)    │
│  5. Refresh token stored in HTTP-only cookie                     │
│  6. Axios interceptor attaches Bearer token to requests          │
│  7. 401 responses trigger automatic logout and redirect          │
└──────────────────────────────────────────────────────────────────┘
```

### Security Measures Implemented

| Security Layer           | Implementation                                           | Benefit                                            |
| ------------------------ | -------------------------------------------------------- | -------------------------------------------------- |
| **Password Storage**     | bcrypt with configurable salt rounds (default: 12)       | Protection against rainbow table attacks           |
| **Token Security**       | Separate access/refresh secrets, configurable expiration | Minimized token exposure window                    |
| **Input Validation**     | Zod schemas on all endpoints                             | Prevention of injection attacks and malformed data |
| **Role-Based Access**    | Middleware-enforced authorization                        | Principle of least privilege                       |
| **Error Handling**       | Centralized error middleware with sanitized responses    | Prevention of information leakage                  |
| **CORS Configuration**   | Explicit origin whitelisting                             | Cross-origin attack prevention                     |
| **Credentials Handling** | `withCredentials: true` for cookie-based refresh tokens  | Secure token transmission                          |

### Backend Security Middleware Stack

```typescript
// Request flow through security layers
Route → authenticate() → authorize([roles]) → validateInput() → Controller
          │                   │                    │
          │                   │                    └─ Zod schema validation
          │                   └─ Role-based access check
          └─ JWT verification and user attachment
```

### Environment Security

- Secrets managed via environment variables (never committed)
- Separate `.env` files for development, testing, and production
- Docker secrets support for later production deployments

---

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- PostgreSQL 15+
- Docker & Docker Compose (for containerized deployment)
- npm or yarn

### Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
cd Nordic_MarketPlace
```

2. **Install backend dependencies:**

```bash
cd backend
npm install
```

3. **Install frontend dependencies:**

```bash
cd ../frontend
npm install
```

### Environment Variables

#### Backend (`.env`)

```env
# Database
DATABASE_URL=

# Server
PORT=
NODE_ENV=

# JWT Configuration
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=
JWT_REFRESH_EXPIRES_IN=

# Security
BCRYPT_SALT_ROUNDS=12
```

#### Frontend (`.env`)

```env
VITE_API_BASE_URL=
```

### Database Setup

```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

---

## Running the Application

### Development Mode

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Access the application:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

---

## Docker Deployment

### Development with Hot Reloading

```bash
docker-compose up --build
```

This starts:

- PostgreSQL database
- Backend API server
- Frontend dev server (with hot reloading)
- pgAdmin (database management)

### Docker Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    Docker Compose Network                      │
├──────────────┬──────────────┬──────────────┬───────────────────┤
│   Frontend   │   Backend    │     DB       │     pgAdmin       │
│  (Dev mode ) │  (Node.js)   │ (PostgreSQL) │                   │
│   Port 5173  │   Port 3000  │  Port 5432   │    Port 5050      │
│              │              │              │                   │
└──────────────┴──────────────┴──────────────┴───────────────────┘
```

---

## Testing Strategy

### Test Pyramid

```
        ┌───────────┐
       /  E2E Tests  \        (Future: Cypress/Playwright)
      /───────────────\
     /  Integration    \      Jest + Supertest (API routes)
    /───────────────────\
   /     Unit Tests      \    Jest (Service layer)
  /───────────────────────\
```

### Running Tests

```bash
cd backend

# Unit tests
npm run test:unit

# Integration tests (starts test DB automatically)
npm run test:int:full

# Integration tests only (DB must be running)
npm run test:int

# Watch mode
npm run test:watch
```

---

## API Documentation

### Authentication

| Method | Endpoint         | Description                 | Auth     |
| ------ | ---------------- | --------------------------- | -------- |
| POST   | `/auth/register` | Register new user           | Public   |
| POST   | `/auth/login`    | User login                  | Public   |
| POST   | `/auth/logout`   | User logout                 | Required |
| POST   | `/auth/refresh`  | Refresh token (in progress) | Cookie   |

### Users

| Method | Endpoint          | Description    | Auth     |
| ------ | ----------------- | -------------- | -------- |
| GET    | `/users/allUsers` | Get all users  | Admin    |
| GET    | `/users/:id`      | Get user by ID | Required |
| PATCH  | `/users/:id`      | Update user    | Required |

### Products

| Method | Endpoint                            | Description          | Auth   |
| ------ | ----------------------------------- | -------------------- | ------ |
| GET    | `/products`                         | List all products    | Public |
| GET    | `/products/:id`                     | Get product details  | Public |
| GET    | `/products/category/:categoryId`    | Products by category | Public |
| POST   | `/products/admin/addproduct`        | Create product       | Admin  |
| PATCH  | `/products/admin/updateproduct/:id` | Update product       | Admin  |
| DELETE | `/products/admin/deleteproduct/:id` | Delete product       | Admin  |

### Orders

| Method | Endpoint                               | Description       | Auth     |
| ------ | -------------------------------------- | ----------------- | -------- |
| POST   | `/orders/user/create`                  | Create order      | Required |
| GET    | `/orders/user/info/:orderId`           | Get order info    | Required |
| GET    | `/orders/user/:userId`                 | Get user's orders | Required |
| DELETE | `/orders/user/delete/:orderId`         | Delete order      | Required |
| GET    | `/orders/admin/:orderId`               | Admin order view  | Admin    |
| PATCH  | `/orders/admin/update-status/:orderId` | Update status     | Admin    |

### Tracking

| Method | Endpoint                    | Description         | Auth     |
| ------ | --------------------------- | ------------------- | -------- |
| GET    | `/tracking/status/:orderId` | Get tracking status | Required |
| PATCH  | `/tracking/update/:orderId` | Update tracking     | Admin    |

---

## Project Structure

```
Nordic_MarketPlace/
├── docker-compose.yml          # Multi-container orchestration
├── README.md                   # This file
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema definition
│   │   ├── seed.ts             # Database seeding
│   │   └── migrations/         # Version-controlled migrations
│   ├── src/
│   │   ├── app.ts              # Express app configuration
│   │   ├── server.ts           # Server entry point
│   │   ├── logger.ts           # Winston logger setup
│   │   ├── controllers/        # Request handlers
│   │   ├── services/           # Business logic layer
│   │   ├── routes/             # API route definitions
│   │   ├── middleware/         # Auth, error handling, roles
│   │   ├── prisma/             # Prisma client instance
│   │   └── utils/              # Helpers, validators, types
│   ├── tests/
│   │   ├── unit/               # Service layer tests
│   │   └── integration/        # API route tests
│   ├── Dockerfile              # Multi-stage build
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/                # API client and endpoints
    │   │   ├── axios.ts        # Configured Axios instance
    │   │   ├── apiClient.ts    # Type-safe API wrapper
    │   │   └── endpoint.ts     # Centralized endpoint definitions
    │   ├── features/           # Feature-sliced modules
    │   │   ├── auth/           # Authentication feature
    │   │   │   ├── components/ # Login/Register forms
    │   │   │   ├── hooks/      # useAuth hook
    │   │   │   ├── pages/      # Auth pages
    │   │   │   ├── services/   # Auth API calls
    │   │   │   ├── store/      # Redux slice + thunks
    │   │   │   └── types/      # TypeScript interfaces
    │   │   ├── products/       # Product catalog feature
    │   │   ├── cart/           # Shopping cart feature
    │   │   └── orders/         # Order management feature
    │   ├── shared/             # Shared utilities
    │   │   ├── components/     # Footer, common UI
    │   │   ├── hooks/          # useDebounce, etc.
    │   │   └── layouts/        # MainLayout
    │   ├── store/              # Redux store configuration
    │   ├── routes/             # React Router setup
    │   └── components/ui/      # shadcn/ui components
    ├── Dockerfile              # Multi-stage (dev + prod)
    ├── nginx.conf              # Production web server config
    └── package.json
```

---

## Database Schema

### Entity Relationship Diagram

## Design Patterns & Best Practices

### Patterns Used

| Pattern                    | Location            | Purpose                           |
| -------------------------- | ------------------- | --------------------------------- |
| **Layered Architecture**   | Backend             | Separation of concerns            |
| **Feature-Sliced Design**  | Frontend            | Domain-driven module organization |
| **Repository Pattern**     | Services via Prisma | Data access abstraction           |
| **Middleware Pattern**     | Express middleware  | Cross-cutting concerns            |
| **Flux/Redux Pattern**     | Frontend state      | Unidirectional data flow          |
| **Async Thunk Pattern**    | Redux actions       | Standardized async operations     |
| **Interceptor Pattern**    | Axios               | Request/response transformation   |
| **Custom Hook Pattern**    | React hooks         | Logic reuse and abstraction       |
| **Error Boundary Pattern** | Error middleware    | Centralized error handling        |

### Code Quality Practices

- **TypeScript Strict Mode** - Maximum type safety
- **ESLint + Prettier** - Consistent code formatting
- **Zod Validation** - Runtime type checking at API boundaries
- **Custom Error Classes** - Structured error handling
- **Centralized Configuration** - Environment-based settings
- **Immutable State** - Redux Toolkit's Immer integration
- **Atomic Commits** - Small, focused changes

---

## Scalability & Performance

### Frontend Optimizations

| Optimization           | Implementation              | Impact                           |
| ---------------------- | --------------------------- | -------------------------------- |
| **Code Splitting**     | `React.lazy()` + `Suspense` | Reduced initial bundle size      |
| **Debounced Search**   | `useDebounce` hook (300ms)  | Reduced API calls                |
| **Memoized Selectors** | Redux Toolkit               | Prevented unnecessary re-renders |
| **Optimistic Updates** | Cart state                  | Improved perceived performance   |
| **Production Build**   | Vite's tree-shaking         | Minimal production bundle        |

### Backend Optimizations

| Optimization           | Implementation                 | Impact                    |
| ---------------------- | ------------------------------ | ------------------------- |
| **Connection Pooling** | Prisma default pool            | Efficient DB connections  |
| **Indexed Queries**    | Prisma's `@unique` constraints | Fast lookups              |
| **Cascade Deletes**    | `onDelete: Cascade`            | Data integrity            |
| **Async/Await**        | Throughout codebase            | Non-blocking operations   |
| **Multi-stage Docker** | Separate build/runtime         | Smaller production images |

### Horizontal Scaling Readiness

- Stateless JWT authentication (no server-side sessions)
- Database connection pooling
- Containerized deployment
- Health check endpoints for orchestration
- Structured logging for aggregation

---

## Development Guidelines

### Code Quality

```bash
# Backend
cd backend
npm run lint          # Check for issues
npm run lint:fix      # Auto-fix issues
npm run format        # Format with Prettier
npm run format:check  # Check formatting

# Frontend
cd frontend
npm run lint
```

### Database Management

```bash
cd backend

# View database in browser
npx prisma studio

# Create new migration
npx prisma migrate dev --name <migration_name>

# Reset database (caution: data loss)
npx prisma migrate reset

# Generate client after schema changes
npm run prisma:generate
```

---

## Key Learning Outcomes

This project demonstrates proficiency in:

- **Full-Stack Development** - React frontend + Node.js backend
- **TypeScript** - End-to-end type safety
- **State Management** - Redux Toolkit patterns
- **API Design** - RESTful principles, proper status codes
- **Security** - JWT auth, input validation, role based access control
- **Testing** - Unit and integration testing strategies
- **DevOps** - Docker, multi-stage builds, environment management
- **Database Design** - Relational modeling, migrations, ORM usage

---

## License

This project is licensed under the MIT License.

---

Built with ❄️ by Israt Jahan Erin
