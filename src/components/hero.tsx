"use client";
import Link from "next/link";
import React from "react";
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
  href?: string;
}

interface HeroProps {
  title: string;
  breadcrumbs: BreadcrumbStep[];
}

export const Hero = ({ title, breadcrumbs }: HeroProps) => {
  // --- SEO: BreadcrumbList Schema Generation ---
  // এটি গুগল সার্চ রেজাল্টে আপনার পেজের পাথ (Path) সুন্দরভাবে দেখাতে সাহায্য করবে
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "হোম",
        item: "https://susthio.com", // আপনার ডোমেইন নাম দিন
      },
      ...breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: crumb.label,
        item: crumb.href ? `https://susthio.com${crumb.href}` : undefined,
      })),
    ],
  };

  return (
    <section className="bg-white border-b hero-gradient dot-pattern border-slate-100 py-10 lg:py-14 relative overflow-hidden">
      {/* JSON-LD Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <nav aria-label="Breadcrumb" className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/"
                    className="flex items-center gap-1 font-medium hover:text-blue-600 transition-colors"
                  >
                    হোম
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

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
                        <Link
                          href={crumb.href || "#"}
                          className="font-medium hover:text-blue-600 transition-colors"
                        >
                          {crumb.label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </nav>

        <div className="space-y-2">
          {/* SEO: নিশ্চিত করুন এটি যেন পেজের একমাত্র <h1> হয় */}
          <h1 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
};
