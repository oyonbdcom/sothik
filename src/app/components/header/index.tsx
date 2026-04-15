"use client";
import { menus } from "@/config/menus";
import { useMediaQuery } from "@/hooks/use-media-query";
import { getUserInfo } from "@/service/auth.service";
import Link from "next/link";
import { usePathname } from "next/navigation";

import MobileMenuHandler from "@/components/partials/header/mobile-menu-handler";
import { ProfileInfo } from "@/components/partials/header/profile-info";
import MobileSidebar from "@/components/partials/sidebar/mobile-sidebar";
import SiteLogo from "@/components/sitelogo";

const Header = () => {
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 1224px)");
  const user = getUserInfo();
  // Professional Header Styles
  const headerStyles =
    "sticky top-0 left-0 w-full z-50 bg-white border-b border-slate-100 shadow-sm transition-all duration-200";

  // MOBILE VIEW
  if (!isDesktop) {
    return (
      <header className={headerStyles}>
        <nav className="container mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <MobileSidebar menus={menus} />
            <Link href="/" className="flex items-center">
              <SiteLogo />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user?.role && <ProfileInfo />} {/* ৪. সেফ চেক */}
            <MobileMenuHandler />
          </div>
        </nav>
      </header>
    );
  }

  // DESKTOP VIEW
  return (
    <header className={headerStyles}>
      <nav className="container mx-auto h-14 flex items-center justify-between px-4">
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <Link href="/">
            <SiteLogo />
          </Link>
        </div>

        {/* Navigation Menu */}
        <div className="flex items-center gap-8">
          {menus.map((link) => (
            <Link
              key={link.href}
              href={link.href || "#"}
              className={`text-[14px] font-bold transition-all hover:text-blue-600 ${
                pathname === link.href
                  ? "text-blue-700 underline underline-offset-8 decoration-2"
                  : "text-slate-500"
              }`}
            >
              {link.title}
            </Link>
          ))}
        </div>

        {/* Authentication Actions */}
        <div className="flex items-center gap-4">
          {user?.role ? (
            <ProfileInfo />
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-black text-slate-600 hover:text-blue-700 px-4 py-2 transition-colors"
              >
                লগইন
              </Link>
              <Link
                href="/register"
                className="text-sm font-black text-white bg-blue-600 px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
              >
                নিবন্ধন
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
