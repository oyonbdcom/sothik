"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "react-hot-toast";

// Components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AddDoctorMembership } from "./components/add-membership-form";
import MembershipList from "./components/membarship-list";

export default function DoctorPageView() {
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition(); // 'isPadding' কে 'isPending' করা হয়েছে

  const confirmDelete = async () => {
    if (!isDeleting) return;

    startTransition(async () => {
      try {
        // এখানে আপনার API call হবে (যেমন: await deleteDoctorAction(isDeleting))
        toast.success(`ডাক্তার সফলভাবে অপসারণ করা হয়েছে`);
      } catch (error) {
        toast.error("অপসারণ করতে ব্যর্থ হয়েছে");
      } finally {
        setIsDeleting(null);
      }
    });
  };

  if (isCreating) {
    return (
      <AddDoctorMembership handleBackToList={() => setIsCreating(false)} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Header Section */}
      <div className="z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ডাক্তার ব্যবস্থাপনা
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 font-medium">
                ডাক্তার, শিডিউল এবং ক্লিনিক মেম্বারশিপ পরিচালনা করুন
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - setIsDeleting পাস করা হয়েছে */}
      <MembershipList setIsCreating={setIsCreating} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!isDeleting} onOpenChange={() => setIsDeleting(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              ডাক্তার অপসারণ নিশ্চিত করুন
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
              আপনি কি নিশ্চিত যে এই ডাক্তারকে আপনার ক্লিনিক থেকে সরিয়ে দিতে চান?
              এর ফলে সংশ্লিষ্ট সকল শিডিউল মুছে যাবে। এই কাজটি আর ফিরিয়ে আনা
              সম্ভব নয়।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl">
              বাতিল করুন
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700 rounded-xl"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  অপসারণ হচ্ছে...
                </>
              ) : (
                "হ্যাঁ, অপসারণ করুন"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
