/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Sidebar from "@/components/partials/sidebar";
import React from "react";

import Header from "@/components/partials/header";
import MobileSidebar from "@/components/partials/sidebar/mobile-sidebar";

import { getSidebarMenus } from "@/config/sidebar/sidebar.config";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils/utils";
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
        <div className={cn(" layout-padding    page-min-height bg-slate-100 ")}>
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
  const { user } = useAuth();

  const menus = getSidebarMenus(user?.role, user?.staff?.staffType);

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
