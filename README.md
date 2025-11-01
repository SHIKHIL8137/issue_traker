# Issue Tracker Application

A comprehensive issue tracking system built with the MERN stack (MongoDB, Express.js, React, Node.js) that allows teams to manage and resolve issues efficiently.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Database Seeding](#database-seeding)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Issues](#issues)
  - [Users](#users)
  - [Comments](#comments)
  - [Audit Logs](#audit-logs)
  - [Dashboard](#dashboard)
- [Design Decisions](#design-decisions)
  - [Authentication & Authorization](#authentication--authorization)
  - [Role-Based Access Control](#role-based-access-control)
  - [Issue Assignment Workflow](#issue-assignment-workflow)
  - [Status Flow Management](#status-flow-management)
  - [Comment Threading System](#comment-threading-system)
  - [Audit Trail](#audit-trail)
  - [UI/UX Design](#uiux-design)
- [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)

## Features

- **User Authentication**: Secure JWT-based authentication with role-based access control
- **Issue Management**: Create, read, update, and delete issues with status tracking
- **Role-Based Access**: Three distinct roles (Admin, Developer, User) with specific permissions
- **Issue Assignment**: Workflow for assigning issues to developers with acceptance/rejection
- **Comment System**: Threaded comments with role-based reply permissions
- **Audit Trail**: Comprehensive logging of all actions for transparency
- **Dashboard**: Role-specific dashboards with relevant statistics
- **Responsive UI**: Mobile-friendly interface with dark/light theme support
- **Form Validation**: Real-time validation with user-friendly error messages
- **SEO Optimization**: Proper metadata and favicon for better discoverability

## Tech Stack

### Backend
- **Node.js** with **Express.js** - Server-side framework
- **MongoDB** with **Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **Bcrypt.js** - Password hashing
- **Zod** - Validation schema
- **Helmet** - Security headers
- **Morgan** - HTTP request logging

### Frontend
- **React** with **Vite** - Frontend framework and build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animations
- **React Router** - Client-side routing
- **Lucide React** - Icons
- **Axios** - HTTP client
- **React Helmet Async** - SEO management

## Architecture

```
issue-tracker/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── validation/
│   │   ├── config/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── routes/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret
   PORT=5000
   NODE_ENV=development
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `env.example`:
   ```bash
   cp env.example .env
   ```

4. Update the `.env` file with your configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

## Database Seeding

To seed the database with sample data:

1. Ensure the backend server is not running
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Run the seed script:
   ```bash
   npm run seed
   ```

This will create:
- An admin user (admin@example.com / password)
- A developer user (dev@example.com / password)
- A regular user (user@example.com / password)
- Sample issues for testing

## Running the Application

### Development Mode

1. Start MongoDB (if not using Docker):
   ```bash
   mongod
   ```

2. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

3. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Production Mode

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

## API Endpoints

### Authentication

| Method | Endpoint         | Description          | Role Required |
|--------|------------------|----------------------|---------------|
| POST   | `/api/auth/register` | Register new user    | None          |
| POST   | `/api/auth/login`    | Login user           | None          |
| POST   | `/api/auth/logout`   | Logout user          | None          |
| GET    | `/api/auth/profile`  | Get user profile     | Authenticated |
| PATCH  | `/api/auth/role`     | Update user role     | Admin         |

### Issues

| Method | Endpoint               | Description              | Role Required     |
|--------|------------------------|--------------------------|-------------------|
| POST   | `/api/issue`           | Create new issue         | User, Developer, Admin |
| GET    | `/api/issue`           | Get all issues           | Authenticated     |
| GET    | `/api/issue/:id`       | Get specific issue       | Authenticated     |
| PATCH  | `/api/issue/:id`       | Update issue             | Issue Reporter, Developer, Admin |
| DELETE | `/api/issue/:id`       | Delete issue             | Admin             |
| PATCH  | `/api/issue/:id/accept`| Accept issue assignment  | Assigned Developer |
| PATCH  | `/api/issue/:id/reject`| Reject issue assignment  | Assigned Developer |

### Users

| Method | Endpoint           | Description          | Role Required |
|--------|--------------------|----------------------|---------------|
| GET    | `/api/users`       | Get all users        | Admin         |
| GET    | `/api/users/:id`   | Get specific user    | Admin         |
| PATCH  | `/api/users/:id/role` | Update user role  | Admin         |
| DELETE | `/api/users/:id`   | Delete user          | Admin         |
| GET    | `/api/users/developers` | Get all developers | Authenticated |

### Comments

| Method | Endpoint                  | Description         | Role Required |
|--------|---------------------------|---------------------|---------------|
| POST   | `/api/comment`            | Add comment         | Authenticated |
| GET    | `/api/comment/issue/:issueId` | Get issue comments | Authenticated |

### Audit Logs

| Method | Endpoint              | Description              | Role Required |
|--------|-----------------------|--------------------------|---------------|
| GET    | `/api/audit`          | Get all audit logs       | Admin         |
| GET    | `/api/audit/issue/:issueId` | Get issue audit logs | Authenticated |

### Dashboard

| Method | Endpoint              | Description              | Role Required |
|--------|-----------------------|--------------------------|---------------|
| GET    | `/api/dashboard/admin`    | Admin dashboard stats    | Admin         |
| GET    | `/api/dashboard/developer`| Developer dashboard stats| Developer     |
| GET    | `/api/dashboard/user`     | User dashboard stats     | User          |

## Design Decisions

### Authentication & Authorization

- JWT tokens are used for stateless authentication
- Tokens are stored in HTTP-only cookies for security
- Role-based access control implemented with middleware
- Passwords are hashed using bcrypt.js

### Role-Based Access Control

The application has three distinct roles with specific permissions:

1. **Admin**:
   - Can manage all issues
   - Can assign issues to developers
   - Can manage users and roles
   - Has access to all audit logs

2. **Developer**:
   - Can update issue status
   - Can accept/reject issue assignments
   - Can view assigned issues

3. **User**:
   - Can create issues
   - Can comment on their own issues
   - Can view their own issues

### Issue Assignment Workflow

- Only Admins can assign issues to developers
- Developers must accept or reject assignments
- Assignment status tracked (Pending, Accepted, Rejected)
- Rejected assignments can be reassigned

### Status Flow Management

Issues follow a strict status flow to ensure proper progression:
- Open → In-Progress → Resolved
- Developers cannot skip statuses
- Resolved issues can be moved back to In-Progress for corrections

### Comment Threading System

- Comments support threading for better conversation flow
- Role-based reply permissions:
  - Admins can reply to all comments
  - Developers can reply to all comments
  - Users can only reply to Admin comments

### Audit Trail

- All significant actions are logged
- Logs include timestamp, user, action, and changes
- Available for Admin review and user transparency

### UI/UX Design

- Responsive design for all device sizes
- Dark/light theme toggle with localStorage persistence
- Form validation with real-time feedback
- Loading states with custom animated loaders
- Smooth animations using Framer Motion
- Consistent design language across all pages

## Docker Deployment

The application uses Docker Compose for backend services only:

```bash
docker-compose up -d
```

This will start:
- MongoDB database
- Node.js backend API

The frontend should be served separately using a web server or development server.

## Environment Variables

### Backend (.env)

| Variable     | Description              | Example                          |
|--------------|--------------------------|----------------------------------|
| MONGO_URI    | MongoDB connection string| mongodb://localhost:27017/issue_tracker |
| JWT_SECRET   | Secret for JWT signing   | your_jwt_secret_here             |
| PORT         | Server port              | 5000                             |
| NODE_ENV     | Environment              | development                      |

### Frontend (.env)

| Variable          | Description              | Example                          |
|-------------------|--------------------------|----------------------------------|
| VITE_API_BASE_URL | Backend API base URL     | http://localhost:5000/api        |