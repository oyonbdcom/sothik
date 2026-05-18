import { Calendar } from "lucide-react";
import { dashboardMenu, passwordMenu } from "./common.sidebar";
import { MenuItemProps } from "./sidebar.types";

export const coordinatorConfig: MenuItemProps[] = [
  dashboardMenu,

  { title: "আমার অ্যাপয়েন্টমেন্ট ", icon: Calendar, href: "appointments" },

  passwordMenu,
];
