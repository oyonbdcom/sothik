import { CreditCard, Star, Stethoscope } from "lucide-react";

import { dashboardMenu, passwordMenu } from "./common.sidebar";
import { MenuItemProps } from "./sidebar.types";

export const diagnosticConfig: MenuItemProps[] = [
  dashboardMenu,
  { title: "ডাক্তার সমূহ", icon: Stethoscope, href: "memberships" },
  { title: "স্টাপ সমূহ", icon: Stethoscope, href: "staff" },
  { title: "অ্যাপয়েন্টমেন্ট তালিকা", icon: CreditCard, href: "appointments" },
  { title: "প্রোফাইল ", icon: Star, href: "profile" },
  passwordMenu,
];
