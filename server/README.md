# Fitness Management App — Backend

A complete Node.js / Express / MongoDB backend for a members-only Fitness
Management application. Provides JWT authentication and full CRUD APIs for
Exercises and Workouts. Built with a clean MVC folder structure so it's easy
to plug a React frontend into later.

## Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken) for authentication
- bcryptjs for password hashing
- dotenv, cors

## Folder Structure

```
server/
  config/
    db.js                 # MongoDB connection
  controllers/
    authController.js     # register / login / profile
    exerciseController.js # exercise CRUD
    workoutController.js  # workout CRUD + dashboard stats
  middleware/
    authMiddleware.js      # JWT verification (protect)
    errorMiddleware.js     # 404 + centralized error handler
  models/
    User.js
    Exercise.js
    Workout.js
  routes/
    authRoutes.js
    exerciseRoutes.js
    workoutRoutes.js
  utils/
    generateToken.js
  server.js
  .env.example
  package.json
```

## Setup Instructions

1. **Install dependencies**

   ```bash
   cd server
   npm install
   ```

2. **Configure environment variables**

   Copy `.env.example` to `.env` and fill in your own values:

   ```bash
   cp .env.example .env
   ```

   ```
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/fitness_management
   JWT_SECRET=replace_this_with_a_long_random_secret_string
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   ```

   - If you're using MongoDB Atlas, replace `MONGO_URI` with your Atlas
     connection string.
   - `CLIENT_URL` should match wherever your React frontend runs (used for
     CORS) — the default Vite port is `5173`.

3. **Make sure MongoDB is running**

   Locally: `mongod` (if using local MongoDB), or just use an Atlas URI —
   no local install needed in that case.

4. **Run the server**

   ```bash
   npm run dev     # with nodemon (auto-restarts on changes)
   # or
   npm start       # plain node
   ```

   You should see:

   ```
   MongoDB Connected: <host>
   Server running in development mode on port 5000
   ```

5. **Verify it's alive**

   Visit `http://localhost:5000/` — you should get:

   ```json
   { "success": true, "message": "Fitness Management API is running" }
   ```

## API Reference

All responses follow the shape `{ success, message?, data?, count? }`.

### Auth — `/api/auth`

| Method | Endpoint         | Access  | Description                     |
|--------|------------------|---------|----------------------------------|
| POST   | `/register`      | Public  | Register a new member            |
| POST   | `/login`         | Public  | Login, returns JWT                |
| GET    | `/profile`       | Private | Get logged-in member's profile   |

**Register body**
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "secret123" }
```

**Login body**
```json
{ "email": "jane@example.com", "password": "secret123" }
```

Both return:
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "name": "...", "email": "...", "createdAt": "..." },
    "token": "<jwt>"
  }
}
```

For every private route below, send the token as:
```
Authorization: Bearer <jwt>
```

### Exercises — `/api/exercises` (all private)

| Method | Endpoint | Description        |
|--------|----------|---------------------|
| POST   | `/`      | Create an exercise   |
| GET    | `/`      | List all exercises   |
| GET    | `/:id`   | Get one exercise     |
| PUT    | `/:id`   | Update an exercise   |
| DELETE | `/:id`   | Delete an exercise   |

**Create/Update body**
```json
{
  "exerciseName": "Push Ups",
  "muscleGroup": "Chest",
  "difficulty": "Beginner",
  "description": "Standard push ups",
  "duration": 10
}
```
`difficulty` must be one of: `Beginner`, `Intermediate`, `Advanced`.

### Workouts — `/api/workouts` (all private, scoped to the logged-in member)

| Method | Endpoint          | Description                              |
|--------|-------------------|--------------------------------------------|
| POST   | `/`               | Create a workout entry                     |
| GET    | `/`               | List the current member's workouts         |
| GET    | `/stats/summary`  | Dashboard stats (counts + recent workouts) |
| GET    | `/:id`            | Get one workout (must belong to you)       |
| PUT    | `/:id`            | Update notes / date / completed status     |
| DELETE | `/:id`            | Delete a workout                           |

**Create body**
```json
{
  "exerciseId": "<exercise ObjectId>",
  "workoutDate": "2026-07-21",
  "notes": "Felt strong today",
  "completed": false
}
```

**Update body** (any subset)
```json
{ "notes": "Updated notes", "completed": true }
```

**`/stats/summary` response**
```json
{
  "success": true,
  "data": {
    "totalExercises": 12,
    "totalWorkouts": 8,
    "completedWorkouts": 5,
    "pendingWorkouts": 3,
    "recentWorkouts": [ /* last 5 workouts, populated with exercise info */ ]
  }
}
```

## Security Notes

- Passwords are hashed with bcrypt before being stored; the raw password is
  never saved and the hash is excluded from query results by default
  (`select: false` on the schema).
- All exercise and workout routes are protected by JWT middleware
  (`Authorization: Bearer <token>`).
- Workout routes additionally enforce ownership — a member can only read,
  update, or delete their **own** workout records (checked against
  `workout.userId` in the controller), even if they guess another
  workout's ID.
- Centralized error handling normalizes Mongoose errors (bad ObjectId,
  duplicate email, validation errors) into clean JSON responses with
  proper HTTP status codes.

## Next Steps (Frontend)

This backend is ready to be consumed by a React (Vite) frontend using
Axios. Point your Axios base URL at `http://localhost:5000/api` and store
the JWT from login/register in `localStorage`, attaching it as a Bearer
token on every subsequent request.
