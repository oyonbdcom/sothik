"use client";

import { useMounted } from "@/hooks/use-mounted";
import { Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SiteLogo() {
  const router = useRouter();
  const mounted = useMounted();

  if (!mounted) return null;

  const handleHome = () => {
    router.push("/");
  };

  return (
    <button
      onClick={handleHome}
      className="flex items-center justify-center group outline-none select-none transition-all active:scale-95"
    >
      <div className="flex items-center gap-[2px]">
        {/* Main Brand Text */}
        <span className="text-3xl font-black text-[#1A237E] tracking-tighter transition-colors group-hover:text-[#1E293B]">
          <span className="text-[33px]">s</span>usthi
        </span>

        {/* The Icon 'O' - Circle with Background */}
        <div className="relative flex items-center justify-center">
          {/* এই div টি এখন নিশ্চিতভাবে দেখা যাবে */}
          <div className="w-5 h-5 bg-[#15d1d1] rounded-full flex items-center justify-center    ">
            {/* আইকন কালার white দিন যাতে ব্যাকগ্রাউন্ডে ফুটে ওঠে */}
            <Stethoscope size={12} strokeWidth={3} className="text-white" />
          </div>

          {/* একটি ছোট ডট যোগ করা যেতে পারে প্রাক্টো স্টাইলে */}
        </div>
      </div>
    </button>
  );
}
