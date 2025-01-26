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
import { usePathname } from "next/navigation";
import { FaHome, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { AiFillSchedule } from "react-icons/ai";

const navigation = [
  { name: "Dashboard", icon: <FaHome size={24} />, href: "/", href2: "/" },
  {
    name: "WorkoutPlan",
    icon: <AiFillSchedule size={24} />,
    href: "/workoutplan",
    href2: "/workoutplan/edit",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const [avatarImg, setAvatarImg] = useState(null);

  const showToast = useToast();
  const pathname = usePathname();
  const { data: session } = useSession();

  const avatarFallback = session?.user?.name?.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut({ redirect: false, callbackUrl: "/" });
    showToast("success", "Sign Out Successfully!");
  };

  const getUser = async () => {
    const user = await fetchUser(session?.user?.email);
    setAvatarImg(user.image);
  };

  useEffect(() => {
    if (session) {
      getUser();
    }
  }, [session]);

  return (
    <>
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

            {/* Center Navigation (Visible on large screens) */}
            {session && (
              <div className="hidden sm:block">
                <div className="flex space-x-4 items-center">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      passHref
                      prefetch={true}
                    >
                      <span
                        className={`${
                          pathname === item.href || pathname === item.href2
                            ? "bg-gray-900 text-white"
                            : "text-black hover:bg-gray-700 hover:text-white"
                        } rounded-md flex gap-2 items-center px-3 py-2 text-md font-medium bg-gray-100`}
                        aria-current={
                          pathname === item.href || item.href2
                            ? "page"
                            : undefined
                        }
                      >
                        {item.icon}
                        {item.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Right Section: Menu Button and Profile */}
            <div className="flex items-center space-x-4">
              {session ? (
                <Menu as="div" className="relative">
                  <div>
                    <MenuButton className="relative rounded-full bg-background text-sm mt-2">
                      <span className="sr-only">Open user menu</span>
                      {avatarImg !== null ? (
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
                        className="px-4 py-2 text-sm flex gap-2 text-gray-700 hover:bg-gray-100 border-b border-gray-200"
                      >
                        <FaUserCircle size={20} />
                        Profile
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-start flex gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FaSignOutAlt size={20} />
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

        {/* Mobile Bottom Navigation (Visible on small screens) */}
        {session && (
          <div className="fixed bottom-0 inset-x-0 bg-background flex justify-around items-center sm:hidden py-4 border-t border-gray-700">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} passHref>
                <div
                  className={`${
                    pathname === item.href || pathname === item.href2
                      ? "text-black"
                      : "text-gray-500"
                  } flex flex-col items-center w-full`}
                >
                  {item.icon}
                  <span className="text-xl">{item.name}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Disclosure>
    </>
  );
}
