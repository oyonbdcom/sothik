"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// types/breadcrumb.ts
export interface BreadcrumbItemType {
  label: string;
  href?: string;
}

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumbs";

interface AppBreadcrumbProps {
  items?: BreadcrumbItemType[];

  maxItems?: number;
}

export default function AppBreadcrumb({
  items,
  maxItems = 3,
}: AppBreadcrumbProps) {
  const pathname = usePathname();

  const autoItems: BreadcrumbItemType[] = pathname
    .split("/")
    .filter(Boolean)
    .map((segment, index, array) => ({
      label: segment.replace(/-/g, " "),
      href: "/" + array.slice(0, index + 1).join("/"),
    }));

  const breadcrumbs = items ?? autoItems;
  const showEllipsis = breadcrumbs.length > maxItems;

  const visibleItems = showEllipsis
    ? breadcrumbs.slice(breadcrumbs.length - maxItems)
    : breadcrumbs;

  const hiddenItems = showEllipsis
    ? breadcrumbs.slice(0, breadcrumbs.length - maxItems)
    : [];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">হোম</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbs.length > 0 && <BreadcrumbSeparator />}

        {/* Collapsed menu */}
        {showEllipsis && (
          <>
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="size-4" />
                  <span className="sr-only">Toggle breadcrumb menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {hiddenItems.map((item, i) => (
                    <DropdownMenuItem key={i} asChild>
                      <Link href={item.href ?? "#"}>{item.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        {/* Visible breadcrumbs */}
        {visibleItems.map((item, index) => {
          const isLast = index === visibleItems.length - 1;

          return (
            <span key={index} className="flex items-center">
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="capitalize">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href ?? "#"} className="capitalize">
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator />}
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
