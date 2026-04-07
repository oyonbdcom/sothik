"use client";
import { menus } from "@/config/menus";
import { useMediaQuery } from "@/hooks/use-media-query";
import { getUserInfo } from "@/service/auth.service";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import MobileMenuHandler from "@/components/partials/header/mobile-menu-handler";
import { ProfileInfo } from "@/components/partials/header/profile-info";
import MobileSidebar from "@/components/partials/sidebar/mobile-sidebar";
import SiteLogo from "@/components/sitelogo";

const Header = () => {
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 1224px)");

  useEffect(() => {
    // Hydration-safe user check
    const userInfo = getUserInfo();
    setUser(userInfo);
  }, []);

  // Professional Header Styles: Always White, Sticky, and Bordered
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
            {user ? <ProfileInfo /> : <MobileMenuHandler />}
          </div>
        </nav>
      </header>
    );
  }

  // DESKTOP VIEW
  return (
    <header className={headerStyles}>
      <nav className="container h-14 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <Link href="/">
            <SiteLogo />
          </Link>
        </div>

        {/* Navigation Menu */}
        <div className="flex items-center gap-10">
          {menus.map((link) => (
            <Link
              key={link.href}
              href={link.href || "#"}
              className={`text-[15px] font-medium transition-all hover:text-blue-600 ${
                pathname === link.href ? "text-blue-700" : "text-slate-600"
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
                className="text-sm font-semibold text-blue-700 hover:text-blue-800 px-4 py-2 transition-colors"
              >
                লগইন
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold text-white bg-blue-600 px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95"
              >
                নিবন্ধন করুন
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
// <div
//   className={
//     scroll
//       ? "bg-card/50 backdrop-blur-lg shadow-xl z-30 dark:bg-card/70 fixed top-0 left-0 w-full flex items-center  h-14 "
//       : "z-30 fixed   top-0 left-0 w-full  flex items-center  h-14  "
//   }
// >
//   <nav className="w-full flex justify-between items-center">
//     <Link href="/" className="flex items-center gap-1">
//       <SiteLogo />
//     </Link>

//     <ul className="flex gap-8 items-center">
//       {menus?.map((item, i) => {
//         const isActive = pathname === item.href;

//         return (
//           <li key={`main-item-${i}`} className="block">
//             <Link
//               href={item.href || ""}
//               className={`relative py-2 text-sm font-semibold transition-colors group ${
//                 isActive
//                   ? "text-primary"
//                   : "text-default-600 hover:text-primary"
//               }`}
//             >
//               {item.title}

//               {/* আন্ডারলাইন অ্যানিমেশন */}
//               <span
//                 className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ease-in-out ${
//                   isActive
//                     ? "w-full scale-x-100"
//                     : "w-full scale-x-0 group-hover:scale-x-100 origin-left"
//                 }`}
//               />
//             </Link>
//           </li>
//         );
//       })}
//     </ul>

//     <div className="flex items-center gap-6">
//       {user?.role ? (
//         <div className="flex items-center gap-4">
//           <ProfileInfo />
//         </div>
//       ) : (
//         <div className="flex gap-3 items-center">
//           {/* Sign In - Ghost Button Style */}
//           <Link
//             href="/login"
//             className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
//           >
//             লগইন
//           </Link>

//           {/* Sign Up - Solid Primary Button Style */}
//           <Link
//             href="/register"
//             className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95"
//           >
//             রেজিস্ট্রেশন
//           </Link>
//         </div>
//       )}
//     </div>
//   </nav>
// </div>
