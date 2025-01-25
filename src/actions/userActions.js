"use server";

import { connectDB } from "@/utils/connectDB";
import User from "@/models/User";
import WeeklyWorkoutPlan from "@/models/WeeklyWorkoutPlan";

export const fetchUser = async (email) => {
  await connectDB();
  let u = await User.findOne({ email });
  let user = u.toObject({ flattenObjectIds: true });
  return user;
};

export const updateProfile = async (email, data) => {
  await connectDB();

  const existingUserWithUsername = await User.findOne({
    username: data.username,
  }).lean();

  if (existingUserWithUsername) {
    return {
      error: "User already exists with the same email or username",
      status: 400,
    };
  }

  const user = await User.updateOne({ email }, data).lean();

  return {
    message: "Profile updated successfully",
    user: user,
    status: 200,
  };
};

export const fetchWorkoutPlan = async (email) => {
  try {
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return {
        error: "User not found",
        status: 404,
      };
    }

    const data = await WeeklyWorkoutPlan.findOne({ user: user._id });
    if (!data) {
      return {
        error: "Workout plan not found",
        status: 404,
      };
    }

    return {
      message: "Workout plan fetched successfully",
      data: data.toObject({ flattenObjectIds: true }),
      status: 200,
    };
  } catch (error) {
    console.error("Error fetching workout plan:", error.message);
    return {
      error: "An error occurred. Please try again.",
      status: 500,
    };
  }
};

export const createWorkoutPlan = async (email, data) => {
  try {
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return {
        error: "User not found",
        status: 404,
      };
    }

    const existingWorkoutPlan = await WeeklyWorkoutPlan.findOne({
      user: user._id,
    });

    if (existingWorkoutPlan) {
      return {
        error: "Workout plan already exists",
        status: 400,
      };
    }

    const newWorkoutPlan = new WeeklyWorkoutPlan({
      user: user._id,
      workoutPlan: data,
    });

    const savedWorkoutPlan = await newWorkoutPlan.save();

    return {
      message: "Workout plan created successfully",
      workoutPlan: savedWorkoutPlan.toObject({ flattenObjectIds: true }),
      status: 200,
    };
  } catch (error) {
    console.error("Error creating workout plan:", error.message);
    return {
      error: "An error occurred. Please try again.",
      status: 500,
    };
  }
};

export const updateWorkoutPlan = async (email, data) => {
  try {
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return {
        error: "User not found",
        status: 404,
      };
    }

    const existingWorkoutPlan = await WeeklyWorkoutPlan.findOne({
      user: user._id,
    });
    if (!existingWorkoutPlan) {
      return {
        error: "Workout plan not found",
        status: 404,
      };
    }

    const updatedWorkoutPlan = await WeeklyWorkoutPlan.updateOne(
      { user: user._id },
      { workoutPlan: data }
    );

    return {
      message: "Workout plan updated successfully",
      status: 200,
    };
  } catch (error) {
    console.error("Error updating workout plan:", error.message);
    return {
      error: "An error occurred. Please try again.",
      status: 500,
    };
  }
};
