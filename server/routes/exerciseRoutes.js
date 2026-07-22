const express = require("express");
const router = express.Router();
const {
  createExercise,
  getExercises,
  getExerciseById,
  updateExercise,
  deleteExercise,
} = require("../controllers/exerciseController");
const { protect } = require("../middleware/authMiddleware");

// All exercise routes require a logged-in member
router.use(protect);

router.route("/").post(createExercise).get(getExercises);

router.route("/:id").get(getExerciseById).put(updateExercise).delete(deleteExercise);

module.exports = router;
