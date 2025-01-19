import mongoose, { Schema, model } from "mongoose";

const exerciseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  targetedMuscle: {
    type: String,
    required: true,
  },
  sets: {
    type: Number,
    required: true,
    min: 1,
    max: 8,
  },
  repsRange: {
    type: String,
    required: true,
  },
  rest: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
});

const muscleGroupSchema = new Schema({
  muscle: {
    type: String,
    required: true,
  },
  exercises: [exerciseSchema],
});

const daySchema = new Schema({
  day: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    required: true,
  },
  targetedMuscles: [muscleGroupSchema],
});

const weeklyWorkoutPlanSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  workout: [daySchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.WeeklyWorkoutPlan ||
  model("WeeklyWorkoutPlan", weeklyWorkoutPlanSchema);
