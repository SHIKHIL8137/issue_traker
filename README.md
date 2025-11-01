# Issue Tracker (MERN)

Frontend: React + Vite + Tailwind CSS (`/frontend`)
Backend: Express + MongoDB + JWT (`/backend`)

## Roles
- Admin: assign issues, change roles
- Developer: update issue status
- User: create issues, comment on their issues

## Features
- JWT auth
- Issues CRUD with status, priority, assignee
- Threaded comments
- Audit trail (backend)
- Dashboard, list, detail, create/edit
- Role-based UI and routes
- Search/filter
- Light/Dark theme toggle

## Setup
### Backend
```
cd backend
npm install
```
Create an env file from `ENV.EXAMPLE` with:
```
MONGO_URI=mongodb://localhost:27017/issue_tracker
JWT_SECRET=your_jwt_secret
PORT=4000
```
Seed sample data (optional):
```
node src/utils/seed.js
```
Start backend:
```
npm start
```

### Frontend
```
cd frontend
npm install
```
Create `.env` from `env.example`:
```
cp env.example .env
```
Run dev server:
```
npm run dev
```
Default: `http://localhost:3000`

## API Overview
- Auth: POST `/api/auth/register`, POST `/api/auth/login`
- Issues: GET/POST `/api/issues`, GET/PUT/DELETE `/api/issues/:id`
- Actions: PATCH `/api/issues/:id/assign`, PATCH `/api/issues/:id/status`
- Comments: GET/POST `/api/comments/:issueId`
- Users: GET `/api/users`, PATCH `/api/users/:id/role`

## Notes
- Only Admin assigns issues/changes roles
- Developers update statuses
- Users create and comment on their issues
