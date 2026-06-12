import { Star } from "lucide-react";
import { dashboardMenu, passwordMenu } from "./common.sidebar";
import { MenuItemProps } from "./sidebar.types";

export const doctorConfig: MenuItemProps[] = [
  dashboardMenu,

  { title: "প্রোফাইল ", icon: Star, href: "profile" },

  passwordMenu,
];
