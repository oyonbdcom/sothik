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

export type SidebarConfigType = {
  role: string;
  staffType?: string;
  menus: MenuItemProps[];
};
