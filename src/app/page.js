"use client";
import { useToast } from "@/components/Toast";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();
  const showToast = useToast();

  return (
    <>
      <h1 className="bg-red-400 text-white">Page</h1>
    </>
  );
}
