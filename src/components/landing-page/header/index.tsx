"use client";
import MobileMenuHandler from "@/components/partials/header/mobile-menu-handler";
import { ProfileInfo } from "@/components/partials/header/profile-info";
import MobileSidebar from "@/components/partials/sidebar/mobile-sidebar";
import SiteLogo from "@/components/sitelogo";

import { menus } from "@/config/menus";
import { useMediaQuery } from "@/hooks/use-media-query";
import { getUserInfo } from "@/service/auth.service";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Header = () => {
  const [scroll, setScroll] = useState<boolean>(false);
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 1224px)");
  const user = getUserInfo();
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 50);
    });
    return () => window.removeEventListener("scroll", () => {});
  }, []);

  if (!isDesktop) {
    return (
      <div
        className={`fixed top-0 left-0 w-full z-50 ${
          scroll ? "bg-card/50 backdrop-blur-lg shadow-xl " : ""
        }`}
      >
        <nav className="container flex justify-between relative z-[9999]">
          <div className="w-full flex items-center gap-1">
            <MobileSidebar menus={menus} />
            <Link href="/" className="flex gap-1 items-center">
              <SiteLogo />
            </Link>
          </div>
          <div className="w-full flex items-center justify-end gap-6">
            {user && <ProfileInfo />}
            <MobileMenuHandler />
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div
      className={
        scroll
          ? "bg-card/50 backdrop-blur-lg shadow-xl z-30 dark:bg-card/70 fixed top-0 left-0 w-full "
          : "z-30 fixed   top-0 left-0 w-full "
      }
    >
      <nav className="container flex justify-between items-center">
        <Link href="/" className="flex items-center gap-1">
          <SiteLogo />
        </Link>

        <ul className="flex gap-8 items-center">
          {menus?.map((item, i) => {
            const isActive = pathname === item.href;

            return (
              <li key={`main-item-${i}`} className="block">
                <Link
                  href={item.href || ""}
                  className={`relative py-2 text-base font-semibold transition-colors group ${
                    isActive
                      ? "text-primary"
                      : "text-default-600 hover:text-primary"
                  }`}
                >
                  {item.title}

                  {/* আন্ডারলাইন অ্যানিমেশন */}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ease-in-out ${
                      isActive
                        ? "w-full scale-x-100"
                        : "w-full scale-x-0 group-hover:scale-x-100 origin-left"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-6">
          {user?.role ? (
            <div className="flex items-center gap-4">
              <ProfileInfo />
            </div>
          ) : (
            <div className="flex gap-3 items-center">
              {/* Sign In - Ghost Button Style */}
              <Link
                href="/auth/sign-in"
                className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                লগইন
              </Link>

              {/* Sign Up - Solid Primary Button Style */}
              <Link
                href="/auth/sign-up"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95"
              >
                রেজিস্ট্রেশন
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
