"use client";

import { removeUserInfo } from "@/service/auth.service";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface LogoutButtonProps {
  className?: string; // Optional prop for custom styling  e.g. "w-16 h-16" or "text-xl"
}
export default function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      await removeUserInfo();

      toast.success("Logged out successfully");

      router.replace("/auth/sign-in");
    } catch (error) {
      toast.error("Logout failed. Try again.");
      console.error("Logout error:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className={`w-full flex gap-1  text-default-700 text-base capitalize px-[10px] items-center font-medium py-2 rounded cursor-pointer hover:bg-primary hover:text-default-100 ${className}`}
    >
      <LogOut size={16} />
      Logout
    </button>
  );
}
