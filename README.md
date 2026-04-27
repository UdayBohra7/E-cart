# E-cart Backend

Production-ready e-commerce backend built with Node.js, Express, TypeScript, Prisma, and MySQL.

## Prerequisites

- Node.js (v16 or higher)
- MySQL Server

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Configure environment variables**:
    Update the `.env` file with your MySQL database credentials.

3.  **Database Setup**:
    Generate the Prisma client and run migrations:
    ```bash
    npx prisma generate
    ```

4.  **Run in development mode**:
    ```bash
    npm run dev
    ```

## Project Structure

- `src/config`: Environment configurations and Passport strategies.
- `src/controllers`: Request handlers.
- `src/middlewares`: Custom middleware (auth, error handled, validation).
- `src/routes`: API route definitions.
- `src/services`: Business logic layer.
- `src/utils`: Utility classes and functions.
- `prisma/schema.prisma`: Database schema definition.

## Security Features

- **JWT Authentication**: Secure stateless authentication using Passport.js.
- **Role-based Access Control (RBAC)**: Admin and User roles with granular permissions.
- **Helmet**: Security-related HTTP headers.
- **CORS**: Configurable cross-side resource sharing.
- **Rate Limiting**: Protection against brute-force attacks.
- **Environment Validation**: Joi-based validation for all environment variables.
