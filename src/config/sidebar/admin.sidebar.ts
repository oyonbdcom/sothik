import { Building2, Calendar, Settings, Users } from "lucide-react";

import { dashboardMenu, passwordMenu } from "./common.sidebar";
import { MenuItemProps } from "./sidebar.types";

export const adminConfig: MenuItemProps[] = [
  dashboardMenu,
  {
    title: "সিস্টেম সেটআপ ",
    href: "setup",
    icon: Settings,
  },
  {
    title: "ইউজার ম্যানেজমেন্ট",
    href: "users",
    icon: Users,
  },
  {
    title: "ম্যানেজার সমূহ",
    href: "managers",
    icon: Users,
  },
  {
    title: "অ্যাপয়েন্টমেন্ট তালিকা",
    href: "appointments",
    icon: Calendar,
  },
  {
    title: "ডায়াগনস্টিকসমূহ",
    href: "diagnostics",
    icon: Building2,
  },

  passwordMenu,
];
