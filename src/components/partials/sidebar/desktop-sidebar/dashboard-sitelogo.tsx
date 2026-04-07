"use client";
import { siteConfig } from "@/config/site";
import { useMounted } from "@/hooks/use-mounted";
import { useRouter } from "next/navigation";

export default function DashboardSiteLogo() {
  const router = useRouter();
  const mounted = useMounted();
  if (!mounted) return null;

  const handleHome = () => {
    router.push("/");
  };
  return (
    <button
      onClick={handleHome}
      className="flex items-center justify-center group outline-none select-none"
    >
      {/* Practo Style Layout: Side Dot + Text */}
      <div className="flex items-center gap-2 justify-center h-16">
        {/* Brand Typography */}
        <div className="flex w-full justify-center items-baseline gap-0.5">
          <span className="text-2xl font-bold text-[#28328C] tracking-tight text-center transition-colors group-hover:text-[#2D6ADF]">
            {siteConfig.siteName}
          </span>
          {/* Smaller Accent Dot at the end (Practo Style) */}
          <div className="w-1.5 h-1.5 bg-[#14BEF0] rounded-full mb-1"></div>
        </div>
      </div>
    </button>
  );
}
