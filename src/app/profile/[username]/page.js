"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchUser, updateProfile } from "@/actions/userActions";
import { useLoader } from "@/utils/useLoader";

function Profile() {
  const [form, setForm] = useState({});

  const { data: session, status } = useSession();
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    if (!session) {
      router.push("/login");
    } else {
      getData();
    }
  }, [session, router]);

  const getData = async () => {
    showLoader();
    let u = await fetchUser(session.user.email);
    setForm(u);
    hideLoader();
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center my-2">Profile Page</h1>
      <form className="max-w-2xl mx-auto border rounded-lg p-4">
        <div className="my-2">
          <label
            htmlFor="email"
            className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
          >
            Email *
          </label>
          <input
            type="text"
            name="email"
            id="email"
            value={form.email ? form.email : ""}
            onChange={handleChange}
            disabled
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="my-2">
          <label
            htmlFor="username"
            className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
          >
            Username *
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={form.username ? form.username : ""}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="my-2">
          <label
            htmlFor="name"
            className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={form.name ? form.name : ""}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="my-2">
          <label
            htmlFor="image"
            className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
          >
            Profile Picture
          </label>
          <input
            type="text"
            name="image"
            id="image"
            value={form.image ? form.image : ""}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        <button className="bg-black hover:bg-opacity-80 text-white w-full text-lg font-semibold rounded-lg py-2 mt-3">
          Save
        </button>
      </form>
    </div>
  );
}

export default Profile;
