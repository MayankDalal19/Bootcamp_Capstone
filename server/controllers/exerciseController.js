const Exercise = require("../models/Exercise");

// @desc    Create a new exercise
// @route   POST /api/exercises
// @access  Private
const createExercise = async (req, res, next) => {
  try {
    const { exerciseName, muscleGroup, difficulty, description, duration } = req.body;

    if (!exerciseName || !muscleGroup || !difficulty || !description || !duration) {
      return res.status(400).json({ success: false, message: "All exercise fields are required" });
    }

    const exercise = await Exercise.create({
      exerciseName,
      muscleGroup,
      difficulty,
      description,
      duration,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, message: "Exercise created", data: exercise });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all exercises
// @route   GET /api/exercises
// @access  Private
const getExercises = async (req, res, next) => {
  try {
    const exercises = await Exercise.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: exercises.length, data: exercises });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single exercise by id
// @route   GET /api/exercises/:id
// @access  Private
const getExerciseById = async (req, res, next) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({ success: false, message: "Exercise not found" });
    }

    res.status(200).json({ success: true, data: exercise });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an exercise
// @route   PUT /api/exercises/:id
// @access  Private
const updateExercise = async (req, res, next) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({ success: false, message: "Exercise not found" });
    }

    const { exerciseName, muscleGroup, difficulty, description, duration } = req.body;

    exercise.exerciseName = exerciseName ?? exercise.exerciseName;
    exercise.muscleGroup = muscleGroup ?? exercise.muscleGroup;
    exercise.difficulty = difficulty ?? exercise.difficulty;
    exercise.description = description ?? exercise.description;
    exercise.duration = duration ?? exercise.duration;

    const updatedExercise = await exercise.save();

    res.status(200).json({ success: true, message: "Exercise updated", data: updatedExercise });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an exercise
// @route   DELETE /api/exercises/:id
// @access  Private
const deleteExercise = async (req, res, next) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({ success: false, message: "Exercise not found" });
    }

    await exercise.deleteOne();

    res.status(200).json({ success: true, message: "Exercise deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExercise,
  getExercises,
  getExerciseById,
  updateExercise,
  deleteExercise,
};
