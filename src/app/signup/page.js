"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { data: session } = useSession();
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    let valid = true;
    let tempErrors = {};

    if (!formData.name.trim()) {
      tempErrors.name = "Name is required";
      valid = false;
    }

    if (!formData.username.trim()) {
      tempErrors.username = "Username is required";
      valid = false;
    }

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
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters long";
      valid = false;
    }

    if (!formData.confirmPassword.trim()) {
      tempErrors.confirmPassword = "Confirm Password is required";
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error on input change
  };

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/" });
    showToast("success", "You are logged in successfullY!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Submitted:", formData);
      // Perform API call or other actions here
      alert("Account successfully created!");
    }
  };

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router, handleGoogleSignIn, handleSubmit]);

  return (
    <section className="bg-background w-full flex box-border pt-2 justify-center items-center">
      <div className="bg-gray-100 rounded-2xl flex max-w-3xl p-5 items-center">
        <div className="md:w-2/3 px-8">
          <h2 className="font-bold text-3xl text-black">Sign Up</h2>
          <p className="text-sm mt-4 text-black">
            Create your account to get started.
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <input
                className="p-2 mt-8 rounded-xl border border-gray-400 w-full"
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
              />
              {errors.name && (
                <p className="text-red-600 text-sm">{errors.name}</p>
              )}
            </div>
            <div>
              <input
                className="p-2 rounded-xl border border-gray-400 w-full"
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
              />
              {errors.username && (
                <p className="text-red-600 text-sm">{errors.username}</p>
              )}
            </div>
            <div>
              <input
                className="p-2 rounded-xl border border-gray-400 w-full"
                type="email"
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
            <div className="relative">
              <input
                className="p-2 rounded-xl border border-gray-400 w-full"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              <div
                className="absolute right-2 top-3 cursor-pointer"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <IoEyeOff className="text-black size-5" />
                ) : (
                  <IoEye className="text-black size-5" />
                )}
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm">{errors.confirmPassword}</p>
              )}
            </div>
            <button
              type="submit"
              className="relative border-2 border-black text-black px-6 py-2 rounded-lg overflow-hidden group"
            >
              <span className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition duration-300"></span>
              <span className="relative z-10 group-hover:text-white">Sign Up</span>
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
            Sign Up with Google
          </button>

          <div className="mt-4 text-sm flex justify-between items-center">
            <p className="mr-3 md:mr-0 text-black">Already have an account?</p>
            <Link href="/login">
              <button className="text-white bg-black rounded-xl py-2 px-5 hover:bg-gray-800 font-semibold duration-300">
                Login
              </button>
            </Link>
          </div>
        </div>
        <div className="md:block hidden w-1/2">
          <img
            className="rounded-2xl max-h-[1600px]"
            src="/signup-img.jpg"
            alt="signup form image"
          />
        </div>
      </div>
    </section>
  );
}

export default SignUp;
