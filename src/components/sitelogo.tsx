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
    <div>
      <button
        onClick={handleHome}
        className="  group outline-none select-none transition-all active:scale-95"
      >
        <div className="flex items-center gap-0.5">
          {/* Main Brand Text - Deep Professional Slate */}
          <span className="text-2xl font-black text-[#1A237E] tracking-tighter transition-colors group-hover:text-[#1E293B]">
            Susthi
          </span>

          {/* The Icon 'O' - Refined Medical Cyan */}
          <div className="relative flex items-center justify-center ml-[1px]">
            <div className="relative w-[20px] h-[20px] border-[3px] border-[#1A237E] rounded-full flex items-center justify-center transition-all duration-300  ">
              {/* Lucide Stethoscope Icon centered perfectly */}
              <Stethoscope
                size={8}
                strokeWidth={3}
                className="text-[#06B6D4] transition-colors duration-300  "
              />
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
