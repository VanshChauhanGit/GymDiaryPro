"use client"; // Error boundaries must be Client Components
import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen pt-40 bg-background text-center">
      <h2 className="text-3xl text-red-500">Something went wrong!</h2>
      <div className="flex gap-4 justify-center items-center">
        <button
          className="btn bg-secondary p-2 hover:bg-opacity-90 rounded-md mt-3"
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </button>
        <Link href="/" className="btn underline text-blue-700 hover:text-blue-900 mt-2">
          Return Home
        </Link>
      </div>
    </div>
  );
}
