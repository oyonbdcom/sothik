import { User } from "lucide-react";

import { dashboardMenu, passwordMenu } from "./common.sidebar";
import { MenuItemProps } from "./sidebar.types";

export const patientConfig: MenuItemProps[] = [
  dashboardMenu,
  {
    title: "প্রোফাইল",
    href: "profile",
    icon: User,
  },
  passwordMenu,
];
