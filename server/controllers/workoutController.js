const Workout = require("../models/Workout");
const Exercise = require("../models/Exercise");

// @desc    Create a new workout entry
// @route   POST /api/workouts
// @access  Private
const createWorkout = async (req, res, next) => {
  try {
    const { exerciseId, workoutDate, notes, completed } = req.body;

    if (!exerciseId || !workoutDate) {
      return res.status(400).json({ success: false, message: "Exercise and workout date are required" });
    }

    // Make sure the referenced exercise actually exists
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
      return res.status(404).json({ success: false, message: "Exercise not found" });
    }

    const workout = await Workout.create({
      userId: req.user._id,
      exerciseId,
      workoutDate,
      notes: notes || "",
      completed: completed || false,
    });

    const populatedWorkout = await workout.populate("exerciseId", "exerciseName muscleGroup difficulty duration");

    res.status(201).json({ success: true, message: "Workout created", data: populatedWorkout });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all workouts belonging to the logged in member
// @route   GET /api/workouts
// @access  Private
const getWorkouts = async (req, res, next) => {
  try {
    const workouts = await Workout.find({ userId: req.user._id })
      .populate("exerciseId", "exerciseName muscleGroup difficulty duration")
      .sort({ workoutDate: -1 });

    res.status(200).json({ success: true, count: workouts.length, data: workouts });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single workout by id (must belong to the logged in member)
// @route   GET /api/workouts/:id
// @access  Private
const getWorkoutById = async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id).populate(
      "exerciseId",
      "exerciseName muscleGroup difficulty duration"
    );

    if (!workout) {
      return res.status(404).json({ success: false, message: "Workout not found" });
    }

    // Ensure members can only access their own workout records
    if (workout.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to access this workout" });
    }

    res.status(200).json({ success: true, data: workout });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a workout (notes, date, completed status)
// @route   PUT /api/workouts/:id
// @access  Private
const updateWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ success: false, message: "Workout not found" });
    }

    if (workout.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to update this workout" });
    }

    const { notes, workoutDate, completed } = req.body;

    workout.notes = notes ?? workout.notes;
    workout.workoutDate = workoutDate ?? workout.workoutDate;
    workout.completed = completed ?? workout.completed;

    const updatedWorkout = await workout.save();
    const populatedWorkout = await updatedWorkout.populate(
      "exerciseId",
      "exerciseName muscleGroup difficulty duration"
    );

    res.status(200).json({ success: true, message: "Workout updated", data: populatedWorkout });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a workout
// @route   DELETE /api/workouts/:id
// @access  Private
const deleteWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ success: false, message: "Workout not found" });
    }

    if (workout.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this workout" });
    }

    await workout.deleteOne();

    res.status(200).json({ success: true, message: "Workout deleted" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics for the logged in member
// @route   GET /api/workouts/stats/summary
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const totalExercises = await Exercise.countDocuments();
    const totalWorkouts = await Workout.countDocuments({ userId: req.user._id });
    const completedWorkouts = await Workout.countDocuments({ userId: req.user._id, completed: true });
    const pendingWorkouts = totalWorkouts - completedWorkouts;

    const recentWorkouts = await Workout.find({ userId: req.user._id })
      .populate("exerciseId", "exerciseName muscleGroup")
      .sort({ workoutDate: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalExercises,
        totalWorkouts,
        completedWorkouts,
        pendingWorkouts,
        recentWorkouts,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  getDashboardStats,
};
