"use client";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";
import { IoMenu } from "react-icons/io5";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useToast } from "./Toast";
import { fetchUser } from "@/actions/userActions";
import { useState, useEffect } from "react";

const navigation = [
  { name: "Dashboard", href: "/", current: true },
  { name: "WorkoutPlan", href: "/workoutplan", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { data: session } = useSession();
  const showToast = useToast();
  const [avatarImg, setAvatarImage] = useState(null);

  // const avatarImg = session?.user?.image || null;
  const avatarFallback = session?.user?.name?.charAt(0).toUpperCase() || "";

  const handleSignOut = async () => {
    await signOut({ redirect: false, callbackUrl: "/" });
    showToast("success", "Sign Out Successfully!");
  };

  const getUser = async () => {
    const user = await fetchUser(session?.user?.email);
    setAvatarImage(user?.image);
  };

  useEffect(() => {
    if (session) {
      getUser();
    }
  }, [session]);

  return (
    <Disclosure
      as="nav"
      className="bg-background fixed w-full z-10 border-b border-gray-700 dark:border-gray-800"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* App Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/dumbell.png" alt="app logo" className="size-8" />
            <span className="text-black text-xl font-bold">GymDiary</span>
          </Link>

          {/* Center Navigation Menu */}
          {session && (
            <div className="hidden sm:block">
              <div className="flex space-x-4 items-center">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-black hover:bg-gray-700 hover:text-white",
                      "rounded-md px-3 py-2 text-md font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Right Section: Menu Button and Profile */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            {session && (
              <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white sm:hidden">
                <span className="sr-only">Open main menu</span>
                <IoMenu className="block h-6 w-6" aria-hidden="true" />
                <RxCross2 className="hidden h-6 w-6" aria-hidden="true" />
              </DisclosureButton>
            )}

            {session ? (
              <Menu as="div" className="relative">
                <div>
                  <MenuButton className="relative rounded-full bg-background text-sm  mt-2 ">
                    <span className="sr-only">Open user menu</span>
                    {avatarImg ? (
                      <img
                        className="size-10 rounded-full"
                        src={avatarImg}
                        alt="User img"
                      />
                    ) : (
                      <div className="size-10 flex items-center justify-center bg-sky-500 text-white text-2xl font-bold rounded-full">
                        {avatarFallback}
                      </div>
                    )}
                  </MenuButton>
                </div>
                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-10 focus:outline-none">
                  <MenuItem>
                    <Link
                      href={`/profile/${session.user.username}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Profile
                    </Link>
                  </MenuItem>
                  {/* <MenuItem>
                    <Link
                      href="/user/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                  </MenuItem> */}
                  <MenuItem>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            ) : (
              <div className="flex gap-2">
                <Link href={"/signup"}>
                  <button
                    type="button"
                    className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                  >
                    Sign Up
                  </button>
                </Link>
                <Link href={"/login"}>
                  <button
                    type="button"
                    className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                  >
                    Login
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              className={classNames(
                item.current
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "block rounded-md px-3 py-2 text-base font-medium"
              )}
              aria-current={item.current ? "page" : undefined}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
