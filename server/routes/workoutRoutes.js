const express = require("express");
const router = express.Router();
const {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  getDashboardStats,
} = require("../controllers/workoutController");
const { protect } = require("../middleware/authMiddleware");

// All workout routes require a logged-in member
router.use(protect);

// NOTE: this specific route must be declared before "/:id" to avoid being
// treated as an id param
router.get("/stats/summary", getDashboardStats);

router.route("/").post(createWorkout).get(getWorkouts);

router.route("/:id").get(getWorkoutById).put(updateWorkout).delete(deleteWorkout);

module.exports = router;
