# Docker Setup Instructions

This project includes Docker configuration for running the Issue Tracker application with MongoDB, backend, and frontend services.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Services Overview

1. **MongoDB**: Database service running on port 27017
2. **Backend**: Node.js Express API running on port 8000
3. **Frontend**: React application served via Nginx on port 80

## Running the Application

### 1. Build and Start All Services

```bash
docker-compose up --build
```

This command will:
- Build the backend and frontend Docker images
- Start MongoDB, backend, and frontend services
- Create a Docker network for inter-service communication

### 2. Run in Detached Mode

```bash
docker-compose up --build -d
```

This runs the services in the background.

### 3. View Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb
```

### 4. Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (including database data)
docker-compose down -v
```

## Accessing the Application

Once the services are running:

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **MongoDB**: mongodb://localhost:27017

## Environment Variables

The application uses the following environment variables (configured in docker-compose.yml):

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT token generation
- `PORT`: Backend server port (8000)
- `FRONTEND_URL`: Frontend application URL

## Development vs Production

The Docker setup is configured for production by default:
- Uses production dependencies only
- Optimized builds
- Secure configurations

For development, you can still run the services locally using npm scripts.