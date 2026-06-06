"use client";

import { useMounted } from "@/hooks/use-mounted";
import logo from "@/public/images/logo.png"; // Your image file
import Image from "next/image"; // Import Image component
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
        className="group flex items-center transition-opacity hover:opacity-80 active:scale-[0.98] outline-none"
      >
        <Image
          src={logo}
          alt="Sasthik Logo"
          width={100} // Adjust width as needed
          height={30} // Adjust height as needed
          priority
          className="h-auto w-auto"
        />
      </button>
    </div>
  );
}
