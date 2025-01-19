import mongoose, { Schema, model } from "mongoose";

const ExerciseSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [2, "Name must be at least 2 characters long"],
  },
  description: {
    type: String,
    minlength: [5, "Description must be at least 5 characters long"],
  },
  sets: {
    type: Number,
    required: [true, "Sets is required"],
  },
  repsRange: {
    type: String,
    required: [true, "Reps range is required"],
  },
  rest: {
    type: Number,
    required: [true, "Rest is required"],
  },
});

export default mongoose.models.Exercise || model("Exercise", ExerciseSchema);
