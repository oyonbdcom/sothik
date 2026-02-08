"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMounted } from "@/hooks/use-mounted";
import { useAuth } from "@/hooks/useAuth";
import { useLogoutUserMutation } from "@/redux/api/authApi";

import { removeUserInfo } from "@/service/auth.service";
import { LayoutDashboard, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const ProfileInfo = ({ dashboard = false }: { dashboard?: boolean }) => {
  const mounted = useMounted();
  const router = useRouter();
  const [logoutUser] = useLogoutUserMutation();
  const { user, isLoading } = useAuth();

  if (!mounted || isLoading || !user) return null;

  // ডাইনামিক রাউটিং এর জন্য রোল বের করা
  const role = user?.role.toLowerCase();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      // লোকাল স্টোরেজ থেকে তথ্য মুছে ফেলা
      removeUserInfo();

      router.push("/auth/sign-in");
      toast.success("সফলভাবে লগআউট করা হয়েছে");
    } catch (err) {
      toast.error("লগআউট করতে ব্যর্থ হয়েছে");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none transition-transform active:scale-95">
          <Avatar className="h-9 w-9 border-2 border-slate-100 shadow-sm">
            <AvatarImage src={user.image ?? ""} />
            <AvatarFallback className="bg-blue-50 text-blue-600 font-bold">
              {user.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 p-2">
            <p className="text-sm font-bold text-slate-900 leading-none">
              {user.name}
            </p>
            <p className="text-xs text-slate-500 font-medium truncate">
              {user.phoneNumber}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1" />

        {/* যদি ড্যাশবোর্ডে না থাকে তবেই এই অপশনগুলো দেখাবে */}
        {!dashboard && (
          <>
            <DropdownMenuItem
              className="cursor-pointer py-2.5 font-medium rounded-lg focus:bg-blue-50 focus:text-blue-600"
              onClick={() => router.push(`/${role}/dashboard`)}
            >
              <LayoutDashboard className="mr-3 h-4 w-4" />
              ড্যাশবোর্ড
            </DropdownMenuItem>

            {user.role !== "ADMIN" && (
              <DropdownMenuItem
                className="cursor-pointer py-2.5 font-medium rounded-lg focus:bg-blue-50 focus:text-blue-600"
                onClick={() => router.push(`/${role}/profile`)}
              >
                <User className="mr-3 h-4 w-4" />
                প্রোফাইল
              </DropdownMenuItem>
            )}
          </>
        )}

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer py-2.5 font-bold text-rose-600 rounded-lg focus:bg-rose-50 focus:text-rose-700"
        >
          <LogOut className="mr-3 h-4 w-4" />
          লগআউট
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
