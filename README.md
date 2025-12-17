# Nordic Marketplace

##### Backend

A modern e-commerce marketplace backend built with Node.js, Express, TypeScript, and PostgreSQL.

## 📑 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Development](#development)

## Overview

Nordic Marketplace is a RESTful API backend for an e-commerce platform that handles user management, product catalog, order processing, and order tracking functionalities.

## Architecture

This project follows a **Layered Architecture** pattern with clear separation of concerns:

```
┌─────────────────────────────────────┐
│         Routes Layer                │  ← HTTP request routing
├─────────────────────────────────────┤
│       Controllers Layer             │  ← Request/Response handling
├─────────────────────────────────────┤
│        Services Layer               │  ← Business logic
├─────────────────────────────────────┤
│      Data Access Layer              │  ← Database operations (Prisma ORM)
└─────────────────────────────────────┘
```

### Layer Responsibilities:

- **Routes Layer**: Defines API endpoints and maps them to controllers
- **Controllers Layer**: Handles HTTP requests/responses, input validation, and calls services
- **Services Layer**: Contains business logic and orchestrates data operations
- **Data Access Layer**: Manages database interactions using Prisma ORM
- **Middleware Layer**: Handles cross-cutting concerns (error handling, logging, authentication)

This architecture ensures:

- **Separation of Concerns**: Each layer has a specific responsibility
- **Testability**: Easy to unit test services and integration test routes
- **Maintainability**: Changes in one layer don't affect others
- **Scalability**: Easy to extend and add new features

## Features

- 🔐 User authentication and authorization (JWT-based)
- 👤 User management with role-based access (USER/ADMIN)
- 📦 Product catalog management with categories
- 🛒 Order processing and management
- 📍 Order tracking system
- ✅ Input validation using Zod
- 📊 Structured logging with Winston
- 🧪 Comprehensive testing (Unit & Integration)
- 🐳 Docker support for testing environment
- 🔄 Database migrations with Prisma

## Technology Stack

### Core Technologies

- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma

### Development Tools

- **Testing**: Jest, Supertest
- **Code Quality**: ESLint, Prettier
- **Logging**: Winston
- **Validation**: Zod
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Development**: tsx, nodemon

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v16 or higher)
- Docker & Docker Compose (for testing)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Nordic_MarketPlace
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

### Environment Variables

Create `.env` file in the `backend` directory based on `.env.example`:

```env
# Database configuration
DATABASE_URL=

# Server configuration
PORT=

# JWT configuration (will be added)
JWT_SECRET=
```

For testing, create `.env.test`:

```env
# Seperate Testing database configuration
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
POSTGRES_PORT=
DATABASE_URL=
```

### Database Setup

1. Generate Prisma Client:

```bash
npm run prisma:generate
```

2. Run migrations:

```bash
npx prisma migrate dev
```

3. (Optional) Seed the database:

```bash
npx prisma db seed
```

## Running the Application

### Development Mode

```bash
cd backend
npm run dev
```

The server will start on `http://localhost:3000` (or the PORT specified in `.env`)

### Production Build

```bash
npm run build
npm start
```

## Testing

### Run Unit Tests

```bash
npm run test:unit
```

### Run Integration Tests

```bash
npm run test:int:full
```

This command will:

1. Spin up a test PostgreSQL database using Docker
2. Run database migrations
3. Execute integration tests
4. Clean up the test database

### Run Integration Tests Only (DB must be running)

```bash
npm run test:int
```

### Manage Test Database Manually

```bash
# Start test database
npm run db:test:up

# Stop and remove test database
npm run db:test:down

# Run migrations on test database
npm run db:test:migrate
```

## API Endpoints

### Users

- `GET /users/allUsers` - Get all users
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user by ID

### Products

**Public Routes:**

- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `GET /products/category/:categoryId` - Get products by category

**Admin Routes:**

- `POST /products/admin/addproduct` - Create a new product
- `PATCH /products/admin/updateproduct/:id` - Update product
- `DELETE /products/admin/deleteproduct/:id` - Delete product

