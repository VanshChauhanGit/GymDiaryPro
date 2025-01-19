"use client";
import React from "react";
import { useSession } from "next-auth/react";

function Profile() {
  const { data: session } = useSession();
  console.log(session);
  return <div>Profile: {session?.user?.username}</div>;
}

export default Profile;
