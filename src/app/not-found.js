import Link from "next/link";
import React from "react";

function notFound() {
  return (
    <div className="text-center pt-40 bg-background min-h-screen">
      <h1 className="text-4xl">404 - Page Not Found</h1>
      <p className="text-2xl mt-5 mb-3 text-primary">
        Could not found requested resource!
      </p>
      <Link href="/" className="btn underline text-blue-700">
        Return Home
      </Link>
    </div>
  );
}

export default notFound;
