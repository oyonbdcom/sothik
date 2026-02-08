"use client";
import { useMounted } from "@/hooks/use-mounted";
import logo from "@/public/assets/logo.png";
import { useSidebar } from "@/store";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SiteLogo() {
  const { collapsed } = useSidebar();
  const router = useRouter();
  const mounted = useMounted();
  if (!mounted) return null;

  const handleHome = () => {
    router.push("/");
  };
  return (
    <button onClick={handleHome} className="flex items-center group">
      <Image
        src={logo}
        width={60}
        height={60}
        alt="logo"
        className="group-hover:opacity-80 transition-opacity"
      />
      {!collapsed && (
        <div className="min-w-[1px] text-start leading-tight">
          <span className="text-2xl font-bold text-[#003366]">Oyon</span>
          <div className="text-base font-bold text-cyan-400 -mt-2">
            <span className="text-[#003366]">BD</span>.com
          </div>
        </div>
      )}
    </button>
  );
}
