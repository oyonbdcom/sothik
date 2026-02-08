"use client";
import { cn } from "@/lib/utils/utils";
import React from "react";

const ClassicHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <header className={cn("z-50", className)}>{children}</header>;
};

export default ClassicHeader;
