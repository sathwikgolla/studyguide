# Auth Setup Guide

## Backend

1. Install dependencies:
   - `cd backend`
   - `npm install`
2. Create `.env` from `.env.example` and set:
   - `JWT_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `MONGODB_URI`
   - `FRONTEND_URL` (for reset link generation)
3. Start backend:
   - `npm run dev`

## Frontend

1. Create `.env` from `frontend/.env.example`.
2. Set:
   - `VITE_GOOGLE_CLIENT_ID` (same Google OAuth client ID)
   - `VITE_API_URL` (empty for Vite proxy, or full backend URL)
3. Start frontend:
   - `cd frontend`
   - `npm run dev`

## New Auth Endpoints

- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/google`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

## Google OAuth

- Create OAuth client in Google Cloud Console.
- Add authorized JavaScript origins:
  - `http://localhost:5173`
- Add authorized redirect URI if needed for your deployment flow.
- Use the same client ID in backend and frontend env files.

## Password Reset

- Request reset:
  - `POST /auth/forgot-password` with `{ "email": "user@example.com" }`
- Response includes `resetUrl` (for development/demo).
- Reset password:
  - `POST /auth/reset-password` with `{ "token": "...", "password": "NewPass#123" }`

