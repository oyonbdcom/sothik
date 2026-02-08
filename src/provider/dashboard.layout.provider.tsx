/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Header from "@/components/partials/header";
import Sidebar from "@/components/partials/sidebar";
import React from "react";

import MobileSidebar from "@/components/partials/sidebar/mobile-sidebar";
import {
  adminConfig,
  clinicConfig,
  doctorConfig,
  MenuItemProps,
  patientConfig,
} from "@/config/menus";
import { UserRole } from "@/constant/common";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils/utils";
import { useGetCurrentUserQuery } from "@/redux/api/authApi";
import { useSidebar } from "@/store";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const DashBoardLayoutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { collapsed } = useSidebar();

  const [open, setOpen] = React.useState(false);

  const location = usePathname();
  const isMobile = useMediaQuery("(min-width: 768px)");

  return (
    <div className="">
      <Header />
      <Sidebar />

      <div className={` ${!collapsed ? "collapsed  " : "not-collapsed "}`}>
        <div className={cn(" layout-padding px-4 pt-4  page-min-height ")}>
          <LayoutWrapper
            isMobile={isMobile}
            setOpen={setOpen}
            open={open}
            location={location}
          >
            {children}
          </LayoutWrapper>
        </div>
      </div>
    </div>
  );
};

export default DashBoardLayoutProvider;

const LayoutWrapper = ({
  children,

  location,
}: {
  children: React.ReactNode;
  isMobile: boolean;
  setOpen: any;
  open: boolean;
  location: any;
}) => {
  const { data } = useGetCurrentUserQuery(undefined);

  const user = data?.user;

  const getMenuConfig = (): MenuItemProps[] => {
    switch (user?.role) {
      case UserRole.ADMIN:
        return adminConfig;
      case UserRole.DOCTOR:
        return doctorConfig;
      case UserRole.CLINIC:
        return clinicConfig;
      case UserRole.PATIENT:
        return patientConfig;
      default:
        return [];
    }
  };

  const menus = getMenuConfig();

  return (
    <>
      <motion.div
        key={location}
        initial="pageInitial"
        animate="pageAnimate"
        exit="pageExit"
        variants={{
          pageInitial: {
            opacity: 0,
            y: 50,
          },
          pageAnimate: {
            opacity: 1,
            y: 0,
          },
          pageExit: {
            opacity: 0,
            y: -50,
          },
        }}
        transition={{
          type: "tween",
          ease: "easeInOut",
          duration: 0.5,
        }}
      >
        <main>{children}</main>
      </motion.div>

      <MobileSidebar menus={menus} className="left-[300px]" />
    </>
  );
};
