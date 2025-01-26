import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <footer className="bg-background w-full border-t border-gray-800 dark:border-gray-700 sm:pb-0 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link
            href="/"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <img src="/dumbell.png" className="h-8" alt="Logo" />
            <span className="text-center text-2xl font-semibold whitespace-nowrap text-black dark:text-white">
              GymDiary
            </span>
          </Link>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-black sm:mb-0 dark:text-gray-400">
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Licensing
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-800 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="block text-sm text-black text-center dark:text-gray-400">
          © 2025 GymDiary™ All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
