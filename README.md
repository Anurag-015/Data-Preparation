# Typing Fatigue Form

- Frontend: React + TailwindCSS + Framer Motion
- Backend: Node.js (Express)
- Database: MongoDB (`typing_fatigue`)

## Prerequisites

- Node.js 18+
- MongoDB Atlas account and cluster

## Environment

- Root `.env`:
  - `MONGO_URI=mongodb+srv://<cluster-url>/?retryWrites=true&w=majority&appName=Cluster0`
  - `MONGO_USER=<atlas-username>`
  - `MONGO_PASS=<atlas-password>`
  - `MONGO_DB=typing_fatigue`
  - `CORS_ORIGINS=http://localhost:5173`
- Frontend `.env`:
  - `VITE_API_BASE_URL=http://localhost:5000`

## Start Order

- Start the backend first, then start the frontend.

## MongoDB Driver

- Driver: Node.js
- Install: `npm install mongodb`
- Connection:
  - Use the variables above; credentials are provided via `MONGO_USER`/`MONGO_PASS` rather than embedded in `MONGO_URI`.
  - Ensure password is URL-encoded only if you embed it in the URI (not required when using separate auth).
- Ensure your IP is allowed in Atlas Network Access

## Quick Start

1. Backend

- `cd backend`
- `npm install`
- `npm run dev`
- Server runs at `http://127.0.0.1:5000`

1. Frontend

- `cd frontend`
- `npm install`
- `npm run dev`
- App runs at `http://localhost:5173`

## Endpoints

 - `POST /api/get_next_session` body `{ "email": "..." }` returns `{ user_id, session_number }`
- `POST /api/submit` body `{ email, hold_mean, flight_mean, typing_speed, error_rate, pause_count, drift_over_time, rhythm_entropy, fatigue_level }`

## Workflow

- Enter Gmail to get next session number.
- Accept consent.
- Complete typing test.
- Select fatigue level (0–2: Low, Medium, High).
- Submit and see success animation.

## Notes

- Single collection: `records` with unique index on `(email, session_number)`.
- Session numbers increment per `email`.
- Keystroke metrics use `performance.now()` timestamps captured in the typing test.