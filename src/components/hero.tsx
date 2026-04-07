"use client";
import Link from "next/link";
import React from "react"; // Added for Fragment
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumbs";

interface BreadcrumbStep {
  label: string;
  href?: string; // Made optional since the last item might not need a link
}

interface HeroProps {
  title: string;
  breadcrumbs: BreadcrumbStep[];
  description?: string;
}

export const Hero = ({ title, breadcrumbs }: HeroProps) => {
  return (
    <section className="bg-white border-b hero-gradient dot-pattern border-slate-100 py-10 lg:py-14 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            {/* 1. Static Home Link */}
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="flex items-center gap-1">
                  হোম
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {/* 2. Map through dynamic breadcrumbs */}
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage className="text-blue-700 font-bold">
                      {crumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={crumb.href || "#"}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-2">
          <h1 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
};
