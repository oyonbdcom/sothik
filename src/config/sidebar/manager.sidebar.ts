import { Building, Star, UserPlus } from "lucide-react";

import { dashboardMenu, passwordMenu } from "./common.sidebar";
import { MenuItemProps } from "./sidebar.types";

export const managerConfig: MenuItemProps[] = [
  dashboardMenu,
  { title: "ডাক্তার প্রোফাইল", icon: UserPlus, href: "doctors" },
  { title: "ডায়াগনস্টিক প্রোফাইল", icon: Building, href: "diagnostics" },
  // { title: "মেম্বারশিপ", icon: CreditCard, href: "memberships" },
  { title: "রিভিউ ম্যানেজমেন্ট", icon: Star, href: "reviews" },
  passwordMenu,
];
