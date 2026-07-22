const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    exerciseName: {
      type: String,
      required: [true, "Exercise name is required"],
      trim: true,
    },
    muscleGroup: {
      type: String,
      required: [true, "Muscle group is required"],
      trim: true,
    },
    difficulty: {
      type: String,
      required: [true, "Difficulty is required"],
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    duration: {
      type: Number, // duration in minutes
      required: [true, "Duration is required"],
      min: 1,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

module.exports = mongoose.model("Exercise", exerciseSchema);
