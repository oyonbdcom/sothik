import { Building, Star, UserPlus } from "lucide-react";

import { dashboardMenu, passwordMenu } from "./common.sidebar";
import { MenuItemProps } from "./sidebar.types";

export const managerConfig: MenuItemProps[] = [
  dashboardMenu,
  { title: "ডাক্তার প্রোফাইল", icon: UserPlus, href: "doctors" },
  { title: "ক্লিনিক প্রোফাইল", icon: Building, href: "clinics" },
  // { title: "মেম্বারশিপ", icon: CreditCard, href: "memberships" },
  { title: "রিভিউ ম্যানেজমেন্ট", icon: Star, href: "reviews" },
  passwordMenu,
];
