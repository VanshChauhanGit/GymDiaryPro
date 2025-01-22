"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useToast } from "@/components/Toast";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLoader } from "@/utils/useLoader";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const showToast = useToast();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear errors as the user types
  };

  const validateForm = () => {
    let valid = true;
    let tempErrors = {};

    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
      valid = false;
    } else if (!validateEmail(formData.email)) {
      tempErrors.email = "Invalid email format";
      valid = false;
    }

    if (!formData.password.trim()) {
      tempErrors.password = "Password is required";
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  const handleGoogleSignIn = async () => {
    showLoader();
    await signIn("google");
    router.push("/");
    hideLoader();
    // showToast("success", "Login successfull");
  };

  const handleSubmit = async (e) => {
    if (validateForm()) {
      showLoader();
      e.preventDefault();
      try {
        const res = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (res?.ok) {
          hideLoader();
          showToast("success", "Login successfull!");
          router.push("/dashboard");
        } else if (res?.status === 401) {
          hideLoader();
          showToast("error", "Incorrect email or password.");
        } else {
          hideLoader();
          showToast("error", "An error occurred. Please try again.");
        }
      } catch (error) {
        hideLoader();
        console.error("Error logging in:", error.message);
      }
    }
    hideLoader();
  };

  useEffect(() => {
    showLoader();
    if (session) {
      hideLoader();
      router.push("/");
    }
    hideLoader();
  }, [session, router, handleGoogleSignIn, handleSubmit]);

  return (
    <section className="bg-background w-full flex box-border pt-2 justify-center items-center">
      <div className="bg-gray-100 rounded-2xl flex max-w-3xl p-5 items-center">
        <div className="md:w-2/3 px-8">
          <h2 className="font-bold text-3xl text-black">Login</h2>
          <p className="text-sm mt-4 text-black">
            If you already have an account, easily log in now.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <input
                className="p-2 mt-8 rounded-xl border border-gray-400 w-full"
                type="text"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email}</p>
              )}
            </div>
            <div className="relative">
              <input
                className="p-2 rounded-xl border border-gray-400 w-full"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <div
                className="absolute right-2 top-3 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <IoEyeOff className="text-black size-5" />
                ) : (
                  <IoEye className="text-black size-5" />
                )}
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="relative border-2 border-black text-black px-6 py-2 rounded-lg overflow-hidden group"
            >
              <span className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition duration-300"></span>
              <span className="relative z-10 group-hover:text-white">
                Login
              </span>
            </button>
          </form>

          <div className="mt-6 items-center text-gray-800">
            <hr className="border-gray-400" />
            <p className="text-center text-sm text-black">OR</p>
            <hr className="border-gray-400" />
          </div>
          <button
            onClick={handleGoogleSignIn}
            className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm duration-300 hover:bg-gray-200 font-semibold"
          >
            <FcGoogle className="size-6 mr-2" />
            Login with Google
          </button>

          <div className="mt-4 text-sm flex justify-between items-center">
            <p className="mr-3 md:mr-0 text-black">
              If you don't have an account..
            </p>
            <Link href="/signup">
              <button className="text-white bg-black rounded-xl py-2 px-5 hover:bg-gray-800 font-semibold duration-300">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
        <div className="md:block hidden w-1/2">
          <img
            className="rounded-2xl max-h-[1600px]"
            src="/img1.jpg"
            alt="login form image"
          />
        </div>
      </div>
    </section>
  );
}

export default Login;
