"use client";
import React from "react";
import { useLoader } from "@/utils/useLoader";

const Loader = () => {
  const { isLoading } = useLoader();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-20 z-50">
      <div className="relative">
        {/* Outer Gray Spinner */}
        <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
        {/* Inner Blue Spinner */}
        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-black animate-spin"></div>
      </div>
    </div>
  );
};

export default Loader;
