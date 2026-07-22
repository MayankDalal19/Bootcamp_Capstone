# Ledger — Fitness Management Frontend

A React (Vite) frontend for the Fitness Management API. Built in three phases:

1. **Auth + layout shell** — login/register screens, JWT storage, protected
   routes, sidebar navigation.
2. **Exercises + Workouts CRUD** — full create/read/update/delete for both
   resources, wired to the real API.
3. **Dashboard + polish** — live stats summary, completion rate, recent
   workouts, and visual polish across the app.

## Tech Stack

- React 19 + Vite
- React Router
- Axios (with a request interceptor that attaches the JWT, and a response
  interceptor that logs the user out on a 401)
- Plain CSS (no framework) — a "training ledger" design system defined in
  `src/index.css`

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Point the app at your backend**

   Copy `.env.example` to `.env` and set the URL your backend runs on:

   ```bash
   cp .env.example .env
   ```

   ```
   VITE_API_URL=http://localhost:5000/api
   ```

   This must match wherever your Express server is listening (default is
   `http://localhost:5000`). Also make sure the backend's `CLIENT_URL` env
   var matches wherever this frontend runs (default Vite dev port is
   `5173`) so CORS allows the requests through.

3. **Run the backend** (from the `server` folder)

   ```bash
   npm install
   npm run dev
   ```

4. **Run the frontend**

   ```bash
   npm run dev
   ```

   Visit `http://localhost:5173`.

## How it connects to the backend

- `src/api/axios.js` creates a single Axios instance pointed at
  `VITE_API_URL`. Every request automatically attaches
  `Authorization: Bearer <token>` from `localStorage` if present.
- `src/api/requests.js` has one function per backend endpoint
  (`/auth/*`, `/exercises/*`, `/workouts/*`).
- `src/context/AuthContext.jsx` handles login/register/logout, persists the
  JWT + user object in `localStorage`, and exposes `isAuthenticated` for
  route protection.
- A 401 response from any request (expired/invalid token) automatically
  clears local storage and redirects to `/login`.

## Folder structure

```
src/
  api/            axios instance + request functions
  context/        AuthContext (login/register/logout state)
  components/     Layout, ProtectedRoute, Modal, forms, StatCard
  pages/          Login, Register, Dashboard, Exercises, Workouts
```

## Notes

- Workout entries reference an exercise by ID and can't change which
  exercise they point to after creation (matches the backend, which
  doesn't accept `exerciseId` on update) — delete and re-log instead.
- The dashboard's "Exercise library" count reflects **all** exercises in
  the system (matches the backend's `getDashboardStats`, which counts all
  `Exercise` documents, not just ones created by the current user).
