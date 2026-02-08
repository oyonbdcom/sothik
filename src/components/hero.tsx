"use client";

import { cn } from "@/lib/utils/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import AppBreadcrumb from "./app-breadcrumb";

interface HeroProps {
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  backgroundImage?: string;
  className?: string;
  contentClassName?: string;
  titleClassName?: string;
}

export const Hero = ({
  title,

  breadcrumbs = [],
  backgroundImage,
  className = "",
  contentClassName = "",
  titleClassName = "",
}: HeroProps) => {
  return (
    <section
      className={cn(
        "relative min-h-[300px]  pt-10  overflow-hidden",
        className,
      )}
    >
      {/* Main Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50  " />

      {/* Background Image Overlay (if provided) */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-overlay dark:mix-blend-soft-light">
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        </div>
      )}

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-r from-blue-300 to-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-r from-emerald-200 to-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-gradient-to-r from-indigo-200 to-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiLz48L2c+PC9nPjwvc3Zn+')] opacity-50 dark:opacity-20" />

      <div className="container relative z-20  ">
        <div className="flex h-[200px] md:h-[200px] lg:h-[300px] flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div
              className={cn(
                "flex flex-col items-center text-center  ",
                contentClassName,
              )}
            >
              {/* Breadcrumb - Top */}
              {breadcrumbs.length > 0 && (
                <motion.nav
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="mb-6">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 shadow-sm">
                      <AppBreadcrumb items={breadcrumbs} />
                    </div>
                  </div>
                </motion.nav>
              )}

              {/* Title with Professional Gradient */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <span
                  className={cn(
                    "text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 md:mb-6",
                    "bg-gradient-to-r from-slate-900 via-blue-700 to-emerald-700 dark:from-white dark:via-blue-300 dark:to-emerald-300 bg-clip-text text-transparent py-2",
                    titleClassName,
                  )}
                >
                  {title}
                </span>
              </motion.div>

              {/* Subtitle */}
              {/* {subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="mb-8 max-w-2xl text-lg md:text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed"
                >
                  {subtitle}
                </motion.p>
              )} */}

              {/* Decorative Line */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100px" }}
                transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
              >
                <div className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full mt-4" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-slate-950 to-transparent" />

      {/* CSS for Blob Animation */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 8s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};
