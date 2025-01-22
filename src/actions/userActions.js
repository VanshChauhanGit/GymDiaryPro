"use server";

import { connectDB } from "@/utils/connectDB";
import User from "@/models/User";

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
