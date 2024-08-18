# Monorepo for Backend (NestJS) and Frontend (Next.js)

This monorepo houses both the backend (NestJS) and frontend (Next.js) applications. Both applications are written in TypeScript for type safety and enhanced developer experience. The setup is designed with Docker to facilitate development, testing, and deployment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Environment Setup](#environment-setup)
4. [Running the Applications](#running-the-applications)
5. [Backend - NestJS](#backend---nestjs)
6. [Frontend - Next.js](#frontend---nextjs)
7. [Testing](#testing)

## Prerequisites

Before you start, ensure you have the following installed on your system:

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: Included with Docker Desktop
- **Node.js**: v20.x [Install Node.js](https://nodejs.org/en/download/)
- **MongoDB**: Ensure MongoDB is running locally or provide the connection URI in the `.env` file.

## Project Structure

```bash
/monorepo-root
│
├── /backend               # NestJS Backend
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .gitignore
│   ├── /src
│   ├── nest-cli.json
│   ├── tsconfig.json
│   ├── package.json
│   └── ...
│
├── /frontend              # Next.js Frontend
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .gitignore
│   ├── /public
│   ├── /src
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── package.json
│   └── ...
│
├── docker-compose.yml     # Docker Compose Configuration
├── README.md
└── .gitignore (root)
```

## Environment Setup

### Backend (NestJS)

Create a .env file in the /backend directory with the following variables:

```
# Example .env file for Backend
MONGO_URI=mongodb://localhost:27017/nest_next_auth
JWT_SECRET=6b4de239c9046b60111e003a88039a78ff88669ae2802ef0199474321b6985d3
JWT_EXPIRES_IN=60m
PORT=3001
NODE_ENV=development
```

### Frontend (Next.js)

Create a .env.local file in the /frontend directory with the following variables:

```
# Example .env.local file for Backend
NEXTAUTH_SECRET=meyJhbGciOiJIUzI1NiIsInR5cCI6Ikp
API_URL=http://127.0.0.1:3001/api
NEXTAUTH_URL=http://localhost:3000
```

## Running the Applications

To run both applications using Docker, navigate to the root of the monorepo and execute:

```
docker-compose up --build
```

This command will build and start both the backend and frontend services.

- The Backend will be accessible at http://localhost:3001/api
- The Frontend will be accessible at http://localhost:3000

## Backend - NestJS

The backend is built with NestJS and includes the following features:

- **Authentication**: Using Passport and JWT for secure authentication.
- **Authorization**: Role-based access control with Auth Guards.
- **Validation**: Using class-validator for validating request data.
- **Logging**: Integrated with Pino Logger for structured logging.
- **HTTP Request Logging**: All incoming HTTP requests are logged.
- **Global Exception Handling**: Custom global exception filter for consistent error responses.
- **CORS**: Cross-Origin Resource Sharing enabled for secure cross-domain communication.
- **Unit Testing**: Comprehensive unit tests covering service layer.

### Technologies & Packages

- **Passport**: For handling authentication strategies.
- **JWT**: JSON Web Token for stateless authentication.
- **Class-validator**: Decorators for validating request payloads.
- **Pino Logger**: Fast and low-overhead logging.
- **CORS**: Cross-origin resource sharing.
- **Mongoose**: ORM for database interactions.
- **Jest**: For writing unit tests.

## Frontend - Next.js

The frontend is built with Next.js and includes the following features:

- **Authentication**: Using NextAuth.js for user authentication.
- **Styling**: Integrated with Tailwind CSS for utility-first styling.
- **API Integration**: Seamless integration with the NestJS backend.

### Technologies & Packages

- **NextAuth.js**: Authentication for Next.js applications.
- **Tailwind CSS**: Utility-first CSS framework.

### Testing

## Backend

To run unit tests for the backend, navigate to the /backend directory and run:

```
npm run test
```

### License

This project is licensed under the MIT License - see the LICENSE file for details.

### Key Points:

- **Prerequisites**: Clearly lists the necessary software and services.
- **Environment Setup**: Includes `.env` configuration examples.
- **Running the Applications**: Simple Docker commands for running both apps.
- **Backend and Frontend Details**: Provides insights into the technologies and features used.
- **Testing**: Instructions for running tests.
- **Contributing** and **License**: Encourages contributions and states the license.

This `README.md` is both comprehensive and concise, providing all necessary details for developers and contributors to understand, set up, and work on the project.
