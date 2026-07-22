import api from "./axios";

// ---- Auth ----
export const registerUser = (payload) => api.post("/auth/register", payload);
export const loginUser = (payload) => api.post("/auth/login", payload);
export const getProfile = () => api.get("/auth/profile");

// ---- Exercises ----
export const listExercises = () => api.get("/exercises");
export const getExercise = (id) => api.get(`/exercises/${id}`);
export const createExercise = (payload) => api.post("/exercises", payload);
export const updateExercise = (id, payload) => api.put(`/exercises/${id}`, payload);
export const deleteExercise = (id) => api.delete(`/exercises/${id}`);

// ---- Workouts ----
export const listWorkouts = () => api.get("/workouts");
export const getWorkout = (id) => api.get(`/workouts/${id}`);
export const createWorkout = (payload) => api.post("/workouts", payload);
export const updateWorkout = (id, payload) => api.put(`/workouts/${id}`, payload);
export const deleteWorkout = (id) => api.delete(`/workouts/${id}`);
export const getDashboardStats = () => api.get("/workouts/stats/summary");
