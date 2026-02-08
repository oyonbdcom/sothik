"use client";

import {
  adminConfig,
  clinicConfig,
  doctorConfig,
  MenuItemProps,
  patientConfig,
} from "@/config/menus";
import { useMediaQuery } from "@/hooks/use-media-query";

import { UserRole } from "@/constant/common";
import { getUserInfo } from "@/service/auth.service";
import PopoverSidebar from "./desktop-sidebar";
import MobileSidebar from "./mobile-sidebar";

const Sidebar = () => {
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const user = getUserInfo();

  const roleMap: Record<string, MenuItemProps[]> = {
    [UserRole.ADMIN]: adminConfig,
    [UserRole.DOCTOR]: doctorConfig,
    [UserRole.CLINIC]: clinicConfig,
    [UserRole.PATIENT]: patientConfig,
  };

  const menus = roleMap[user?.role ?? ""] ?? [];

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
