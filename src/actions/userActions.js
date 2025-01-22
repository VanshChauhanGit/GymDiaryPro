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
  const ndata = Object.fromEntries(data);
  await User.updateOne({ email }, ndata);
};
