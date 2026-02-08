"use client";

import { ArrowRight, Building2, User } from "lucide-react";
import Link from "next/link";

const AccountTypeSelector = () => {
  const accountTypes = [
    {
      id: "PATIENT",
      title: "পেশেন্ট (Patient)",
      description: "ডাক্তার খুঁজতে এবং অ্যাপয়েন্টমেন্ট বুক করতে",
      icon: <User className="w-6 h-6" />,
      href: "/auth/sign-up/patient",
      color: "blue",
    },
    {
      id: "CLINIC",
      title: "ক্লিনিক/হাসপাতাল",
      description: "আপনার মেডিকেল প্রতিষ্ঠান ম্যানেজ করতে",
      icon: <Building2 className="w-6 h-6" />,
      href: "/auth/sign-up/clinic",
      color: "indigo",
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            অ্যাকাউন্ট টাইপ
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            শুরু করতে আপনার অ্যাকাউন্টের ধরন নির্বাচন করুন
          </p>
        </div>

        {/* Account Type Cards */}
        <div className="grid gap-4">
          {accountTypes.map((type) => (
            <Link
              key={type.id}
              href={type.href}
              className="group relative flex items-center gap-5 p-5 rounded-[2rem] border border-slate-200 dark:border-slate-800 
              bg-white dark:bg-slate-900 transition-all duration-300
              hover:border-blue-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1"
            >
              {/* Icon Container */}
              <div
                className="flex-shrink-0 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 
              group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300"
              >
                {type.icon}
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-0.5">
                  {type.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {type.description}
                </p>
              </div>

              {/* Arrow Icon */}
              <div className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all">
                <ArrowRight size={20} />
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center pt-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
            <Link
              href="/auth/sign-in"
              className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
            >
              লগইন করুন
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountTypeSelector;
