"use client";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useSidebar } from "@/store";
import FullScreen from "./full-screen";

import ClassicHeader from "./layout/classic-header";
import MobileMenuHandler from "./mobile-menu-handler";

import { siteConfig } from "@/config/site";
import { Shield } from "lucide-react";
import { ProfileInfo } from "./profile-info";
import VerticalHeader from "./vertical-header";

const NavTools = ({ isDesktop }: { isDesktop: boolean }) => (
  <div className="nav-tools flex items-center gap-2">
    {isDesktop && <FullScreen />}

    {/* {<NotificationMessage />} */}
    <ProfileInfo dashboard />
    {!isDesktop && <MobileMenuHandler />}
  </div>
);

const Header = () => {
  const { collapsed } = useSidebar();
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  return (
    <ClassicHeader className="sticky top-0">
      <div className={` ${!collapsed ? "collapsed  " : "not-collapsed "}`}>
        <div className="w-full bg-card/90 backdrop-blur-lg md:px-6 px-[15px] py-[14px] border-b">
          <div className="flex justify-between   items-center h-full">
            <div className="lg:hidden">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>

                <div>
                  <span className="text-2xl   font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {siteConfig.siteName}
                  </span>
                </div>
              </div>
            </div>
            <VerticalHeader />
            <NavTools isDesktop={isDesktop} />
          </div>
        </div>
      </div>
    </ClassicHeader>
  );
};

export default Header;
