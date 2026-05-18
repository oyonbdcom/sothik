"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

import { getSidebarMenus } from "@/config/sidebar/sidebar.config";
import { useAuth } from "@/hooks/useAuth";
import PopoverSidebar from "./desktop-sidebar";
import MobileSidebar from "./mobile-sidebar";

const Sidebar = () => {
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const { user } = useAuth();

  const menus = getSidebarMenus(user?.role, user?.staff?.staffType);

  return (
    <div>
      {!isDesktop ? (
        <MobileSidebar menus={menus} />
      ) : (
        <PopoverSidebar menus={menus} />
      )}
    </div>
  );
};

export default Sidebar;
