const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    workoutDate: {
      type: Date,
      required: [true, "Workout date is required"],
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

module.exports = mongoose.model("Workout", workoutSchema);
