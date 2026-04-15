import {
  Building,
  Building2,
  Calendar,
  CreditCard,
  LayoutDashboard,
  Lock,
  Settings,
  Share2,
  Star,
  User,
  UserPlus,
  Users,
} from "lucide-react";

// --- সাধারণ মেনু (Public Menus) ---
export const menus: MenuItemProps[] = [
  {
    title: "ডাক্তার খুজুন ",
    href: "/doctors",
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

export interface MenuItemProps {
  title?: string;
  icon?: React.ElementType;
  href?: string;
  child?: MenuItemProps[];
  megaMenu?: MenuItemProps[];
  multi_menu?: MenuItemProps[];
  nested?: MenuItemProps[];
  onClick?: () => void;
  isHeader?: boolean;
}

// --- ডাক্তারদের জন্য কনফিগ (Doctor Config) ---
export const doctorConfig: MenuItemProps[] = [
  {
    title: "ড্যাশবোর্ড",
    icon: LayoutDashboard,
    href: "dashboard",
  },
  {
    title: "আমার প্রোফাইল",
    href: "profile",
    icon: User,
  },
  {
    title: "আমার রোগীগণ",
    href: "patients",
    icon: Users,
  },
  {
    title: "সময়সূচী",
    href: "schedule",
    icon: Calendar,
  },
  {
    title: "রিভিউ ও রেটিং",
    href: "reviews",
    icon: Star,
  },
  {
    title: "সামাজিক মাধ্যম",
    href: "socials",
    icon: Share2,
  },
];

// --- রোগীদের জন্য কনফিগ (Patient Config) ---
export const patientConfig: MenuItemProps[] = [
  {
    title: "ড্যাশবোর্ড",
    icon: LayoutDashboard,
    href: "dashboard",
  },
  {
    title: "প্রোফাইল",
    href: "profile",
    icon: User,
  },
  {
    title: "পাসওয়ার্ড পরিবর্তন",
    href: "change-password",
    icon: Lock,
  },
];

// --- ক্লিনিকের জন্য কনফিগ (Clinic Config) ---
export const clinicConfig: MenuItemProps[] = [
  {
    title: "ড্যাশবোর্ড",
    icon: LayoutDashboard,
    href: "dashboard",
  },

  {
    title: "ডক্টরস",
    href: "doctors",
    icon: Users,
  },
  {
    title: "রিভিউ",
    href: "reviews",
    icon: Star,
  },
  {
    title: "ক্লিনিক প্রোফাইল",
    href: "profile",
    icon: User,
  },
  {
    title: "পাসওয়ার্ড পরিবর্তন",
    href: "change-password",
    icon: Lock,
  },
];

// --- অ্যাডমিনের জন্য কনফিগ (Admin Config) ---
export const adminConfig: MenuItemProps[] = [
  {
    title: "অ্যাডমিন ড্যাশবোর্ড",
    icon: LayoutDashboard,
    href: "dashboard",
  },
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
    title: "ক্লিনিকসমূহ",
    href: "clinics",
    icon: Building2,
  },

  {
    title: "পাসওয়ার্ড পরিবর্তন",
    href: "change-password",
    icon: Lock,
  },
];
export const managerConfig: MenuItemProps[] = [
  { title: "ড্যাশবোর্ড", icon: LayoutDashboard, href: "dashboard" },
  { title: "ডাক্তার প্রোফাইল", icon: UserPlus, href: "doctors" },
  { title: "ক্লিনিক প্রোফাইল", icon: Building, href: "clinics" },
  { title: "মেম্বারশিপ", icon: CreditCard, href: "memberships" },
  { title: "রিভিউ ম্যানেজমেন্ট", icon: Star, href: "reviews" },
  { title: "পাসওয়ার্ড পরিবর্তন", icon: Lock, href: "change-password" },
];
