
"use client";
import { UserProvider } from "@/context/userContext";
import HomePage from "@/components/home";
export default function Home() {
  return (

    <UserProvider>

      <HomePage />
    </UserProvider>
  );
}

