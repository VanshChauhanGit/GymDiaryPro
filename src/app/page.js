"use client";
import { useToast } from "@/components/Toast";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();

  return (
    <>
      <h1 className="text-3xl">Page</h1>
      
    </>
  );
}
