"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IMembershipResponse } from "@/interface/clinic-membership";
import { useGetMembershipsQuery } from "@/redux/api/membershipApi";
import { Plus, Stethoscope, UserPlus } from "lucide-react";
import { useState } from "react";
import { DoctorCard } from "./doctor-card";
import { DoctorCardSkeleton } from "./skeleton";

interface MembershipListProps {
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MembershipList({ setIsCreating }: MembershipListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isFetching, refetch } =
    useGetMembershipsQuery(undefined);

  const memberships = data?.membership || [];
  const meta = data?.meta;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:p-8 space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              চিকিৎসক তালিকা
            </h1>
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-sm font-bold border border-blue-200 dark:border-blue-800">
              {meta?.total || 0} জন
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base max-w-md leading-relaxed">
            আপনার ক্লিনিকের সকল চিকিৎসক এবং তাদের মেম্বারশিপ প্রোফাইল এখান থেকে
            পরিচালনা করুন।
          </p>
        </div>

        <Button
          onClick={() => setIsCreating(true)}
          className="flex-1 md:flex-none gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-5 px-6 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
        >
          <Plus className="h-5 w-5" />
          নতুন চিকিৎসক যুক্ত করুন
        </Button>
      </header>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <DoctorCardSkeleton key={i} />
          ))}
        </div>
      ) : memberships.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {memberships.map((member: IMembershipResponse) => (
            <DoctorCard key={member.id} member={member} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="border-dashed border-2 bg-gray-50/50 dark:bg-slate-900/20 rounded-[2rem] overflow-hidden">
          <CardContent className="py-16 md:py-24 text-center">
            <div className="relative mx-auto w-24 h-24 mb-8">
              <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-pulse" />
              <div className="relative flex items-center justify-center w-full h-full rounded-full bg-white dark:bg-slate-800 shadow-md">
                <Stethoscope className="w-10 h-10 text-blue-500" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              চিকিৎসকের তালিকা খালি
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">
              {searchQuery
                ? `দুঃখিত, "${searchQuery}" নামে কোনো চিকিৎসক খুঁজে পাওয়া যায়নি।`
                : "আপনার ক্লিনিকে এখনো কোনো চিকিৎসক মেম্বারশিপে যুক্ত নেই। প্রথম চিকিৎসক যুক্ত করে শুরু করুন।"}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => setIsCreating(true)}
                size="lg"
                className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 rounded-xl px-8"
              >
                <UserPlus className="h-5 w-5" />
                চিকিৎসক যুক্ত করুন
              </Button>

              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery("")}
                  variant="ghost"
                  size="lg"
                  className="w-full sm:w-auto text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  সার্চ ক্লিয়ার করুন
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