### Orders

**User Routes:**

- `POST /orders/user/create` - Create a new order
- `GET /orders/user/info/:orderId` - Get order information
- `GET /orders/user/:userId` - Get all orders for a user
- `DELETE /orders/user/delete/:orderId` - Delete an order

**Admin Routes:**

- `GET /orders/admin/:orderId` - Get order information (admin view)
- `PATCH /orders/admin/update-status/:orderId` - Update order status

### Tracking

- `GET /tracking/status/:orderId` - Get order tracking status
- `PATCH /tracking/update/:orderId` - Update order tracking status

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── client.ts              # Prisma client instance
│   ├── seed.ts                # Database seeding
│   └── migrations/            # Database migrations
├── src/
│   ├── app.ts                 # Express app configuration
│   ├── server.ts              # Server entry point
│   ├── logger.ts              # Winston logger configuration
│   ├── controllers/           # Request handlers
│   │   ├── userController.ts
│   │   ├── productController.ts
│   │   ├── orderController.ts
│   │   └── trackingController.ts
│   ├── services/              # Business logic layer
│   │   ├── userService.ts
│   │   ├── productService.ts
│   │   ├── orderService.ts
│   │   └── trackingService.ts
│   ├── routes/                # API route definitions
│   │   ├── userRoutes.ts
│   │   ├── productRoutes.ts
│   │   ├── orderRoutes.ts
│   │   └── trackingRoutes.ts
│   ├── middleware/            # Custom middleware
│   │   └── errorMiddleware.ts
│   └── utils/                 # Utility functions
│       ├── apiError.ts        # Custom error classes
│       ├── prismaError.ts     # Prisma error handler
│       ├── types.ts           # TypeScript types
│       └── validators.ts      # Zod validation schemas
├── tests/
│   ├── setup.ts               # Test setup
│   ├── prismaTestClient.ts    # Test Prisma client
│   ├── unit/                  # Unit tests
│   │   ├── userService.unit.test.ts
│   │   ├── productService.unit.test.ts
│   │   └── orderService.unit.test.ts
│   └── integration/           # Integration tests
│       ├── userRoutes.int.test.ts
│       ├── productRoutes.int.test.ts
│       └── orderRoutes.int.test.ts
├── logs/                      # Application logs
├── .env                       # Environment variables (not committed)
├── .env.example               # Environment variables template
├── .env.test                  # Test environment variables for test database (not commited )
├── docker-compose.test.yml    # Docker config for testing
├── package.json
└── tsconfig.json
```

## Database Schema

### Models

#### User

- Stores user information and credentials
- Roles: USER, ADMIN
- One-to-many relationship with Orders

#### Product

- Product catalog with pricing and inventory
- Belongs to a Category
- One-to-many relationship with OrderItems

#### Category

- Product categorization
- One-to-many relationship with Products

#### Order

- Customer orders with status tracking
- Status: PLACED, PACKED, SHIPPED, DELIVERED
- Belongs to User
- One-to-many relationship with OrderItems

#### OrderItem

- Individual items within an order
- Links Products to Orders
- Stores quantity and price at time of order

## Development

### Code Quality

Run linting:

```bash
npm run lint
npm run lint:fix
```

Format code:

```bash
npm run format
npm run format:check
```

### Database Management

View database in Prisma Studio:

```bash
npx prisma studio
```

Create a new migration:

```bash
npx prisma migrate dev --name <migration_name>
```

Reset database:

```bash
npx prisma migrate reset
```

### Logging

Application logs are stored in the `logs/` directory and output to console during development. Winston logger is configured in `src/logger.ts`.

### Key Learning Points

- **Centralized error handling**: Using `next(err)` for consistent error propagation
- **Structured logging**: Winston for professional logging across the application
- **Service layer pattern**: Clean separation of business logic from database queries
- **Type safety**: Full TypeScript implementation for better development experience
- **Test coverage**: Both unit and integration tests for reliability

---
