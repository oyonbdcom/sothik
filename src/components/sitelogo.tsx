"use client";

import { useMounted } from "@/hooks/use-mounted";
import { useRouter } from "next/navigation";

export default function SiteLogo() {
  const router = useRouter();
  const mounted = useMounted();

  if (!mounted) return null;

  const handleHome = () => {
    router.push("/");
  };

  return (
    <div className="flex items-center">
      <button
        onClick={handleHome}
        className="group flex items-center gap-2 transition-opacity hover:opacity-80 active:scale-[0.98] outline-none"
      >
        {/* Minimalist Medical Icon - Very Clean like Global Health Brands */}

        {/* Typography Section - The "Practo" Style Focus */}
        <div className="flex items-baseline gap-0">
          <span className="text-2xl font-bold text-[#1A237E] tracking-tight">
            Sasthi
          </span>
          <span className="text-2xl font-medium text-[#06B6D4] tracking-tight">
            k
          </span>
          {/* Subtle accent dot */}
          <span className="ml-0.5 text-[#06B6D4] font-bold text-2xl">.</span>
        </div>
      </button>
    </div>
  );
}
