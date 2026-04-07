"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MenuItemProps } from "@/config/menus";
import { cn } from "@/lib/utils/utils";
import { useSidebar } from "@/store";

import { useState } from "react";
import AddBlock from "../common/add-block";

import SiteLogo from "@/components/sitelogo";
import { Stethoscope } from "lucide-react";
import Link from "next/link";
import NestedSubMenu from "../common/nested-menus";
import SingleMenuItem from "./single-menu-item";
import SubMenuHandler from "./sub-menu-handler";

const PopoverSidebar = ({
  menus,
}: {
  className?: string;
  menus: MenuItemProps[];
}) => {
  const { collapsed, sidebarBg } = useSidebar();

  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const [activeMultiMenu, setMultiMenu] = useState<number | null>(null);

  const toggleSubmenu = (i: number) => {
    setActiveSubmenu(activeSubmenu === i ? null : i);
  };

  const toggleMultiMenu = (subIndex: number) => {
    setMultiMenu(activeMultiMenu === subIndex ? null : subIndex);
  };

  // const pathname = usePathname();
  // const locationName = getDynamicPath(pathname);

  // useEffect(() => {
  //   let subMenuIndex = null;
  //   let multiMenuIndex = null;
  //   menus?.map((item: any, i: number) => {
  //     if (item?.child) {
  //       item.child.map((childItem: any, j: number) => {
  //         if (isLocationMatch(childItem.href, locationName)) {
  //           subMenuIndex = i;
  //         }
  //         if (childItem?.multi_menu) {
  //           childItem.multi_menu.map((multiItem: any, k: number) => {
  //             if (isLocationMatch(multiItem.href, locationName)) {
  //               subMenuIndex = i;
  //               multiMenuIndex = j;
  //             }
  //           });
  //         }
  //       });
  //     }
  //   });
  //   setActiveSubmenu(subMenuIndex);
  //   setMultiMenu(multiMenuIndex);
  // }, [locationName, menus]);

  return (
    <div
      className={cn("fixed bg-card top-0 border-r h-full z-[99]", {
        "w-[248px]": !collapsed,
        "w-[72px]": collapsed,
      })}
    >
      <div className="px-1 flex justify-star items-center h-14">
        {collapsed ? (
          <div>
            <Link
              href={"/"}
              className="flex items-center justify-center group outline-none select-none transition-all active:scale-95"
            >
              <div className="flex items-center gap-0.5">
                {/* Main Brand Text - Deep Professional Slate */}
                <span className="text-[14px] font-black text-[#1A237E] tracking-tighter transition-colors group-hover:text-[#1E293B]">
                  Susthi
                </span>

                {/* The Icon 'O' - Refined Medical Cyan */}
                <div className="relative flex items-center justify-center ml-[1px]">
                  <div className="relative w-[16px] h-[16px] border-[3px] border-[#1A237E] rounded-full flex items-center justify-center transition-all duration-300  ">
                    {/* Lucide Stethoscope Icon centered perfectly */}
                    <Stethoscope
                      size={8}
                      strokeWidth={3}
                      className="text-[#06B6D4] transition-colors duration-300  "
                    />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ) : (
          <SiteLogo />
        )}
      </div>
      <Separator />
      <ScrollArea
        className={cn("sidebar-menu h-[calc(100%-80px)]", {
          "px-4 pt-2": !collapsed,
        })}
      >
        <ul
          className={cn("space-y-1 pt-2", {
            "space-y-2 text-center": collapsed,
          })}
        >
          {menus?.length > 0 &&
            menus.map((item, i) => (
              <li key={`menu_key_${i}`}>
                {!item.child && !item.isHeader && (
                  <SingleMenuItem item={item} collapsed={collapsed} />
                )}
                {/* {item.isHeader && !item.child && !collapsed && (
                  <MenuLabel item={item} />
                )} */}
                {item.child && (
                  <>
                    <SubMenuHandler
                      item={item}
                      toggleSubmenu={toggleSubmenu}
                      index={i}
                      activeSubmenu={activeSubmenu}
                      collapsed={collapsed}
                    />
                    {!collapsed && (
                      <NestedSubMenu
                        toggleMultiMenu={toggleMultiMenu}
                        activeMultiMenu={activeMultiMenu}
                        activeSubmenu={activeSubmenu}
                        item={item}
                        index={i}
                      />
                    )}
                  </>
                )}
              </li>
            ))}
        </ul>

        {!collapsed && (
          <div className="-mx-2">
            <AddBlock />
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default PopoverSidebar;
