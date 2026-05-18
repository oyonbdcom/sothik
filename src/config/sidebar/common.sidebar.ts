import { LayoutDashboard, Lock } from "lucide-react";
import { MenuItemProps } from "./sidebar.types";

export const menus: MenuItemProps[] = [
  {
    title: "ডাক্তার খুজুন ",
    href: "/doctors",
  },
  {
    title: "জরুরি ডাক্তার",
    href: "/emergency",
  },
  {
    title: "আমাদের সম্পর্কে",
    href: "/about-us",
  },
  {
    title: "যোগাযোগ",
    href: "/contact",
  },
];

export const passwordMenu = {
  title: "পাসওয়ার্ড পরিবর্তন",
  href: "change-password",
  icon: Lock,
};
export const dashboardMenu = {
  title: "ড্যাশবোর্ড",
  icon: LayoutDashboard,
  href: "dashboard",
};
