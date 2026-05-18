"use client";

import SiteLogo from "@/components/sitelogo";
import { UserRole } from "@/constant/common";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useAuth } from "@/hooks/useAuth";
import ClassicHeader from "./layout/classic-header";
import MobileMenuHandler from "./mobile-menu-handler";
import { ProfileInfo } from "./profile-info";

const Header = () => {
  // Logic fix: isDesktop is true if width >= 768px
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { user } = useAuth();
  return (
    <ClassicHeader>
      <div className="bg-white collapsed border-b border-slate-200 px-4  h-16 z-20 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          {/* Mobile Hamburger: Only shows on screens smaller than 768px */}
          {!isDesktop && <MobileMenuHandler />}

          <div>
            <SiteLogo />

            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">
              {user?.role?.replace(/_/g, " ")}
              {user?.role === UserRole.STAFF && user?.staff?.staffType && (
                <> • {user.staff?.staffType}</>
              )}{" "}
              Panel
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* You can hide certain ProfileInfo details on mobile if needed */}
          <ProfileInfo />
        </div>
      </div>
    </ClassicHeader>
  );
};

export default Header;
