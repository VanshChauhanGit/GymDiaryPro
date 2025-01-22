import User from "@/models/User";
import { connectDB } from "@/utils/connectDB";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password, username, name } = await req.json();

    // Check if the user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return new Response(
        JSON.stringify({
          error: "User already exists with the same email or username",
        }),
        {
          status: 400,
        }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      username,
    });

    return new Response(
      JSON.stringify({ message: "User created successfully", user: newUser }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
