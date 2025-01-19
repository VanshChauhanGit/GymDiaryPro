import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/utils/connectDB";

function generateUsername(length = 8) {
  const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const characters = letters + numbers;

  let username = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    username += characters[randomIndex];
  }

  return username;
}

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          await connectDB();
          const user = await User.findOne({ email: credentials?.email });

          if (!user) {
            throw new Error("User not found, sign up first!");
          }

          const isValidPassword = await bcrypt.compare(
            credentials?.password ?? "",
            user.password
          );

          if (!isValidPassword) {
            throw new Error("Password is incorrect");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username,
          };
        } catch (error) {
          console.error("Authorize error:", error.message);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        try {
          await connectDB();
          const existingUser = await User.findOne({ email: profile?.email });
          if (!existingUser) {
            const newUser = await User.create({
              name: profile?.name || account?.name,
              email: profile?.email || account?.email,
              username: generateUsername(8),
              image: profile?.picture, // Save the Google profile picture
              isOAuthUser: true,
            });
            return true;
          }
          return true;
        } catch (error) {
          console.error("Error during sign-in callback:", error.message);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.username = user.username;
        token.image = user.image; // Add user image to the token
      } else if (token.email) {
        // Fetch additional user details for OAuth users
        await connectDB();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.username = dbUser.username;
          token.name = dbUser.name;
          token.image = dbUser.image; // Fetch the image from the database
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
          username: token.username,
          image: token.image, // Add the user image to the session
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
